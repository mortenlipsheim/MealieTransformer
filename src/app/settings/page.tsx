
"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/use-local-storage";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { uiLanguages, targetLanguages } from "@/lib/translations";
import { Separator } from "@/components/ui/separator";

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
  const [mealieUrl, setMealieUrl] = useLocalStorage("mealieUrl", "");
  const [mealieApiToken, setMealieApiToken] = useLocalStorage(
    "mealieApiToken",
    ""
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
          <CardTitle className="font-headline text-3xl">{t('Mealie Settings')}</CardTitle>
          <CardDescription>{t('Configure the connection to your Mealie instance.')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="mealie-url">{t('Mealie URL')}</Label>
            <Input
              id="mealie-url"
              placeholder="https://mealie.example.com"
              value={mealieUrl}
              onChange={(e) => setMealieUrl(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mealie-api-token">{t('Mealie API Token')}</Label>
            <Input
              id="mealie-api-token"
              type="password"
              placeholder="Enter your long-lived API token"
              value={mealieApiToken}
              onChange={(e) => setMealieApiToken(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{t('Transformer Settings')}</CardTitle>
           <CardDescription>{t('Configure the recipe transformation and translation settings.')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="ui-language">{t('UI Language')}</Label>
            <Select value={uiLanguage} onValueChange={setUiLanguage}>
              <SelectTrigger id="ui-language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(uiLanguages).map(([code, name]) => (
                  <SelectItem key={code} value={code}>{name}</SelectItem>
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
