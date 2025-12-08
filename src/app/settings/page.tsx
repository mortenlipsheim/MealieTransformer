
import type { ModelReference } from 'genkit';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import SettingsForm from "./settings-form";
import { getAvailableModels } from "@/lib/genkit-actions";


export default async function SettingsPage() {
  let textModels: ModelReference[] = [];
  let visionModels: ModelReference[] = [];
  let modelsError: string | null = null;

  try {
    const allModels = await getAvailableModels();

    textModels = allModels.filter(m =>
      m.supports.generate &&
      (m.name.includes('gemini') && !m.name.includes('vision'))
    );

    visionModels = allModels.filter(m =>
      m.supports.generate &&
      m.name.includes('gemini') && (m.name.includes('vision') || m.name.includes('flash')) // Flash is multimodal
    );

  } catch (error: any) {
    console.error("Failed to load models:", error);
    modelsError = error.message || "Could not load AI models from the API.";
    
    // Fallback to a hardcoded list if the API fails
    textModels = [
        { name: 'gemini-1.5-flash-latest', supports: { generate: true }, label: "Gemini 1.5 Flash" },
        { name: 'gemini-1.5-pro-latest', supports: { generate: true }, label: "Gemini 1.5 Pro" },
        { name: 'gemini-1.0-pro', supports: { generate: true }, label: "Gemini 1.0 Pro" },
    ];
    visionModels = [
        { name: 'gemini-1.5-flash-latest', supports: { generate: true }, label: "Gemini 1.5 Flash" },
        { name: 'gemini-1.5-pro-latest', supports: { generate: true }, label: "Gemini 1.5 Pro" },
    ];
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
