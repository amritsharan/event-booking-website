'use client';

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { use, useRef, useState } from 'react';
import { events } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Tag, Clock, Download, FileText, Loader2, Minus, Plus, Share2, Check } from 'lucide-react';
import { format } from 'date-fns';
import pptxgen from "pptxgenjs";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useUser } from '@/firebase';
import { EventReviews } from '@/components/event-reviews';
import { useToast } from '@/hooks/use-toast';

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const event = events.find(e => e.id === resolvedParams.id);
  const pdfRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [selectedTicketId, setSelectedTicketId] = useState(event ? event.ticketTypes[0].id : '');
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  if (!event) {
    notFound();
  }

  const handleBookingClick = () => {
    const bookingUrl = `/checkout/${event.id}?ticketType=${selectedTicketId}&quantity=${quantity}`;
    if (user) {
      router.push(bookingUrl);
    } else {
      router.push(`/login?redirect_to=${encodeURIComponent(bookingUrl)}`);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Event link copied to clipboard. Share it with your friends!",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleDownloadPpt = () => {
    if (!event) return;

    try {
      const pptx = new pptxgen();
      const slide = pptx.addSlide();

      slide.background = { color: "1A1E23" };

      slide.addText(event.name, { 
        x: 0.5, 
        y: 0.4, 
        w: '90%', 
        h: 0.8, 
        fontSize: 28, 
        bold: true, 
        color: "D4AF37",
        align: 'center' 
      });
      
      const imageUrl = event.imageUrl.includes('photo-')
        ? `https://images.unsplash.com/photo-${event.imageUrl.split('photo-')[1]}`
        : event.imageUrl;

      try {
        slide.addImage({ 
          path: imageUrl,
          x: 1, 
          y: 1.4, 
          w: 8, 
          h: 4.2,
          cors: true
        } as any);
      } catch (e) {
        console.warn('Image could not be embedded into PPT presentation:', e);
      }

      const details = `Date: ${format(new Date(event.date), 'eeee, MMMM d, yyyy')} at ${event.time}\nLocation: ${event.venue}, ${event.location}\nCategory: ${event.category}`;
      slide.addText(details, { 
        x: 0.5, 
        y: 5.8, 
        w: '90%', 
        h: 1.2, 
        fontSize: 15, 
        color: "FFFFFF",
        align: 'center'
      });

      pptx.writeFile({ fileName: `${event.name}.pptx` });
      toast({
        title: "PPT Downloaded",
        description: `Brochure for ${event.name} has been generated.`,
      });
    } catch (err: any) {
      console.error('PPT generation error:', err);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not generate presentation brochure.",
      });
    }
  };

  const handleDownloadPdf = async () => {
    const input = pdfRef.current;
    if (!input) return;
  
    try {
      // Temporarily make hidden elements visible for capture
      const elementsToHide = input.querySelectorAll('.hide-from-pdf');
      elementsToHide.forEach(el => el.classList.remove('hide-from-pdf'));
    
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        onclone: (document) => {
          const images = document.querySelectorAll('img');
          images.forEach(img => {
            if (img.src.includes('unsplash.com') && img.src.includes('photo-')) {
              const newSrc = `https://images.unsplash.com/photo-${img.src.split('photo-')[1]}`;
              img.srcset = '';
              img.src = newSrc;
            }
          });
        }
      });
    
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth;
      const height = width / ratio;
    
      if (height > pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      }
    
      pdf.save(`${event.name}.pdf`);
      elementsToHide.forEach(el => el.classList.add('hide-from-pdf'));

      toast({
        title: "PDF Downloaded",
        description: `Event details for ${event.name} saved as PDF.`,
      });
    } catch (err) {
      console.error('PDF error:', err);
      toast({
        variant: "destructive",
        title: "PDF Error",
        description: "Could not export PDF.",
      });
    }
  };

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-6xl mx-auto" ref={pdfRef}>
        <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
          <div className="md:col-span-3">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg shadow-lg shadow-primary/20">
              <Image
                src={event.imageUrl}
                alt={event.name}
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint={event.imageHint}
                crossOrigin="anonymous"
                priority
              />
            </div>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="font-headline text-3xl md:text-5xl font-bold text-primary">{event.name}</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="w-fit hide-from-pdf"
              >
                {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Share2 className="mr-2 h-4 w-4" />}
                {copied ? 'Copied' : 'Share'}
              </Button>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">{event.description}</p>
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="font-headline text-2xl font-semibold">About this event</h2>
              <p className="mt-4 text-foreground/90 whitespace-pre-wrap leading-relaxed">{event.longDescription}</p>
            </div>
            <div className="mt-12 border-t border-border pt-8">
              <EventReviews eventId={event.id} />
            </div>
          </div>
          <div className="md:col-span-2">
            <Card className="sticky top-24 shadow-xl">
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
              
              <div className="hide-from-pdf">
                <CardHeader className="border-t">
                  <CardTitle className="font-headline text-2xl">Brochure & Downloads</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <Button variant="outline" onClick={handleDownloadPdf} className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" onClick={handleDownloadPpt} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    PPT
                  </Button>
                </CardContent>

                <CardHeader className="border-t">
                  <CardTitle className="font-headline text-2xl">Book Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <RadioGroup value={selectedTicketId} onValueChange={setSelectedTicketId} className="mb-6">
                      {event.ticketTypes.map(ticket => (
                        <div key={ticket.id} className="flex items-center justify-between rounded-md border border-border p-4 has-[:checked]:border-primary transition-colors">
                          <Label htmlFor={ticket.id} className="flex flex-col gap-1 cursor-pointer">
                            <span>{ticket.name}</span>
                            <span className="font-bold text-primary">${ticket.price.toFixed(2)}</span>
                          </Label>
                          <RadioGroupItem value={ticket.id} id={ticket.id} />
                        </div>
                      ))}
                    </RadioGroup>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mb-6 border border-border p-4 rounded-md">
                      <span className="text-sm font-medium text-foreground">Quantity</span>
                      <div className="flex items-center gap-2">
                        <Button 
                          type="button"
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                        <Button 
                          type="button"
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setQuantity(q => Math.min(10, q + 1))}
                          disabled={quantity >= 10}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Button onClick={handleBookingClick} disabled={isUserLoading} size="lg" className="w-full">
                      {isUserLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : user ? (
                        'Proceed to Checkout'
                      ) : (
                        'Login to Book'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
