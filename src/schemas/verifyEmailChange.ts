import { z } from "zod";

export const verifyEmailChangeSchema = z.object({
  verificationCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Verification code must be 6 digits."),
});