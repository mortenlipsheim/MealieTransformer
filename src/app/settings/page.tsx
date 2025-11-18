
import 'dotenv/config';
import '@/ai/genkit'; // Ensure plugins are registered
import { listModels, type ModelReference } from 'genkit';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import SettingsForm from "./settings-form";

// Hardcoded fallbacks in case the model listing API fails
const hardcodedTextModels: ModelReference[] = [
  { name: 'gemini-1.5-flash-latest', supports: { generate: true }, label: "Gemini 1.5 Flash" },
  { name: 'gemini-1.5-pro-latest', supports: { generate: true }, label: "Gemini 1.5 Pro" },
  { name: 'gemini-1.0-pro', supports: { generate: true }, label: "Gemini 1.0 Pro" },
];

const hardcodedVisionModels: ModelReference[] = [
  { name: 'gemini-1.5-flash-latest', supports: { generate: true }, label: "Gemini 1.5 Flash" },
  { name: 'gemini-1.5-pro-latest', supports: { generate: true }, label: "Gemini 1.5 Pro" },
];


async function getAvailableModels(): Promise<{ data: ModelReference[] | null; error: string | null; }> {
  try {
    const allModels = await listModels();

    if (!allModels || allModels.length === 0) {
      return { data: null, error: 'No models were returned from the listModels API. Using hardcoded fallbacks.' };
    }
    
    const supportedModels = allModels.filter(m => 
      m.supports.generate && 
      (m.name.includes('gemini') || m.name.includes('flash') || m.name.includes('pro'))
    );

    return { data: supportedModels, error: null };
  } catch (e: any) {
    console.error('Failed to list models:', e);
    // Return hardcoded models as a fallback
    return { 
      data: [...hardcodedTextModels, ...hardcodedVisionModels], 
      error: 'Could not load AI models from API. Using hardcoded fallbacks. Please check your configuration and API key.' 
    };
  }
}


export default async function SettingsPage() {
  const { data: models, error: modelsError } = await getAvailableModels();

  let textModels: ModelReference[];
  let visionModels: ModelReference[];

  if (!models || models.length === 0) {
      textModels = hardcodedTextModels;
      visionModels = hardcodedVisionModels;
  } else {
    // Separate the models into text and vision based on their names
    textModels = models.filter(m => !m.name.includes('vision')) || [];
    visionModels = models.filter(m => m.name.includes('vision') || m.name.includes('flash') || m.name.includes('pro')) || [];

    if (textModels.length === 0) textModels = hardcodedTextModels;
    if (visionModels.length === 0) visionModels = hardcodedVisionModels;
  }


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

      <SettingsForm 
        textModels={textModels}
        visionModels={visionModels}
        modelsError={modelsError}
      />
    </div>
  );
}
