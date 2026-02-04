import { render, screen } from '@testing-library/react';
import { EventCard } from '@/components/event-card';
import { Event } from '@/lib/types';

const mockEvent: Event = {
  id: '1',
  name: 'Test Event',
  description: 'A test event description',
  longDescription: 'A longer test event description',
  date: '2026-03-15',
  time: '19:00',
  location: 'Test Venue, Test City',
  venue: 'Test Venue',
  imageUrl: '/test-image.jpg',
  imageHint: 'test image',
  category: 'Music',
  ticketTypes: [
    { id: '1', name: 'General Admission', price: 50 }
  ],
};

describe('EventCard', () => {
  it('renders event information correctly', () => {
    render(<EventCard event={mockEvent} />);
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('A test event description')).toBeInTheDocument();
    expect(screen.getByText('Music')).toBeInTheDocument();
  });

  it('displays the correct date format', () => {
    render(<EventCard event={mockEvent} />);
    
    expect(screen.getByText(/March 15, 2026/)).toBeInTheDocument();
  });

  it('displays location information', () => {
    render(<EventCard event={mockEvent} />);
    
    expect(screen.getByText('Test Venue, Test City')).toBeInTheDocument();
  });

  it('has a link to the event details page', () => {
    render(<EventCard event={mockEvent} />);
    
    const link = screen.getByRole('link', { name: /view details/i });
    expect(link).toHaveAttribute('href', '/events/1');
  });
});
