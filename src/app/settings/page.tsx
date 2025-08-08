
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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

export default function SettingsPage() {
  const [uiLanguage, setUiLanguage] = useLocalStorage("uiLanguage", "en");
  const [targetLanguage, setTargetLanguage] = useLocalStorage(
    "targetLanguage",
    "fr"
  );
  const [measurementSystem, setMeasurementSystem] = useLocalStorage(
    "measurementSystem",
    "metric"
  );
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">{t('Mealie Transformer')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{t('Settings')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="ui-language">{t('UI Language')}</Label>
            <Select value={uiLanguage} onValueChange={setUiLanguage}>
              <SelectTrigger id="ui-language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('English')}</SelectItem>
                <SelectItem value="es">{t('Spanish')}</SelectItem>
                <SelectItem value="fr">{t('French')}</SelectItem>
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
                <SelectItem value="en">{t('English')}</SelectItem>
                <SelectItem value="es">{t('Spanish')}</SelectItem>
                <SelectItem value="fr">{t('French')}</SelectItem>
                <SelectItem value="de">{t('German')}</SelectItem>
                <SelectItem value="it">{t('Italian')}</SelectItem>
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
