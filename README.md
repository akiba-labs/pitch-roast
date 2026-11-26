# Pitch Roast

**Five judges, one verdict, one change.** Paste a startup pitch (one to five sentences). A seed VC, a skeptical customer,
a CTO, your competitor, and a growth lead each score it 1 to 10 with a short roast line. Then you get one verdict and the
single change that would most improve it.

- Full app and API (Vercel): https://pitch-roast.vercel.app
- Roast tool (GitHub Pages): https://akiba-labs.github.io/pitch-roast/

- Free, no login, no database. The pitch lives in the share URL, so nothing is stored.
- Deterministic and transparent: a fixed rubric in [`lib/roast.ts`](lib/roast.ts), no AI model, no paid API calls.
  Same pitch, same scores. Full rubric: https://pitch-roast.vercel.app/how-it-works
- Every result has its own share link and OG image (`/r?p=...`, `/og?p=...`).

## API for AI agents

Free JSON API, no key, CORS open. GET query or POST JSON.

```bash
curl "https://pitch-roast.vercel.app/api/roast?pitch=Uber%20for%20dog%20walkers%2C%20but%20on%20the%20blockchain.&stage=idea"
```

- OpenAPI 3.1: https://pitch-roast.vercel.app/openapi.json
- Plugin manifest: https://pitch-roast.vercel.app/.well-known/ai-plugin.json
- llms.txt: https://pitch-roast.vercel.app/llms.txt
- MCP tool `roast_pitch` on the free remote MCP server: https://free-agent-tools.vercel.app/mcp

## Develop

```bash
npm install
npm run dev
npm test      # rubric + API tests
npm run lint
npm run build
npm run build:pages
```

`npm run build` is the Vercel app (roast tool, JSON API, share pages). `npm run build:pages` writes a static `out/` for GitHub Pages and checks that internal links and assets resolve under `/pitch-roast`. Server routes stay in the repo; the Pages script only moves them aside for that build.

GitHub settings: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Pushes to `main` deploy with `.github/workflows/pages.yml`. Pull requests build only. The copy-paste steps for the other tool repos are at the top of `scripts/build-pages.mjs`.

## Disclaimer

For fun and practice. Not investment, legal, or business advice. The judges are fictional, and a score does not predict
whether anyone will fund, buy, or use a product.
