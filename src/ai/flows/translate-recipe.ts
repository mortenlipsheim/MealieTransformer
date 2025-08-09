
'use server';

/**
 * @fileOverview Translates a recipe to the user's preferred language.
 *
 * - translateRecipe - A function that handles the recipe translation process.
 * - TranslateRecipeInput - The input type for the translateRecipe function.
 * - TranslateRecipeOutput - The return type for the translateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateRecipeInputSchema = z.object({
  recipeText: z.string().describe('The recipe text to translate.'),
  targetLanguage: z.string().describe('The target language for the translation.'),
});
export type TranslateRecipeInput = z.infer<typeof TranslateRecipeInputSchema>;

const TranslateRecipeOutputSchema = z.object({
  translatedRecipe: z.string().describe('The translated recipe in the target language.'),
});
export type TranslateRecipeOutput = z.infer<typeof TranslateRecipeOutputSchema>;

export async function translateRecipe(input: TranslateRecipeInput): Promise<TranslateRecipeOutput> {
  return translateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateRecipePrompt',
  input: {schema: TranslateRecipeInputSchema},
  output: {schema: TranslateRecipeOutputSchema},
  model: 'gemini-pro',
  prompt: `Translate the following recipe to {{{targetLanguage}}}.\n\nRecipe:\n{{{recipeText}}}`,
});

const translateRecipeFlow = ai.defineFlow(
  {
    name: 'translateRecipeFlow',
    inputSchema: TranslateRecipeInputSchema,
    outputSchema: TranslateRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
