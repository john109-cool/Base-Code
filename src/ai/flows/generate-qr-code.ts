'use server';

/**
 * @fileOverview Flow to generate a QR code from a given URL.
 *
 * - generateQrCode - A function that takes a URL and returns a data URI of a QR code image.
 * - GenerateQrCodeInput - The input type for the generateQrCode function.
 * - GenerateQrCodeOutput - The return type for the generateQrCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQrCodeInputSchema = z.object({
  url: z.string().url().describe('The URL to encode in the QR code.'),
});
export type GenerateQrCodeInput = z.infer<typeof GenerateQrCodeInputSchema>;

const GenerateQrCodeOutputSchema = z.object({
  qrCodeDataUri: z
    .string()
    .describe(
      'A data URI of the generated QR code image in PNG format. It must include a MIME type and use Base64 encoding. Expected format: \'data:image/png;base64,<encoded_data>\'.' // keep the backslashes to escape the single quotes
    ),
});
export type GenerateQrCodeOutput = z.infer<typeof GenerateQrCodeOutputSchema>;

export async function generateQrCode(input: GenerateQrCodeInput): Promise<GenerateQrCodeOutput> {
  return generateQrCodeFlow(input);
}

const generateQrCodePrompt = ai.definePrompt({
  name: 'generateQrCodePrompt',
  input: {schema: GenerateQrCodeInputSchema},
  output: {schema: GenerateQrCodeOutputSchema},
  prompt: `You are an expert QR code generator.

  Create a QR code for the following URL and return it as a data URI:

  URL: {{{url}}}

  Ensure the QR code is in PNG format and the data URI is properly encoded.`, // keep the backslashes to escape the single quotes
});

const generateQrCodeFlow = ai.defineFlow(
  {
    name: 'generateQrCodeFlow',
    inputSchema: GenerateQrCodeInputSchema,
    outputSchema: GenerateQrCodeOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {
          text: `QR code for url: ${input.url}`,
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {qrCodeDataUri: media!.url!};
  }
);
