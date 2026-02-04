import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Reservations',
  description: 'View and manage your event reservations and tickets.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ReservationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
