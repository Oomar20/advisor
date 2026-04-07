import { date, integer, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    consultantId: varchar("consultant_id", { length: 120 }).notNull(),
    userId: varchar("user_id", { length: 120 }).notNull(),
    sessionDate: date("session_date").notNull(),
    timeSlot: varchar("time_slot", { length: 5 }).notNull(),
    timezone: varchar("timezone", { length: 64 }).notNull(),
    sessionDurationMinutes: integer("session_duration_minutes").notNull().default(60),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    uniqueSession: uniqueIndex("bookings_unique_session_idx").on(
      table.consultantId,
      table.sessionDate,
      table.timeSlot,
    ),
  }),
);

export type BookingRow = typeof bookings.$inferSelect;
export type NewBookingRow = typeof bookings.$inferInsert;
