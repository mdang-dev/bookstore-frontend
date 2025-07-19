'use client';

import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useCartStore } from '@/stores/cart.store';
import { useRouter } from 'next/navigation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import OrderModal, { OrderData } from './_components/order-modal';
import { useCallback, useState } from 'react';

import { CreateOrderRequest } from '@/types/order/order.request.type';
import { useUser } from '@/hooks/use-user';
import { useMutation } from '@tanstack/react-query';
import { orderCommandApi } from '@/apis/order';
import { toast } from 'sonner';

export default function Cart() {
  const router = useRouter();
  const { items, total, itemCount, updateQuantity, removeFromCart, clearCart } =
    useCartStore();
  const { mutate: createOrder } = useMutation({
    mutationFn: (body: CreateOrderRequest) => orderCommandApi.createOrder(body),
  });
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleOrderConfirm = (orderData: OrderData) => {
    const createOrderRequest: CreateOrderRequest = {
      items: items.map((item) => ({
        code: item.product.code,
        name: item.product.name,
        price: Number(item.product.price),
        quantity: item.quantity,
      })),
      customer: {
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.email ?? '',
        phone: orderData.phone,
      },
      deliveryAddress: {
        addressLine1: orderData.addressLine1,
        addressLine2: orderData.addressLine2,
        city: orderData.city,
        state: orderData.state,
        zipCode: orderData.zipCode,
        country: orderData.country,
      },
    };

    createOrder(createOrderRequest, {
      onSuccess: () => toast.success('Create order successfully !'),
      onError: () => toast.error('Error when create order !'),
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some products to get started!
          </p>
          <Button onClick={() => router.replace('/')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-30 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              Shopping Cart ({itemCount} items)
            </h1>
            <Button variant="ghost" size="sm" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-220px)] w-full p-1">
            <div className="space-y-4 z-10">
              {items.map((item) => (
                <Card key={item.product.code} className="p-5">
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="relative w-full sm:w-24 h-24 bg-muted/30 rounded-lg flex-shrink-0">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="object-contain w-full h-full"
                          width={96}
                          height={96}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.product.code}
                        </p>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.product.description}
                        </p>

                        {/* Mobile quantity and price */}
                        <div className="flex items-center justify-between sm:hidden">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.product.code,
                                  item.quantity - 1,
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.product.code,
                                  item.quantity + 1,
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Badge className="text-base font-semibold">
                            $
                            {(
                              Number(item.product.price) * item.quantity
                            ).toFixed(2)}
                          </Badge>
                        </div>
                      </div>

                      {/* Desktop quantity and price */}
                      <div className="hidden sm:flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.code)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(
                                item.product.code,
                                item.quantity - 1,
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(
                                item.product.code,
                                item.quantity + 1,
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Badge className="text-base font-semibold">
                          $
                          {(Number(item.product.price) * item.quantity).toFixed(
                            2,
                          )}
                        </Badge>
                      </div>

                      {/* Mobile remove button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.product.code)}
                        className="sm:hidden text-red-500 hover:text-red-700 self-start"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>

        {/* Cart Summary */}
        <div className="lg:w-80">
          <Card className="lg:mt-13 xl:mt-13">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={() => setIsModalOpen(true)}
              >
                Proceed to Checkout
              </Button>

              <OrderModal
                cartItems={items}
                total={total}
                onConfirm={handleOrderConfirm}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
              />

              <Button
                onClick={() => router.replace('/')}
                variant="outline"
                className="w-full mt-2"
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
