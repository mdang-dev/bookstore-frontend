import { ProductSchemaType } from '@/schemas/product.schema';

export type CreateProductRequest = ProductSchemaType;
export type UpdateProductRequest = ProductSchemaType & { id: string };
