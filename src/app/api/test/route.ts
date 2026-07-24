import { ai } from "@/lib/gemini";

export async function GET() {
  try {
    const models = await ai.models.list();

    return Response.json(models);
  } catch (error) {
    console.error(error);
    return Response.json(error);
  }
}