import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import type { Event } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

export function EventCard({ event }: { event: Event }) {
  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 bg-card border-border">
      <Link href={`/events/${event.id}`} className="block group">
        <CardContent className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-300 group-hover:scale-110"
              data-ai-hint={event.imageHint}
            />
            <div className="absolute top-2 right-2 bg-secondary/90 text-secondary-foreground text-xs font-bold px-2 py-1 rounded-full">{event.category}</div>
          </div>
          <div className="p-4">
            <h3 className="font-headline text-xl font-semibold text-primary">{event.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground h-10 overflow-hidden">{event.description}</p>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
