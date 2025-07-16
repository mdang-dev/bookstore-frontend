'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { ReactNode } from 'react';

interface TextFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  icon?: ReactNode;
}

export function TextField({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  icon,
}: TextFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              {icon && (
                <div className="absolute left-3 top-3 text-gray-400">
                  {icon}
                </div>
              )}
              <Input
                type={type}
                placeholder={placeholder}
                className={icon ? 'pl-10' : ''}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
