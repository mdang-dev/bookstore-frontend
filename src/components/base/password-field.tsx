'use client';

import { useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Control } from 'react-hook-form';

interface PasswordFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
}

export function PasswordField({
  control,
  name,
  label,
  placeholder,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={visible ? 'text' : 'password'}
                placeholder={placeholder}
                className="pl-10 pr-10"
                {...field}
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-6 w-6 p-0"
                onClick={() => setVisible(!visible)}
              >
                {visible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
