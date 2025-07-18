'use client';

import { useUser } from '@/hooks/use-user';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect } from 'react';

export default function UserHydrator() {
  const { setUser, setIsLoading } = useAuthStore();
  const { user } = useUser();
  useEffect(() => {
    if (user) setUser(user);
  }, [setUser, user]);
  return null;
}
