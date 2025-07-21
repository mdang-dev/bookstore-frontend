import { CreateOrderRequest, Order, OrderDetail } from '@/types/order.type';
import { httpClient } from '@/utils/http-client';

const url = '/orders/api/orders';

export const orderApi = {
  createOrder: async (body: CreateOrderRequest) => {
    const res = await httpClient.post(url, body);
    return res.data;
  },
  getMyOrders: async (): Promise<Order[]> => {
    const res = await httpClient(url);
    return res.data;
  },
  getOrder: async (orderNumber: string): Promise<OrderDetail> => {
    const res = await httpClient(`${url}/${orderNumber}`);
    return res.data;
  },
};
