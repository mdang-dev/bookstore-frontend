import z from 'zod';

export const authSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' }),
  password: z.string().nonempty({ message: 'Password cannot be empty' }),
});

export type AuthSchemaType = z.infer<typeof authSchema>;
