'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateRecommendations } from '@/app/actions';
import { reservations, events } from '@/lib/data';
import { EventCard } from '@/components/event-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  userPreferences: z.string().min(3, { message: 'Please tell us at least one preference.' }),
  pastBookings: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function RecommendationsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { toast } = useToast();

  const pastBookedEventNames = reservations
    .filter(r => r.status === 'past')
    .map(r => r.eventName)
    .join(', ');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userPreferences: '',
      pastBookings: pastBookedEventNames,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setRecommendations([]);
    const result = await generateRecommendations(values);
    setIsLoading(false);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: result.error,
      });
    } else {
      setRecommendations(result.recommendations);
    }
  }

  const recommendedEvents = events.filter(event => 
    recommendations.some(rec => event.name.toLowerCase().includes(rec.toLowerCase()))
  );

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Personalized Recommendations</CardTitle>
          <CardDescription>Tell us what you like, and our AI will find events just for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Interests</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jazz music, Modern art, Italian food" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastBookings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Past Bookings (from your history)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Events you've enjoyed before"
                        className="resize-none"
                        {...field}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Get Recommendations'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="text-center py-10">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Finding the perfect events for you...</p>
         </div>
      )}

      {recommendations.length > 0 && !isLoading && (
        <div className="mt-12">
            <h2 className="font-headline text-3xl font-bold text-center mb-8">Here's What We Found For You</h2>
            {recommendedEvents.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recommendedEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-10">
                    We found some recommendations: {recommendations.join(', ')}. However, no currently available events match these suggestions. Please check back later!
                </p>
            )}
        </div>
      )}
    </>
  );
}
