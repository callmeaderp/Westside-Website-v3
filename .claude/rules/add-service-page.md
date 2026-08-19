---
paths:
  - "src/data/services.ts"
  - "src/data/service-content.ts"
  - "src/data/navigation.ts"
  - "src/data/investment.ts"
  - "src/data/projects.ts"
  - "src/pages/services/**"
---

# Adding a New Service Page

Service pages are data-driven — `/services/[slug]/` routes are generated dynamically from `services.ts` via `src/pages/services/[slug].astro`. To ship a new service, touch three files. Missing any one leaves the site in a partially-wired state that compiles but has dead ends.

## The Three-File Touch

1. **`src/data/services.ts`**
   - Add the new slug to the `SERVICE_SLUGS` tuple (this is the Zod-validated union; the build fails if slugs drift).
   - Append a full `Service` object to the `services` array (all fields required by `ServiceSchema`).
   - Set `tier`: `'core'` puts it in the homepage grid; `'construction'` groups it with the build lanes under the hardscaping hub.

2. **`src/data/service-content.ts`**
   - Add a `ServiceContent` entry keyed by slug with intro/detail/process/FAQs/relatedSlugs/CTA.
   - Add `heroButtons` — without them the hero falls back to a generic estimate/call pair. A construction page should point one button at `#investment`.
   - Construction services should also set `investmentBandIds` and `featuredProjectSlugs`.
   - Services without a content entry render a blank body (hero + CTA only) — technically valid, but every production service has content.

3. **`src/data/navigation.ts`**
   - Add `{ label, href: '/services/<slug>/' }` to **both** `mainNav` children (header dropdown) AND `footerServices` (footer service list). These are separate arrays, not derived from `services.ts`.

`src/pages/contact.astro` no longer needs editing: the service `<select>` and the `?service=<slug>` preselect map are both generated from `services.ts`. Career Inquiry remains a hand-added special case.

`src/pages/services/[slug].astro` usually needs no change — the dynamic route auto-generates from `services.map()`.
**Exception:** if the service needs a fully custom page (like `plant-health.astro` with its pricing block + upsells), add a standalone `.astro` file AND add the slug to the `.filter()` call in `getStaticPaths` to prevent the dynamic route from shadowing it.

## Publishing prices

Never inline a dollar figure in a template or content string. Add an `InvestmentBand` to `src/data/investment.ts` and reference it by id; the `InvestmentRanges` component renders `INVESTMENT_CAVEAT` alongside every band so a published range cannot be read as a quote. Ranges must stay internally consistent — a walkway cannot start above a full patio.

`tests/construction.spec.ts` asserts that every construction route publishes a band **and** the caveat.

## Adding a project case study

Add a `Project` to `src/data/projects.ts` and copy the source photo into `src/images/photos/` as `proj-<name>.webp` (max 1500px, WebP q78). Two evidence rules:

- Set `town` **only** when the location is independently provable. Photo EXIF in the marketing library carries capture dates and camera models but no GPS, so current entries omit it. A wrong town is worse than no town.
- Check the new image is not a near-duplicate of an existing asset before adding it. The marketing library contains re-exports of photos already on the site (`gallery-drone-patio.webp` and the library's `outdoor-kitchen-stone-bar-evening-lights.jpg` were byte-similar), and two cards showing the same yard reads as padding.

## Optional

- **`src/data/company.ts`** `financing.eligibleServices` array — add the slug if the Wells Fargo financing banner should appear on this page.
- **`src/pages/services/index.astro`** — no change needed; it maps over `services` and `constructionServices` automatically.
- **`src/pages/index.astro`** homepage grids — also auto-generated from `coreServices` / `constructionServices`.

## Cross-Linking Convention

Service-to-service links inside `detailCards[].text` and `faqs[].answer` render via `set:html`. Use:

```html
<a href="/services/<slug>/" style="color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;">anchor text</a>
```

The trailing slash on internal URLs is required (Astro is configured `trailingSlash: 'always'`). Note that `url()` deliberately does **not** prefix same-page fragments — `url('#investment')` returns `#investment`, not `/#investment`.

## Professional title claims

Do not describe anyone at Westside as a "landscape architect" or the service as "landscape architecture". NY Education Law §7322 protects the title and no Westside licence has been identified. Use "landscape design", "landscape planning", or "design-build landscape contractor". `tests/construction.spec.ts` fails if a claiming phrase appears in page copy or metadata.

## FAQ Formatting

`FaqSection.astro` renders `faq.answer` via `set:html`, so you can use `<strong>`, `<em>`, `<a>`, `<br>` in answers. The same HTML is safe to include in the JSON-LD `FAQPage.acceptedAnswer.text` field — Google's structured data spec permits this subset.

Do not use HTML in `faq.question` — rendered as plain text.

## Build + Verify

After editing: `npm run check`, `npm run lint`, and `npm run build` must succeed, then `npm test`. The new route is asserted automatically only if you add it to the route lists at the top of `tests/construction.spec.ts`. Then see `deploy.md` for Cloudflare Pages deployment.

The build emits `dist/services/<slug>/index.html` and the sitemap picks up the new URL automatically via `@astrojs/sitemap`. No manual sitemap edits needed.

## After Deploy

- Resubmit the sitemap to GSC to nudge recrawl:
  ```bash
  curl -X PUT "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Awestsideprolandscape.com/sitemaps/https%3A%2F%2Fwestsideprolandscape.com%2Fsitemap-index.xml" \
    -H "Authorization: Bearer $GOOGLE_TOKEN"
  ```
- The GSC API has **no generalized "Request Indexing" endpoint** anymore (Google restricted the Indexing API to JobPosting/Livestream schemas). For a specific URL recrawl, use the GSC UI's "Request Indexing" button manually, or just wait — Google typically crawls new sitemap URLs within a few days for this property.
