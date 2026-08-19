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
| "main site", "live site", "production", "the real one" | Production at `westsideprolandscape.com` | `npx wrangler pages deploy dist/ --project-name=westside-website --branch=master` |
| "dev site", "testing", "preview", "let me look first" | Branch preview at `<name>.westside-website.pages.dev` | `npx wrangler pages deploy dist/ --project-name=westside-website --branch=<name>` |

## Why this matters

The Pages project's production branch is `master`. `--branch=master` explicitly targets it and is the unambiguous production form (verified: produces `environment: production`, 2026-08-19). Omitting `--branch` makes wrangler infer the branch from the current git checkout — that also deploys production *only because* this repo's branch is `master`; from any other branch it would silently create a preview. `--branch=main` likewise creates a preview named "main", not production. Always pass `--branch=master` for production. After deploying, confirm with the deployments API that the new deployment's `environment` is `production`.

## Auth (Linux)

Set these env vars before running wrangler (not `CLOUDFLARE_API_TOKEN`):

```
CLOUDFLARE_API_KEY CLOUDFLARE_EMAIL CLOUDFLARE_ACCOUNT_ID
```

## Build + deploy one-liner

```bash
cd /path/to/Westside-Website-v3 && npm run build && \
CLOUDFLARE_API_KEY="..." CLOUDFLARE_EMAIL="..." CLOUDFLARE_ACCOUNT_ID="..." \
npx wrangler pages deploy dist/ --project-name=westside-website --branch=master
```
