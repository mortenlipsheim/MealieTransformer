
import '@/ai/genkit'; // Ensure Genkit is initialized
import { listModels } from 'genkit';

// This is a server-only file
export const dynamic = 'force-dynamic'; // an API route is required to be dynamic

export async function GET() {
  try {
    // This call now happens exclusively on the server.
    const models = await listModels();
    return Response.json(models);
  } catch (e: any) {
    console.error("Error listing models:", e);
    // Return a structured error response
    return Response.json(
        { error: `Failed to fetch models from the API. Reason: ${e.message}` },
        { status: 500 }
    );
  }
}
