export const messageSuggestionPrompt = `
Generate 3 short, friendly, anonymous message suggestions.

The messages should be casual and suitable for sending to someone anonymously.

Return ONLY valid JSON.

The JSON must have exactly this structure:

{
  "suggestions": [
    "message 1",
    "message 2",
    "message 3"
  ]
}

Rules:
- Return exactly 3 suggestions.
- Each suggestion must be a single string.
- Keep each suggestion short.
- Do not include markdown.
- Do not include code fences.
- Do not include any text outside the JSON object.
-Do not repeat messages. PLS STRICTLY
`;