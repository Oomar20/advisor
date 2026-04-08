import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  HOST: z.string().min(1),
  ALLOWED_ORIGIN: z.string().min(1),
  DEFAULT_TIMEZONE: z.string().min(1),
  CONSULTANT_ID: z.string().min(1),
  SESSION_COOKIE_NAME: z.string().min(1),
  DATABASE_URL: z.string().url().optional().or(z.literal("")),
});

export const env = envSchema.parse(process.env);
