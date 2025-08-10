
'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting recipe data from one or more images.
 *
 * The flow uses a multimodal AI prompt to identify and extract key information such as ingredients,
 * instructions, and cooking time from the input images and combines them.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractRecipeFromImageInputSchema = z.object({
  imageDataUris: z
    .array(z.string())
    .describe(
      "An array of recipe images, each as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type ExtractRecipeFromImageInput = z.infer<
  typeof ExtractRecipeFromImageInputSchema
>;

const ExtractRecipeFromImageOutputSchema = z.object({
    recipeText: z.string().describe("The full text of the recipe extracted from the image(s).")
});
export type ExtractRecipeFromImageOutput = z.infer<typeof ExtractRecipeFromImageOutputSchema>;


export async function extractRecipeFromImage(
  input: ExtractRecipeFromImageInput
): Promise<ExtractRecipeFromImageOutput> {
  return extractRecipeFromImageFlow(input);
}

const extractRecipeFromImagePrompt = ai.definePrompt({
  name: 'extractRecipeFromImagePrompt',
  input: {schema: ExtractRecipeFromImageInputSchema},
  output: {schema: ExtractRecipeFromImageOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert at extracting text from a series of recipe images. The images might be pages of a cookbook or handwritten notes.

  Extract and combine the text from all the following images into a single recipe text.

  {{#each imageDataUris}}
  Image: {{media url=this}}
  {{/each}}
  `,
});

const extractRecipeFromImageFlow = ai.defineFlow(
  {
    name: 'extractRecipeFromImageFlow',
    inputSchema: ExtractRecipeFromImageInputSchema,
    outputSchema: ExtractRecipeFromImageOutputSchema,
  },
  async (input): Promise<ExtractRecipeFromImageOutput> => {
    const {output} = await extractRecipeFromImagePrompt(input);
    if (!output?.recipeText) {
        throw new Error("Could not extract any text from the image(s).");
    }
    return output;
  }
);
