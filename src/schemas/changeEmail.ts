import { z, email } from 'zod';

export const changeEmailSchema = z.object({
  newEmail: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Please enter a valid email address")),
});