'use server';

import { 
  getPersonalizedEventRecommendations,
  type PersonalizedEventRecommendationsInput,
  type PersonalizedEventRecommendationsOutput
} from '@/ai/flows/personalized-event-recommendations';
import { sendBookingConfirmationEmail, type SendBookingConfirmationEmailInput } from '@/ai/flows/send-booking-confirmation-email';
import { chatFlow } from '@/ai/flows/chat';

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

export async function askChatbotAction(history: { role: 'user' | 'model'; content: string }[], message: string) {
  try {
    const response = await chatFlow({ history, message });
    return { text: response };
  } catch (e) {
    console.error('Chatbot Action Error:', e);
    return { error: 'Failed to generate chatbot response. Make sure GEMINI_API_KEY/GOOGLE_GENAI_API_KEY environment variable is configured.' };
  }
}
