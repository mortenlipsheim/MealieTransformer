
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/use-local-storage";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { uiLanguages, targetLanguages } from "@/lib/translations";
import Logo from "@/components/logo";
import { useToast } from "@/hooks/use-toast";
import type { ModelReference } from "genkit/ai";

export default function SettingsPage() {
  const [uiLanguage, setUiLanguage] = useLocalStorage("uiLanguage", "en");
  const [targetLanguage, setTargetLanguage] = useLocalStorage("targetLanguage", "fr");
  const [measurementSystem, setMeasurementSystem] = useLocalStorage("measurementSystem", "metric");
  const [textModel, setTextModel] = useLocalStorage<string>("textModel", "");
  const [visionModel, setVisionModel] = useLocalStorage<string>("visionModel", "");

  const [models, setModels] = useState<ModelReference[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);

  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchModels() {
      setLoadingModels(true);
      try {
        const response = await fetch("/api/models");
        if (!response.ok) {
           const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch models: ${response.statusText}`);
        }
        const { data, error } = await response.json();

        if (error) {
          throw new Error(error);
        }

        if (!data || data.length === 0) {
          throw new Error("No models returned from API.");
        }
        
        setModels(data);

        // Set default models only if they are not already set
        if (!textModel) {
            const flashModel = data.find((m: ModelReference) => m.name.includes('flash'));
            if (flashModel) setTextModel(flashModel.name);
        }
        if (!visionModel) {
            const visionModelFound = data.find((m: ModelReference) => m.name.includes('vision'));
            if (visionModelFound) setVisionModel(visionModelFound.name);
        }

      } catch (e: any) {
        toast({
          variant: "destructive",
          title: t("Error"),
          description: e.message || "Could not load AI models.",
        });
      } finally {
        setLoadingModels(false);
      }
    }
    fetchModels();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{t('Transformer Settings')}</CardTitle>
           <CardDescription>{t('Configure the recipe transformation and translation settings.')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="text-model">{t('Text Generation Model')}</Label>
            <Select value={textModel} onValueChange={setTextModel} disabled={loadingModels}>
                <SelectTrigger id="text-model">
                    <SelectValue placeholder={loadingModels ? t("Loading models...") : t("Select a model")} />
                </SelectTrigger>
                <SelectContent>
                    {models.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                        {model.info?.label || model.name}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vision-model">{t('Vision/Image Model')}</Label>
             <Select value={visionModel} onValueChange={setVisionModel} disabled={loadingModels}>
                <SelectTrigger id="vision-model">
                    <SelectValue placeholder={loadingModels ? t("Loading models...") : t("Select a model")} />
                </SelectTrigger>
                <SelectContent>
                    {models.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                        {model.info?.label || model.name}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ui-language">{t('UI Language')}</Label>
            <Select value={uiLanguage} onValueChange={setUiLanguage}>
              <SelectTrigger id="ui-language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(uiLanguages).map(([code, name]) => (
                  <SelectItem key={code} value={code}>{t(name)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="target-language">{t('Target Recipe Language')}</Label>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger id="target-language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(targetLanguages).map(([code, name]) => (
                  <SelectItem key={code} value={code}>{t(name)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="measurement-system">
              {t('Target Measurement System')}
            </Label>
            <Select
              value={measurementSystem}
              onValueChange={setMeasurementSystem}
            >
              <SelectTrigger id="measurement-system">
                <SelectValue placeholder="Select system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">{t('Metric')}</SelectItem>
                <SelectItem value="us">{t('US')}</SelectItem>
                <SelectItem value="imperial">{t('Imperial')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
