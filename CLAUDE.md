# Westside Website v3 agent bootloader

## Workspace identity

This is the Astro 7 production website for Westside Professional Landscape. Start with [README.md](README.md) for architecture, content conventions, development, testing, deployment, and verification. The older V2 and V2.5 sibling repositories are references and rollback sources, not active development targets.

## Standing rules

- Keep repeating business and service content in `src/data/`; do not duplicate it in page templates.
- Put shared structure in `src/layouts/` or `src/components/`, and keep page-specific content in its page.
- Compute JSON-LD from canonical company, service, and testimonial data rather than maintaining independent copies.
- Use Tailwind 4 through `@tailwindcss/vite`; brand tokens belong in CSS `@theme`, not a Tailwind configuration file.
- Preserve `build.assets: "assets"` unless an end-to-end preview proves a replacement works.
- Internal links use trailing slashes. Preserve and test legacy redirects when routes change.
- Keep tracking logic centralized in `TrackingScripts.astro` and preserve form attribution and conversion behavior.
- Never commit platform credentials or secret API tokens.
- Production deployment is an external side effect and requires Joshua's explicit request.

## Focused runbooks

Read the matching file under `.claude/rules/` before changing:

- service routes or data: `add-service-page.md`;
- Tailwind layer behavior: `tailwind-v4-layers.md`;
- `public/_redirects`: `_redirects-pitfalls.md`.

Cloudflare deployment is an on-demand external workflow under `.claude/skills/deploy/SKILL.md`; invoke `/deploy` only after Joshua explicitly requests a production or preview publication.

## Short verification workflow

For source or content changes, run:

```sh
npm run check
npm run lint
npm run build
```

Add focused Playwright/accessibility checks and responsive visual inspection for affected UI behavior. Deploy previews before production when Joshua wants to review the result.
