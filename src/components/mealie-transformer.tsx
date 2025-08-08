"use client";

import * as React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChefHat,
  Loader2,
  Plus,
  Trash2,
  Settings,
  Globe,
  Scale,
  Send,
  Wand2,
} from "lucide-react";
import { z } from "zod";

import { recipeSchema, type Recipe } from "@/lib/schema";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import {
  handleExtractRecipe,
  handleTranslateRecipe,
  handleConvertUnits,
  handlePostToMealie,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "./logo";

type LoadingStates = {
  extracting: boolean;
  translating: boolean;
  converting: boolean;
  posting: boolean;
};

export default function MealieTransformer() {
  const [sourceUrl, setSourceUrl] = React.useState("");
  const [sourceText, setSourceText] = React.useState("");
  const [extractedRecipe, setExtractedRecipe] = React.useState<Recipe | null>(
    null
  );
  const [loading, setLoading] = React.useState<LoadingStates>({
    extracting: false,
    translating: false,
    converting: false,
    posting: false,
  });

  const { toast } = useToast();

  const [mealieUrl, setMealieUrl] = useLocalStorage("mealieUrl", "");
  const [apiKey, setApiKey] = useLocalStorage("mealieApiKey", "");
  const [targetLanguage, setTargetLanguage] = useLocalStorage(
    "targetLanguage",
    "English"
  );
  const [preferredUnits, setPreferredUnits] = useLocalStorage<"metric" | "us">(
    "preferredUnits",
    "metric"
  );

  const form = useForm<Recipe>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      description: "",
      servings: "",
      prepTime: "",
      cookingTime: "",
      ingredients: [],
      instructions: [],
      source: "",
    },
  });

  const { fields: ingredients, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const { fields: instructions, append: appendInstruction, remove: removeInstruction, update: updateInstruction, } = useFieldArray({
    control: form.control,
    name: "instructions",
  });

  React.useEffect(() => {
    if (extractedRecipe) {
      form.reset({
        ...extractedRecipe,
        ingredients: extractedRecipe.ingredients?.map((i) => ({ value: i })) || [],
        instructions:
          extractedRecipe.instructions?.map((i) => ({ value: i })) || [],
      });
    }
  }, [extractedRecipe, form]);

  const onExtract = async (source: string) => {
    setLoading((prev) => ({ ...prev, extracting: true }));
    setExtractedRecipe(null);
    form.reset();

    const result = await handleExtractRecipe({ source });
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Extraction Failed",
        description: result.error,
      });
    } else if (result.data) {
      setExtractedRecipe(result.data);
      form.setValue("source", source);
      toast({
        title: "Recipe Extracted!",
        description: "Review and edit the recipe below.",
      });
    }
    setLoading((prev) => ({ ...prev, extracting: false }));
  };
  
  const onTranslate = async () => {
    setLoading((prev) => ({ ...prev, translating: true }));
    const currentRecipe = form.getValues();
    const recipeText = `Title: ${currentRecipe.title}\n\nIngredients:\n${currentRecipe.ingredients?.map(i => i.value).join('\n')}\n\nInstructions:\n${currentRecipe.instructions?.map(i => i.value).join('\n')}`;

    const result = await handleTranslateRecipe({ recipeText, targetLanguage });
    if(result.error) {
      toast({ variant: "destructive", title: "Translation Failed", description: result.error });
    } else if (result.data) {
      form.setValue('instructions', [{value: "TRANSLATED RECIPE (please review and separate ingredients if necessary):\n\n" + result.data.translatedRecipe}]);
      form.setValue('ingredients', []);
      toast({ title: "Recipe Translated", description: `The recipe has been translated to ${targetLanguage}.`});
    }
    setLoading((prev) => ({ ...prev, translating: false }));
  }
  
  const onConvertUnits = async () => {
    setLoading((prev) => ({ ...prev, converting: true }));
    const currentRecipe = form.getValues();
    const recipeText = `Title: ${currentRecipe.title}\n\nIngredients:\n${currentRecipe.ingredients?.map(i => i.value).join('\n')}\n\nInstructions:\n${currentRecipe.instructions?.map(i => i.value).join('\n')}`;

    const result = await handleConvertUnits({ recipeText, preferredSystem: preferredUnits });
     if(result.error) {
      toast({ variant: "destructive", title: "Conversion Failed", description: result.error });
    } else if (result.data) {
      form.setValue('instructions', [{value: "CONVERTED RECIPE (please review and separate ingredients if necessary):\n\n" + result.data.convertedRecipeText}]);
      form.setValue('ingredients', []);
      toast({ title: "Units Converted", description: `Units converted to ${preferredUnits} system.`});
    }
    setLoading((prev) => ({ ...prev, converting: false }));
  }

  const onPostToMealie = async (data: Recipe) => {
    setLoading((prev) => ({ ...prev, posting: true }));
    if (!mealieUrl || !apiKey) {
      toast({
        variant: "destructive",
        title: "Mealie Not Configured",
        description:
          "Please set your Mealie URL and API Key in the settings.",
      });
      setLoading((prev) => ({ ...prev, posting: false }));
      return;
    }

    const result = await handlePostToMealie({
      recipe: data,
      mealieUrl,
      apiKey,
    });
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Failed to Post to Mealie",
        description: result.error,
      });
    } else {
      toast({
        title: "Success!",
        description: `Recipe "${data.title}" posted to Mealie.`,
      });
      setExtractedRecipe(null);
      form.reset();
    }
    setLoading((prev) => ({ ...prev, posting: false }));
  };

  return (
    <div className="space-y-8">
      <header className="text-center">
        <Logo />
        <p className="text-muted-foreground mt-2">
          Your AI-powered assistant for importing recipes into Mealie.
        </p>
      </header>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="settings">
          <AccordionTrigger>
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Settings className="w-5 h-5" /> Settings
            </h3>
          </AccordionTrigger>
          <AccordionContent>
            <Card className="border-none shadow-none">
              <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">
                    Mealie Configuration
                  </h4>
                  <div className="space-y-2">
                    <Label htmlFor="mealieUrl">Mealie URL</Label>
                    <Input
                      id="mealieUrl"
                      placeholder="https://mealie.example.com"
                      value={mealieUrl}
                      onChange={(e) => setMealieUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter your Mealie API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">
                    AI Tool Preferences
                  </h4>
                  <div className="space-y-2">
                    <Label htmlFor="targetLanguage">Target Language</Label>
                    <Input
                      id="targetLanguage"
                      placeholder="e.g., Spanish, German"
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Measurement System</Label>
                    <Select
                      value={preferredUnits}
                      onValueChange={(v: "metric" | "us") =>
                        setPreferredUnits(v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric</SelectItem>
                        <SelectItem value="us">US Imperial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            1. Import Recipe
          </CardTitle>
          <CardDescription>
            Paste a URL or recipe text to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="url">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">From URL</TabsTrigger>
              <TabsTrigger value="text">From Text</TabsTrigger>
            </TabsList>
            <TabsContent value="url">
              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="https://example.com/recipe"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onExtract(sourceUrl)}
                />
                <Button onClick={() => onExtract(sourceUrl)} disabled={loading.extracting}>
                  {loading.extracting ? (
                    <Loader2 className="animate-spin" />
                  ) : "Get Recipe"}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="text">
              <div className="space-y-2 mt-4">
              <Textarea
                placeholder="Paste your recipe text here..."
                className="min-h-[150px]"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
              <Button onClick={() => onExtract(sourceText)} disabled={loading.extracting} className="w-full">
                {loading.extracting ? (
                    <Loader2 className="animate-spin" />
                  ) : "Get Recipe"}
              </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      { (loading.extracting || extractedRecipe) && (
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onPostToMealie)}>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  2. Review & Edit
                </CardTitle>
                <CardDescription>
                  Fine-tune the recipe details. Use the AI tools for quick adjustments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading.extracting ? <div className="flex justify-center items-center h-40"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : 
                <>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Recipe Title" {...field} className="font-headline text-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Original URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A short description of the recipe..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid md:grid-cols-3 gap-6">
                   <FormField
                    control={form.control}
                    name="prepTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prep Time</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 20 minutes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="cookingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cook Time</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 45 minutes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="servings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Servings</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 4 people" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />
                
                <div className="space-y-4">
                  <Label className="text-base">Ingredients</Label>
                  {ingredients.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`ingredients.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                           <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <Button variant="ghost" size="icon" type="button" onClick={() => removeIngredient(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button variant="outline" size="sm" type="button" onClick={() => appendIngredient({ value: ''})}>
                    <Plus className="mr-2 h-4 w-4" /> Add Ingredient
                  </Button>
                </div>
                
                <Separator />

                <div className="space-y-4">
                  <Label className="text-base">Instructions</Label>
                  {instructions.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`instructions.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex items-start gap-2">
                          <div className="mt-2 text-sm font-bold text-primary">{index + 1}.</div>
                           <FormControl>
                            <Textarea {...field} className="flex-1" />
                          </FormControl>
                          <Button variant="ghost" size="icon" type="button" onClick={() => removeInstruction(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </FormItem>
                      )}
                    />
                  ))}
                   <Button variant="outline" size="sm" type="button" onClick={() => appendInstruction({ value: ''})}>
                    <Plus className="mr-2 h-4 w-4" /> Add Step
                  </Button>
                </div>
                </>
                }

              </CardContent>
              <CardFooter className="flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-2">
                    <Button variant="secondary" type="button" onClick={onTranslate} disabled={loading.translating}>
                        {loading.translating ? <Loader2 className="animate-spin" /> : <Globe />}
                        Translate
                    </Button>
                    <Button variant="secondary" type="button" onClick={onConvertUnits} disabled={loading.converting}>
                        {loading.converting ? <Loader2 className="animate-spin" /> : <Scale />}
                        Convert Units
                    </Button>
                </div>
                <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90" disabled={loading.posting || !extractedRecipe}>
                  {loading.posting ? <Loader2 className="animate-spin" /> : <Send />}
                  Post to Mealie
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
    </div>
  );
}
