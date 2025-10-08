
import 'dotenv/config';
import '@/ai/genkit';
import { listModels, type ModelReference } from 'genkit';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allModels: ModelReference[] = await listModels();

    if (!allModels || allModels.length === 0) {
      return NextResponse.json(
        { data: null, error: 'No models were returned from the listModels API.' },
        { status: 500 }
      );
    }
    
    // Filter for only generative models
    const generativeModels = allModels.filter(m => m.info?.supportedGenerationMethods?.includes("generate"));

    return NextResponse.json({ data: generativeModels, error: null });
  } catch (e: any) {
    console.error("Error fetching models:", e);
    // Return the actual error message for better debugging on the client
    return NextResponse.json(
      { data: null, error: e.message || 'An unknown error occurred while fetching models.' },
      { status: 500 }
    );
  }
}
