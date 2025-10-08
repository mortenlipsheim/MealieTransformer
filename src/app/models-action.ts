
'use server';

import 'dotenv/config';
import '@/ai/genkit';

import { listModels, type ModelReference } from 'genkit';

type ActionResult<T> = { data: T; error: null } | { data: null; error: string };

export default async function getAvailableModels(): Promise<ActionResult<ModelReference[]>> {
    try {
        const models = await listModels();
        if (!models || models.length === 0) {
            throw new Error("No models in the list");
        }
        return { data: models, error: null };
    } catch (e: any) {
        console.error("Error fetching models:", e);
        return {
            data: null,
            error: e.message || "Could not fetch available AI models."
        };
    }
}
