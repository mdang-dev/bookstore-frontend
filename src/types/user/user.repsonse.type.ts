import { UserSchemaType } from '@/schemas/user.schema';

export enum Role {
  USER,
  ADMIN,
}

export type UserResponseType = UserSchemaType & { id: string };
