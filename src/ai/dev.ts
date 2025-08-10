import { config } from 'dotenv';
config();

import '@/ai/flows/transform-recipe.ts';
import '@/ai/flows/extract-recipe-from-image.ts';
import '@/ai/flows/extract-recipe-from-youtube.ts';
