# Westside Website v3

This repository is the Astro 6 production website for Westside Professional Landscape at <https://westsideprolandscape.com>. It replaces the older static V2 site with data-driven services, shared layouts and components, self-hosted brand assets, structured metadata, and Cloudflare Pages deployment.

## Stack

- Astro 6 with static output and per-route SSR opt-in when needed.
- Tailwind CSS 4 through `@tailwindcss/vite`.
- TypeScript and Zod for data contracts.
- Biome for linting and formatting.
- Playwright and axe-core for browser, accessibility, and visual tests.
- Cloudflare Pages and Wrangler for deployment.

Node.js 22.12 or newer is required.

## Repository map

- `src/pages/`: route entry points, including the dynamic `services/[slug].astro` route.
- `src/layouts/`: shared HTML shell and service-page structure.
- `src/components/`: header, footer, metadata, tracking, heroes, calls to action, forms, and reusable sections.
- `src/data/`: canonical company, service, navigation, testimonial, gallery, content, and product-document data.
- `src/styles/`: Tailwind theme tokens, base styles, animation styles, and self-hosted font declarations.
- `src/assets/`: source assets processed by Astro.
- `public/`: directly served fonts, icons, manifests, redirects, headers, robots configuration, and currently direct-served photos.
- `tests/`: Playwright suites and fixtures.
- `CONTENT-NEEDED.md`: outstanding content or asset requests.
- `.claude/rules/`: focused contributor runbooks for Tailwind layers, redirects, service pages, and deployment.

Repeating company and service content should come from `src/data/`, not be duplicated in templates. Shared HTML belongs in layouts or components. JSON-LD must be computed from canonical data rather than handwritten independently.

## Development

```sh
npm install
npm run dev
npm run check
npm run lint
npm run build
npm run preview
```

The production build writes `dist/`. `astro.config.mjs` deliberately uses `build.assets: "assets"`; underscore-prefixed default asset paths have failed under the configured preview/base behavior, so do not revert that setting without an end-to-end preview check.

The current browser suites run with:

```sh
npm test
npm run test:a11y
```

Run checks proportional to the change. Data, route, metadata, redirects, or global-layout changes require at least `npm run check`, `npm run lint`, and `npm run build`. UI changes should also be inspected at representative desktop and mobile widths. Update or add Playwright coverage when behavior is stable enough to assert.

## Content and asset conventions

- Service slugs and core cards live in `src/data/services.ts`.
- Long-form service content and FAQs live in `src/data/service-content.ts`.
- Header and footer navigation are separate arrays in `src/data/navigation.ts`.
- Contact-form service options are currently maintained in the page form as well.
- Internal routes use trailing slashes because Astro is configured with `trailingSlash: "always"`.
- FAQ answers may contain the limited HTML supported by the component and structured-data output; questions remain plain text.
- Photos currently exist in both the Astro asset pipeline and `public/images/photos/`, with the site serving the public copies. Remove the direct copies only as part of a verified Astro Image migration.
- Generated `dist/`, local screenshots, test output, and secrets are deployment/test artifacts rather than source.

Read `.claude/rules/add-service-page.md` before adding a service; a complete service currently touches multiple independently maintained data and form/navigation surfaces.

## Tracking and forms

Tracking is centralized in `src/components/TrackingScripts.astro`, including GA4 and Meta integrations. Keep identifiers and event wiring there instead of scattering scripts across pages. The contact form currently uses its established client/API integration; preserve lead attribution, service preselection, validation, and conversion events when changing it.

Never commit Cloudflare, Google, Meta, form-provider, or other credentials. Public analytics identifiers are configuration, but secret API tokens and server-side credentials must remain in environment or platform settings.

## Redirects and compatibility

`public/_redirects` maps V2 `.html` and legacy service URLs to the current trailing-slash routes. Redirect syntax has Cloudflare-specific pitfalls; read `.claude/rules/_redirects-pitfalls.md` and validate affected old URLs after changes. V2 and V2.5 sibling repositories are reference/rollback sources, not active development targets.

## Deployment

Cloudflare Pages project `westside-website` serves production. Build before every deploy:

```sh
npm run check && npm run lint && npm run build
```

A preview deployment uses an explicit branch:

```sh
npx wrangler pages deploy dist/ --project-name=westside-website --branch=<preview-name>
```

Production is the Pages `master` production branch; name it explicitly so a deploy from another checkout branch cannot silently become a preview:

```sh
npx wrangler pages deploy dist/ --project-name=westside-website --branch=master
```

Do not use `--branch=main` as a production substitute; it creates a preview named `main`. Read `.claude/rules/deploy.md` for the current environment terminology and authentication boundary.

After deployment, verify the generated deployment URL before checking the custom domain. Exercise the changed page, responsive navigation, forms/conversion events when relevant, canonical/meta tags, structured data, assets, and affected redirects. Production deployment is an external side effect and requires Joshua's explicit request.
