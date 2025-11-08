
'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { use, useRef } from 'react';
import { events } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Tag, Clock, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import pptxgen from "pptxgenjs";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const event = events.find(e => e.id === resolvedParams.id);
  const pdfRef = useRef<HTMLDivElement>(null);

  if (!event) {
    notFound();
  }
  
  const handleDownloadPpt = () => {
    if (!event) return;

    const pptx = new pptxgen();
    const slide = pptx.addSlide();

    slide.addText(event.name, { 
      x: 0.5, 
      y: 0.5, 
      w: '90%', 
      h: 1, 
      fontSize: 32, 
      bold: true, 
      color: "D4AF37",
      align: 'center' 
    });
    
    // Using a CORS-enabled proxy for the image to avoid taint issues
    const imageUrl = `https://images.unsplash.com/photo-${event.imageUrl.split('photo-')[1]}`;

    slide.addImage({ 
      path: imageUrl,
      x: 1, 
      y: 1.75, 
      w: 8, 
      h: 4.5,
      cors: true
    });

    const details = `Date: ${format(new Date(event.date), 'eeee, MMMM d, yyyy')} at ${event.time}\nLocation: ${event.venue}, ${event.location}`;
    slide.addText(details, { 
      x: 0.5, 
      y: 6.5, 
      w: '90%', 
      h: 1, 
      fontSize: 18, 
      color: "FFFFFF",
      align: 'center'
    });

    pptx.writeFile({ fileName: `${event.name}.pptx` });
  }

  const handleDownloadPdf = async () => {
    const input = pdfRef.current;
    if (!input) return;
  
    // Temporarily make hidden elements visible for capture
    const elementsToHide = input.querySelectorAll('.hide-from-pdf');
    elementsToHide.forEach(el => el.classList.add('invisible-for-pdf'));
  
    const canvas = await html2canvas(input, {
      scale: 2, // Higher scale for better resolution
      useCORS: true, // Important for external images
      onclone: (document) => {
        // This is a workaround for unspash images not loading in html2canvas
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          if (img.src.includes('unsplash.com')) {
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
  
    // Check if content exceeds page height, if so, split it (simple split)
    if (height > pdfHeight) {
      // This is a simplified approach. For complex multi-page, more logic is needed.
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    } else {
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    }
  
    pdf.save(`${event.name}.pdf`);
  
    // Hide the elements again after capture
    elementsToHide.forEach(el => el.classList.remove('invisible-for-pdf'));
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
              />
            </div>
            <div className="mt-8">
              <h1 className="font-headline text-3xl md:text-5xl font-bold text-primary">{event.name}</h1>
            </div>
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
              
              <div className="hide-from-pdf">
                <CardHeader className="border-t">
                  <CardTitle className="font-headline text-2xl">Downloads</CardTitle>
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
                      <Link href={`/checkout/${event.id}`}>Book Now</Link>
                    </Button>
                  </form>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
