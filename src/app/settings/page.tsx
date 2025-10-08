
import 'dotenv/config';
import '@/ai/genkit'; // Ensure plugins are registered
import { listModels, type ModelReference } from 'genkit/ai';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import SettingsForm from "./settings-form";

async function getAvailableModels(): Promise<{ data: ModelReference[] | null; error: string | null; }> {
  try {
    const allModels = await listModels();

    if (!allModels || allModels.length === 0) {
      return { data: null, error: 'No models were returned from the listModels API.' };
    }
    
    // Filter for models that support 'generateContent'
    const supportedModels = allModels.filter(m => 
      m.supports.generateContent && 
      (m.name.includes('gemini') || m.name.includes('flash') || m.name.includes('pro'))
    );

    return { data: supportedModels, error: null };
  } catch (e: any) {
    console.error('Failed to list models:', e);
    return { data: null, error: 'Could not load AI models. Please check your configuration and API key.' };
  }
}


export default async function SettingsPage() {
  const { data: models, error: modelsError } = await getAvailableModels();

  // Separate the models into text and vision based on their names
  const textModels = models?.filter(m => !m.name.includes('vision')) || [];
  const visionModels = models?.filter(m => m.name.includes('vision') || m.name.includes('flash') || m.name.includes('pro')) || [];


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
