import type { Event } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // fallback to a default image if not found
    return { 
      imageUrl: 'https://picsum.photos/seed/default/600/400',
      imageHint: 'event'
    };
  }
  return { imageUrl: image.imageUrl, imageHint: image.imageHint };
};

export const events: Event[] = [
  {
    id: '1',
    name: 'Starlight Symphony Orchestra',
    description: 'An evening of classical music under the stars.',
    longDescription: 'Join us for a magical evening with the Starlight Symphony Orchestra. Featuring timeless pieces from Mozart, Beethoven, and Bach, this open-air concert promises an unforgettable experience. Bring a blanket and enjoy the sublime melodies in a breathtaking natural amphitheater.',
    date: '2025-12-15',
    time: '19:00',
    location: 'Grand Park Amphitheater',
    venue: 'Section A, Row 5',
    ...getImage('music-concert'),
    category: 'Music',
    ticketTypes: [
      { id: 't1', name: 'General Admission', price: 75 },
      { id: 't2', name: 'VIP Seating', price: 150 },
    ],
  },
  {
    id: '2',
    name: 'Modern Art Showcase: "Futurescapes"',
    description: 'Explore the future of art with digital and interactive installations.',
    longDescription: '"Futurescapes" is a groundbreaking exhibition that pushes the boundaries of art and technology. Experience immersive VR installations, interactive digital sculptures, and AI-generated masterpieces from pioneering artists around the globe. A must-see for art lovers and tech enthusiasts alike.',
    date: '2025-11-20',
    time: '10:00 - 20:00',
    location: 'Metropolis Gallery of Modern Art',
    venue: 'Main Hall',
    ...getImage('art-exhibition'),
    category: 'Art',
    ticketTypes: [
      { id: 't1', name: 'Adult', price: 40 },
      { id: 't2', name: 'Student', price: 25 },
    ],
  },
  {
    id: '3',
    name: 'Innovate Summit 2025',
    description: 'The premier conference for technology and innovation leaders.',
    longDescription: 'Innovate Summit 2025 brings together the brightest minds in tech for three days of keynotes, workshops, and networking. Hear from industry giants, discover disruptive startups, and get hands-on with the latest technologies that are shaping our world. Your ticket to the future starts here.',
    date: '2025-01-10',
    time: '09:00 - 17:00',
    location: 'Silicon Valley Convention Center',
    venue: 'Keynote Stage',
    ...getImage('tech-conference'),
    category: 'Tech',
    ticketTypes: [
      { id: 't1', name: 'Full Conference Pass', price: 999 },
      { id: 't2', name: 'One-Day Pass', price: 399 },
    ],
  },
  {
    id: '4',
    name: 'Gourmet World Food Festival',
    description: 'A culinary journey with flavors from around the globe.',
    longDescription: 'Embark on a delicious adventure at the Gourmet World Food Festival. Sample exotic dishes from over 30 countries, watch live cooking demonstrations by celebrity chefs, and discover artisanal products in our gourmet market. A paradise for foodies!',
    date: '2025-10-25',
    time: '11:00 - 22:00',
    location: 'Harborfront Park',
    venue: 'Food Stalls Area',
    ...getImage('food-festival'),
    category: 'Food',
    ticketTypes: [
      { id: 't1', name: 'Entry Ticket', price: 20 },
      { id: 't2', name: 'Tasting Package', price: 50 },
    ],
  },
  {
    id: '5',
    name: 'Premiere of "The Crimson Cipher"',
    description: 'Walk the red carpet at the most anticipated film premiere of the year.',
    longDescription: 'Be among the first to see "The Crimson Cipher," the new spy thriller from acclaimed director Anya Sharma. This exclusive red carpet event includes the film screening, followed by a Q&A with the cast and crew, and an invitation to the official after-party.',
    date: '2026-02-05',
    time: '18:00',
    location: 'The Majestic Theatre',
    venue: 'Orchestra Seats',
    ...getImage('film-premiere'),
    category: 'Film',
    ticketTypes: [
      { id: 't1', name: 'Premiere Ticket', price: 250 },
    ],
  },
  {
    id: '6',
    name: 'The Golden Age Charity Gala',
    description: 'An elegant evening of dining and fundraising for a good cause.',
    longDescription: 'Join us for The Golden Age Charity Gala, an exclusive black-tie event to support children\'s education programs. The evening features a gourmet dinner, a silent auction with luxury items, live entertainment, and a keynote address from a special guest. Make a difference while enjoying a night of glamour.',
    date: '2025-11-30',
    time: '18:30',
    location: 'The Ritz-Carlton Ballroom',
    venue: 'Table 12',
    ...getImage('charity-gala'),
    category: 'Gala',
    ticketTypes: [
      { id: 't1', name: 'Individual Ticket', price: 500 },
      { id: 't2', name: 'Table of 10', price: 4500 },
    ],
  },
];

// This static data is no longer the primary source for the reservations page,
// but it can be kept for reference or other purposes.
export const reservations = [
  {
    id: 'r1',
    eventId: '3',
    eventName: 'Innovate Summit 2025',
    date: '2025-01-10',
    location: 'Silicon Valley Convention Center',
    status: 'upcoming',
    ...getImage('tech-conference'),
  },
  {
    id: 'r2',
    eventId: '1',
    eventName: 'Starlight Symphony Orchestra',
    date: '2025-12-15',
    location: 'Grand Park Amphitheater',
    status: 'upcoming',
    ...getImage('music-concert'),
  },
  {
    id: 'r3',
    eventId: 'past-event-1',
    eventName: 'Summer Jazz Festival',
    date: '2023-08-20',
    location: 'Central City Park',
    status: 'past',
    imageUrl: 'https://picsum.photos/seed/jazz-fest/600/400',
    imageHint: 'jazz festival'
  },
  {
    id: 'r4',
    eventId: 'past-event-2',
    eventName: 'Indie Film Festival',
    date: '2024-03-12',
    location: 'Arthouse Cinema',
    status: 'past',
    imageUrl: 'https://picsum.photos/seed/indie-film/600/400',
    imageHint: 'indie film'
  },
];

export const eventCategories = [
  'All',
  ...Array.from(new Set(events.map(event => event.category))),
];
