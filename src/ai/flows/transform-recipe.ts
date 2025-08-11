
'use server';

/**
 * @fileOverview This file defines a consolidated Genkit flow for transforming a recipe.
 *
 * It takes a source (text, HTML, or a YouTube URL), a target language, and a measurement system,
 * and performs extraction, translation, and unit conversion in a single AI call.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { recipeSchema, type Recipe } from '@/lib/schema';


const TransformRecipeInputSchema = z.object({
  source: z.string().describe('The HTML content, plain text, or YouTube URL of the recipe to transform.'),
  targetLanguage: z.string().describe('The target language for the recipe (e.g., "French", "Spanish").'),
  measurementSystem: z.enum(['metric', 'us']).describe('The target measurement system (metric or US).'),
});
export type TransformRecipeInput = z.infer<typeof TransformRecipeInputSchema>;

export type TransformRecipeOutput = Recipe;

export async function transformRecipe(input: TransformRecipeInput): Promise<TransformRecipeOutput> {
  return transformRecipeFlow(input);
}

const transformRecipePrompt = ai.definePrompt({
  name: 'transformRecipePrompt',
  input: {schema: TransformRecipeInputSchema},
  output: {schema: recipeSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert Chef that can create a recipe from watching a cooking video or reading recipe text.

Your task is to process the provided recipe source and perform three actions in a single step:
1.  **Extract Details**: If the source is a YouTube URL, watch the video. If it's text/HTML, read it. Identify and extract the key details (title, description, ingredients, instructions, prep time, cook time, servings, and the primary recipe image URL if available). You must only use the information present in the source. Do not add any information that is not from the source.
2.  **Translate**: Translate all extracted text into natural-sounding {{{targetLanguage}}}.
3.  **Convert Units**: Convert all measurements into the {{{measurementSystem}}} system.

Please format the final, processed recipe into the required JSON structure. Do not include any extra text, markdown, or commentary in your response.

Here is the recipe source to process:
{{{source}}}
`,
});

const transformRecipeFlow = ai.defineFlow(
  {
    name: 'transformRecipeFlow',
    inputSchema: TransformRecipeInputSchema,
    outputSchema: recipeSchema,
  },
  async input => {
    const {output} = await transformRecipePrompt(input);
    if (!output) {
      throw new Error('The AI model could not generate a recipe. The source may not contain a valid recipe or may be inaccessible.');
    }
    return output;
  }
);
