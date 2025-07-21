import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  getCookie,
  setTokenCookie,
  setRefreshTokenCookie,
  deleteCookie,
} from './cookie.util';
import { COOKIE_KEYS } from '@/constant/cookie-keys.constant';
import { AuthResponseType } from '@/types/auth.type';

class HttpClient {
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
    });

    this.instance.interceptors.request.use(this.handleRequest);
    this.instance.interceptors.response.use(
      (res) => res,
      this.handleResponseError,
    );
  }

  private handleRequest(config: InternalAxiosRequestConfig) {
    const token = getCookie(COOKIE_KEYS.ACCESS_TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }

  private handleResponseError = async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const refreshToken = getCookie(COOKIE_KEYS.REFRESH_TOKEN);

    if (
      error.response?.status !== 401 ||
      original._retry ||
      original.url?.includes('/token/refresh') ||
      !refreshToken
    )
      return Promise.reject(error);

    original._retry = true;

    try {
      const { accessToken, refreshToken: newRefreshToken } =
        await this.refreshToken(refreshToken);

      setTokenCookie(accessToken);
      setRefreshTokenCookie(newRefreshToken);

      original.headers = {
        ...original.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      return this.instance(original);
    } catch {
      this.logout();
      return Promise.reject(error);
    }
  };

  private async refreshToken(token: string): Promise<AuthResponseType> {
    const { data } = await axios.post<AuthResponseType>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/api/auth/token/refresh`,
      { refreshToken: token },
    );
    return data;
  }

  private logout() {
    deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
    deleteCookie(COOKIE_KEYS.REFRESH_TOKEN);
    window.location.href = '/sign-in';
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const httpClient = new HttpClient().getInstance();
