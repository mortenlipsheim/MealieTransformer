
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { handleRecipeTransform } from "./actions";
import type { Recipe } from "@/lib/schema";
import { useTranslation } from "@/hooks/use-translation";

export default function RecipeInput() {
  const [source, setSource] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [, setRecipe] = useLocalStorage<Recipe | null>("recipe", null);
  const { t } = useTranslation();
  const [targetLanguage] = useLocalStorage("targetLanguage", "en");
  const [measurementSystem] = useLocalStorage("measurementSystem", "metric");


  const onTransform = async (sourceText: string) => {
    setLoading(true);
    const { data, error } = await handleRecipeTransform({ 
        source: sourceText,
        targetLanguage,
        measurementSystem,
     });

    if (error) {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: error,
      });
    } else if (data) {
        setRecipe(data);
        router.push("/review");
    }
    setLoading(false);
  };

  const handleUrlTransform = () => {
    if (source) {
      onTransform(source);
    } else {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("Please enter a URL."),
      });
    }
  };
  
  const handleTextTransform = () => {
    if (text) {
      onTransform(text);
    } else {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("Please enter recipe text."),
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">{t('Recipe Input')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="url">{t('URL')}</TabsTrigger>
            <TabsTrigger value="text">{t('Text')}</TabsTrigger>
            <TabsTrigger value="image" disabled>{t('Image')}</TabsTrigger>
            <TabsTrigger value="youtube" disabled>{t('YouTube')}</TabsTrigger>
          </TabsList>
          <TabsContent value="url">
            <div className="mt-4 space-y-4">
              <Input
                placeholder={t("https://example.com/recipe")}
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
               <Button onClick={handleUrlTransform} disabled={loading} className="w-full">
                {loading ? t('Transforming...') : t('Transform')}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="text">
            <div className="mt-4 space-y-4">
              <Textarea
                placeholder={t("Paste your recipe text here...")}
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
              />
              <Button onClick={handleTextTransform} disabled={loading} className="w-full">
                {loading ? t('Transforming...') : t('Transform')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
