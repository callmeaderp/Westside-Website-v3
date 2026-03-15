# Westside Website v3

## Overview

Astro 6 rebuild of the Westside Professional Landscape website. Ported from v2 (static HTML/CSS/JS) to a component-driven framework with typed data files, Tailwind CSS v4, and automated sitemap/SEO. 16 pages, dark premium theme, deployed to Cloudflare Pages.

## Structure

- **`src/pages/`** — Astro page files. `index.astro` (homepage), `services/[slug].astro` (dynamic service pages from data), standalone pages (about, contact, gallery, careers, privacy, service-areas, 404). Every page imports from layouts and components — no raw HTML duplication.
- **`src/layouts/`** — `BaseLayout.astro` (HTML shell + head + header/footer + scroll animations), `ServiceLayout.astro` (service page wrapper with hero + CTA + JSON-LD).
- **`src/components/`** — Reusable UI: `Header.astro`, `Footer.astro`, `Hero.astro`, `CtaBanner.astro`, `BaseHead.astro` (meta/OG/canonical), `TrackingScripts.astro` (GA4 + Meta Pixel).
- **`src/data/`** — Typed data files (single source of truth): `company.ts` (NAP, hours, tracking IDs, social URLs), `services.ts` (Zod-validated, drives dynamic routes + nav + cards + structured data), `navigation.ts` (nav structure for header/footer), `testimonials.ts`, `team.ts`, `gallery.ts`.
- **`src/styles/`** — `global.css` (Tailwind v4 import + design tokens via `@theme` + base styles + animation classes), `fonts.css` (@font-face for 3 self-hosted WOFF2 fonts).
- **`src/assets/`** — Source images for Astro optimization pipeline: `photos/` (25 WebP), `logos/` (SVGs, PNG), `placeholders/` (SVG).
- **`public/`** — Static assets served directly: `fonts/` (WOFF2), favicons, manifest, `_headers`, `_redirects`, `robots.txt`, `images/photos/` (WebP copies for current direct serving).
- **`tests/`** — Playwright E2E, axe-core a11y, visual regression (scaffolded, not yet populated).

### Gotchas
- **Astro 6 removed `output: "hybrid"`** — static mode now handles both. Pages are static by default; add `export const prerender = false` to any page/API route that needs SSR.
- **Tailwind v4** uses the Vite plugin (`@tailwindcss/vite`) instead of `@astrojs/tailwind`. Design tokens go in `@theme {}` blocks in CSS, not `tailwind.config.js`.
- **`@lucide/astro` doesn't support Astro 6** (peer dep conflict). Using inline SVGs for now. `lucide-static` is installed for SVG file access.
- **Photos are in both `src/assets/photos/` and `public/images/photos/`** — currently using `public/` for direct serving. Migration to Astro `<Image />` pipeline is planned (would use `src/assets/` and remove `public/images/photos/`).
- **`build.assets` is set to `'assets'`** (not the default `_astro`). Vite's preview server 404s underscore-prefixed asset directories when `base` is set — CSS/JS won't load in `astro preview` with the default `_astro` name.
- **Form handler** still uses Web3Forms (client-side POST). API route migration planned but not yet implemented.
- **Service URLs changed**: v2 `/plant-health.html` → v3 `/services/plant-health`. `_redirects` maps all old URLs.

## Working Rules

- **Data-driven content**: All repeating content (services, nav, testimonials, team, gallery, company info) lives in `src/data/` TypeScript files. Never hardcode this data in page templates — import from data files.
- **Component-first**: No raw HTML duplication. Header, footer, hero, CTA, and structured data are components. Page-specific content goes in page files; shared structure goes in layouts/components.
- **Structured data from data files**: JSON-LD is built programmatically in layouts/pages using `company.ts`, `services.ts`, and `testimonials.ts`. Never hand-write JSON-LD blocks — compute them.
- **CSS approach**: Tailwind utility classes for layout/spacing/responsive. CSS custom properties (via `@theme`) for brand colors/fonts/shadows. Component-scoped `<style>` blocks for page-specific styles. `global.css` for base styles and animation classes.
- **Scripts**: Component-scoped `<script>` tags in Astro files. Global scroll animations and parallax live in `BaseLayout.astro`. No external JS files.

## Key Facts

- **Stack**: Astro 6.0.4, Tailwind CSS v4, Zod schemas, GSAP (installed, not yet integrated), Cloudflare Pages adapter, Biome linter, Playwright tests.
- **Brand**: Green primary `#00863F`, bright `#6CC551`, dark bg `#111`. Anton headings, Source Sans 3 body, Merriweather logo. Full tokens in `global.css` `@theme`.
- **Tracking**: GA4 `G-60GGNQVGCD`, Meta Pixel `414143897932367` — both in `TrackingScripts.astro`.
- **Build**: `npm run build` → `dist/` (~3.5s). `npm run dev` for local dev server.
- **Deploy**: Cloudflare Pages auto-deploy. Build command: `npm run build`, output dir: `dist`.

## Related Projects

- **`../Westside-Website-v2/`** — Previous version (static HTML/CSS/JS). V3 was ported from this. Keep as reference but don't develop further.
- **`../Westside-Website-v2.5/`** — Simplified safety-net fork of V2. No longer needed once V3 is production-ready.
- **`../Westside/`** — Parent project with all source content, communications, reference materials, marketing collateral.
