identity:
project: Westside Website v3
purpose: Astro 6 rebuild of Westside Professional Landscape website, ported from V2 static HTML/CSS/JS site
shape: 16 pages, dark premium theme, deployed via Cloudflare Pages

stack:
framework: Astro 6.0.4
css: Tailwind v4 through @tailwindcss/vite; do not use @astrojs/tailwind
validation: Zod
animation: GSAP installed but not integrated
deployment: Cloudflare Pages adapter
tooling: Biome and Playwright

layout:
pages: src/pages/ contains index.astro, services/[slug].astro generated from services.ts, about, contact, gallery, careers, privacy, service-areas, 404
layouts: src/layouts/ contains BaseLayout.astro for HTML shell, head, header/footer, scroll animations; ServiceLayout.astro for service hero, CTA, JSON-LD
components: src/components/ contains Header, Footer, Hero, CtaBanner, BaseHead for meta/OG/canonical, TrackingScripts for GA4 plus Meta Pixel
data: src/data/ is TypeScript single source of truth: company.ts, services.ts, navigation.ts, testimonials.ts, gallery.ts, service-content.ts, product-documents.ts
styles: src/styles/global.css holds Tailwind import, @theme tokens, base, animation classes; src/styles/fonts.css declares 3 self-hosted WOFF2 fonts
assets: src/assets/ is Astro pipeline source for photos, logos, placeholders; public/ directly serves fonts, favicons, manifest, _headers, _redirects, robots.txt, and current direct-serve copies in images/photos/
tests: tests/ contains scaffolded Playwright E2E, axe-core accessibility, visual regression tests; currently empty

working_rules:
data-driven content: repeating content such as services, navigation, testimonials, gallery, and company info must come from src/data/; never hardcode those values in templates
no duplication: do not duplicate raw HTML; put shared structure in layouts/components and page-specific content in page files
JSON-LD: compute from company.ts, services.ts, and testimonials.ts; never hand-write JSON-LD
CSS: use Tailwind utilities for layout, spacing, responsive behavior; @theme custom properties for brand tokens; component-scoped style blocks for page-specific styling; global.css only for base and animations
scripts: use component-scoped script blocks in Astro files; keep global scroll/parallax behavior in BaseLayout.astro; do not add external JS

gotchas:
Astro 6 output: output:"hybrid" removed; static output handles static pages and SSR opt-in; add export const prerender = false only for SSR pages
Tailwind 4 tokens: tokens belong in CSS @theme blocks, not tailwind.config.js
lucide: @lucide/astro has peer-dependency conflict with Astro 6; project uses inline SVGs; lucide-static installed for SVG file access
photos: duplicated in src/assets/photos/ and public/images/photos/; site currently serves public/images/photos/; planned Astro Image migration would remove public/images/photos/
asset dir: build.assets must be "assets", not default _astro, because Vite preview 404s underscore-prefixed directories when base is set; default breaks astro preview CSS/JS
forms: form handler still client-side Web3Forms; API-route migration planned
redirects: service URLs changed from V2 /plant-health.html to V3 /services/plant-health; _redirects maps all old URLs

brand_and_tracking:
colors: primary green #00863F, bright green #6CC551, dark background #111
fonts: Anton headings, Source Sans 3 body, Merriweather logo
tokens: full brand tokens live in global.css @theme
GA4: G-60GGNQVGCD
Meta Pixel: 414143897932367
tracking location: Tracking IDs are in TrackingScripts.astro

build_and_deploy:
local dev: npm run dev
build: npm run build writes dist/ and typically takes about 3.5 seconds
Cloudflare Pages: auto-deploys with build command npm run build and output directory dist

related_projects:
Westside V2: ../Westside-Website-v2/ is previous static version; reference only; no further development
Westside V2.5: ../Westside-Website-v2.5/ is simplified safety-net fork of V2; retire when V3 is production
parent project: ../Westside/ contains source content, communications, and marketing collateral
