'use server';

import { 
  getPersonalizedEventRecommendations,
  type PersonalizedEventRecommendationsInput,
  type PersonalizedEventRecommendationsOutput
} from '@/ai/flows/personalized-event-recommendations';
import { sendBookingConfirmationEmail, type SendBookingConfirmationEmailInput } from '@/ai/flows/send-booking-confirmation-email';

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

export async function sendConfirmationEmailAction(input: SendBookingConfirmationEmailInput) {
  try {
    const result = await sendBookingConfirmationEmail(input);
    if (!result.success) {
      console.error('Failed to send confirmation email.');
    }
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}
