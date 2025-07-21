'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { User, Mail, Edit3, LogOut } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { profileSchema, ProfileSchemaType } from '@/schemas/user.schema';
import { getQueryClient } from '@/query-client';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '@/apis/user.api';
import { UpdateUserRequest } from '@/types/user.type';
import { QUERY_KEYS } from '@/constant/query-keys.constant';
import { toast } from 'sonner';
import Spinner from '@/components/base/spinner';
import InfoField from './_components/info-field';
import { authApi } from '@/apis/auth.api';
import { deleteCookie, getCookie } from '@/utils/cookie.util';
import { COOKIE_KEYS } from '@/constant/cookie-keys.constant';
import { useRouter } from 'next/navigation';

export default function Account() {
  const { user, isLoading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (body: UpdateUserRequest) => userApi.updateProfile(body),
  });
  const { mutate: logout, isPending: isPendingLogout } = useMutation({
    mutationFn: (refreshToken: string) => authApi.logout({ refreshToken }),
  });

  const router = useRouter();
  const client = getQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateUserRequest>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('username', user.username || '');
      setValue('email', user.email || '');
    }
  }, [user, setValue]);

  const onSubmit = (data: ProfileSchemaType) => {
    updateProfile(data, {
      onSuccess: () => {
        client.invalidateQueries({ queryKey: [QUERY_KEYS.USER_PROFILE] });
        toast.success('Profile updated successfully!');
      },
      onError: () => toast.error('Error updating profile'),
      onSettled: () => setIsEditing(false),
    });
  };

  const handleLogout = async () => {
    const refreshToken = getCookie(COOKIE_KEYS.REFRESH_TOKEN);
    if (refreshToken) {
      logout(refreshToken, {
        onSuccess: () => {
          deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
          deleteCookie(COOKIE_KEYS.REFRESH_TOKEN);
          client.removeQueries({ queryKey: [QUERY_KEYS.USER_PROFILE] });
          router.replace('/sign-in');
        },
        onError: () => toast.error('Error when logout !'),
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  if (isLoading)
    return (
      <div className="w-full h-[calc(100vh-120px)] flex justify-center items-center">
        <Spinner size="large" />
      </div>
    );
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 bg-gradient-to-br from-blue-300 to-indigo-200 border-0 shadow-lg relative">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">@{user.username}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isPendingLogout}
                className="mt-4 text-red-600"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Form */}
        <Card className="md:col-span-2 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  Account Details
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (user) {
                      reset({
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        username: user.username || '',
                        email: user.email || '',
                      });
                    }
                    setIsEditing(!isEditing);
                  }}
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoField
                    label="First Name"
                    id="firstName"
                    icon={User}
                    editable={isEditing}
                    register={register}
                    error={errors.firstName?.message}
                  />
                  <InfoField
                    label="Last Name"
                    id="lastName"
                    icon={User}
                    editable={isEditing}
                    register={register}
                    error={errors.lastName?.message}
                  />
                </div>

                <InfoField
                  label="Username"
                  id="username"
                  icon={User}
                  editable={false}
                  copyable
                  register={register}
                  error={errors.username?.message}
                />

                <InfoField
                  label="Email Address"
                  id="email"
                  icon={Mail}
                  editable={isEditing}
                  copyable
                  register={register}
                  error={errors.email?.message}
                />

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      disabled={isPending}
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isPending ? <Spinner size="small" /> : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        if (user) {
                          reset({
                            firstName: user.firstName || '',
                            lastName: user.lastName || '',
                            username: user.username || '',
                            email: user.email || '',
                          });
                        }
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
