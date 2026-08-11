import {groq} from "@/lib/groq"
import { messageSuggestionPrompt } from "@/prompts/suggestMessages";

export async function POST() {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: messageSuggestionPrompt,
        },
      ],

      temperature: 0.8,
      max_tokens: 200,
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      return Response.json(
        {
          success: false,
          message: "No suggestions generated.",
        },
        {
          status: 500,
        }
      );
    }

    const parsed = JSON.parse(content);

    return Response.json({
      success: true,
      suggestions: parsed.suggestions,
    });
  } catch (error) {
    console.error("Groq Error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to generate suggestions",
      },
      {
        status: 500,
      }
    );
  }
}