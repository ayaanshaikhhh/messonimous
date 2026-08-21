import { groq } from "@/lib/groq";
import { messageSuggestionPrompt } from "@/prompts/suggestMessages";

export async function POST() {
  try {
    // Generate suggestions

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content: messageSuggestionPrompt,
        },
      ],

      temperature: 0.8,
      max_tokens: 200,

      // Force Groq to return a JSON object
      response_format: {
        type: "json_object",
      },
    });

    // Get generated content

    const content =
      completion.choices[0]?.message?.content;

    if (!content) {
      return Response.json(
        {
          success: false,
          message: "No suggestions generated.",
        },
        {
          status: 500,
        },
      );
    }
    //  Parse JSON
    
    let parsed: {
      suggestions?: unknown;
    };

    try {
      parsed = JSON.parse(content);
    } catch (error) {
      return Response.json(
        {
          success: false,
          message:
            "AI returned an invalid response.",
        },
        {
          status: 500,
        },
      );
    }
    // Validate suggestions
    if (
      !Array.isArray(parsed.suggestions) ||
      parsed.suggestions.length === 0
    ) {
      return Response.json(
        {
          success: false,
          message:
            "AI returned invalid suggestions.",
        },
        {
          status: 500,
        },
      );
    }

    const suggestions = parsed.suggestions.filter(
      (suggestion): suggestion is string =>
        typeof suggestion === "string" &&
        suggestion.trim().length > 0,
    );

    if (suggestions.length === 0) {
      return Response.json(
        {
          success: false,
          message:
            "No valid suggestions generated.",
        },
        {
          status: 500,
        },
      );
    }


    // Success
    return Response.json(
      {
        success: true,
        suggestions,
      },
      {
        status: 200,
      },
    );
  } catch (error) {

    //Groq/API error
    return Response.json(
      {
        success: false,
        message:
          "Failed to generate suggestions.",
      },
      {
        status: 500,
      },
    );
  }
}