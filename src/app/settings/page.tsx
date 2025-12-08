
import type { ModelReference } from 'genkit';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import SettingsForm from "./settings-form";

const textModels: ModelReference[] = [
  { name: 'gemini-1.5-flash-latest', supports: { generate: true }, label: "Gemini 1.5 Flash" },
  { name: 'gemini-1.5-pro-latest', supports: { generate: true }, label: "Gemini 1.5 Pro" },
  { name: 'gemini-1.0-pro', supports: { generate: true }, label: "Gemini 1.0 Pro" },
];

const visionModels: ModelReference[] = [
  { name: 'gemini-1.5-flash-latest', supports: { generate: true }, label: "Gemini 1.5 Flash" },
  { name: 'gemini-1.5-pro-latest', supports: { generate: true }, label: "Gemini 1.5 Pro" },
];


export default async function SettingsPage() {
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
        modelsError={null}
      />
    </div>
  );
}
