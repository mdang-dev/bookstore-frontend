'use client';

import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { useState } from 'react';

export function ProductCard({
  product,
  onAddToCart,
  isInCart = false,
}: {
  product: Product;
  onAddToCart?: (product: Product) => void;
  isInCart: boolean;
}) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onAddToCart?.(product);
    setIsAdding(false);
  };

  return (
    <Card className="rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm hover:shadow-md sm:hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full gap-0">
      {/* Compact image container */}
      <div className="relative w-full h-28 sm:h-32 md:h-36 lg:h-40 bg-muted/30 px-2 sm:px-3 lg:px-4 flex-shrink-0">
        <Image
          src={product.imageUrl}
          alt={product.name}
          className="object-contain w-full h-full hover:scale-105 transition-transform duration-300"
          width={300}
          height={300}
        />
      </div>

      {/* Compact header */}
      <CardHeader className="p-2 sm:p-3 lg:p-4 pb-0 flex-shrink-0">
        <CardTitle className="">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg line-clamp-2 font-medium leading-tight">
            {product.name}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {product.code}
          </p>
        </CardTitle>
        <CardDescription className="">
          <p className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-3 text-muted-foreground">
            {product.description}
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto">
        <div className="flex flex-col xs:flex-row lg:flex-row items-stretch xs:items-center lg:items-center justify-between gap-2 mt-auto">
          <Badge className="text-xs sm:text-sm lg:text-base font-semibold px-2 sm:px-3 py-1 w-fit">
            ${product.price}
          </Badge>

          <Button
            size="sm"
            variant="default"
            className="rounded-lg sm:rounded-xl w-full xs:w-auto lg:w-auto text-xs sm:text-sm h-7 sm:h-8 lg:h-9 px-2 sm:px-3 lg:px-4"
            onClick={handleAddToCart}
          >
            {isAdding ? (
              <>
                <div className="animate-spin h-3 w-3 sm:h-4 sm:w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                Adding...
              </>
            ) : isInCart ? (
              <>
                <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                <span className="hidden xs:inline sm:hidden lg:inline">
                  In Cart
                </span>
                <span className="xs:hidden sm:inline lg:hidden">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                <span className="hidden xs:inline sm:hidden lg:inline">
                  Add to Cart
                </span>
                <span className="xs:hidden sm:inline lg:hidden">Add</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
