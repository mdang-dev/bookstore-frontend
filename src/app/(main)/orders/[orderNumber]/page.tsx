import OrderDetail from '@/modules/orders/order-detail';

export default async function Page({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return <OrderDetail orderNumber={orderNumber} />;
}
