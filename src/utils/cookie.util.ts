import Cookies from 'js-cookie';
import { COOKIE_KEYS } from '@/constant/cookie-keys.constant';

export function setCookie(name: string, value: string, options = {}) {
  Cookies.set(name, value, options);
}

export function setTokenCookie(token: string) {
  if (!token) return;
  const { exp } = JSON.parse(atob(token.split('.')[1]));
  const expires = new Date(exp * 1000);
  setCookie(COOKIE_KEYS.ACCESS_TOKEN, token, {
    path: '/',
    expires,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
}

export function setRefreshTokenCookie(token: string) {
  if (!token) return;
  const { exp } = JSON.parse(atob(token.split('.')[1]));
  const expires = new Date(exp * 1000);
  setCookie(COOKIE_KEYS.REFRESH_TOKEN, token, {
    path: '/',
    expires,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
}

export function getCookie(name: string) {
  return Cookies.get(name) || null;
}

export function deleteCookie(name: string) {
  Cookies.remove(name, { path: '/' });
}
