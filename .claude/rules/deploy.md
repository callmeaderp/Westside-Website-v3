---
paths:
  - "dist/**"
  - "wrangler.toml"
  - "src/**"
---

# Deploying the Website

Two environments. User refers to them as:

| User says | Means | Command |
|---|---|---|
| "main site", "live site", "production", "the real one" | Production at `westsideprolandscape.com` | `npx wrangler pages deploy dist/ --project-name=westside-website` (NO `--branch` flag) |
| "dev site", "testing", "preview", "let me look first" | Branch preview at `<name>.westside-website.pages.dev` | `npx wrangler pages deploy dist/ --project-name=westside-website --branch=<name>` |

## Why this matters

Cloudflare Pages production branch is `master`. Using `--branch=main` does NOT deploy to production — it creates a branch preview called "main". Omitting `--branch` entirely is what triggers a production deployment.

## Auth (Linux)

Set these env vars before running wrangler (not `CLOUDFLARE_API_TOKEN`):

```
CLOUDFLARE_API_KEY CLOUDFLARE_EMAIL CLOUDFLARE_ACCOUNT_ID
```

## Build + deploy one-liner

```bash
cd /path/to/Westside-Website-v3 && npm run build && \
CLOUDFLARE_API_KEY="..." CLOUDFLARE_EMAIL="..." CLOUDFLARE_ACCOUNT_ID="..." \
npx wrangler pages deploy dist/ --project-name=westside-website
```
