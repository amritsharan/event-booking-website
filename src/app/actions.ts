'use server';

import { 
  getPersonalizedEventRecommendations,
  type PersonalizedEventRecommendationsInput,
  type PersonalizedEventRecommendationsOutput
} from '@/ai/flows/personalized-event-recommendations';

export async function generateRecommendations(input: PersonalizedEventRecommendationsInput): Promise<{ recommendations: string[] } | { error: string }> {
  try {
    const result: PersonalizedEventRecommendationsOutput = await getPersonalizedEventRecommendations(input);
    const recommendations = result.recommendations.split(',').map(r => r.trim()).filter(r => r);
    return { recommendations };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate recommendations. Please try again later.' };
  }
}
