'use client';

import { notFound } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { events } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { sendConfirmationEmailAction } from '@/app/actions';


export default function BookingConfirmationPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const event = events.find(e => e.id === id);

  useEffect(() => {
    if (event) {
      // In a real app, you'd get the user's email from their session.
      // For this example, we'll use a placeholder.
      const userEmail = 'test@example.com';
      sendConfirmationEmailAction({
        userEmail,
        eventName: event.name,
        eventDate: event.date,
        eventLocation: event.location,
      });
    }
  }, [event]);


  if (!event) {
    notFound();
  }

  return (
    <div className="container flex items-center justify-center py-12 md:py-24">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Booking Confirmed!</CardTitle>
          <CardDescription className="text-lg">You're all set for {event.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-left border rounded-lg p-4 flex items-start space-x-4">
            <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
               <Image src={event.imageUrl} alt={event.name} fill style={{objectFit: 'cover'}} data-ai-hint={event.imageHint} />
            </div>
            <div>
              <h4 className="font-bold">{event.name}</h4>
              <p className="text-sm text-muted-foreground">{event.date} at {event.location}</p>
            </div>
          </div>
          <p className="mt-6 text-muted-foreground">A confirmation has been sent to your email. We look forward to seeing you there!</p>
          <div className="mt-8 flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Events</Link>
            </Button>
            <Button asChild>
              <Link href="/reservations">View My Reservations</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
