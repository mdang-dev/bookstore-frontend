'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UpdateUserRequest } from '@/types/user.type';
import { Check, Copy, LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface InfoFieldProps {
  label: string;
  id: keyof UpdateUserRequest;
  icon?: LucideIcon;
  copyable?: boolean;
  editable?: boolean;
  register: ReturnType<typeof useForm<UpdateUserRequest>>['register'];
  error?: string;
}

export default function InfoField({
  label,
  id,
  icon: Icon,
  copyable = false,
  editable = false,
  register,
  error,
}: InfoFieldProps) {
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
}
