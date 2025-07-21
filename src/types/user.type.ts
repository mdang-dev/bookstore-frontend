import { ProfileSchemaType, UserSchemaType } from '@/schemas/user.schema';

export type CreateUserRequest = UserSchemaType;
export type UpdateUserRequest = ProfileSchemaType;

export type User = UserSchemaType & { id: string };
