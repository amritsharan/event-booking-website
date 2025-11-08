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
  id: string; // This will be the document ID from Firestore
  eventId: string;
  eventName: string;
  date: string;
  location: string;
  imageUrl: string;
  imageHint: string;
  reservedAt: string;
};
