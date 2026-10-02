# Cloudflare Pages Functions

The production site is a static Astro build plus three Cloudflare Pages Function entry points. These Functions do not run under the repository's static Playwright server, so treat their runtime and secrets separately from ordinary page checks.

## Responsibility map

| Route | Source | Responsibilities |
|---|---|---|
| `POST /api/contact/` | `api/contact.ts` | Turnstile verification, resume validation, Microsoft Graph notification and confirmation mail, Meta `Lead` Conversions API event |
| `POST /api/track-call/` | `api/track-call.ts` | Meta `Contact` Conversions API event for tracked call clicks |
| `GET /api/address-suggest/` | `api/address-suggest.ts` | Google Places address suggestions |

Browser-side analytics and conversion wiring live in `src/components/TrackingScripts.astro`: GA4, Google Ads, Meta Pixel, Microsoft UET, first-touch attribution, and call-click tracking. Keep that browser layer and these server routes aligned when changing event names or deduplication.

## Runtime bindings

Verified 2026-08-30 against the production Pages project's secret inventory and current Function interfaces:

| Binding | Requirement | Used by |
|---|---|---|
| `TURNSTILE_SECRET` | Required | `api/contact.ts` |
| `AZURE_TENANT_ID` | Required | `api/contact.ts` |
| `AZURE_CLIENT_ID` | Required | `api/contact.ts` |
| `AZURE_CLIENT_SECRET` | Required | `api/contact.ts` |
| `PLACES_API_KEY` | Required | `api/address-suggest.ts` |
| `META_ACCESS_TOKEN` | Optional | Contact and call CAPI routes; missing value logs and skips Meta without failing the customer action |
| `META_TEST_EVENT_CODE` | Test-only, optional | Sends server events to Meta Events Manager's Test Events surface when configured |
| `CONTACT_TEST_RECIPIENT` | Preview environment only | Sends contact notifications only to this `@westsideprolandscape.com` mailbox and skips the Meta CAPI `Lead` event, so preview submissions never reach the office or ad reporting. Must never be set on production. |

Production currently retains a `WEB3FORMS_KEY` secret even though no tracked Function uses it. Web3Forms was replaced by the Graph-backed contact endpoint. Remove that live secret only as an explicit platform-cleanup task after checking any retained preview environment that matters; it is not part of current source.

Never put secret values in the repository. Set production values with `wrangler pages secret put <NAME> --project-name=westside-website` and verify names, not values, with `wrangler pages secret list --project-name=westside-website`.

## Local and preview verification

`npm run preview`, `tests/static-server.mjs`, and the Playwright suite serve only `dist/`; they do **not** execute Pages Functions. Contact-form browser tests mock `/api/contact/`, so a passing `npm test` does not validate Turnstile, Graph mail, Places, or Meta CAPI.

`tests/contact-function.spec.ts` calls the contact handler directly with every outbound service stubbed, so the subject line, email rows, recipient choice, and CAPI payload are covered without sending anything.

For an end-to-end check, deploy a preview branch and submit the real form there. Preview deployments carry `CONTACT_TEST_RECIPIENT`, so the notification reaches only the test mailbox. Set the `_wpl_internal=1` cookie on the preview origin first; it blocks the browser-side Google Ads, Meta, and Microsoft conversion tags and tags GA4 traffic as internal.

For local Function integration work, build first and run `npx wrangler pages dev dist` with deliberate local bindings/secrets. Do not send real mail or production analytics events merely to prove local routing. Before production publication of a Function change, deploy a Cloudflare preview, exercise the affected endpoint there with test-safe inputs, inspect Function logs/errors, and verify the observable response. Production deployment remains an explicit external action governed by `.claude/skills/deploy/SKILL.md`.
