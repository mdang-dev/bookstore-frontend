'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { userSchema } from '@/schemas/user.schema';
import { CreateUserRequest } from '@/types/user.type';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';

import { useMutation } from '@tanstack/react-query';
import { Loader2, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TextField } from '@/components/base/text-field';
import { PasswordField } from '@/components/base/password-field';
import { useRouter } from 'next/navigation';
import { authApi } from '@/apis/auth.api';

export default function SignUp() {
  const [registerError, setRegisterError] = useState('');
  const router = useRouter();
  const { mutate: register, isPending } = useMutation({
    mutationFn: (body: CreateUserRequest) => authApi.register(body),
  });

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: CreateUserRequest) => {
    setRegisterError('');
    register(data, {
      onSuccess: () => {
        form.reset();
        toast.success('Registration successful!', {
          description: `Account was registered.`,
        });
      },
      onError: (err: any) => {
        setRegisterError(err?.response?.data?.detail);
      },
    });
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up for a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {registerError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {registerError}
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                />
                <TextField
                  control={form.control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                />
              </div>

              <TextField
                control={form.control}
                name="username"
                label="Username"
                placeholder="johndoe"
                icon={<User className="h-4 w-4" />}
              />

              <TextField
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="john@example.com"
                icon={<Mail className="h-4 w-4" />}
              />

              <PasswordField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
              />

              <PasswordField
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter your password"
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold text-blue-600"
              onClick={() => router.push('/sign-in')}
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
