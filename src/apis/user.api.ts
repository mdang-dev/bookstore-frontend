import { ProfileSchemaType } from '@/schemas/user.schema';
import { User } from '@/types/user.type';
import { httpClient } from '@/utils/http-client';

const url = '/users/api/users';

export const userApi = {
  updateProfile: async (body: ProfileSchemaType): Promise<User> => {
    const res = await httpClient.put<User>(`${url}/update-profile`, body);
    return res.data;
  },
  getMyInfo: async (): Promise<User> => {
    const res = await httpClient(`${url}/me`);
    return res.data;
  },
};
