import { UserSchemaType } from '@/schemas/user.schema';

export type CreateUserRequest = UserSchemaType;
export type UpdateUserRequest = UserSchemaType & { id: string };
