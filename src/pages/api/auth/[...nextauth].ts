import { authCommandApi } from '@/apis/auth';
import { COOKIE_KEYS } from '@/constant/cookie-keys.constant';
import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    callbacks: {
      async jwt({ token, account }) {
        if (account) {
          const { accessToken, refreshToken } =
            await authCommandApi.loginWithGoogle({
              accessToken: account?.access_token!,
            });

          const refreshCookie = serialize(
            COOKIE_KEYS.REFRESH_TOKEN,
            refreshToken,
            {
              secure: process.env.NODE_ENV === 'production',
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
            },
          );

          const accessCookie = serialize(
            COOKIE_KEYS.ACCESS_TOKEN,
            accessToken,
            {
              secure: process.env.NODE_ENV === 'production',
              path: '/',
              maxAge: 60 * 15,
            },
          );

          res.setHeader('Set-Cookie', [refreshCookie, accessCookie]);
        }

        return token;
      },
    },
  });
