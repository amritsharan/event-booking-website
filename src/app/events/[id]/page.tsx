import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { events } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Tag, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const event = events.find(e => e.id === params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
        <div className="md:col-span-3">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg shadow-lg shadow-primary/20">
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint={event.imageHint}
            />
          </div>
          <h1 className="font-headline text-3xl md:text-5xl font-bold mt-8 text-primary">{event.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{event.description}</p>
          <div className="mt-8 border-t border-border pt-6">
            <h2 className="font-headline text-2xl font-semibold">About this event</h2>
            <p className="mt-4 text-foreground/90 whitespace-pre-wrap">{event.longDescription}</p>
          </div>
        </div>
        <div className="md:col-span-2">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold">{format(new Date(event.date), 'eeee, MMMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold">{event.time}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold">{event.venue}</p>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Tag className="h-5 w-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold">{event.category}</p>
                </div>
              </div>
            </CardContent>
            
            <CardHeader className="border-t">
              <CardTitle className="font-headline text-2xl">Book Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <RadioGroup defaultValue={event.ticketTypes[0].id} className="mb-6">
                  {event.ticketTypes.map(ticket => (
                    <div key={ticket.id} className="flex items-center justify-between rounded-md border border-border p-4 has-[:checked]:border-primary">
                      <Label htmlFor={ticket.id} className="flex flex-col gap-1 cursor-pointer">
                        <span>{ticket.name}</span>
                        <span className="font-bold text-primary">${ticket.price.toFixed(2)}</span>
                      </Label>
                      <RadioGroupItem value={ticket.id} id={ticket.id} />
                    </div>
                  ))}
                </RadioGroup>
                <Button asChild size="lg" className="w-full">
                  <Link href={`/book/${event.id}`}>Book Now</Link>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
