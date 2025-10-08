
'use server';

import 'dotenv/config';
import '@/ai/genkit';
import { listModels, type ModelReference } from 'genkit';

export async function getAvailableModels(): Promise<{ data: ModelReference[] | null, error: string | null }> {
  try {
    const allModels: ModelReference[] = await listModels();
    
    if (!allModels || allModels.length === 0) {
      return { data: null, error: 'No models were returned from the listModels API.' };
    }
    
    // Filter for only generative models from Google AI that support 'generate'
    const generativeModels = allModels.filter(m => 
        m.provider === 'google-ai' &&
        m.info?.supportedGenerationMethods?.includes("generate")
    );

    if (generativeModels.length === 0) {
        return { data: null, error: 'No generative models found. Please check your Google AI project and API key.' };
    }

    return { data: generativeModels, error: null };
  } catch (e: any) {
    console.error("Error fetching models:", e);
    // Return the actual error message for better debugging on the client
    return { data: null, error: e.message || 'An unknown error occurred while fetching models.' };
  }
}
