
'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting recipe data from a URL or text.
 *
 * The flow uses an AI prompt to identify and extract key information such as ingredients,
 * instructions, and cooking time from the input.
 *
 * @exports {
 *   extractRecipeData,
 *   ExtractRecipeDataInput,
 *   ExtractRecipeDataOutput
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { extractedRecipeDataSchema, type ExtractedRecipeData } from '@/lib/schema';


const ExtractRecipeDataInputSchema = z.object({
  source: z.string().describe('The HTML content or text of the recipe to extract data from.'),
});
export type ExtractRecipeDataInput = z.infer<typeof ExtractRecipeDataInputSchema>;

export type ExtractRecipeDataOutput = ExtractedRecipeData;

export async function extractRecipeData(input: ExtractRecipeDataInput): Promise<ExtractRecipeDataOutput> {
  return extractRecipeDataFlow(input);
}

const extractRecipeDataPrompt = ai.definePrompt({
  name: 'extractRecipeDataPrompt',
  input: {schema: ExtractRecipeDataInputSchema},
  output: {schema: extractedRecipeDataSchema},
  model: 'googleai/gemini-pro',
  prompt: `You are a recipe data extraction expert.

  Your task is to extract the following information from the given recipe source (which could be HTML content or plain text):
  - Recipe Title
  - Description
  - Ingredients (as a list of strings)
  - Instructions (as a list of strings)
  - Cooking Time
  - Prep Time
  - Servings

  Source:
  {{{source}}}

  Please provide the extracted information in JSON format.
  If a particular piece of information is not available, omit that field from the JSON output.
  Focus on the main recipe content and ignore irrelevant parts of the page like headers, footers, or ads.
`,
});

const extractRecipeDataFlow = ai.defineFlow(
  {
    name: 'extractRecipeDataFlow',
    inputSchema: ExtractRecipeDataInputSchema,
    outputSchema: extractedRecipeDataSchema,
  },
  async input => {
    const {output} = await extractRecipeDataPrompt(input);
    return output!;
  }
);
