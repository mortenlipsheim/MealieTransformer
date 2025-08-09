
'use server';

/**
 * @fileOverview Converts units in a recipe to the user's preferred measurement system (metric or US).
 *
 * - convertUnitsToPreferredSystem - A function that handles the unit conversion process.
 * - ConvertUnitsToPreferredSystemInput - The input type for the convertUnitsToPreferredSystem function.
 * - ConvertUnitsToPreferredSystemOutput - The return type for the convertUnitsToPreferredSystem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertUnitsToPreferredSystemInputSchema = z.object({
  recipeText: z.string().describe('The recipe text to convert.'),
  preferredSystem: z
    .enum(['metric', 'us'])
    .describe('The preferred measurement system (metric or US).'),
});
export type ConvertUnitsToPreferredSystemInput = z.infer<
  typeof ConvertUnitsToPreferredSystemInputSchema
>;

const ConvertUnitsToPreferredSystemOutputSchema = z.object({
  convertedRecipeText: z
    .string()
    .describe('The recipe text with converted units.'),
});
export type ConvertUnitsToPreferredSystemOutput = z.infer<
  typeof ConvertUnitsToPreferredSystemOutputSchema
>;

export async function convertUnitsToPreferredSystem(
  input: ConvertUnitsToPreferredSystemInput
): Promise<ConvertUnitsToPreferredSystemOutput> {
  return convertUnitsToPreferredSystemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertUnitsToPreferredSystemPrompt',
  input: {schema: ConvertUnitsToPreferredSystemInputSchema},
  output: {schema: ConvertUnitsToPreferredSystemOutputSchema},
  model: 'gemini-pro',
  prompt: `You are a recipe assistant that converts units in a recipe to the user's preferred measurement system.

  The user's preferred measurement system is: {{{preferredSystem}}}

  Here is the recipe to convert:
  {{{recipeText}}}

  Convert the units in the recipe to the user's preferred measurement system.  Do not modify any other aspect of the recipe.
  If the recipe is already in the user's preferred system, return the recipe as is.
  If you are unsure of a conversion, leave the original measurement as is.
  Pay attention to fractions, and properly convert them to the target system.
`,
});

const convertUnitsToPreferredSystemFlow = ai.defineFlow(
  {
    name: 'convertUnitsToPreferredSystemFlow',
    inputSchema: ConvertUnitsToPreferredSystemInputSchema,
    outputSchema: ConvertUnitsToPreferredSystemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
