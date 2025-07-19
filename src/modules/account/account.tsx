'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { User, Mail, Copy, Edit3, Check, LucideIcon } from 'lucide-react';

import { redirect } from 'next/navigation';
import { useUser } from '@/hooks/use-user';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { profileSchema, ProfileSchemaType } from '@/schemas/user.schema';
import { getQueryClient } from '@/query-client';
import { useMutation } from '@tanstack/react-query';
import { userCommandApi } from '@/apis/user';
import { UpdateUserRequest } from '@/types/user';
import { QUERY_KEYS } from '@/constant/query-keys.constant';
import { toast } from 'sonner';

interface InfoFieldProps {
  label: string;
  id: keyof UpdateUserRequest;
  icon?: LucideIcon;
  copyable?: boolean;
  editable?: boolean;
  register: ReturnType<typeof useForm<UpdateUserRequest>>['register'];
  error?: string;
}

const InfoField = ({
  label,
  id,
  icon: Icon,
  copyable = false,
  editable = false,
  register,
  error,
}: InfoFieldProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      navigator.clipboard.writeText(input.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-medium"
      >
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          readOnly={!editable}
          {...register(id)}
          className={`pr-10 ${error ? 'border-red-500' : ''}`}
        />
        {copyable && (
          <button
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100"
            title="Copy"
            type="button"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default function Account() {
  const { user, isLoading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateProfile } = useMutation({
    mutationFn: (body: UpdateUserRequest) => userCommandApi.updateProfile(body),
  });
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
        toast.success('Update profile successfully !');
      },
      onError: () => toast.error('Error when update profile !'),
      onSettled: () => setIsEditing(false),
    });
  };

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  if (isLoading) return <p>Loading...</p>;
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 bg-gradient-to-br from-blue-300 to-indigo-200 border-0 shadow-lg">
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
            </div>
          </CardContent>
        </Card>

        {/* Info Form */}
        <Card className="md:col-span-2 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <div className="flex items-center justify-between my-auto">
                <CardTitle className="text-xl font-bold">
                  Account Details
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
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
                  editable={isEditing}
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
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsEditing(false)}
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
