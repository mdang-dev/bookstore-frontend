import { z } from 'zod';

export const userSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters long.' })
      .max(200, { message: 'Username must be less than 200 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    firstName: z.string().nonempty({ message: 'First name is required.' }),
    lastName: z.string().nonempty({ message: 'Last name is required.' }),
    password: z.string().nonempty({ message: 'Password is required.' }),
    confirmPassword: z
      .string()
      .nonempty({ message: 'Please confirm your password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export type UserSchemaType = z.infer<typeof userSchema>;
