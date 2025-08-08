
'use server';

import {
  extractRecipeData,
  type ExtractRecipeDataOutput,
} from '@/ai/flows/extract-recipe-data';
import {
  translateRecipe,
  type TranslateRecipeInput,
} from '@/ai/flows/translate-recipe';
import {
  convertUnitsToPreferredSystem,
  type ConvertUnitsToPreferredSystemInput,
} from '@/ai/flows/convert-units';
import { extractRecipeFromImage } from '@/ai/flows/extract-recipe-from-image';
import type { Recipe } from '@/lib/schema';

type ActionResult<T> = { data: T; error: null } | { data: null; error: string };

async function fetchHtml(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    return await response.text();
  } catch (error: any) {
    console.error('Error fetching HTML:', error);
    throw new Error('Could not retrieve content from the provided URL.');
  }
}

function recipeOutputToString(recipe: ExtractRecipeDataOutput): string {
    let text = `Title: ${recipe.title || ''}\n`;
    if (recipe.description) {
        text += `Description: ${recipe.description}\n`;
    }
    if (recipe.prepTime) {
        text += `Prep Time: ${recipe.prepTime}\n`;
    }
    if (recipe.cookingTime) {
        text += `Cook Time: ${recipe.cookingTime}\n`;
    }
    if (recipe.servings) {
        text += `Servings: ${recipe.servings}\n`;
    }
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        text += `Ingredients:\n${recipe.ingredients.join('\n')}\n`;
    }
    if (recipe.instructions && recipe.instructions.length > 0) {
        text += `Instructions:\n${recipe.instructions.join('\n')}\n`;
    }
    return text;
}


export async function handleRecipeTransform({
  source,
  targetLanguage,
  measurementSystem,
  isImage = false,
}: {
  source: string;
  targetLanguage: string;
  measurementSystem: 'metric' | 'us';
  isImage?: boolean;
}): Promise<ActionResult<Recipe>> {
  if (!source) {
    return { data: null, error: 'Source cannot be empty.' };
  }

  try {
    let content = source;
    let extractedData: ExtractRecipeDataOutput;
    let isUrl = false;

    if (isImage) {
        extractedData = await extractRecipeFromImage({ imageDataUri: source });
    } else {
        isUrl = source.startsWith('http');
        if (isUrl) {
            content = await fetchHtml(source);
        }
         // 1. Extract recipe data
        extractedData = await extractRecipeData({ source: content });
    }
    
    let recipeText = recipeOutputToString(extractedData);

    // 2. Translate if necessary
    if (targetLanguage !== 'en') { // Assuming source is primarily English
        const translated = await translateRecipe({ recipeText, targetLanguage });
        recipeText = translated.translatedRecipe;
    }

    // 3. Convert units
    const converted = await convertUnitsToPreferredSystem({
        recipeText: recipeText,
        preferredSystem: measurementSystem,
    });

    // 4. Re-extract from the final text to get structured data
    const finalData = await extractRecipeData({ source: converted.convertedRecipeText });


    const recipeData: Recipe = {
      title: finalData.title || extractedData.title || '',
      description: finalData.description || extractedData.description || '',
      servings: finalData.servings || extractedData.servings || '',
      prepTime: finalData.prepTime || extractedData.prepTime || '',
      cookingTime: finalData.cookingTime || extractedData.cookingTime || '',
      ingredients:
        finalData.ingredients?.map((i) => ({ value: i })) || [],
      instructions:
        finalData.instructions?.map((i) => ({ value: i })) || [],
      source: isUrl ? source : '',
    };

    return { data: recipeData, error: null };
  } catch (e: any) {
    console.error(e);
    return {
      data: null,
      error: e.message || 'An unknown error occurred during transformation.',
    };
  }
}
