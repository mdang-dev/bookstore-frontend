import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { getCookie, setCookie, deleteCookie } from './cookie.util';
import { COOKIE_KEYS } from '@/constant/cookie-keys.constant';
import { AuthResponseType } from '@/types/auth';
import { redirect } from 'next/navigation';

class HttpClient {
  private _client: AxiosInstance;

  private _baseUrl: string =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  public get instace() {
    return this._client;
  }

  constructor() {
    this._client = axios.create({ baseURL: this._baseUrl, timeout: 10000 });

    this._client.interceptors.request.use((config) => {
      const token = getCookie(COOKIE_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this._client.interceptors.response.use(
      (res) => res,
      (error) => this.handleError(error),
    );
  }

  private async handleError(error: AxiosError) {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refresh = getCookie(COOKIE_KEYS.REFRESH_TOKEN);
        if (!refresh) throw new Error('No refresh token');

        const tokens = await this.refreshToken(refresh);

        setCookie(COOKIE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        setCookie(COOKIE_KEYS.REFRESH_TOKEN, tokens.refreshToken);

        original.headers = {
          Authorization: `Bearer ${tokens.accessToken}`,
        };

        return this._client(original);
      } catch {
        deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
        deleteCookie(COOKIE_KEYS.REFRESH_TOKEN);
        redirect('/sign-in');
      }
    }

    return Promise.reject(error);
  }

  private async refreshToken(token: string): Promise<AuthResponseType> {
    const res = await axios.post<AuthResponseType>(
      `${this._baseUrl}/token/refresh`,
      { refreshToken: token },
    );
    return res.data;
  }
}

export const httpClient = new HttpClient().instace;
