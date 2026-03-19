# Content Needed from Westside

Checklist of content and approvals needed to restore features that were removed or softened for the initial deployment. Each item below was on the previous `master` branch and can be re-added once Westside provides the information.

## Team Section (About Page)

**What's needed:** Real bios for each team member (2-3 sentences each), plus approved headshot photos.

The about page currently has a generic "A Team That Cares" paragraph. The full version has a grid of team member cards with photos, names, roles, and bios. The code and layout are ready — just needs real content.

**People to include:**
- **Brad** — Owner / President. *Need:* How he started the company, background, philosophy. Photo.
- **Brantley** — Plant Health Manager. *Need:* Years with Westside, certifications, what he enjoys. Photo.
- **Heather** — Office Manager. *Need:* What she manages day-to-day, years with Westside. Photo.
- **Jeff** — Landscape Operations Manager. *Need:* Background, specialties, years with Westside. Photo.

**Code:** Team data lives in `src/data/team.ts`. About page imports `team` and renders the grid. Team photos go in `src/images/photos/` as `team-brad.webp`, `team-brantley.webp`, etc.

**Also blocked:** The homepage about section currently uses `gallery-striped-colonial.webp` (a real project photo). When team photos are approved, swap to `about-company.webp` (a team/company photo) on the homepage too.

---

## "Top 100 Fastest Growing" Credential (About Page)

**What's needed:** Citation or source for this claim. Which organization? What year? What list?

Currently says "Locally Owned Since 2000" instead. Replace the third certification card once verified.

---

## Specific Job Listings (Careers Page)

**What's needed:** Confirmation that these positions are actually open and the descriptions are accurate:

1. **Landscape Crew Member** — Full-time. "Experience preferred but will train motivated candidates."
2. **Lawn Care Technician** — Full-time / Seasonal. "Must obtain or hold NYS DEC pesticide applicator certification."
3. **Crew Leader** — Full-time. "Lead a crew of 3-5 in daily landscape operations. 3+ years experience required. Valid driver's license required."

Currently the careers page has a general "Think You're Westside Material?" section that invites resumes without claiming specific open positions.

**Also needs confirmation:**
- "Performance bonuses and overtime opportunities" — is this real?
- "Paid training" — is this accurate?
- "Clear advancement paths from crew member to crew leader to management" — can this be said?

---

## Stronger Service Copy

These are copy improvements that were softened for safety. They can be restored once Westside confirms:

### Snow & Ice Management (`service-content.ts`)
- **Confirm:** "Our crews monitor weather conditions continuously and deploy proactively — often before the first flake hits the ground" — is proactive deployment accurate?
- **Confirm:** "response team ready 24/7" — is there actually a 24/7 response commitment?
- **Confirm:** "Properties that plan ahead get priority response" — is this a real policy?

### Commercial Services (`service-content.ts`, `services.ts`)
- **Confirm:** "well-trained and uniformed" — are crews actually uniformed?
- **Confirm:** "members of industry trade associations" and "continuing education" — which associations? Is this current?

### Holiday Lighting (`service-content.ts`)
- **Confirm:** "no damage to your property" — the softer "treating your property with respect" avoids a guarantee-style claim. Which does Westside prefer?
- **Confirm:** "reservations fill up fast" — is this true, or aspirational?

### Artificial Grass (`service-content.ts`, `services.ts`)
- **Decision:** "industry-leading warranties" vs. "manufacturer-backed warranties" — the latter is factually safer (SYNLawn does back their products with warranties). The former is a subjective claim.

### Plant Health (`plant-health.astro`)
- **Decision:** "go beyond what's available at retail stores" vs. "for effective, lasting results" — is the retail comparison accurate and desired?
- **Decision:** "Not satisfied? Contact us and we'll make it right" vs. "Questions about a treatment? Give us a call" — the first implies a guarantee. Does Westside want that?

### Contact FAQ (`contact.astro`)
- **Confirm:** "All of our plant health and lawn care technicians are NYS DEC Certified Pesticide Applicators" — is *every* technician certified, or just the team leads? Currently says "Our plant health technicians hold NYS DEC Certified Commercial Pesticide Applicator credentials."

---

## Not Content-Blocked (Can Be Done Anytime)

These are code quality improvements that don't depend on Westside:

- [x] ~~Contact form script: modernize `var` → `const`, arrow functions, TypeScript types~~ *(applied during branch consolidation)*
- [x] ~~Contact form: remove duplicate inline tracking code (now handled by TrackingScripts)~~ *(applied during branch consolidation)*
