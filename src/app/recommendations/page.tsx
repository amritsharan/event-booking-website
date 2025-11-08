import { RecommendationsForm } from '@/components/recommendations-form';
import { Sparkles } from 'lucide-react';

export default function RecommendationsPage() {
  return (
    <div className="container py-12 md:py-16">
       <div className="text-center mb-12">
        <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl md:text-5xl font-bold">AI-Powered Event Finder</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Let our smart assistant curate a list of events tailored to your unique taste.
        </p>
      </div>
      <RecommendationsForm />
    </div>
  );
}
