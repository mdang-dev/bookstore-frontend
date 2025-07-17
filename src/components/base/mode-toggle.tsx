'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState, useTransition } from 'react';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleChangeTheme = () => {
    startTransition(() => {
      setTheme(isDark ? 'light' : 'dark');
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleChangeTheme}
      disabled={isPending}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-400 transition-all" />
      ) : (
        <Moon className="h-5 w-5 text-gray-900 transition-all" />
      )}
    </Button>
  );
}
