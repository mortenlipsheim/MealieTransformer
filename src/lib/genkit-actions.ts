
'use server';

import 'dotenv/config';
import '@/ai/genkit';
import * as Genkit from 'genkit';
import type { ModelReference } from 'genkit';

// This is a server-only file
export async function getAvailableModels(): Promise<ModelReference[]> {
  try {
    const models = await Genkit.listModels();
    return models;
  } catch (error: any) {
    console.error('Genkit listModels error:', error);
    // Throw a more specific error to be handled by the caller
    throw new Error(`Failed to list models from Genkit. Reason: ${error.message}`);
  }
}
