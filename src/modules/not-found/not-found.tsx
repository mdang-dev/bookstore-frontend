'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md transition-all duration-300 animate-fade-in">
        <Card className="border-border/10 bg-card/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-muted/10 p-6 text-center">
            <CardTitle className="text-xl font-semibold text-foreground flex flex-col items-center gap-2">
              <AlertCircle className="h-10 w-10 text-destructive" />
              Page Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-6">
            <p className="text-base text-muted-foreground">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <Button
              asChild
              variant="default"
              className="rounded-xl px-6 transition-all duration-200 hover:shadow-xl"
            >
              <Link href="/">← Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
