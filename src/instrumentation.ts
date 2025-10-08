
// src/instrumentation.ts
import { config } from 'dotenv';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    config();
    // The import of @/ai/genkit is what initializes the Genkit instance
    // with the googleAI() plugin, which in turn needs the GEMINI_API_KEY.
    await import('@/ai/genkit');
  }
}
