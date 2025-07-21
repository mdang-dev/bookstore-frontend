import { Product, ProductItems, ProductPage } from '@/types/product.type';
import { httpClient } from '@/utils/http-client';

const url = '/catalog/api/products';

export const productApi = {
  getProductsByPageNumber: async (page: number = 1): Promise<ProductItems> => {
    const res = await httpClient<ProductPage>(url, { params: { page } });
    return {
      items: res?.data?.data ?? [],
      nextPage: res?.data.hasNext ? page + 1 : undefined,
    };
  },
};
