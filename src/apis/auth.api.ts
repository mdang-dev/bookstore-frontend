import { AuthRequestType, AuthResponseType } from '@/types/auth.type';
import { httpClient } from '@/utils/http-client';

const url = '/auth/api/auth';

export const authApi = {
  login: async (body: AuthRequestType): Promise<AuthResponseType> => {
    const res = await httpClient.post<AuthResponseType>(`${url}/login`, body);
    return res.data;
  },
  loginWithGoogle: async (body: { accessToken: string }) => {
    const res = await httpClient.post<AuthResponseType>(
      `${url}/login/google`,
      body,
    );
    return res.data;
  },
  register: async (body: AuthRequestType): Promise<AuthResponseType> => {
    const res = await httpClient.post<AuthResponseType>(
      `${url}/register`,
      body,
    );
    return res.data;
  },
  logout: async (body: { refreshToken: string }): Promise<void> => {
    const res = await httpClient.post(`${url}/logout`, body);
    return res.data;
  },
};
