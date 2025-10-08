
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
    for await (const { models } of listModels()) {
      const model = models.find(
        (m) =>
          m.info?.supportedGenerationMethods.includes('generate') &&
          m.info.label?.toLocaleLowerCase().includes('flash')
      );
      if (model) {
        cachedModel = model.name;
        return model.name;
      }
    }
    throw new Error('No suitable model found.');
  }
);
