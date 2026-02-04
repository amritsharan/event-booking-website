import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Recommendations',
  description: 'Get personalized event recommendations based on your preferences.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function RecommendationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
