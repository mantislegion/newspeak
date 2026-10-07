import {OpenRouter} from "@openrouter/sdk";
import {z} from "zod";
import dictionary from "../dictionary.js";
import {createSystemPrompt, validateTranslationRequest} from "../lib/translation.mjs";

const RESPONSE_SCHEMA = z.object({
  text: z.string(),
  unresolved: z.array(z.string())
});
const RESPONSE_JSON_SCHEMA = {
  type: "object",
  properties: {
    text: {type: "string", description: "The translated text only."},
    unresolved: {
      type: "array",
      items: {type: "string"},
      description: "Source terms that could not be faithfully translated."
    }
  },
  required: ["text", "unresolved"],
  additionalProperties: false
};

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

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json({
        error: "OpenRouter is not configured. Add OPENROUTER_API_KEY for local development."
      }, {status: 503});
    }

    const direction = validation.value.direction === "toNS"
      ? "English to Newspeak"
      : "Newspeak to English";

    try {
      const openRouter = new OpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY,
        appTitle: "Newspeak Quick Dictionary"
      });
      const response = await openRouter.chat.send({
        chatRequest: {
          model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
          messages: [
            {role: "system", content: createSystemPrompt(dictionary)},
            {role: "user", content: `Direction: ${direction}\n\nText to translate:\n${validation.value.text}`}
          ],
          responseFormat: {
            type: "json_schema",
            jsonSchema: {
              name: "newspeak_translation",
              strict: true,
              schema: RESPONSE_JSON_SCHEMA
            }
          },
          maxCompletionTokens: 500,
          stream: false
        }
      });

      if (response instanceof ReadableStream) {
        throw new Error("Unexpected streaming response");
      }
      const content = response.choices[0]?.message?.content;
      if (typeof content !== "string") throw new Error("OpenRouter returned no text content");
      const result = RESPONSE_SCHEMA.parse(JSON.parse(content));

      return Response.json({
        text: result.text,
        unresolved: [...new Set(result.unresolved)]
      });
    } catch (error) {
      console.error("OpenRouter translation failed:", error instanceof Error ? error.name : "unknown error");
      return Response.json({
        error: "OpenRouter could not complete the translation. Check OPENROUTER_API_KEY, model access, and your OpenRouter credits."
      }, {status: 502});
    }
  }
};