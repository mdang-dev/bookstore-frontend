'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ListOrdered, ShoppingCart, User } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cart.store';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearchStore } from '@/stores/search.store';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import Hint from './hint';

export function Header() {
  const { itemCount } = useCartStore();
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedValue = useDebounce(searchValue, 500);
  const { setSearchTerm } = useSearchStore();
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    setSearchTerm(debouncedValue);
  }, [debouncedValue, setSearchTerm]);

  return (
    <header className="w-full px-4 py-3 border-b bg-background shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="w-full md:w-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-primary"
          >
            BookStore
          </Link>
        </div>

        {/* Search Input */}
        <div className="w-full md:max-w-md">
          <Input
            type="search"
            placeholder="Search books..."
            className="w-full"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchValue(e.target.value)
            }
          />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <Hint text="Cart">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-5 h-5" />
                <Badge
                  className="absolute -top-1 -right-1 text-[10px] px-1 py-0.5"
                  variant="secondary"
                >
                  {itemCount}
                </Badge>
              </Link>
            </Button>
          </Hint>

          <Hint text="Orders">
            <Button variant="ghost" size="icon">
              <Link href="/orders" about="hi">
                <ListOrdered className="w-5 h-5" />
              </Link>
            </Button>
          </Hint>
          {/* Account/Login */}
          <Hint text="Account">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (user && !isLoading) router.push('/account');
                else router.push('/sign-in');
              }}
            >
              <User className="w-4 h-4" />
            </Button>
          </Hint>

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
