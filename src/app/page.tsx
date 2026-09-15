'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { events, eventCategories } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventCard } from '@/components/event-card';
import { ErrorBoundary } from '@/components/error-boundary';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  const filteredAndSortedEvents = useMemo(() => {
    let result = events.filter(event => {
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Apply sorting
    if (sortBy === 'date-asc') {
      result = [...result].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => {
        const minA = Math.min(...a.ticketTypes.map(t => t.price));
        const minB = Math.min(...b.ticketTypes.map(t => t.price));
        return minA - minB;
      });
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => {
        const maxA = Math.max(...a.ticketTypes.map(t => t.price));
        const maxB = Math.max(...b.ticketTypes.map(t => t.price));
        return maxB - maxA;
      });
    } else if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchTerm, selectedCategory, sortBy]);

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'All' || sortBy !== 'featured';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('featured');
  };

  return (
    <div className="w-full">
      <section className="relative h-[60vh] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="opacity-30"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold text-primary">Discover Your Next Experience</h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-foreground">
            From exclusive concerts to gourmet food festivals, book your tickets to the most sought-after events.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <Button asChild size="lg">
              <Link href="#events">Explore Events</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/recommendations">AI Recommendations</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="events" className="container py-12 md:py-24">
        <div className="text-center mb-10">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Upcoming Events</h2>
          <p className="text-muted-foreground mt-2">Browse our curated selection of premier events and live experiences.</p>
        </div>

        <div className="mb-8 max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by event name, description, or city..."
                className="pl-10 bg-background/60 focus-visible:ring-primary"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                suppressHydrationWarning
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[170px]" suppressHydrationWarning>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {eventCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[170px]" suppressHydrationWarning>
                  <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="date-asc">Date: Soonest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Showing {filteredAndSortedEvents.length} of {events.length} events</span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <RotateCcw className="h-3 w-3" /> Reset filters
              </button>
            )}
          </div>
        </div>

        {filteredAndSortedEvents.length > 0 ? (
          <ErrorBoundary>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {filteredAndSortedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </ErrorBoundary>
        ) : (
          <div className="text-center py-16 max-w-md mx-auto border border-dashed rounded-lg bg-secondary/10">
            <p className="text-lg font-medium text-foreground mb-2">No events match your criteria</p>
            <p className="text-sm text-muted-foreground mb-4">Try searching for a different keyword or resetting your filters.</p>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
