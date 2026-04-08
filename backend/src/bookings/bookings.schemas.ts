import { z } from "zod";

import { DEFAULT_TIME_SLOTS } from "./bookings.constants";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const availableSessionsQuerySchema = z.object({
  date: z.string().regex(datePattern, "date must be in YYYY-MM-DD format"),
  timezone: z.string().trim().min(1).optional(),
});

export const createBookingSchema = z.object({
  date: z.string().regex(datePattern, "date must be in YYYY-MM-DD format"),
  timeSlot: z.enum(DEFAULT_TIME_SLOTS),
  timezone: z.string().trim().min(1).optional(),
});

export type AvailableSessionsQuery = z.infer<typeof availableSessionsQuerySchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
