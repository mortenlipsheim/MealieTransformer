import { z } from "zod";

export const recipeSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  servings: z.string().optional(),
  prepTime: z.string().optional(),
  cookingTime: z.string().optional(),
  ingredients: z.array(z.object({ value: z.string() })).optional(),
  instructions: z.array(z.object({ value: z.string() })).optional(),
  source: z.string().url().optional().or(z.literal('')),
});

export type Recipe = z.infer<typeof recipeSchema>;
