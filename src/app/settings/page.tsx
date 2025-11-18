import type { ModelReference } from 'genkit';
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
    // This needs to be an absolute URL on the server, but Next.js fetch can handle relative
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:9002';
    const response = await fetch(`${baseUrl}/api/models`, { cache: 'no-store' });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API responded with status ${response.status}`);
    }

    const allModels: ModelReference[] = await response.json();
    
    if (!allModels || allModels.length === 0) {
      return { data: null, error: 'No models were returned from the API. Using hardcoded fallbacks.' };
    }
    
    const supportedModels = allModels.filter(m => 
      m.supports.generate && 
      (m.name.includes('gemini') || m.name.includes('flash') || m.name.includes('pro'))
    );

    return { data: supportedModels, error: null };
  } catch (e: any) {
    const errorMessage = `Could not load AI models from API. Reason: ${e.message || 'An unknown error occurred.'}`;
    console.error(e);
    return { 
      data: null, 
      error: errorMessage
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
