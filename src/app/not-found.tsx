import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6 animate-pulse">
        <Compass className="h-10 w-10 text-primary" />
      </div>
      <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-3">404 - Page Not Found</h1>
      <p className="max-w-md text-lg text-muted-foreground mb-8">
        The experience or page you are looking for does not exist or has been moved.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/recommendations">Discover Events</Link>
        </Button>
      </div>
    </div>
  );
}
