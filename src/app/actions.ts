
'use server';

import { extractRecipeFromImage } from '@/ai/flows/extract-recipe-from-image';
import { transformRecipe } from '@/ai/flows/transform-recipe';
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
    let finalData: Recipe;
    let isUrl = false;

    if (isImage) {
      // If it's an image, we first extract the text content.
      const extractedTextData = await extractRecipeFromImage({ imageDataUri: source });
      // Then we pass that text to the universal transform flow.
      finalData = await transformRecipe({
        source: extractedTextData.recipeText,
        targetLanguage,
        measurementSystem,
      });

    } else {
        isUrl = source.startsWith('http');
        if (isUrl) {
            content = await fetchHtml(source);
        }
        // For URL or text, we call the universal transform flow directly.
        finalData = await transformRecipe({
            source: content,
            targetLanguage,
            measurementSystem,
        });
    }

    const recipeData: Recipe = {
      ...finalData,
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


export async function sendToMealie({
    recipe,
}: {
    recipe: Recipe;
}): Promise<ActionResult<{ success: boolean }>> {

    const mealieUrl = process.env.MEALIE_URL;
    const mealieApiToken = process.env.MEALIE_API_TOKEN;

    if (!mealieUrl || !mealieApiToken) {
        return { data: null, error: "Mealie URL and API Token are not configured in environment variables." };
    }

    try {
        const mealieApiUrl = new URL('/api/recipes/create/html-or-json', mealieUrl).toString();

        const schemaOrgRecipe = {
            "@context": "https://schema.org/",
            "@type": "Recipe",
            name: recipe.title,
            description: recipe.description,
            recipeYield: recipe.servings,
            prepTime: recipe.prepTime,
            totalTime: recipe.cookingTime,
            recipeIngredient: recipe.ingredients?.map(i => i.value),
            recipeInstructions: recipe.instructions?.map(i => ({ "@type": "HowToStep", "text": i.value })),
            org_url: recipe.source,
        };

        const payload = {
            data: JSON.stringify(schemaOrgRecipe),
            includeTags: false,
        };

        const response = await fetch(mealieApiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${mealieApiToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Mealie API Error:', errorData);
            throw new Error(`Mealie API responded with status ${response.status}: ${errorData.detail || response.statusText}`);
        }

        return { data: { success: true }, error: null };

    } catch (e: any) {
        console.error("Error sending to Mealie:", e);
        return {
            data: null,
            error: e.message || 'An unknown error occurred while sending to Mealie.',
        };
    }
}
