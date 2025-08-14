
'use server';

/**
 * @fileOverview This file defines a consolidated Genkit flow for transforming a recipe.
 *
 * It takes recipe text, a target language, and a measurement system,
 * and performs extraction, translation, and unit conversion in a single AI call.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { recipeSchema, type Recipe } from '@/lib/schema';


const TransformRecipeInputSchema = z.object({
  recipeText: z.string().describe('The plain text of the recipe to transform.'),
  targetLanguage: z.string().describe('The target language for the recipe (e.g., "French", "Spanish").'),
  measurementSystem: z.enum(['metric', 'us', 'imperial']).describe('The target measurement system (metric, US, or Imperial).'),
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
  system: `You are an expert Chef. Your task is to process the provided recipe text and perform these actions:
1.  **Extract & Generate**: Read the text and identify the key details (title, description, ingredients, instructions, prep time, cook time, and servings). If the source text is missing a title or description, you MUST generate a suitable one based on the content.
2.  **Convert Units**: Convert all measurements in the ingredients into the {{{measurementSystem}}} system.
3.  **Translate**: Translate ALL fields (including the title and description you may have generated) into natural-sounding {{{targetLanguage}}}.

Please format the final, processed recipe into the required JSON structure. Do not include any extra text, markdown, or commentary in your response.`,
  prompt: `Here is the recipe text to process:
{{{recipeText}}}
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
      throw new Error('The AI model could not generate a recipe. The source may not contain a valid recipe.');
    }
    return output;
  }
);
