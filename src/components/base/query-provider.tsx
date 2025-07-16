'use client';

import { getQueryClient } from '@/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = getQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
