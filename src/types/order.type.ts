export type CreateOrderRequest = {
  items: {
    code: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  customer: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
};

export type Order = {
  orderNumber: string;
  status: string;
};

export type OrderDetail = CreateOrderRequest & {
  orderNumber: string;
  status: string;
  createdAt: Date;
  totalAmount: number;
  comments: string | null;
  user: string;
};
