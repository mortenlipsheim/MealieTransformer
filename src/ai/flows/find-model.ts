
'use server';

/**
 * @fileOverview This file defines a Genkit flow for finding a suitable generative model.
 *
 * It lists available Google AI models and selects one that is recommended for the task.
 */

import { ai } from '@/ai/genkit';
import { listModels } from 'genkit';

let cachedModel: string | undefined;

export const findModel = ai.defineFlow(
  {
    name: 'findModel',
  },
  async () => {
    if (cachedModel) {
      return cachedModel;
    }
    const allModels = await listModels();
    const suitableModel = allModels.find(model => 
        model.info?.supportedGenerationMethods.includes('generate') &&
        model.info.label?.toLocaleLowerCase().includes('flash')
    );

    if (suitableModel) {
        cachedModel = suitableModel.name;
        return suitableModel.name;
    }

    throw new Error('No suitable model found.');
  }
);
