'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn, useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { toast } from 'sonner';
import { TextField } from '@/components/base/text-field';
import { PasswordField } from '@/components/base/password-field';
import { Form } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authCommandApi } from '@/apis/auth';
import { AuthRequestType } from '@/types/auth';
import { getCookie, setTokenCookie } from '@/utils/cookie.util';

export default function SignIn() {
  const [loginError, setLoginError] = useState('');
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: (body: AuthRequestType) => authCommandApi.login(body),
  });

  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: AuthRequestType) => {
    setLoginError('');
    handleLogin(data, {
      onSuccess: (data) => {
        setTokenCookie(data.accessToken);
        toast.success('Login successful!');
        router.push('/');
      },
      onError: () => {
        setLoginError('Invalid username/email or password !');
      },
    });
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGoogleLogin = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {loginError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {loginError}
                  </AlertDescription>
                </Alert>
              )}

              <TextField
                control={form.control}
                name="username"
                label="Email or Username"
                placeholder="Enter your email or username"
                icon={<User className="h-4 w-4" />}
              />

              <PasswordField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full gap-2"
          >
            <Image
              alt="google"
              src="/image-icons/google-image-icon.png"
              width={20}
              height={20}
              className="object-cover"
            />
            Google
          </Button>

          <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold text-blue-600"
              onClick={() => router.push('/sign-up')}
            >
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
