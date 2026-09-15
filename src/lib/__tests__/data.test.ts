import { events, eventCategories, reservations } from '@/lib/data';

describe('Data validation', () => {
  it('contains valid events with required fields', () => {
    expect(events.length).toBeGreaterThan(0);
    events.forEach(event => {
      expect(event.id).toBeDefined();
      expect(event.name).toBeTruthy();
      expect(event.description).toBeTruthy();
      expect(event.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(event.location).toBeTruthy();
      expect(event.ticketTypes.length).toBeGreaterThan(0);
      event.ticketTypes.forEach(ticket => {
        expect(ticket.id).toBeDefined();
        expect(ticket.name).toBeTruthy();
        expect(ticket.price).toBeGreaterThan(0);
      });
    });
  });

  it('contains unique event categories starting with All', () => {
    expect(eventCategories[0]).toBe('All');
    const categoriesSet = new Set(eventCategories);
    expect(categoriesSet.size).toBe(eventCategories.length);
  });

  it('contains sample reservations with valid structure', () => {
    expect(reservations.length).toBeGreaterThan(0);
    reservations.forEach(res => {
      expect(res.id).toBeDefined();
      expect(res.eventName).toBeTruthy();
      expect(res.date).toBeTruthy();
    });
  });
});
