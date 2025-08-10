
'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting recipe data from a YouTube video URL.
 *
 * The flow uses a multimodal AI prompt to understand the video and audio content to extract
 * key information such as ingredients, instructions, and cooking time.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractRecipeFromYoutubeInputSchema = z.object({
  youtubeUrl: z.string().url().describe('The URL of the YouTube cooking video.'),
});
export type ExtractRecipeFromYoutubeInput = z.infer<typeof ExtractRecipeFromYoutubeInputSchema>;


const ExtractRecipeFromYoutubeOutputSchema = z.object({
    recipeText: z.string().describe("The full text of the recipe extracted from the YouTube video.")
});
export type ExtractRecipeFromYoutubeOutput = z.infer<typeof ExtractRecipeFromYoutubeOutputSchema>;


export async function extractRecipeFromYoutube(
  input: ExtractRecipeFromYoutubeInput
): Promise<ExtractRecipeFromYoutubeOutput> {
  return extractRecipeFromYoutubeFlow(input);
}

const extractRecipeFromYoutubePrompt = ai.definePrompt({
  name: 'extractRecipeFromYoutubePrompt',
  input: {schema: ExtractRecipeFromYoutubeInputSchema},
  output: {schema: ExtractRecipeFromYoutubeOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert recipe extractor. Your task is to analyze the cooking video found at the following URL: {{{youtubeUrl}}}

  Carefully analyze both the visual steps and the spoken narration to extract a complete, structured recipe.

  From the video, please extract the full text of the recipe, including the list of ingredients with quantities and the step-by-step instructions.
  `,
});

const extractRecipeFromYoutubeFlow = ai.defineFlow(
  {
    name: 'extractRecipeFromYoutubeFlow',
    inputSchema: ExtractRecipeFromYoutubeInputSchema,
    outputSchema: ExtractRecipeFromYoutubeOutputSchema,
  },
  async (input): Promise<ExtractRecipeFromYoutubeOutput> => {
    const {output} = await extractRecipeFromYoutubePrompt(input);

    if (!output?.recipeText) {
        throw new Error("Could not extract any recipe text from the YouTube video.");
    }
    return output;
  }
);
