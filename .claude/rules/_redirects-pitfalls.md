---
paths:
  - public/_redirects
---

# Cloudflare Pages `_redirects` — Known Pitfalls

## NEVER write query-string patterns in `_redirects`

Cloudflare Pages `_redirects` **does not support query-string matching** (officially unsupported per [Cloudflare Pages docs on advanced redirects](https://developers.cloudflare.com/pages/configuration/redirects/#advanced-redirects)).

A source line like:

```
/?feed=*                /       301
```

is NOT parsed as "root with query param `feed=anything`" — the `?` truncates the match, the rest is discarded, and the effective source becomes just `/`. The rule then matches **every request to the homepage** and creates an infinite redirect loop (`/` → `/` → `/` → ...).

**This exact bug took down the homepage on April 14, 2026** and stayed live for ~24 hours before it was caught. Symptom: Safari/Chrome/Firefox show "Too many redirects" on `/` only; all other pages load fine; `curl -I /` returns `HTTP 301 Location: /` on a loop.

## Query-string redirects must live at the ZONE level

Query-string matching requires wirefilter expressions, which only Cloudflare Zone-level Redirect Rules support. They run in the `http_request_dynamic_redirect` phase **before** Pages sees the request, so no loop is possible with the static `_redirects` file.

The current zone rule for `/?feed=rss2`-style URLs (ruleset `63277d1deb904d28ae0c71175cddc5c8`, rule `9d2503507dee41bb8ce304b049b04a19`):

```
Expression:
  (http.host in {"westsideprolandscape.com" "www.westsideprolandscape.com"})
  and (http.request.uri.path eq "/")
  and (starts_with(http.request.uri.query, "feed=")
       or http.request.uri.query contains "&feed=")

Action: dynamic redirect, 301, target = https://westsideprolandscape.com/, preserve_query_string = false
```

Manage via Cloudflare API (zone `5a81c4f4e3e41b9422ab799dcb369673`):

```bash
# List rules
curl -s -H "X-Auth-Email: callmeaderp@gmail.com" -H "X-Auth-Key: $CF_KEY" \
  "https://api.cloudflare.com/client/v4/zones/5a81c4f4e3e41b9422ab799dcb369673/rulesets/phases/http_request_dynamic_redirect/entrypoint" | jq .

# Update — PUT to the same endpoint replaces all rules in the phase
```

## Rule-precedence order (Cloudflare → Pages)

When a request hits the Cloudflare edge:

1. **Zone-level Redirect Rules** (`http_request_dynamic_redirect`) — fire first. Full wirefilter: host, path, query, headers, cookies, geo.
2. **Pages Functions** (if any match) — can handle routing dynamically.
3. **Pages static file handling** — serves files from `dist/`.
4. **`_redirects`** — runs during Pages static handling; path-only matching with splats (`*`) and placeholders (`:name`).
5. **404 fallback** — Pages returns `404.html` if nothing matched.

So: put query-string / header / geo rules at the zone level. Keep `_redirects` for simple path rewrites only.

## Other `_redirects` gotchas

- **No trailing-slash auto-matching.** `/blog/winterize` and `/blog/winterize/` are two separate sources. We have the first as a specific topical redirect (`→ /services/plant-health/`); the second falls through to the catch-all `/blog/*` → `/services/` and loses the topical mapping. If Google has both forms indexed, add both lines.
- **Soft 404 anti-pattern.** Per an earlier SEO audit (see `memory/website-v3-migration.md`): redirecting obviously-unrelated legacy URLs like `/wp-admin/*`, `/xmlrpc.php`, `/tag/*`, `/author/*`, `/feed/*` to `/` is treated by Google as a soft 404 — a negative crawl signal. A natural 404 is stronger SEO-wise when the destination has no topical relationship to the source. We currently send a mix of topical redirects (good) and blanket `→ /` redirects (marginal).
- **Trailing slash on destination matters.** `trailingSlash: 'always'` in `astro.config.mjs` means every destination should end in `/` to avoid a double hop through Pages' trailing-slash canonicalization.

## After editing `_redirects`, always test the homepage

```bash
# Must return 200, NOT 301 with location: /
curl -sI "https://westsideprolandscape.com/" | head -3
curl -sI "https://westsideprolandscape.com/?feed=rss2" | head -3  # should 301 → /
curl -sI "https://westsideprolandscape.com/?gclid=abc" | head -1  # should 200 (ads must keep query)
curl -sI "https://westsideprolandscape.com/?utm_source=x" | head -1  # should 200
```

A preview deploy first (`--branch=test-redirects`) is cheap insurance for any `_redirects` change.
