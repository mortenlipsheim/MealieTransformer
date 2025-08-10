import { z } from "zod";

export const extractedRecipeDataSchema = z.object({
    title: z.string().optional().describe('The title of the recipe.'),
    description: z.string().optional().describe('A short summary of the recipe.'),
    ingredients: z.array(z.string()).optional().describe('The list of ingredients for the recipe.'),
    instructions: z.array(z.string()).optional().describe('The step-by-step instructions for the recipe.'),
    cookingTime: z.string().optional().describe('The total cooking time for the recipe.'),
    prepTime: z.string().optional().describe('The preparation time for the recipe.'),
    servings: z.string().optional().describe('The number of servings the recipe makes.'),
});

export const recipeSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  servings: z.string().optional(),
  prepTime: z.string().optional(),
  cookingTime: z.string().optional(),
  ingredients: z.array(z.object({ value: z.string() })).optional(),
  instructions: z.array(z.object({ value: z.string() })).optional(),
  source: z.string().optional(),
  image: z.string().optional(),
});

export type Recipe = z.infer<typeof recipeSchema>;
export type ExtractedRecipeData = z.infer<typeof extractedRecipeDataSchema>;
