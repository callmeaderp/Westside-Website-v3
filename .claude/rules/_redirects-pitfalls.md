---
paths:
  - public/_redirects
---

# Cloudflare Pages `_redirects` — known pitfalls

## Current status

Verified 2026-08-30 against the Cloudflare API and the current Pages file: dynamic-redirect ruleset `63277d1deb904d28ae0c71175cddc5c8` contains **10 enabled rules**, not one. Rule `9d2503507dee41bb8ce304b049b04a19` handles both legacy `feed=` queries and `/field/chemical-record[/]`; the other rules own path catalogs for hardscaping, landscape design, lawn care, maintenance, commercial, snow, brand/news, careers, and the canonical `www` host redirect. Several path-only rules intentionally or historically overlap `public/_redirects`; the zone rule wins because it runs before Pages. Never reconstruct or replace the phase from an excerpt in this document.

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

Rule `9d2503507dee41bb8ce304b049b04a19` currently handles the feed-query case **and** the retired chemical-record path. The feed fragment below is illustrative only; it is not the rule's complete expression and is never a safe replacement payload:

```
Feed fragment:
  (http.host in {"westsideprolandscape.com" "www.westsideprolandscape.com"})
  and (http.request.uri.path eq "/")
  and (starts_with(http.request.uri.query, "feed=")
       or http.request.uri.query contains "&feed=")

Shared action: dynamic redirect, 301, target = https://westsideprolandscape.com/, preserve_query_string = false
```

Manage via Cloudflare API (zone `5a81c4f4e3e41b9422ab799dcb369673`):

```bash
# Fetch the complete live phase immediately before any change
curl -s -H "X-Auth-Email: $CLOUDFLARE_EMAIL" -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  "https://api.cloudflare.com/client/v4/zones/5a81c4f4e3e41b9422ab799dcb369673/rulesets/phases/http_request_dynamic_redirect/entrypoint" | jq .

# Preferred single-rule edit: PATCH preserves every other rule
curl -s -X PATCH \
  -H "X-Auth-Email: $CLOUDFLARE_EMAIL" -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  -H "Content-Type: application/json" \
  --data @<complete-one-rule-payload.json> \
  "https://api.cloudflare.com/client/v4/zones/5a81c4f4e3e41b9422ab799dcb369673/rulesets/63277d1deb904d28ae0c71175cddc5c8/rules/<RULE_ID>"
```

A `PUT` to the phase entrypoint replaces the entire live catalog. Use it only with a freshly fetched, intentionally complete ten-rule payload and explicit intent to replace the whole phase. Never build that payload from the illustrative feed fragment above.

## Rule-precedence branches (Cloudflare → Pages)

When a request hits the edge, reason in three branches rather than as one linear five-step pipeline:

1. **Zone-level Redirect Rules run before the Pages project.** They support host, path, query, headers, cookies, and geography. Any overlapping zone rule shadows `public/_redirects`.
2. **A request handled by a Pages Function does not invoke `_redirects`, even when the Function route matches the same URL pattern.** Function routing belongs in `functions/` or `_routes.json`.
3. **Otherwise, a matching `_redirects` rule is followed even when a static asset exists.** Rules are evaluated top-to-bottom; when none matches, normal static-file and 404 resolution applies.

Put query-string/header/geo rules at the zone level. Keep path-only redirects in `_redirects` when possible, but first check whether a live zone rule already owns the path; editing only the repository copy may have no production effect.

## Other `_redirects` gotchas

- **Slash forms are separate sources.** Maintain both when production may receive both; the current `public/_redirects` correctly maps `/blog/winterize` and `/blog/winterize/` to `/services/plant-health/`.
- **Soft 404 anti-pattern.** Redirecting obviously unrelated legacy URLs such as `/wp-admin/*`, `/xmlrpc.php`, `/tag/*`, `/author/*`, or `/feed/*` to `/` can be treated by Google as a soft 404. Prefer a natural 404 when there is no topically related destination; preserve targeted redirects where there is one. The broader historical Cloudflare context lives in the Westside operations workspace's `memory/cloudflare-dns-setup.md`.
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
