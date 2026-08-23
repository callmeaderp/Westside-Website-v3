---
name: deploy
description: Build, deploy, and verify the Westside Website v3 on Cloudflare Pages. Use when Joshua explicitly asks to deploy, publish, release, update the live site, or create a preview deployment. Distinguishes production (`master`) from preview branches and verifies the resulting environment.
argument-hint: "[production|preview-name]"
disable-model-invocation: true
---

# Deploy Westside Website v3

Deploy only when Joshua explicitly requests the external publication. Interpret “main site,” “live site,” “production,” or “the real one” as production; interpret “dev site,” “testing,” “preview,” or “let me look first” as a branch preview. If the target is still ambiguous, ask before publishing.

## Prepare and verify the build

From the repository root, run `npm run check`, `npm run lint`, and `npm run build`. Do not deploy a failed build.

## Select the Cloudflare Pages target

- **Production:** deploy `dist/` to project `westside-website` with explicit branch `master`.
- **Preview:** deploy `dist/` to the same project with the requested preview branch name.

The explicit branch is load-bearing. The Pages production branch is `master`; `main` creates a preview named `main`, and omitting the branch lets Wrangler infer behavior from the current checkout.

On Linux, Wrangler authentication uses `CLOUDFLARE_API_KEY`, `CLOUDFLARE_EMAIL`, and `CLOUDFLARE_ACCOUNT_ID`, not `CLOUDFLARE_API_TOKEN`. Read them from the established environment/credential source; never print or commit them.

## Verify the deployment

After Wrangler returns, verify the generated deployment URL before the custom domain. Use the deployments API to confirm the environment is `production` for a production release or preview for a preview branch. Then exercise the changed page and any affected navigation, forms/conversion events, canonical/meta tags, structured data, assets, responsive behavior, and redirects. Report the exact deployment URL, environment, and checks performed.
