'use client';

import { productApi } from '@/apis//product.api';
import { QUERY_KEYS } from '@/constant/query-keys.constant';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ProductCard } from './_components/product-card';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCartStore } from '@/stores/cart.store';
import { useSearchStore } from '@/stores/search.store';
import { ProductSkeleton } from './_components/product-skeletion';
import { useEffect, useState } from 'react';

export default function Home() {
  const { items, addToCart } = useCartStore();
  const { searchTerm } = useSearchStore();
  const [isClient, setIsClient] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [QUERY_KEYS.PRODUCTS],
      queryFn: ({ pageParam }) => productApi.getProductsByPageNumber(pageParam),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
    });

  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;
  const products = data?.pages.flatMap((page) => page.items) ?? [];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isProductInCart = (productCode: string) => {
    return items.some((item) => item.product.code === productCode);
  };

  const productGridClasses =
    'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 xl:px-30 gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8';

  return (
    <>
      {isLoading ? (
        <div className={productGridClasses}>
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<p className="text-center py-4">Loading more...</p>}
          endMessage={
            <p className="text-center py-4 text-muted-foreground">
              No more products
            </p>
          }
        >
          <div className={productGridClasses}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.code}
                product={product}
                onAddToCart={addToCart}
                isInCart={isProductInCart(product.code)}
              />
            ))}
          </div>
          {isFetchingNextPage && (
            <p className="text-center py-4 text-sm text-muted-foreground">
              Fetching next page...
            </p>
          )}
        </InfiniteScroll>
      )}
    </>
  );
}
