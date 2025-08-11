
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
  sourceImages,
  targetLanguage,
  measurementSystem,
  sourceType = 'text',
}: {
  source?: string;
  sourceImages?: string[];
  targetLanguage: string;
  measurementSystem: 'metric' | 'us';
  sourceType: 'url' | 'text' | 'image' | 'youtube';
}): Promise<ActionResult<Recipe>> {

  try {
    let content: string | undefined = source;
    let finalData: Recipe;

    if (sourceType === 'image') {
        if (!sourceImages || sourceImages.length === 0) {
            return { data: null, error: 'No images provided for transformation.' };
        }
      const extractedTextData = await extractRecipeFromImage({ imageDataUris: sourceImages });
      content = extractedTextData.recipeText;

    } else if (sourceType === 'url') {
        if (!source) {
            return { data: null, error: 'URL cannot be empty.' };
        }
        content = await fetchHtml(source);
    }

    if (!content && sourceType !== 'youtube') {
        return { data: null, error: 'Could not resolve recipe content from the source.' };
    }

    // For YouTube, the source URL itself is the content.
    const sourceForTransform = sourceType === 'youtube' ? source! : content!;

    finalData = await transformRecipe({
        source: sourceForTransform,
        targetLanguage,
        measurementSystem,
    });

    const recipeData: Recipe = {
      ...finalData,
      source: (sourceType === 'url' || sourceType === 'youtube') ? source : '',
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
            image: recipe.image,
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
