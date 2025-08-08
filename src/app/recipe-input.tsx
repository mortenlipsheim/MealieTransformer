
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
import { handleExtractRecipe } from "./actions";
import type { Recipe } from "@/lib/schema";

export default function RecipeInput() {
  const [source, setSource] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [, setRecipe] = useLocalStorage<Recipe | null>("recipe", null);

  const onTransform = async (source: string) => {
    setLoading(true);
    const { data, error } = await handleExtractRecipe({ source });
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    } else if (data) {
        const recipeData: Recipe = {
            title: data.title || "",
            description: data.description || "",
            servings: data.servings || "",
            prepTime: data.prepTime || "",
            cookingTime: data.cookingTime || "",
            ingredients: data.ingredients?.map(i => ({value: i})) || [],
            instructions: data.instructions?.map(i => ({value: i})) || [],
            source: source.startsWith('http') ? source : '',
        }
        setRecipe(recipeData);
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
        title: "Error",
        description: "Please enter a URL.",
      });
    }
  };
  
  const handleTextTransform = () => {
    if (text) {
      onTransform(text);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter recipe text.",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Recipe Input</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="image" disabled>Image</TabsTrigger>
            <TabsTrigger value="youtube" disabled>YouTube</TabsTrigger>
          </TabsList>
          <TabsContent value="url">
            <div className="mt-4 space-y-4">
              <Input
                placeholder="https://example.com/recipe"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
               <Button onClick={handleUrlTransform} disabled={loading} className="w-full">
                {loading ? 'Transforming...' : 'Transform'}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="text">
            <div className="mt-4 space-y-4">
              <Textarea
                placeholder="Paste your recipe text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
              />
              <Button onClick={handleTextTransform} disabled={loading} className="w-full">
                {loading ? 'Transforming...' : 'Transform'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
