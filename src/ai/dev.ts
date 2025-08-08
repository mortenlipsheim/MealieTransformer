import { config } from 'dotenv';
config();

import '@/ai/flows/convert-units.ts';
import '@/ai/flows/translate-recipe.ts';
import '@/ai/flows/extract-recipe-data.ts';
import '@/ai/flows/extract-recipe-from-image.ts';
