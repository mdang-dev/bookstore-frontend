import { User } from '@/types/user';
import httpClient from '@/utils/http-client';

const url = '/users/api/users';

export const userQueryApi = {
  getMyInfo: async (): Promise<User> => {
    const res = await httpClient(`${url}/me`);
    return res.data;
  },
};
