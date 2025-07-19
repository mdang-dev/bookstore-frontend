import { CreateOrderRequest } from '@/types/order/order.request.type';
import { httpClient } from '@/utils/http-client';

const url = '/orders/api/orders';

export const orderCommandApi = {
  createOrder: async (body: CreateOrderRequest) => {
    const res = await httpClient.post(url, body);
    return res.data;
  },
};
