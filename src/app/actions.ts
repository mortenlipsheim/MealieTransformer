'use server';

import { extractRecipeData, type ExtractRecipeDataOutput } from '@/ai/flows/extract-recipe-data';

type ActionResult<T> = { data: T; error: null } | { data: null; error: string };

export async function handleExtractRecipe({ source }: { source: string }): Promise<ActionResult<ExtractRecipeDataOutput>> {
  if (!source) {
    return { data: null, error: 'Source cannot be empty.' };
  }
  try {
    const data = await extractRecipeData({ source });
    return { data, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'An unknown error occurred during extraction.' };
  }
}
