import { UserSchemaType } from '@/schemas/user.schema';

export type UserResponseType = UserSchemaType & { id: string };
