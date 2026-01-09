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
    .describe("The suggested primary color for the QR code, in hex format (e.g., '#RRGGBB'). This should be a shade of blue."),
  backgroundColor: z
    .string()
    .describe("The suggested background color for the QR code, in hex format (e.g., '#RRGGBB'). This should be a light color like white or light gray."),
  accentColor: z
    .string()
    .describe("The suggested accent color for the QR code, in hex format (e.g., '#RRGGBB'). This should be a contrasting shade of blue or a complementary color."),
});

export type SuggestColorsOutput = z.infer<typeof SuggestColorsOutputSchema>;

export async function suggestColors(): Promise<SuggestColorsOutput> {
  return suggestColorsFlow();
}

const prompt = ai.definePrompt({
  name: 'suggestColorsPrompt',
  output: {schema: SuggestColorsOutputSchema},
  prompt: `You are a color palette expert. Suggest visually appealing color combinations for a QR code with a blue theme.

Consider the following guidelines:

*   The primary color will be used for the QR code itself. This should be a shade of blue.
*   The background color will be the background of the QR code. This should be a light color like white or light gray to ensure scannability.
*   The accent color will be used for any interactive elements on the page.
*   Return the colors as hex codes.

Suggest a new, visually appealing shade of blue for the primary color each time. The background should remain light.`,
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
