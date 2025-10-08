
import 'dotenv/config';
import { ai } from '@/ai/genkit';
import type { ModelReference } from 'genkit/ai';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import SettingsForm from "./settings-form";

async function getAvailableModels(): Promise<{ data: ModelReference[] | null; error: string | null; }> {
  try {
    const allModels: ModelReference[] = await ai.listModels();

    if (!allModels || allModels.length === 0) {
      return { data: null, error: 'No models were returned from the listModels API.' };
    }

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
    const errorMessage = e.message || 'An unknown error occurred while fetching models.';
    if (errorMessage.toLowerCase().includes('api key not valid')) {
        return { data: null, error: 'The provided Google AI API Key is not valid. Please check your .env file.' };
    }
    return { data: null, error: errorMessage };
  }
}

export default async function SettingsPage() {
  const { data: models, error } = await getAvailableModels();

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <Logo />
      </div>

      <SettingsForm models={models} modelsError={error} />
    </div>
  );
}
