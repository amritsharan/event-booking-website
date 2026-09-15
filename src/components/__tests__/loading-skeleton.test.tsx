import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { EventCardSkeleton, EventGridSkeleton, EventDetailSkeleton, ReservationsSkeleton } from '@/components/loading-skeleton';

describe('Loading Skeletons', () => {
  it('renders EventCardSkeleton without crashing', () => {
    const { container } = render(<EventCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders EventGridSkeleton with default count', () => {
    const { container } = render(<EventGridSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders EventDetailSkeleton without crashing', () => {
    const { container } = render(<EventDetailSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders ReservationsSkeleton without crashing', () => {
    const { container } = render(<ReservationsSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
