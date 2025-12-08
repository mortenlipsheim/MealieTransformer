
'use server';

import '@/ai/genkit'; // Ensure Genkit is initialized
import type { ModelReference } from 'genkit';
import * as Genkit from 'genkit';

/**
 * A Server Action to get the list of available Genkit models.
 */
export async function getAvailableModels(): Promise<ModelReference[]> {
  try {
    const models = await Genkit.listModels();
    return models;
  } catch (error: any) {
    console.error('Genkit listModels error:', error);
    // Re-throw a simpler error to avoid leaking complex objects to the client.
    throw new Error(error.message || 'An unexpected error occurred while fetching models.');
  }
}
