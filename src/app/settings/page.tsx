
"use client";

import { useEffect, useState } from "react";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { uiLanguages, targetLanguages } from "@/lib/translations";
import Logo from "@/components/logo";
import { getAvailableModels } from "../actions";
import { useToast } from "@/hooks/use-toast";
import type { ModelReference } from "genkit";

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
    const fetchModels = async () => {
      setLoadingModels(true);
      const { data, error } = await getAvailableModels();
      if (error) {
        toast({
          variant: "destructive",
          title: t("Error"),
          description: t("Could not load AI models. Please try again later."),
        });
      } else if (data) {
        setModels(data);
      }
      setLoadingModels(false);
    };
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
            {loadingModels ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <span>{t("Loading models...")}</span>
              </div>
            ) : (
                <Select value={textModel} onValueChange={setTextModel}>
                    <SelectTrigger id="text-model">
                        <SelectValue placeholder={t("Select a model")} />
                    </SelectTrigger>
                    <SelectContent>
                        {models.map((model) => (
                        <SelectItem key={model.name} value={model.name}>
                            {model.info?.label || model.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vision-model">{t('Vision/Image Model')}</Label>
            {loadingModels ? (
                 <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>{t("Loading models...")}</span>
                 </div>
            ) : (
                <Select value={visionModel} onValueChange={setVisionModel}>
                    <SelectTrigger id="vision-model">
                        <SelectValue placeholder={t("Select a model")} />
                    </SelectTrigger>
                    <SelectContent>
                        {models.map((model) => (
                        <SelectItem key={model.name} value={model.name}>
                             {model.info?.label || model.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
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
