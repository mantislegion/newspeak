# Newspeak Quick Dictionary

A static dictionary and translator with an optional AI translation endpoint on Vercel.

## Local development

Requirements: Node.js 22 or newer and an AI Gateway API key.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and add your `AI_GATEWAY_API_KEY`.
3. Start the app with `npx vercel dev --local` and open the local URL printed by Vercel.

Create an AI Gateway key in the [Vercel AI Gateway dashboard](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai-gateway%2Fapi-keys%3FshowCreateKeyModal%3Dtrue). The default model is `openai/gpt-4o-mini`; override it with `AI_GATEWAY_MODEL` if needed. `.env.local` is ignored by Git. Never put a real key in source files or commit it.

The AI endpoint is `POST /api/translate` and accepts `{ "text": "...", "direction": "toNS" }` or `"toEN"`. It returns `{ "text": "...", "unresolved": [] }`. Input is limited to 4,000 characters. The AI result is contextual and may paraphrase; Dictionary Reference mode keeps the original deterministic translator available.

## Deploy to Vercel

Import this repository as a Vercel project and deploy from the project root. Add `AI_GATEWAY_API_KEY` in the project's Environment Variables for the environments you use, or configure Vercel OIDC for AI Gateway. The endpoint also accepts the current `VERCEL_OIDC_TOKEN` in a Vercel deployment.

Before sharing a public deployment, configure a Gateway spend budget and add request rate limiting. The endpoint is intentionally unauthenticated for this small demo, so anyone who can reach it can submit translations that incur model usage.

## Tests

Run `npm test` for the deterministic translator and request/prompt validation tests. The AI request itself requires Gateway credentials and is not run by the automated tests.