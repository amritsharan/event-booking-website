'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="font-headline text-3xl md:text-5xl font-bold mb-3">Something Went Wrong</h1>
      <p className="max-w-md text-muted-foreground mb-8">
        An unexpected error occurred while loading this page. Our team has been notified.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button onClick={() => reset()} size="lg">
          <RotateCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
