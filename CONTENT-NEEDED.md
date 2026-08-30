# Content and approvals still needed

Current-state list of unpublished content, missing approvals, and the safe fallback already on the site. This is not a branch-restoration checklist: some earlier implementations no longer exist and should be rebuilt from current data/component conventions only after the underlying content is approved.

## Team section (About page)

**Current published fallback:** a generic “A Team That Cares” section in `src/pages/about.astro`.

**What's needed:** approved people, current roles, 2–3 sentence bios, and approved headshots. The roster below is historical input, not an approved current lineup; Brantley is no longer active and must not be republished as Plant Health Manager.

**Implementation state:** four `team-*.webp` assets and `about-company.webp` exist under `src/images/photos/`, but there is no current `src/data/team.ts` or team-card renderer. After approval, create a canonical team data module and rebuild the About-page grid from current components. Do not follow the retired `src/data/team.ts` route as though its code were already present.

**Candidate people to confirm:** Brad, Heather, Jeff, Joshua, and any other current leaders Westside wants to publish. Confirm exact public titles, bios, and photo rights before implementation.

**Homepage follow-up:** once a current company/team photo is approved, decide whether `about-company.webp` should replace the current project photo in the homepage About section.

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
- **Current published fallback:** “manufacturer-backed warranties,” which is the factually safer approved wording unless Westside supplies evidence for a stronger comparative claim. No decision is currently blocking the site.

### Plant Health (`plant-health.astro`)
- **Decision:** "go beyond what's available at retail stores" vs. "for effective, lasting results" — is the retail comparison accurate and desired?
- **Decision:** "Not satisfied? Contact us and we'll make it right" vs. "Questions about a treatment? Give us a call" — the first implies a guarantee. Does Westside want that?

### Contact FAQ (`contact.astro`)
- **Current published fallback:** “Our plant health technicians hold NYS DEC Certified Commercial Pesticide Applicator credentials.” Keep that narrower wording unless Westside verifies the certification status of every technician represented by a broader claim.
