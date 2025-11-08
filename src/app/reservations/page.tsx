'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Ticket, Loader2 } from 'lucide-react';
import { format, isPast } from 'date-fns';
import type { Reservation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

function ReservationCard({ reservation }: { reservation: Reservation }) {
  const reservationStatus = isPast(new Date(reservation.date)) ? 'past' : 'upcoming';
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-1/4 aspect-[4/3] rounded-md overflow-hidden">
          <Image
            src={reservation.imageUrl}
            alt={reservation.eventName}
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint={reservation.imageHint}
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-headline text-xl font-semibold text-primary">{reservation.eventName}</h3>
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{format(new Date(reservation.date), 'MMMM d, yyyy')}</span>
          </div>
          <div className="mt-1 flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{reservation.location}</span>
          </div>
          <div className="mt-4">
            <Button asChild variant="secondary" disabled={reservationStatus === 'past'}>
              <Link href={`/events/${reservation.eventId}`}>View Event</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReservationsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const reservationsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/reservations`);
  }, [firestore, user]);

  const { data: reservations, isLoading: areReservationsLoading } = useCollection<Reservation>(reservationsQuery);

  const { upcomingReservations, pastReservations } = useMemo(() => {
    if (!reservations) return { upcomingReservations: [], pastReservations: [] };
    const upcoming: Reservation[] = [];
    const past: Reservation[] = [];
    reservations.forEach(res => {
      // Ensure date is valid before processing
      if (res.date && !isNaN(new Date(res.date).getTime())) {
          if (isPast(new Date(res.date))) {
              past.push(res);
          } else {
              upcoming.push(res);
          }
      }
    });
    // Sort reservations by date
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return { upcomingReservations: upcoming, pastReservations: past };
  }, [reservations]);
  
  const isLoading = isUserLoading || areReservationsLoading;

  return (
    <div className="container py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl md:text-5xl font-bold">My Reservations</h1>
        <Ticket className="h-10 w-10 text-primary" />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : !user ? (
         <div className="text-center text-muted-foreground py-10">
            <p>Please log in to see your reservations.</p>
            <Button asChild className="mt-4">
              <Link href="/login">Login</Link>
            </Button>
          </div>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="upcoming">Upcoming ({upcomingReservations.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastReservations.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <div className="grid gap-6">
              {upcomingReservations.length > 0 ? (
                upcomingReservations.map(res => <ReservationCard key={res.id} reservation={res} />)
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  <p>You have no upcoming reservations.</p>
                  <Button asChild className="mt-4">
                    <Link href="/">Explore Events</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="past">
            <div className="grid gap-6">
              {pastReservations.length > 0 ? (
                pastReservations.map(res => <ReservationCard key={res.id} reservation={res} />)
              ) : (
                 <div className="text-center text-muted-foreground py-10">
                  <p>You have no past reservations.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
