import { z } from 'zod';

export const productSchema = z.object({
  code: z.string().min(1, 'Product code cannot be empty'),
  name: z.string().min(1, 'Product name cannot be empty'),
  description: z.string().min(1, 'Product description cannot be empty'),
  imageUrl: z.string('Image URL must be a valid URL'),
  price: z.union([
    z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number string'),
  ]),
});

export type ProductSchemaType = z.infer<typeof productSchema>;
