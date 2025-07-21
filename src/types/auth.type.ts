import { AuthSchemaType } from '@/schemas/auth.schema';

export type AuthResponseType = {
  accessToken: string;
  refreshToken: string;
};

export type AuthRequestType = AuthSchemaType;
