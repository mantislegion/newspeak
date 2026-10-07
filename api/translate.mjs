import {generateText, Output} from "ai";
import {z} from "zod";
import dictionary from "../dictionary.js";
import {createSystemPrompt, validateTranslationRequest} from "../lib/translation.mjs";

const RESPONSE_SCHEMA = z.object({
  text: z.string(),
  unresolved: z.array(z.string())
});

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return Response.json({error: "Use POST to translate text."}, {
        status: 405,
        headers: {Allow: "POST"}
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({error: "Request body must be valid JSON."}, {status: 400});
    }

    const validation = validateTranslationRequest(body);
    if (validation.error) {
      return Response.json({error: validation.error}, {status: 400});
    }

    if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
      return Response.json({
        error: "AI Gateway is not configured. Add AI_GATEWAY_API_KEY for local development."
      }, {status: 503});
    }

    const direction = validation.value.direction === "toNS"
      ? "English to Newspeak"
      : "Newspeak to English";

    try {
      const {output} = await generateText({
        model: process.env.AI_GATEWAY_MODEL || "openai/gpt-4o-mini",
        output: Output.object({schema: RESPONSE_SCHEMA}),
        instructions: createSystemPrompt(dictionary),
        prompt: `Direction: ${direction}\n\nText to translate:\n${validation.value.text}`,
        maxOutputTokens: 500
      });

      return Response.json({
        text: output.text,
        unresolved: [...new Set(output.unresolved)]
      });
    } catch (error) {
      console.error("AI translation failed:", error instanceof Error ? error.name : "unknown error");
      return Response.json({
        error: "The AI service could not complete the translation. Check your Gateway credentials and model access."
      }, {status: 502});
    }
  }
};