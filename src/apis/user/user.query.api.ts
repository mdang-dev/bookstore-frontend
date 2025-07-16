import { UserResponseType } from '@/types/user';
import httpClient from '@/utils/http-client';

const url = '/api/users';

export const userQueryApi = {
  getMyInfo: async (): Promise<UserResponseType> => {
    const res = await httpClient(`${url}/me`);
    return res.data;
  },
};
