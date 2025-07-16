'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  if (typeof window !== undefined) {
    return <SessionProvider>{children}</SessionProvider>;
  }
}
