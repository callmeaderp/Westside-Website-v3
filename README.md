# Westside Website v3

This repository is the Astro 7 production website for Westside Professional Landscape at <https://westsideprolandscape.com>. It replaces the older static V2 site with data-driven services, shared layouts and components, self-hosted brand assets, structured metadata, and Cloudflare Pages deployment.

## Stack

- Astro 7 with static output and Cloudflare Pages Functions for API routes.
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
npm test           # full suite, desktop + mobile projects
npm run test:a11y  # axe-core WCAG 2 A/AA pass only
```

Both build against `dist/`, so run `npm run build` first. `playwright.config.ts` starts `tests/static-server.mjs` on port 4331 rather than `astro preview` — Astro 7's preview daemonizes and Playwright reports the launcher's exit as `Process from config.webServer exited early`. Override the port with `PLAYWRIGHT_PORT` if 4331 is taken.

Run checks proportional to the change. Data, route, metadata, redirects, or global-layout changes require at least `npm run check`, `npm run lint`, and `npm run build`. UI changes should also be inspected at representative desktop and mobile widths. Update or add Playwright coverage when behavior is stable enough to assert.

## Content and asset conventions

- Service slugs and core cards live in `src/data/services.ts`. `tier` separates the primary `core` offering from the focused `construction` build lanes.
- Long-form service content and FAQs live in `src/data/service-content.ts`, including hero CTA buttons, investment-band references, and featured project slugs.
- Published price ranges live only in `src/data/investment.ts`. Never inline a dollar figure in a template — every band renders with `INVESTMENT_CAVEAT` so it cannot be read as a quote.
- Project case studies live in `src/data/projects.ts`. A `town` may be set only when the location is independently provable; photo EXIF in the current library has no GPS, so entries omit it rather than guess.
- Header and footer navigation are separate arrays in `src/data/navigation.ts`.
- Contact-form service options and the `?service=<slug>` preselect map are both derived from `services.ts`, so adding a service no longer requires editing the form.
- Internal routes use trailing slashes because Astro is configured with `trailingSlash: "always"`. `url()` deliberately passes through same-page fragments (`#investment`) and scheme URLs (`tel:`) untouched.
- FAQ answers may contain the limited HTML supported by the component and structured-data output; questions remain plain text.
- Photos live only in `src/images/photos/` and are resolved through `getPhoto()` in `src/lib/images.ts`. The Astro image pipeline emits optimized, content-hashed files under `/assets/`; there is no `public/images/` copy to keep in sync.
- Generated `dist/`, local screenshots, test output, and secrets are deployment/test artifacts rather than source.

Read `.claude/rules/add-service-page.md` before adding a service; a complete service currently touches multiple independently maintained data and form/navigation surfaces.

## Professional title claims

New York Education Law §7322 protects the title "landscape architect". No Westside licence has been identified, so the site describes the work as **landscape design** or **design-build landscape contracting**. `tests/construction.spec.ts` fails the build-adjacent test run if a claiming phrase reappears in page copy or metadata. The one permitted mention is the landscape-design FAQ that answers the question honestly.

## Tracking and forms

Tracking is centralized in `src/components/TrackingScripts.astro`, including GA4 and Meta integrations. Keep identifiers and event wiring there instead of scattering scripts across pages. The contact form currently uses its established client/API integration; preserve lead attribution, service preselection, validation, and conversion events when changing it.

Acquisition attribution (`utm_*`, `fbclid`, `gclid`, `msclkid`, landing page, referrer) is captured on first pageview by `TrackingScripts.astro`, held in `sessionStorage` as **first touch**, and exposed via `window.__wplAttribution()`. Ad traffic usually lands on a tagged page and submits from an untagged `/contact/`, so reading the parameters at submit time would lose the campaign. The values reach the office notification email and the GA4/Meta payloads; they are query-string data, never secrets.

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
