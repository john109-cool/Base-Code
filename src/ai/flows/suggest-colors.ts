'use server';
/**
 * @fileOverview This file contains a Genkit flow that suggests visually appealing color combinations for QR codes.
 *
 * The flow takes no input and returns an object containing suggested colors.
 *  - suggestColors: A function that returns suggested color combinations for QR codes.
 *  - SuggestColorsOutput: The output type for the suggestColors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestColorsOutputSchema = z.object({
  primaryColor: z
    .string()
    .describe("The suggested primary color for the QR code, in hex format (e.g., '#RRGGBB')."),
  backgroundColor: z
    .string()
    .describe("The suggested background color for the QR code, in hex format (e.g., '#RRGGBB')."),
  accentColor: z
    .string()
    .describe("The suggested accent color for the QR code, in hex format (e.g., '#RRGGBB')."),
});

export type SuggestColorsOutput = z.infer<typeof SuggestColorsOutputSchema>;

export async function suggestColors(): Promise<SuggestColorsOutput> {
  return suggestColorsFlow();
}

const prompt = ai.definePrompt({
  name: 'suggestColorsPrompt',
  output: {schema: SuggestColorsOutputSchema},
  prompt: `You are a color palette expert. Suggest visually appealing color combinations for a QR code.

Consider the following guidelines:

*   The primary color will be used for the QR code itself.
*   The background color will be the background of the QR code.
*   The accent color will be used for any interactive elements on the page.
*   Return the colors as hex codes.

Suggest a primary color, background color, and accent color. Be creative and suggest visually appealing colors:

{{output}}
`,
});

const suggestColorsFlow = ai.defineFlow(
  {
    name: 'suggestColorsFlow',
    outputSchema: SuggestColorsOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
