import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  HOST: z.string().min(1).default("0.0.0.0"),
  ALLOWED_ORIGIN: z.string().min(1).default("http://localhost:3000"),
  DEFAULT_TIMEZONE: z.string().min(1).default("UTC"),
  CONSULTANT_ID: z.string().min(1).default("sara-ahmad"),
  DATABASE_URL: z.string().url().optional().or(z.literal("")),
});

export const env = envSchema.parse(process.env);
