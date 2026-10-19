# Cloudflare Pages Functions

The production site is a static Astro build plus three Cloudflare Pages Function entry points. These Functions do not run under the repository's static Playwright server, so treat their runtime and secrets separately from ordinary page checks.

## Responsibility map

| Route | Source | Responsibilities |
|---|---|---|
| `POST /api/contact/` | `api/contact.ts` | Customer requests and short career applications, Turnstile, optional resume validation, Microsoft Graph notification and acknowledgement mail; customer-only Meta `Lead` CAPI |
| `POST /api/track-call/` | `api/track-call.ts` | Customer-only Meta `Contact` CAPI for production call clicks, excluding career sources |
| `GET /api/address-suggest/` | `api/address-suggest.ts` | Google Places address suggestions |

Browser-side analytics and conversion wiring live in `src/components/TrackingScripts.astro`: GA4, Google Ads, Meta Pixel, Microsoft UET, first-touch attribution, and call-click tracking. Keep that browser layer and these server routes aligned when changing event names or deduplication.

## Runtime bindings

Runtime secret names rechecked 2026-10-19; values are never recorded here:

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

## Contact and career payloads

Both use JSON `POST /api/contact/` and the same `{ success: true }` response. Errors return `{ success: false, message }` with an appropriate 4xx/5xx status. All known text fields must be strings when supplied; omit unused fields rather than sending `null`. Unknown fields are ignored. Turnstile verification remains required.

- **Customer requests:** first name, last name, email and message remain required. Existing property/company/project/budget/timing fields and office routing remain supported.
- **Career applications:** set `service: 'Career Inquiry'`, supply `firstName`, `lastName`, `turnstileToken` and at least one usable `email` or `phone`. A supplied email or phone must be valid even when the other is usable. `message` (relevant experience) is optional. Optional `careerPosition` (160 characters), `careerAvailability` (500), `referredBy` (120), `howHeard` (300), `contactPreference` (40), acquisition `attribution`, and `resume` are supported. Position values are free text, not a separate roles catalog. Legacy career requests without these additions remain accepted.
- Names are capped at 100 characters each, email at 254, phone at 80, message at 5,000. Phone validation accepts 7–15 main digits, common formatting and optional extensions of up to six digits. Attribution uses known keys only, each capped at 300 characters. The handler's `FIELD_LIMITS` owns all remaining field bounds. Subjects collapse whitespace and are capped at 400 characters.
- Total body limit is **3 MiB**, enforced against the actual stream as well as Content-Length; oversized bodies return 413. Resumes are optional `{ name, type, data }` objects. `data` is base64 (a data URL is also accepted). PDF/DOC/DOCX MIME, matching extension, nonempty content, magic bytes and decoded byte size are checked. Filenames are sanitized. This is a signature check, not antivirus scanning or full document validation. Do not request SSNs, birth dates, banking data or identity documents.
- Shared `src/data/form-limits.ts` exports `MAX_RESUME_BYTES = 2 * 1024 * 1024` and `MAX_RESUME_MB = 2`. Use these on the frontend. Microsoft documents simple Outlook attachments as [under 3 MB, with upload sessions for 3–150 MB](https://learn.microsoft.com/en-us/graph/outlook-large-attachments). The conservative 2 MiB cap leaves room for base64 and message overhead without an upload-session subsystem. [JSON sendMail supports inline base64 file attachments](https://learn.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0); its 202 response means accepted for processing, not proven delivery. Limits checked 2026-10-19.

Notifications remain from `website@westsideprolandscape.com` to `office@westsideprolandscape.com` and `brad@westsideprolandscape.com`. Careers additionally CC Joshua's Westside address for launch coordination. Their subjects retain `[Career Inquiry]` and add the position when supplied; their HTML omits customer property/project rows. `CONTACT_TEST_RECIPIENT` overrides every notification To/CC recipient, including career CC. The acknowledgement still goes to the submitted email, so preview tests must use a controlled applicant email too. Phone-only applications send no acknowledgement and no empty applicant Reply-To. Acknowledgements only confirm receipt, promise no hiring outcome or response time, and failures log HTTP status, Graph error code and correlation ID without raw applicant content. An accepted notification is never reported as failed because acknowledgement sending failed.

Career submissions exit before any Meta user-data hashing or `Lead` CAPI, including legacy requests. Both server conversion routes allow only HTTPS `westsideprolandscape.com` or `www.westsideprolandscape.com` request hosts, and reject supplied preview/nonproduction source origins. Preview notification mode skips conversions too. Call tracking also skips when either the submitted source URL or Referer points to `/career/`, `/careers/` (including descendants), or a legacy contact URL with a career `service` query value. These are analytics guards, not proof of a visitor's hiring intent: missing source metadata is skipped, but a forged customer source URL cannot identify a career-origin call. Browser-side suppression remains necessary.

## Local and preview verification

`npm run preview`, `tests/static-server.mjs`, and the Playwright suite serve only `dist/`; they do **not** execute Pages Functions. Contact-form browser tests mock `/api/contact/`, so a passing `npm test` does not validate Turnstile, Graph mail, Places, or Meta CAPI.

`tests/contact-function.spec.ts` calls the contact handler directly with every outbound service stubbed, so the subject line, email rows, recipient choice, and CAPI payload are covered without sending anything.

For an end-to-end check, deploy a preview branch and submit the real form there. Preview deployments carry `CONTACT_TEST_RECIPIENT`, so the notification reaches only the test mailbox. It is set with `wrangler pages secret put CONTACT_TEST_RECIPIENT --project-name=westside-website --env preview`. Without `--env preview`, Wrangler writes to production, where the setting would send every live inquiry to the test mailbox instead of the office after the next deploy; the flag works but is missing from `wrangler pages secret put --help`. Confirm with `wrangler pages secret list --project-name=westside-website` (production) that it is absent. Browser analytics are runtime-host-gated, so preview hosts load no GA4 or advertising tags. Automated browsers may fail real Turnstile challenges; Cloudflare recommends its [official dummy credentials](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) for automation. If used for runtime verification, temporarily change **preview only**, keep all mail recipients controlled, restore the real preview secret, deploy a restored preview and delete the temporary dummy-secret deployment afterward. Never put test credentials into production, disable verification there or present a dummy-key test as proof that a real human challenge passed.

For local Function integration work, build first and run `npx wrangler pages dev dist` with deliberate local bindings/secrets. Do not send real mail or production analytics events merely to prove local routing. Before production publication of a Function change, deploy a Cloudflare preview, exercise the affected endpoint there with test-safe inputs, inspect Function logs/errors, and verify the observable response. Production deployment remains an explicit external action governed by `.claude/skills/deploy/SKILL.md`.
