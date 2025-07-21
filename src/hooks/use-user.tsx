'use client';

import { userApi } from '@/apis/user.api';
import { COOKIE_KEYS } from '@/constant/cookie-keys.constant';
import { QUERY_KEYS } from '@/constant/query-keys.constant';
import { User } from '@/types/user.type';
import { getCookie } from '@/utils/cookie.util';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useUser = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = getCookie(COOKIE_KEYS.ACCESS_TOKEN);
    setToken(t ?? null);
  }, []);

  const { data, isLoading, isError } = useQuery<User>({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: userApi.getMyInfo,
    enabled: !!token,
  });

  return { user: data, isLoading, isError };
};
