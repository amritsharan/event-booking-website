'use client';

import { useState, use, useEffect } from 'react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { events } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreditCard, Loader2, ArrowLeft, Tag, Check, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { useUser } from '@/firebase';

const paymentFormSchema = z.object({
  cardName: z.string().min(2, { message: 'Name on card is required.' }),
  cardNumber: z.string().regex(/^\d{16}$/, { message: 'Card number must be 16 digits.' }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Use MM/YY format.' }),
  cvc: z.string().regex(/^\d{3,4}$/, { message: 'CVC must be 3 or 4 digits.' }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();
  const resolvedParams = use(params);
  const event = events.find(e => e.id === resolvedParams.id);
  const [isLoading, setIsLoading] = useState(false);

  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const ticketTypeId = searchParams.get('ticketType');
  const quantity = parseInt(searchParams.get('quantity') || '1', 10);

  const selectedTicket = event?.ticketTypes.find(t => t.id === ticketTypeId) || event?.ticketTypes[0];
  const ticketPrice = selectedTicket?.price || 0;
  const rawSubtotal = ticketPrice * quantity;
  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const serviceFee = subtotal * 0.05; // 5% service fee
  const total = subtotal + serviceFee;

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvc: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      const currentUrl = `/checkout/${resolvedParams.id}?ticketType=${ticketTypeId || ''}&quantity=${quantity}`;
      router.push(`/login?redirect_to=${encodeURIComponent(currentUrl)}`);
    }
  }, [isUserLoading, user, router, resolvedParams.id, ticketTypeId, quantity]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'GILDED10') {
      setDiscountPercent(10);
      setPromoSuccess('10% discount applied successfully!');
    } else if (code === 'VIP20') {
      setDiscountPercent(20);
      setPromoSuccess('20% VIP discount applied successfully!');
    } else if (code === '') {
      setPromoError('Please enter a promo code.');
    } else {
      setPromoError('Invalid promo code. Try GILDED10 or VIP20');
    }
  };

  if (!event) {
    notFound();
  }

  async function onSubmit(values: PaymentFormValues) {
    setIsLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push(`/book/${event!.id}?ticketType=${selectedTicket!.id}&quantity=${quantity}`);
  }
  
  if (isUserLoading || !user) {
    return (
      <div className="container flex items-center justify-center py-12 md:py-24">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto mb-6">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
          <Link href={`/events/${event.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Event Details
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
        <div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="relative w-28 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <Image src={event.imageUrl} alt={event.name} fill style={{ objectFit: 'cover' }} data-ai-hint={event.imageHint} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{event.name}</h4>
                  <p className="text-sm text-muted-foreground">{format(new Date(event.date), 'MMMM d, yyyy')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{event.location}</p>
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="mt-6 border-t pt-4">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-grow">
                    <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Promo code (e.g. GILDED10)"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="pl-9 text-xs uppercase"
                    />
                  </div>
                  <Button type="submit" variant="secondary" size="sm">
                    Apply
                  </Button>
                </form>
                {promoSuccess && (
                  <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                    <Check className="h-3 w-3" /> {promoSuccess}
                  </p>
                )}
                {promoError && (
                  <p className="text-xs text-destructive mt-2">{promoError}</p>
                )}
              </div>

              {/* Line Items */}
              <div className="mt-4 border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Ticket ({selectedTicket?.name})</span>
                  <span>${ticketPrice.toFixed(2)} x {quantity}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-sm text-green-500 font-medium">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Service Fee (5%)</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-4 border-t pt-3 font-bold text-lg text-primary">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground bg-secondary/20 p-2.5 rounded-md border border-border/30">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>256-Bit SSL Encrypted & Secure Booking</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2"><CreditCard /> Payment Information</CardTitle>
              <CardDescription>Enter card details to confirm your reservation.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                          <Input placeholder="John M. Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input placeholder="4000123456789010" maxLength={16} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry (MM/YY)</FormLabel>
                          <FormControl>
                            <Input placeholder="12/28" maxLength={5} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cvc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input placeholder="123" maxLength={4} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={isLoading} size="lg" className="w-full !mt-6">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Processing Reservation...' : `Pay $${total.toFixed(2)}`}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
