'use server';

import { extractRecipeData, type ExtractRecipeDataOutput } from '@/ai/flows/extract-recipe-data';
import { translateRecipe, type TranslateRecipeOutput } from '@/ai/flows/translate-recipe';
import { convertUnitsToPreferredSystem, type ConvertUnitsToPreferredSystemOutput } from '@/ai/flows/convert-units';
import type { Recipe } from '@/lib/schema';

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

export async function handleTranslateRecipe({ recipeText, targetLanguage }: { recipeText: string, targetLanguage: string }): Promise<ActionResult<TranslateRecipeOutput>> {
  if (!recipeText || !targetLanguage) {
    return { data: null, error: 'Recipe text and target language are required.' };
  }
  try {
    const data = await translateRecipe({ recipeText, targetLanguage });
    return { data, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'An unknown error occurred during translation.' };
  }
}

export async function handleConvertUnits({ recipeText, preferredSystem }: { recipeText: string, preferredSystem: 'metric' | 'us' }): Promise<ActionResult<ConvertUnitsToPreferredSystemOutput>> {
  if (!recipeText) {
    return { data: null, error: 'Recipe text is required.' };
  }
  try {
    const data = await convertUnitsToPreferredSystem({ recipeText, preferredSystem });
    return { data, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'An unknown error occurred during unit conversion.' };
  }
}

interface PostToMealieArgs {
    recipe: Recipe;
    mealieUrl: string;
    apiKey: string;
}

export async function handlePostToMealie({ recipe, mealieUrl, apiKey }: PostToMealieArgs): Promise<ActionResult<{ success: boolean }>> {
  try {
    const mealiePayload = {
      name: recipe.title,
      description: recipe.description || '',
      recipeYield: recipe.servings || '',
      recipeIngredient: recipe.ingredients?.map(ing => ({ note: ing.value })) || [],
      recipeInstructions: recipe.instructions?.map(inst => ({ text: inst.value })) || [],
      prepTime: recipe.prepTime || '',
      cookTime: recipe.cookingTime || '',
      orgURL: recipe.source || '',
    };
    
    const response = await fetch(`${mealieUrl}/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(mealiePayload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Mealie API returned status ${response.status}`);
    }

    return { data: { success: true }, error: null };

  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'An unknown error occurred while posting to Mealie.' };
  }
}
