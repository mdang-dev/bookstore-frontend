import { ProfileSchemaType } from '@/schemas/user.schema';
import { CreateUserRequest, User } from '@/types/user';
import { httpClient } from '@/utils/http-client';

const url = '/users/api/users';

export const userCommandApi = {
  updateProfile: async (body: ProfileSchemaType): Promise<User> => {
    const res = await httpClient.put<User>(`${url}/update-profile`, body);
    return res.data;
  },
};
