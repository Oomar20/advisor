import { z } from "zod";

export const loginSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
});

export type LoginInput = z.infer<typeof loginSchema>;
