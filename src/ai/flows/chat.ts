'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { events } from '@/lib/data';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string(),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;

export const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    // Map input history to Genkit message format
    const formattedHistory = input.history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      content: [{ text: msg.content }]
    }));

    const systemPrompt = `You are Gilded Events AI Assistant, a sophisticated and helpful AI concierge for the "Gilded Events" booking platform.
Your job is to assist users with searching for events, answering questions about event details (dates, venues, ticket pricing), and helping them navigate the ticket booking process.

Here is the current, complete event catalog:
${JSON.stringify(events, null, 2)}

Instructions:
- When asked about events, search this catalog and provide details. If a user asks for recommendations, match their preferences with the categories, names, and descriptions of these events.
- Be concise, elegant, and helpful. Use clear markdown formatting (bolding, lists, etc.) in your responses.
- If a user asks how to book tickets, explain that they can navigate to any event detail page (e.g. by clicking "View Details" on the home page) and choose their ticket option and click "Book Now".
- If the user asks about downloads, explain they can download PDF or PPT brochures of events directly from the Event Details page.
- Do not mention events that are not in the catalog. If no event matches their request, offer alternative events from the catalog that might interest them.
- Always be polite and professional. Keep your messages relatively brief (under 150 words per message).`;

    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      messages: [
        ...formattedHistory,
        { role: 'user', content: [{ text: input.message }] }
      ]
    } as any);

    return response.text;
  }
);
