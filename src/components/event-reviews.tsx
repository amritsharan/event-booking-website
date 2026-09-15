'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  userEmail: string;
  createdAt: string;
}

interface EventReviewsProps {
  eventId: string;
}

export function EventReviews({ eventId }: EventReviewsProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  // Form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Memoized query to fetch reviews in real time
  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore || !eventId) return null;
    return query(
      collection(firestore, 'events', eventId, 'reviews'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, eventId]);

  const { data: reviews, isLoading, error } = useCollection<Review>(reviewsQuery);

  // Calculate statistics
  const stats = useMemoFirebase(() => {
    if (!reviews || reviews.length === 0) {
      return { average: 0, count: 0 };
    }
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return {
      average: parseFloat((sum / reviews.length).toFixed(1)),
      count: reviews.length,
    };
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) {
      setFormError('You must be logged in to submit a review.');
      return;
    }
    if (!comment.trim()) {
      setFormError('Please write a comment for your review.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const reviewsColRef = collection(firestore, 'events', eventId, 'reviews');
      const reviewData = {
        rating,
        comment: comment.trim(),
        userId: user.uid,
        userEmail: user.email || 'Anonymous',
        createdAt: new Date().toISOString(),
      };

      // Add to Firestore
      await addDocumentNonBlocking(reviewsColRef, reviewData);
      
      // Clear form
      setComment('');
      setRating(5);
    } catch (e: any) {
      console.error('Error submitting review:', e);
      setFormError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render stars helper
  const renderStars = (count: number, interactive = false, onSelect?: (r: number) => void) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onClick={() => interactive && onSelect?.(star)}
            className={cn(
              "h-5 w-5",
              interactive ? "cursor-pointer transition-colors" : "",
              star <= count
                ? "fill-primary text-primary"
                : "text-muted-foreground/40 hover:text-primary/70"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-headline text-2xl font-bold flex items-center gap-2 mb-2">
          <MessageSquare className="h-5 w-5 text-primary" /> User Reviews
        </h3>
        <p className="text-sm text-muted-foreground">Hear what other attendees have to say about this experience.</p>
      </div>

      {/* Review statistics summary */}
      {reviews && reviews.length > 0 && (
        <Card className="bg-secondary/10 border-border/40">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center sm:border-r border-border/30 sm:pr-8">
              <div className="text-5xl font-headline font-bold text-primary">{stats.average}</div>
              <div className="mt-2">{renderStars(Math.round(stats.average))}</div>
              <div className="text-xs text-muted-foreground mt-2">{stats.count} {stats.count === 1 ? 'review' : 'reviews'}</div>
            </div>
            <div className="flex-grow space-y-2 w-full">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter((r) => r.rating === stars).length;
                const percentage = stats.count > 0 ? (count / stats.count) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-4 text-xs">
                    <span className="w-3 text-right">{stars}</span>
                    <Star className="h-3.5 w-3.5 fill-primary text-primary shrink-0" />
                    <div className="flex-grow h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review submission form */}
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-lg">Write a Review</CardTitle>
          <CardDescription>Share your thoughts and rate your experience.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {user ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Your Rating:</span>
                {renderStars(rating, true, setRating)}
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Tell us what you liked or disliked about this event..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-background/50 focus-visible:ring-primary min-h-[80px]"
                />
              </div>
              {formError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{formError}</span>
                </div>
              )}
              <Button type="submit" disabled={isSubmitting} size="sm">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Review
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 border border-dashed rounded-md bg-muted/20">
              <p className="text-sm text-muted-foreground">You must be logged in to leave a review.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews list */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-destructive border border-dashed rounded-md bg-destructive/10">
            <p className="text-sm">Failed to load reviews. If this is a new collection, you may need to wait for indexes or rules to propagate.</p>
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <Card key={review.id} className="border-border/30 bg-card/60">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm">{review.userEmail}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {review.createdAt ? format(new Date(review.createdAt), 'MMM d, yyyy h:mm a') : ''}
                      </p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap mt-2">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed rounded-md bg-muted/10">
            <p className="text-sm text-muted-foreground">No reviews yet. Be the first to leave one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
