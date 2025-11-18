"use client";

import { useState, useEffect } from "react";
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
import { useTranslation } from "@/hooks/use-translation";
import { uiLanguages, targetLanguages } from "@/lib/translations";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ModelReference } from 'genkit/lib/models';

interface SettingsFormProps {
  textModels: ModelReference[];
  visionModels: ModelReference[];
  modelsError: string | null;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ textModels, visionModels, modelsError }) => {
  const [uiLanguage, setUiLanguage] = useLocalStorage("uiLanguage", "en");
  const [targetLanguage, setTargetLanguage] = useLocalStorage("targetLanguage", "fr");
  const [measurementSystem, setMeasurementSystem] = useLocalStorage("measurementSystem", "metric");
  const [textModel, setTextModel] = useLocalStorage<string>("textModel", 'gemini-1.5-flash-latest');
  const [visionModel, setVisionModel] = useLocalStorage<string>("visionModel", 'gemini-1.5-flash-latest');
  const [isMounted, setIsMounted] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getModelLabel = (model: ModelReference) => {
    if (model.label) return model.label;
    return model.name
      .split(/[-/]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="grid gap-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">{t('Transformer Settings')}</CardTitle>
        <CardDescription>{t('Configure the recipe transformation and translation settings.')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {modelsError && (
            <Alert variant="destructive">
                <AlertTitle>{t("Error")}</AlertTitle>
                <AlertDescription>{modelsError}</AlertDescription>
            </Alert>
        )}
        <div className="grid gap-2">
          <Label htmlFor="text-model">{t('Text Generation Model')}</Label>
          <Select value={textModel} onValueChange={setTextModel}>
            <SelectTrigger id="text-model">
              <SelectValue placeholder={t("Select a model")} />
            </SelectTrigger>
            <SelectContent>
              {textModels.map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  {getModelLabel(model)}
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
              {visionModels.map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  {getModelLabel(model)}
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
  );
};

export default SettingsForm;
