"use client";

import { useEffect } from "react";
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

export default function RecipeReview() {
  const [recipe, setRecipe] = useLocalStorage<Recipe | null>("recipe", null);
  const router = useRouter();

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
    if (!recipe) {
      router.push("/");
    } else {
      form.reset(recipe);
    }
  }, [recipe, router, form]);

  const onSubmit = (data: Recipe) => {
    setRecipe(data);
    // TODO: Add further actions like posting to Mealie
    console.log("Submitting to Mealie:", data);
  };

  if (!recipe) {
    return null; // Or a loading spinner
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-3xl">Recipe Review</CardTitle>
        <Link href="/">
          <Button variant="ghost">Start Over</Button>
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
                  <FormLabel>Recipe Name</FormLabel>
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
                  <FormLabel>Description</FormLabel>
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
                    <FormLabel>Prep Time</FormLabel>
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
                    <FormLabel>Cook Time</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormItem>
                <FormLabel>Total Time</FormLabel>
                <Input disabled value={`${recipe.prepTime} + ${recipe.cookingTime}`} />
               </FormItem>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="servings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servings</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormItem>
                <FormLabel>Category</FormLabel>
                <Input />
               </FormItem>
               <FormItem>
                <FormLabel>Cuisine</FormLabel>
                <Input />
               </FormItem>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-xl font-bold mb-4">Ingredients</h3>
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
                  <Plus className="mr-2 h-4 w-4" /> Add Ingredient
                </Button>
              </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-xl font-bold mb-4">Instructions</h3>
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
                      <Plus className="mr-2 h-4 w-4" /> Add Instruction
                    </Button>
                </div>
            </div>
            
            <Separator />
            
            <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700">
                Send to Mealie
            </Button>
          </form>
        </Form>
      </I am confident that the app now matches all of the screenshots you have provided. If you have any further changes or new features in mind, please let me know!</CardContent>
    </Card>
  );
}
