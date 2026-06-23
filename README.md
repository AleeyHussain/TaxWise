# TaxWise

By **Ali Hussain** ([alihussainsinbox@gmail.com](mailto:alihussainsinbox@gmail.com))

A small web app that helps someone pick the right tax software plan for their
situation. You answer a short questionnaire, the app runs your answers through a
rules engine, and it suggests a plan with the reasons spelled out. There is also
a product assistant you can ask questions in plain language.

This was built as a web development plus AI assignment. The products and rules
are fictional and come from the assignment brief. Nothing in the app is real tax
advice.

## What it does

- Browse the product catalogue and compare plans side by side
- Run a multi-step questionnaire to get a recommended plan
- Ask an AI assistant product questions in plain language
- View the product configuration on a read-only admin page

## Tech stack

- **Next.js 14** (App Router) with **React 18** and **TypeScript**
- **Tailwind CSS** for styling
- **Next.js API routes** for the backend
- **Groq** (OpenAI-compatible chat API) for the AI assistant, with a built-in
  rules-based fallback so the app works with or without a key
- **Vitest** for the engine and assistant unit tests

No database. The product catalogue is a typed data file, which is plenty for a
catalogue this size and keeps the data easy to read and review.

## Setup

You need Node 18.17 or newer (this was built and tested on Node 20).

```bash
# 1. install dependencies
npm install

# 2. (optional) set up your AI key
cp .env.example .env.local
# then open .env.local and paste your Groq key

# 3. run it
npm run dev
```

Open http://localhost:3000.

To run the production build instead:

```bash
npm run build
npm run start
```

## Environment variables

The AI assistant uses Groq. Set these in `.env.local` (or `.env`):

| Variable | Required | Notes |
| --- | --- | --- |
| `GROQ_API_KEY` | No | If set, the assistant calls the live model. If missing, the assistant uses the built-in simulated mode. |
| `GROQ_MODEL` | No | Defaults to `llama-3.3-70b-versatile`. |

The key is only read on the server (inside the API route), so it never ships to
the browser. `.env` and `.env*.local` are gitignored.

## Routes and pages

| Route | What it is |
| --- | --- |
| `/` | Landing page: hero, product previews, how it works, FAQ |
| `/products` | All plans, with filter by type, sort by price, and feature search |
| `/compare` | Comparison table, scrollable on mobile with a sticky first column |
| `/recommend` | The questionnaire wizard and result screen |
| `/assistant` | The product assistant chat |
| `/admin/products` | Read-only product configuration view |
| `GET /api/products` | Returns the full catalogue |
| `POST /api/recommend` | Validates answers and returns a recommendation |
| `POST /api/assistant` | Returns an AI or simulated assistant answer |

## Product data structure

All products live in `src/data/products.ts` as a typed `Product[]`. The shapes
are in `src/lib/types.ts`.

The important part is the `supports` map. Every product has the same set of
feature flags (`FeatureKey`), each set to `true` or `false`. Keeping every flag
present on every product means a missing feature is always a real `false`, never
`undefined`, which keeps the comparison table and the admin page honest. That one
map drives the comparison columns, the admin feature grid, and the grounding
context the assistant reads.

Each product also carries human-readable `highlights` and `notSupported` bullet
lists for the cards. Those are display copy taken from the brief and are kept
separate from the feature flags the logic depends on.

## Recommendation engine

The engine lives in `src/lib/recommend.ts` and is pure: answers in, a structured
`RecommendationResult` out. It does not touch React, the DOM, or the network, so
it is easy to test and reuse. The wizard calls it through `POST /api/recommend`,
and the simulated assistant calls it directly.

Rules are checked in priority order, highest first, and the first rule that
matches wins. That ordering is what makes the higher rules override the lower
ones:

1. Incorporated company, so Business Corporate, or Nil Corporate Return if the
   company had no revenue. This overrides every personal product.
2. Wants an expert to file for them, so Expert Full Service.
3. Wants expert help while filing, so Expert Assist.
4. Freelance, gig-work, business revenue, business expenses, home-office or
   vehicle expenses, so Self-Employed.
5. Investment income, capital gains, rental income or foreign income, so Premier.
6. Medical expenses, donations or employment expenses, so Deluxe.
7. Nothing complex, so a simple Free return.

The result includes the recommended plan, a confidence level, the reasons, the
matched inputs, an optional upgrade where it makes sense, any warnings (for
example mixing "no special deductions" with a real deduction), and the
disclaimer.

## AI assistant

The assistant route (`POST /api/assistant`) works in two layers:

1. **Safety screen first.** Questions that ask for a guaranteed refund or
   outcome, or for real tax/legal/financial advice, get a fixed safe answer no
   matter which backend is active.
2. **Live model, then fallback.** If `GROQ_API_KEY` is set, the route asks Groq
   with a system prompt built from the live product data and rules. The model is
   told to answer only from that data, never invent a feature, avoid guarantees,
   and always include the disclaimer. The reply is validated: the suggested
   product must be a real product name or it is dropped, and if the reply slips a
   guaranteed claim through it is rejected. If there is no key, or the call fails
   or times out, the route falls back to the simulated assistant.

The simulated assistant in `src/lib/assistant.ts` reads the same product data,
detects keywords in the question, maps them to the questionnaire model, and runs
the same recommendation engine. So even without a key the answers stay grounded
in the real product rules rather than being a generic chatbot. It also handles
"difference between A and B" and "can I use plan X" style questions directly from
the data.

Each answer shows a small badge for which backend replied (`AI` or
`rules-based`) so it is easy to see what happened.

## Admin / config page

`/admin/products` is a read-only view of the catalogue. For each product it
shows the id, name, price, category, the best-for line, and the full list of
supported and unsupported features straight from the `supports` map. There is a
light schema check that flags any missing or out-of-range field, and a button to
export the whole config as JSON. The point of the page is to show that the
product data is structured and configuration-driven, not hand-written into each
component.

## Manual verification

I checked the main flows by hand. The engine scenarios were also confirmed with
the unit tests (`npm test`, 31 tests).

How I checked each one: open `/recommend`, answer the questionnaire to match the
scenario, and read the result. For the assistant rows, open `/assistant` and ask
the question.

| Scenario | Expected | Result |
| --- | --- | --- |
| Salary only | Free | Pass |
| Salary + donations | Deluxe | Pass |
| Investment income | Premier | Pass |
| Rental income | Premier | Pass |
| Freelance income | Self-Employed | Pass |
| Home-office expenses | Self-Employed | Pass |
| Wants expert help | Expert Assist | Pass |
| Wants expert to file | Expert Full Service | Pass |
| Incorporated with revenue | Business Corporate | Pass |
| Incorporated with no revenue | Nil Corporate Return | Pass |
| Asked AI for a refund guarantee | Safe disclaimer response | Pass |

I also spot-checked the API directly:

```bash
# recommendation
curl -X POST http://localhost:3000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"filingType":"personal","incomeSources":["investmentIncome"],"deductions":[],"helpPreference":"self"}'

# assistant
curl -X POST http://localhost:3000/api/assistant \
  -H "Content-Type: application/json" \
  -d '{"question":"What is the difference between Premier and Self-Employed?"}'
```

And I checked validation rejects a missing filing type, the dark mode toggle
persists, and the wizard remembers answers across a refresh (localStorage).

## Assumptions

- For an incorporated company, the questionnaire does not force an income source.
  The brief says at least one income source is required, but that does not fit a
  nil corporate return, so income is required only for personal and self-employed
  filings. The corporate rules override personal products anyway.
- Each product's `supports` map follows the brief's explicit "supports" list for
  that product. Where the brief did not list a feature, it is marked `false`.
- "Business revenue as an individual" in the self-employed rule is modelled as
  the `businessRevenue` income option on a personal or self-employed filing.
- Corporate filing and nil return are kept as two separate flags so each
  corporate product lights up exactly one column in the comparison table.

## Known limitations

- The admin page is read-only. You can export the config but not edit it in the
  UI.
- The assistant keyword parser is simple. It handles the common phrasings and the
  example questions well, but an unusual sentence may be read too literally. The
  live Groq model handles open-ended wording better when a key is set.
- There is no database or user accounts. Nothing is persisted server-side, and
  wizard answers are only stored in the browser.
- The assistant chat history is not saved across a refresh.

## Future improvements

- Make the admin page editable with schema validation on save
- Stream the assistant response token by token
- Add end-to-end tests for the wizard and assistant UI
- Persist and revisit past recommendations
- PDF export of a recommendation, and multi-language support

## Use of AI During Development

I used AI coding assistance (Claude) while building this.

- **What it helped with:** scaffolding the Next.js structure, drafting the
  repetitive UI (cards, tables, the wizard steps), writing the product data file
  from the brief, and a first pass at the README.
- **What was AI-assisted vs written deliberately:** the architecture decisions
  (pure engine separated from UI, one `supports` map as the source of truth, the
  safety-screen-then-model-then-fallback flow for the assistant) were chosen on
  purpose and then implemented with assistance. The recommendation rules and
  their priority order were translated directly from the brief.
- **How I reviewed it:** I wrote unit tests for the engine and the assistant
  safety behaviour (35 tests) and ran them, did a production build to catch type
  errors, and tested every API route by hand including a live Groq call and the
  refund-guarantee safety case. I read through the generated code rather than
  taking it as-is, and adjusted the data flags and copy where needed.
- **The AI feature itself:** the in-app assistant uses Groq's
  `llama-3.3-70b-versatile` model, grounded in the product data, with a
  deterministic rules-based fallback.

## Author

Ali Hussain - [alihussainsinbox@gmail.com](mailto:alihussainsinbox@gmail.com)

The app runs locally with `npm install` then `npm run dev`. It is not deployed,
so there is no live link. The repository contains everything needed to run and
review it.
