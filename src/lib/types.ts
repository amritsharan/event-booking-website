export type TicketType = {
  id: string;
  name: string;
  price: number;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  imageUrl: string;
  imageHint: string;
  category: string;
  ticketTypes: TicketType[];
};

export type Reservation = {
  id: string;
  eventId: string;
  eventName: string;
  date: string;
  location: string;
  status: 'upcoming' | 'past';
  imageUrl: string;
  imageHint: string;
};
