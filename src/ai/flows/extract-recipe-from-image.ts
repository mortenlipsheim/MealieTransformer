
'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting recipe data from an image.
 *
 * The flow uses a multimodal AI prompt to identify and extract key information such as ingredients,
 * instructions, and cooking time from the input image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { extractRecipeData, type ExtractRecipeDataOutput } from './extract-recipe-data';
import { extractedRecipeDataSchema } from '@/lib/schema';


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

export async function extractRecipeFromImage(
  input: ExtractRecipeFromImageInput
): Promise<ExtractRecipeDataOutput> {
  return extractRecipeFromImageFlow(input);
}

const extractRecipeFromImagePrompt = ai.definePrompt({
  name: 'extractRecipeFromImagePrompt',
  input: {schema: ExtractRecipeFromImageInputSchema},
  output: {schema: z.object({recipeText: z.string().describe("The full text of the recipe extracted from the image.")})},
  prompt: `You are an expert at extracting text from images of recipes.

  Extract all the text from the following image.

  Image: {{media url=imageDataUri}}`,
});

const extractRecipeFromImageFlow = ai.defineFlow(
  {
    name: 'extractRecipeFromImageFlow',
    inputSchema: ExtractRecipeFromImageInputSchema,
    outputSchema: extractedRecipeDataSchema,
  },
  async (input): Promise<ExtractRecipeDataOutput> => {
    // First, extract the raw text from the image
    const {output: textOutput} = await extractRecipeFromImagePrompt(input);
    if (!textOutput?.recipeText) {
        throw new Error("Could not extract any text from the image.");
    }
    
    // Then, use the existing text extraction flow to structure the data
    return await extractRecipeData({source: textOutput.recipeText});
  }
);
