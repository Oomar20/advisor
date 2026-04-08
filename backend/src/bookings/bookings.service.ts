import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";

import type { AuthSessionUser } from "../auth/auth.types";
import { env } from "../config/env";
import { DatabaseService } from "../database/database.service";
import { bookings } from "../database/schema/bookings";
import {
  DEFAULT_TIME_SLOTS,
  SESSION_DURATION_MINUTES,
} from "./bookings.constants";
import type {
  AvailableSessionsQuery,
  CreateBookingInput,
} from "./bookings.schemas";

type MemoryBooking = {
  id: string;
  consultantId: string;
  userId: string;
  sessionDate: string;
  timeSlot: string;
  timezone: string;
  sessionDurationMinutes: number;
  createdAt: Date;
};

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  private readonly memoryBookings: MemoryBooking[] = [];

  constructor(private readonly databaseService: DatabaseService) {}

  async getAvailableSessions(query: AvailableSessionsQuery) {
    const timezone = this.resolveTimeZone(query.timezone);
    const availability = await this.getAvailability(query.date, timezone);

    return {
      date: query.date,
      timezone,
      sessionDurationMinutes: SESSION_DURATION_MINUTES,
      availableSlots: availability.availableSlots,
    };
  }

  async bookSession(input: CreateBookingInput, user: AuthSessionUser) {
    const timezone = this.resolveTimeZone(input.timezone);
    const availability = await this.getAvailability(input.date, timezone);

    if (
      availability.expiredSlots.includes(input.timeSlot) ||
      availability.isPastDate
    ) {
      throw new BadRequestException({
        code: "slot_expired",
        message: "This session time is no longer available.",
      });
    }

    if (availability.bookedSlots.includes(input.timeSlot)) {
      throw new ConflictException({
        code: "slot_taken",
        message: "This session has already been booked.",
      });
    }

    if (!availability.availableSlots.includes(input.timeSlot)) {
      throw new BadRequestException({
        code: "slot_unavailable",
        message: "This session is not available for booking.",
      });
    }

    if (this.databaseService.db) {
      try {
        const [createdBooking] = await this.databaseService.db
          .insert(bookings)
          .values({
            consultantId: env.CONSULTANT_ID,
            userId: user.id,
            sessionDate: input.date,
            timeSlot: input.timeSlot,
            timezone,
            sessionDurationMinutes: SESSION_DURATION_MINUTES,
          })
          .returning();

        return {
          booking: createdBooking,
          message: "Booking confirmed.",
        };
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new ConflictException({
            code: "slot_taken",
            message: "Another user booked this session just now.",
          });
        }

        this.logger.warn(
          `Database booking insert failed. Falling back to in-memory storage. ${getErrorMessage(error)}`,
        );

        return this.createMemoryBooking(input, timezone, user);
      }
    }

    return this.createMemoryBooking(input, timezone, user);
  }

  private async getBookedSlots(date: string) {
    if (this.databaseService.db) {
      try {
        const rows = await this.databaseService.db
          .select({
            timeSlot: bookings.timeSlot,
          })
          .from(bookings)
          .where(
            and(
              eq(bookings.consultantId, env.CONSULTANT_ID),
              eq(bookings.sessionDate, date),
            ),
          );

        return rows.map((row) => row.timeSlot);
      } catch (error) {
        this.logger.warn(
          `Database availability query failed. Falling back to in-memory storage. ${getErrorMessage(error)}`,
        );
      }
    }

    return this.memoryBookings
      .filter(
        (booking) =>
          booking.consultantId === env.CONSULTANT_ID &&
          booking.sessionDate === date,
      )
      .map((booking) => booking.timeSlot);
  }

  private async getAvailability(date: string, timezone: string) {
    const bookedSlots = await this.getBookedSlots(date);
    const { date: currentDate, minutesSinceMidnight } =
      getCurrentTimeContext(timezone);
    const isPastDate = date < currentDate;
    const expiredSlots =
      date === currentDate
        ? DEFAULT_TIME_SLOTS.filter(
            (slot) => getMinutesSinceMidnight(slot) <= minutesSinceMidnight,
          )
        : [];

    const availableSlots = isPastDate
      ? []
      : DEFAULT_TIME_SLOTS.filter(
          (slot) => !bookedSlots.includes(slot) && !expiredSlots.includes(slot),
        );

    return {
      availableSlots,
      bookedSlots,
      expiredSlots,
      isPastDate,
    };
  }

  private createMemoryBooking(
    input: CreateBookingInput,
    timezone: string,
    user: AuthSessionUser,
  ) {
    const booking = {
      id: crypto.randomUUID(),
      consultantId: env.CONSULTANT_ID,
      userId: user.id,
      sessionDate: input.date,
      timeSlot: input.timeSlot,
      timezone,
      sessionDurationMinutes: SESSION_DURATION_MINUTES,
      createdAt: new Date(),
    } satisfies MemoryBooking;

    this.memoryBookings.push(booking);

    return {
      booking,
      message: "Booking confirmed.",
    };
  }

  private resolveTimeZone(timezone: string | undefined) {
    const timeZone = timezone?.trim() || env.DEFAULT_TIMEZONE;

    try {
      new Intl.DateTimeFormat("en-CA", {
        timeZone,
      }).format(new Date());

      return timeZone;
    } catch {
      throw new BadRequestException({
        code: "invalid_timezone",
        message: "The provided timezone is invalid.",
      });
    }
  }
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown database error.";
}

function getCurrentTimeContext(timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>;

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    minutesSinceMidnight: Number(values.hour) * 60 + Number(values.minute),
  };
}

function getMinutesSinceMidnight(slot: string) {
  const [hours, minutes] = slot.split(":").map(Number);
  return hours * 60 + minutes;
}
