import { Metadata } from 'next';
import { events } from '@/lib/data';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const event = events.find(e => e.id === resolvedParams.id);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  return {
    title: event.name,
    description: event.description,
    keywords: [event.name, event.category, 'event', 'tickets', event.location],
    openGraph: {
      title: event.name,
      description: event.description,
      type: 'website',
      images: [
        {
          url: event.imageUrl,
          width: 1200,
          height: 630,
          alt: event.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.name,
      description: event.description,
      images: [event.imageUrl],
    },
  };
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
