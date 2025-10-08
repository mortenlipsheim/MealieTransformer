
"use client";

import { useState } from "react";
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

// Hardcoded list of common models as a fallback
const commonModels = [
    { name: "gemini-1.5-flash-latest", label: "Gemini 1.5 Flash" },
    { name: "gemini-1.0-pro", label: "Gemini 1.0 Pro" },
    { name: "gemini-pro-vision", label: "Gemini Pro Vision" },
];


export default function SettingsPage() {
  const [uiLanguage, setUiLanguage] = useLocalStorage("uiLanguage", "en");
  const [targetLanguage, setTargetLanguage] = useLocalStorage("targetLanguage", "fr");
  const [measurementSystem, setMeasurementSystem] = useLocalStorage("measurementSystem", "metric");
  const [textModel, setTextModel] = useLocalStorage<string>("textModel", "gemini-1.5-flash-latest");
  const [visionModel, setVisionModel] = useLocalStorage<string>("visionModel", "gemini-pro-vision");

  const { t } = useTranslation();

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
            <Select value={textModel} onValueChange={setTextModel}>
                <SelectTrigger id="text-model">
                    <SelectValue placeholder={t("Select a model")} />
                </SelectTrigger>
                <SelectContent>
                    {commonModels.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                        {model.label}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vision-model">{t('Vision/Image Model')}</Label>
             <Select value={visionModel} onValueChange={setVisionModel}>
                <SelectTrigger id="vision-model">
                    <SelectValue placeholder={t("Select a model")} />
                </SelectTrigger>
                <SelectContent>
                    {commonModels.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                        {model.label}
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
