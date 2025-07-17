import { ProductSchemaType } from '@/schemas/product.schema';

export type Product = ProductSchemaType & { id: string };

export type ProductPage = {
  data: Product[];
  nextPage?: number;
  hasNext: boolean;
};

export type ProductItems = {
  items: Product[];
  nextPage: number | undefined;
};
