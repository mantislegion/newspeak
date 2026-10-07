# Newspeak Quick Dictionary

A static dictionary and translator with an optional OpenRouter-backed translation endpoint hosted on Vercel.

## Local development

Requirements: Node.js 22 or newer and an OpenRouter API key.

1. Install dependencies with `npm install`.
2. Create `.env.local` from `.env.example` and set `OPENROUTER_API_KEY`.
3. Start the app with `npx vercel dev --local` and open the local URL printed by Vercel.

Create an API key in [OpenRouter](https://openrouter.ai/settings/keys). The default model is `openai/gpt-4o-mini`; override it with `OPENROUTER_MODEL` if needed. `.env.local` is ignored by Git. Never put a real key in source files or commit it.

The AI endpoint is `POST /api/translate` and accepts `{ "text": "...", "direction": "toNS" }` or `"toEN"`. It returns `{ "text": "...", "unresolved": [] }`. Input is limited to 4,000 characters. The AI result is contextual and may paraphrase; Dictionary Reference mode keeps the original deterministic translator available.

## Deploy to Vercel

Import this repository as a Vercel project and deploy from the project root. Add `OPENROUTER_API_KEY` in the project's Environment Variables for the environments you use, then redeploy.

Before sharing a public deployment, configure OpenRouter spending limits and add request rate limiting. The endpoint is intentionally unauthenticated for this small demo, so anyone who can reach it can submit translations that incur model usage.

## Tests

Run `npm test` for the deterministic translator and request/prompt validation tests. The OpenRouter request itself requires credentials and is not run by the automated tests.