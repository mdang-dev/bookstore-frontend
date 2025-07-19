'use client';

import { userQueryApi } from '@/apis/user';
import { COOKIE_KEYS } from '@/constant/cookie-keys.constant';
import { QUERY_KEYS } from '@/constant/query-keys.constant';
import { User } from '@/types/user';
import { getCookie } from '@/utils/cookie.util';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
  const token = getCookie(COOKIE_KEYS.ACCESS_TOKEN);
  const { data, isLoading, isError } = useQuery<User>({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: userQueryApi.getMyInfo,
    enabled: !!token,
  });

  console.log('token', token);

  return { user: data, isLoading, isError };
};
