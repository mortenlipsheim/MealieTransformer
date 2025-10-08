
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
import { useToast } from "@/hooks/use-toast";
import type { ModelReference } from "genkit/ai";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SettingsFormProps {
  models: ModelReference[] | null;
  modelsError: string | null;
}

export default function SettingsForm({ models, modelsError }: SettingsFormProps) {
  const [uiLanguage, setUiLanguage] = useLocalStorage("uiLanguage", "en");
  const [targetLanguage, setTargetLanguage] = useLocalStorage("targetLanguage", "fr");
  const [measurementSystem, setMeasurementSystem] = useLocalStorage("measurementSystem", "metric");
  const [textModel, setTextModel] = useLocalStorage<string>("textModel", "");
  const [visionModel, setVisionModel] = useLocalStorage<string>("visionModel", "");
  const [isMounted, setIsMounted] = useState(false);

  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);

    if (modelsError) {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: modelsError,
      });
    }

    if (models) {
      if (!textModel) {
        const flashModel = models.find((m: ModelReference) => m.name.includes('flash'));
        if (flashModel) setTextModel(flashModel.name);
        else if (models.length > 0) setTextModel(models[0].name);
      }
      if (!visionModel) {
        const visionModelFound = models.find((m: ModelReference) => m.name.includes('vision'));
        if (visionModelFound) setVisionModel(visionModelFound.name);
        else if (models.length > 1) setVisionModel(models[1]?.name || models[0].name);
        else if (models.length > 0) setVisionModel(models[0].name);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [models, modelsError, t, toast]);

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
            <AlertTitle>{t("Error Loading Models")}</AlertTitle>
            <AlertDescription>{modelsError}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-2">
          <Label htmlFor="text-model">{t('Text Generation Model')}</Label>
          <Select value={textModel} onValueChange={setTextModel} disabled={!models}>
            <SelectTrigger id="text-model">
              <SelectValue placeholder={!models ? t("Loading models...") : t("Select a model")} />
            </SelectTrigger>
            <SelectContent>
              {models?.map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  {model.info?.label || model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="vision-model">{t('Vision/Image Model')}</Label>
          <Select value={visionModel} onValueChange={setVisionModel} disabled={!models}>
            <SelectTrigger id="vision-model">
              <SelectValue placeholder={!models ? t("Loading models...") : t("Select a model")} />
            </SelectTrigger>
            <SelectContent>
              {models?.map((model) => (
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
  );
}
