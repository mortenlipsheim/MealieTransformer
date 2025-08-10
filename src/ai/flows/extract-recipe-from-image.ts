
'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting recipe data from an image.
 *
 * The flow uses a multimodal AI prompt to identify and extract key information such as ingredients,
 * instructions, and cooking time from the input image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractRecipeFromImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image of a recipe, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type ExtractRecipeFromImageInput = z.infer<
  typeof ExtractRecipeFromImageInputSchema
>;

const ExtractRecipeFromImageOutputSchema = z.object({
    recipeText: z.string().describe("The full text of the recipe extracted from the image.")
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
  prompt: `You are an expert at extracting text from images of recipes.

  Extract all the text from the following image. Only return the text of the recipe.

  Image: {{media url=imageDataUri}}`,
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
        throw new Error("Could not extract any text from the image.");
    }
    return output;
  }
);
