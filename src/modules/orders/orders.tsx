'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Order } from '@/types/order.type';
import { Inbox } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constant/query-keys.constant';
import { orderApi } from '@/apis/order.api';
import { useRouter } from 'next/navigation';

const STATUS_OPTIONS = [
  'ALL',
  'NEW',
  'IN_PROCESS',
  'DELIVERED',
  'CANCELLED',
  'ERROR',
] as const;

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.ORDERS],
    queryFn: orderApi.getMyOrders,
  });

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'ALL') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (isLoading) {
    return (
      <div className="mx-20 sm:px-6 lg:px-8 py-6 mt-3 space-y-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground mb-6"
        >
          My Orders
        </motion.h2>

        <div className="max-w-xs mb-6">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="border-border/20 bg-card/80 backdrop-blur-md rounded-2xl overflow-hidden p-1"
          >
            <CardContent className="flex items-center justify-between sm:p-5">
              <Skeleton className="h-4 w-1/3 rounded" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !orders.length) {
    return (
      <div className="mx-4 sm:mx-6 lg:mx-8 min-h-[50vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            List Order
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            No orders found.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-20 sm:px-6 lg:px-8 py-6 mt-3">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground mb-6"
      >
        My Orders
      </motion.h2>

      {/* Filter Dropdown */}
      <div className="max-w-xs mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Order List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOrders.length === 0 ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-muted-foreground">
              <Inbox className="w-10 h-10 mb-2" />
              <p className="text-sm">You don't have any orders yet.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <motion.div
                key={order.orderNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={cn(
                    'group transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 py-1 cursor-pointer',
                    'border-border/20 bg-card/80 backdrop-blur-md rounded-2xl overflow-hidden',
                  )}
                  onClick={() => router.push('/orders/' + order.orderNumber)}
                >
                  <CardContent className="flex items-center justify-between sm:p-5">
                    <span className="text-sm sm:text-base font-medium text-foreground tracking-tight">
                      #{order?.orderNumber}
                    </span>
                    <Badge
                      variant={
                        order?.status === 'DELIVERED' ? 'default' : 'secondary'
                      }
                      className={cn(
                        'px-3 text-xs sm:text-sm font-medium',
                        order.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-600'
                          : order.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-600'
                            : order.status === 'IN_PROCESS'
                              ? 'bg-yellow-100 text-yellow-700'
                              : order.status === 'NEW'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {order?.status}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
