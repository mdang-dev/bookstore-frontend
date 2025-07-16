import { UserCreateRequestType, UserResponseType } from '@/types/user';
import httpClient from '@/utils/http-client';

const url = '/api/users';

export const userCommandApi = {
  updateProfile: async (
    body: UserCreateRequestType,
    id: string,
  ): Promise<UserResponseType> => {
    const res = await httpClient.put<UserResponseType>(`${url}/${id}`, body);
    return res.data;
  },
};
