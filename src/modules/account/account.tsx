'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { User, Mail, Copy, Edit3, Check, LucideIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { redirect } from 'next/navigation';

type User = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
} & {
  id: string;
};

interface InfoFieldProps {
  label: string;
  value: string;
  id: string;
  icon?: LucideIcon;
  copyable?: boolean;
}

export default function Account() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { user, isLoading } = useAuthStore();

  const copyToClipboard = (text: string, field: string): void => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const InfoField: React.FC<InfoFieldProps> = ({
    label,
    value,
    id,
    icon: Icon,
    copyable = false,
  }) => (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 flex items-center gap-2"
      >
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          value={value}
          disabled={!isEditing}
          className="pr-10 transition-all duration-200 hover:border-gray-400 focus:border-blue-500"
        />
        {copyable && (
          <button
            onClick={() => copyToClipboard(value, id)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors"
            title="Copy to clipboard"
          >
            {copiedField === id ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg">
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

        {/* Details Card */}
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Account Details
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2 hover:bg-gray-50"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoField
                  label="First Name"
                  value={user.firstName}
                  id="firstName"
                  icon={User}
                />
                <InfoField
                  label="Last Name"
                  value={user.lastName}
                  id="lastName"
                  icon={User}
                />
              </div>

              <InfoField
                label="Username"
                value={user.username}
                id="username"
                icon={User}
                copyable={true}
              />

              <InfoField
                label="Email Address"
                value={user.email}
                id="email"
                icon={Mail}
                copyable={true}
              />

              <InfoField
                label="User ID"
                value={user.id}
                id="userId"
                icon={User}
                copyable={true}
              />

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Save Changes
                  </Button>
                  <Button
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
        </Card>
      </div>

      {/* User Activity Stats */}
      <div className="grid gap-4 md:grid-cols-3 mt-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Account Status
                </p>
                <p className="text-2xl font-bold text-green-700">Active</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Profile Complete
                </p>
                <p className="text-2xl font-bold text-blue-700">100%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">
                  Email Verified
                </p>
                <p className="text-2xl font-bold text-purple-700">Yes</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
