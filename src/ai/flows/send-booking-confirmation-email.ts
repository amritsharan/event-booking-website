'use server';
/**
 * @fileOverview A flow to send a booking confirmation email.
 *
 * This file exports:
 *  - `sendBookingConfirmationEmail`: A function to send the confirmation email.
 *  - `SendBookingConfirmationEmailInput`: The input type for the email flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendBookingConfirmationEmailInputSchema = z.object({
  userEmail: z.string().describe('The email address of the recipient.'),
  eventName: z.string().describe('The name of the event.'),
  eventDate: z.string().describe('The date of the event.'),
  eventLocation: z.string().describe('The location of the event.'),
});
export type SendBookingConfirmationEmailInput = z.infer<typeof SendBookingConfirmationEmailInputSchema>;

export async function sendBookingConfirmationEmail(input: SendBookingConfirmationEmailInput): Promise<{ success: boolean }> {
  return sendBookingConfirmationEmailFlow(input);
}

const prompt = ai.definePrompt({
    name: 'sendBookingConfirmationEmailPrompt',
    input: { schema: SendBookingConfirmationEmailInputSchema },
    output: { schema: z.object({ subject: z.string(), body: z.string() }) },
    prompt: `You are an event booking confirmation assistant. 
    Generate a subject and a friendly and professional email body for an event booking confirmation.
    
    Event Name: {{{eventName}}}
    Event Date: {{{eventDate}}}
    Event Location: {{{eventLocation}}}
    
    The user's email is {{{userEmail}}}.
    
    The email should confirm their booking, thank them for their reservation, and provide the key event details.
    
    Output the subject and body in JSON format.`,
});

const sendBookingConfirmationEmailFlow = ai.defineFlow(
  {
    name: 'sendBookingConfirmationEmailFlow',
    inputSchema: SendBookingConfirmationEmailInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      console.error('Failed to generate email content.');
      return { success: false };
    }
    
    const { subject, body } = output;

    // In a real application, you would integrate with an email sending service like Resend, SendGrid, or Nodemailer.
    // For this example, we'll just log the email to the console to simulate it being sent.
    console.log('--- Sending Email ---');
    console.log(`To: ${input.userEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: \n${body}`);
    console.log('--- Email Sent ---');

    return { success: true };
  }
);
