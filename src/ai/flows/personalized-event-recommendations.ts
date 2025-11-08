// src/ai/flows/personalized-event-recommendations.ts
'use server';

/**
 * @fileOverview Provides personalized event recommendations based on user preferences and past bookings.
 *
 * This file exports:
 *   - `getPersonalizedEventRecommendations`: A function that returns personalized event recommendations.
 *   - `PersonalizedEventRecommendationsInput`: The input type for the `getPersonalizedEventRecommendations` function.
 *   - `PersonalizedEventRecommendationsOutput`: The output type for the `getPersonalizedEventRecommendations` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedEventRecommendationsInputSchema = z.object({
  userPreferences: z.string().describe('The user\u2019s event preferences, as a comma separated list of event types.'),
  pastBookings: z.string().describe('A list of event names the user has booked in the past, as a comma separated list.'),
});
export type PersonalizedEventRecommendationsInput = z.infer<typeof PersonalizedEventRecommendationsInputSchema>;

const PersonalizedEventRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('A list of event recommendations personalized for the user, as a comma separated list.'),
});
export type PersonalizedEventRecommendationsOutput = z.infer<typeof PersonalizedEventRecommendationsOutputSchema>;

export async function getPersonalizedEventRecommendations(input: PersonalizedEventRecommendationsInput): Promise<PersonalizedEventRecommendationsOutput> {
  return personalizedEventRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedEventRecommendationsPrompt',
  input: {schema: PersonalizedEventRecommendationsInputSchema},
  output: {schema: PersonalizedEventRecommendationsOutputSchema},
  prompt: `You are an event recommendation expert. Based on the user's stated preferences and past bookings, you will provide a list of event recommendations tailored to their interests.

User Preferences: {{{userPreferences}}}
Past Bookings: {{{pastBookings}}}

Recommendations:`, // Ensure the output is comma-separated.
});

const personalizedEventRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedEventRecommendationsFlow',
    inputSchema: PersonalizedEventRecommendationsInputSchema,
    outputSchema: PersonalizedEventRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
