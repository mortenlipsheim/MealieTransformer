
'use server';

/**
 * @fileOverview This file defines a consolidated Genkit flow for transforming a recipe.
 *
 * It takes a source (text or HTML), a target language, and a measurement system,
 * and performs extraction, translation, and unit conversion in a single AI call.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { recipeSchema, type Recipe } from '@/lib/schema';


const TransformRecipeInputSchema = z.object({
  source: z.string().describe('The HTML content or plain text of the recipe to transform.'),
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
  prompt: `You are an expert recipe processor. Your task is to perform three actions on the provided recipe source in a single step:
1.  **Extract Details**: Identify and extract the key details from the recipe source (title, description, ingredients, instructions, prep time, cook time, servings).
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
    return output!;
  }
);
