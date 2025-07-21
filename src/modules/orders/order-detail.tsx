'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, User, MapPin, BookOpen, PackageX } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constant/query-keys.constant';
import { orderApi } from '@/apis/order.api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function OrderDetail({ orderNumber }: { orderNumber: string }) {
  const [isClient, setIsClient] = useState(false);
  const { data: order, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ORDER, orderNumber],
    queryFn: () => orderApi.getOrder(orderNumber),
    enabled: !!orderNumber,
  });

  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;

  if (isLoading && isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <Card className="border-border/10 bg-card/90 backdrop-blur-xl rounded-3xl shadow-2xl">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-8 w-1/2 bg-muted/50 rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted/50 rounded animate-pulse" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 w-full bg-muted/50 rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!isClient && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Card className="border-border/10 bg-card/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-muted/10 p-4 sm:p-6 text-center">
              <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">
                Order Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <PackageX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground">
                  Sorry, we couldn't find the order #
                  {orderNumber?.slice(0, 8) || 'unknown'}.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Button asChild variant="ghost">
                  <Link href="/orders">Back to Orders</Link>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-4 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="border-border/20 bg-card/80 backdrop-blur-md rounded-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl sm:text-2xl font-semibold">
              Order #{order?.orderNumber}
            </CardTitle>
            <Badge
              variant={order?.status === 'DELIVERED' ? 'default' : 'secondary'}
              className={cn(
                'px-3 py-1 text-sm',
                order?.status === 'DELIVERED'
                  ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {order?.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>
                Placed on{' '}
                {order?.createdAt &&
                  format(new Date(order?.createdAt), 'MMM dd, yyyy, HH:mm')}
              </span>
            </div>

            <Separator className="bg-border/20" />

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Items
              </h3>
              <div className="space-y-4">
                {order?.items &&
                  order?.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex justify-between items-center p-3 rounded-lg bg-muted/30 group hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{item?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Code: {item?.code}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                        <p className="text-xs font-semibold text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                <div className="flex justify-between items-center pt-4">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-bold">
                    ${order?.totalAmount && order?.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-border/20" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" /> Customer
                </h3>
                <p className="text-sm">{order?.customer?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order?.customer?.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order?.customer?.phone}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Delivery Address
                </h3>
                <p className="text-sm">
                  {order?.deliveryAddress?.addressLine1}
                </p>
                {order?.deliveryAddress?.addressLine2 && (
                  <p className="text-sm">
                    {order?.deliveryAddress.addressLine2}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {order?.deliveryAddress?.city},{' '}
                  {order?.deliveryAddress?.state}{' '}
                  {order?.deliveryAddress?.zipCode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order?.deliveryAddress?.country}
                </p>
              </div>
            </div>

            {order?.comments && (
              <>
                <Separator className="bg-border/20" />
                <div>
                  <h3 className="text-lg font-semibold mb-3">Comments</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.comments}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
