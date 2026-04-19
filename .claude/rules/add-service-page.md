---
paths:
  - "src/data/services.ts"
  - "src/data/service-content.ts"
  - "src/data/navigation.ts"
  - "src/pages/contact.astro"
  - "src/pages/services/**"
---

# Adding a New Service Page

Service pages are data-driven — `/services/[slug]/` routes are generated dynamically from `services.ts` via `src/pages/services/[slug].astro`. To ship a new service, touch five files. Missing any one of them leaves the site in a partially-wired state that compiles but has dead ends.

## The Five-File Touch

1. **`src/data/services.ts`**
   - Add the new slug to the `SERVICE_SLUGS` tuple (this is the Zod-validated union; the build fails if slugs drift).
   - Append a full `Service` object to the `services` array (all fields required by `ServiceSchema`: meta title/description, hero copy, card image, icon, features, CTA).

2. **`src/data/service-content.ts`**
   - Add a `ServiceContent` entry keyed by slug with intro/detail/process/FAQs/relatedSlugs/CTA.
   - Services without a content entry render a blank body (hero + CTA only) — technically valid, but every production service has content.

3. **`src/data/navigation.ts`**
   - Add `{ label, href: '/services/<slug>/' }` to **both** `mainNav` children (header dropdown) AND `footerServices` (footer service list). These are separate arrays, not derived from `services.ts`.

4. **`src/pages/contact.astro`**
   - Add `<option>` inside the `<select id="service">` around line ~145. This dropdown is hand-maintained — adding a service without updating it means leads can't select it.
   - If the service is a "Career Inquiry"-style special case, also wire conditional fields in the script block.

5. **`src/pages/services/[slug].astro`** (usually no change needed)
   - The dynamic route auto-generates from `services.map()`. Only touch this if the new service needs custom sections the standard intro/detail/process/FAQ blocks can't express.
   - **Exception:** if the service needs a fully custom page (like `plant-health.astro` with its pricing block + upsells), add a standalone `.astro` file AND add the slug to the `.filter()` call in `getStaticPaths` to prevent the dynamic route from shadowing it.

## Optional

- **`src/data/company.ts`** `financing.eligibleServices` array — add the slug if the Wells Fargo financing banner should appear on this page.
- **`src/pages/services/index.astro`** — no change needed; it maps over `services.map()` automatically.
- **`src/pages/index.astro`** homepage services grid — also auto-generated from the `services` array.

## Cross-Linking Convention

Service-to-service links inside `detailCards[].text` and `faqs[].answer` render via `set:html`. Use:

```html
<a href="/services/<slug>/" style="color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;">anchor text</a>
```

The trailing slash on internal URLs is required (Astro is configured `trailingSlash: 'always'`).

## FAQ Formatting

`FaqSection.astro` renders `faq.answer` via `set:html`, so you can use `<strong>`, `<em>`, `<a>`, `<br>` in answers. The same HTML is safe to include in the JSON-LD `FAQPage.acceptedAnswer.text` field — Google's structured data spec permits this subset.

Do not use HTML in `faq.question` — rendered as plain text.

## Build + Deploy

After editing: `npm run build` must succeed. Then see `deploy.md` for Cloudflare Pages deployment.

The build emits `dist/services/<slug>/index.html` and the sitemap picks up the new URL automatically via `@astrojs/sitemap`. No manual sitemap edits needed.

## After Deploy

- Resubmit the sitemap to GSC to nudge recrawl:
  ```bash
  curl -X PUT "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Awestsideprolandscape.com/sitemaps/https%3A%2F%2Fwestsideprolandscape.com%2Fsitemap-index.xml" \
    -H "Authorization: Bearer $GOOGLE_TOKEN"
  ```
- The GSC API has **no generalized "Request Indexing" endpoint** anymore (Google restricted the Indexing API to JobPosting/Livestream schemas). For a specific URL recrawl, use the GSC UI's "Request Indexing" button manually, or just wait — Google typically crawls new sitemap URLs within a few days for this property.
