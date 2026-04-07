import { ConflictException, Injectable, Logger } from "@nestjs/common";
import { and, eq } from "drizzle-orm";

import { env } from "../config/env";
import { DatabaseService } from "../database/database.service";
import { bookings } from "../database/schema/bookings";
import { DEFAULT_TIME_SLOTS, SESSION_DURATION_MINUTES } from "./bookings.constants";
import type { AvailableSessionsQuery, CreateBookingInput } from "./bookings.schemas";

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
    const timezone = query.timezone ?? env.DEFAULT_TIMEZONE;
    const bookedSlots = await this.getBookedSlots(query.date);
    const availableSlots = DEFAULT_TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));

    return {
      date: query.date,
      timezone,
      sessionDurationMinutes: SESSION_DURATION_MINUTES,
      availableSlots,
    };
  }

  async bookSession(input: CreateBookingInput) {
    const timezone = input.timezone ?? env.DEFAULT_TIMEZONE;
    const existingSlots = await this.getBookedSlots(input.date);

    if (existingSlots.includes(input.timeSlot)) {
      throw new ConflictException("This session has already been booked.");
    }

    if (this.databaseService.db) {
      try {
        const [createdBooking] = await this.databaseService.db
          .insert(bookings)
          .values({
            consultantId: env.CONSULTANT_ID,
            userId: input.userId,
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
          throw new ConflictException("Another user booked this session just now.");
        }

        this.logger.warn(
          `Database booking insert failed. Falling back to in-memory storage. ${getErrorMessage(error)}`,
        );

        return this.createMemoryBooking(input, timezone);
      }
    }

    return this.createMemoryBooking(input, timezone);
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
      .filter((booking) => booking.consultantId === env.CONSULTANT_ID && booking.sessionDate === date)
      .map((booking) => booking.timeSlot);
  }

  private createMemoryBooking(input: CreateBookingInput, timezone: string) {
    const booking = {
      id: crypto.randomUUID(),
      consultantId: env.CONSULTANT_ID,
      userId: input.userId,
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
