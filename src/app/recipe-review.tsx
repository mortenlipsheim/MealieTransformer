
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { recipeSchema, type Recipe } from "@/lib/schema";
import { useTranslation } from "@/hooks/use-translation";
import { sendToMealie } from "./actions";
import { useToast } from "@/hooks/use-toast";

export default function RecipeReview() {
  const [recipe, setRecipe] = useLocalStorage<Recipe | null>("recipe", null);
  const router = useRouter();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<Recipe>({
    resolver: zodResolver(recipeSchema),
    defaultValues: recipe || {},
  });

  const {
    fields: ingredientsFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const {
    fields: instructionsFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control: form.control,
    name: "instructions",
  });

  useEffect(() => {
    if (isClient && !recipe) {
      router.push("/");
    } else if (recipe) {
      form.reset(recipe);
    }
  }, [recipe, router, form, isClient]);

  const onSubmit = async (data: Recipe) => {
    setRecipe(data);
    setLoading(true);

    const { error } = await sendToMealie({ recipe: data });

    if (error) {
        toast({
            variant: "destructive",
            title: t("Error"),
            description: error,
        });
    } else {
        toast({
            title: t("Success!"),
            description: t("Recipe sent to Mealie successfully."),
        });
        setRecipe(null);
        router.push("/");
    }
    setLoading(false);
  };

  if (!isClient || !recipe) {
    return null; // Or a loading spinner, but null is fine for now
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
        <CardTitle className="font-headline text-3xl">{t('Recipe Review')}</CardTitle>
        <Link href="/">
          <Button variant="ghost">{t('Start Over')}</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Recipe Name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Description')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="prepTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Prep Time')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{t('Cook Time')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Total Time')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="servings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Servings')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormItem>
                <FormLabel>{t('Category')}</FormLabel>
                <Input />
               </FormItem>
               <FormItem>
                <FormLabel>{t('Cuisine')}</FormLabel>
                <Input />
               </FormItem>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-xl font-bold mb-4">{t('Ingredients')}</h3>
              <div className="space-y-4">
                {ingredientsFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`ingredients.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeIngredient(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendIngredient({ value: "" })}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" /> {t('Add Ingredient')}
                </Button>
              </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-xl font-bold mb-4">{t('Instructions')}</h3>
                <div className="space-y-4">
                  <ol className="space-y-4">
                    {instructionsFields.map((field, index) => (
                      <li key={field.id} className="flex items-start gap-4">
                          <span className="font-bold text-lg mt-2">{index + 1}.</span>
                          <div className="flex-1">
                            <FormField
                                control={form.control}
                                name={`instructions.${index}.value`}
                                render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-2">
                                      <FormControl>
                                          <Textarea {...field} rows={3} />
                                      </FormControl>
                                      <Button
                                          type="button"
                                          variant="destructive"
                                          size="icon"
                                          onClick={() => removeInstruction(index)}
                                      >
                                          <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                </FormItem>
                                )}
                            />
                          </div>
                      </li>
                    ))}
                  </ol>
                    <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendInstruction({ value: "" })}
                    className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" /> {t('Add Instruction')}
                    </Button>
                </div>
            </div>
            
            <Separator />
            
            <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? t('Sending...') : t('Send to Mealie')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
