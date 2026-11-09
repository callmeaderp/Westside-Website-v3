/**
 * Option lists for the project-inquiry fields on the contact form.
 *
 * Values are stored verbatim in the notification email and GA4/Meta
 * parameters, so keep them human-readable.
 *
 * The budget question asks for the visitor's comfort level; it is not
 * Westside pricing. Service prices and price ranges are deliberately
 * unpublished (README, "Content and asset conventions").
 */

/** Budget options offered on the contact form. */
export const budgetOptions = [
  'Not sure yet; help me scope it',
  'Under $10,000',
  '$10,000 – $25,000',
  '$25,000 – $50,000',
  '$50,000 – $100,000',
  'Over $100,000',
] as const;

/** Desired-timing options for the contact form. */
export const timingOptions = [
  'As soon as possible',
  'Within 1–3 months',
  'Later this season',
  'Next season / planning ahead',
  'Just gathering information',
] as const;

/** Project-type options for the contact form. */
export const projectTypeOptions = [
  'Paver patio',
  'Walkway, steps, or front entry',
  'Retaining wall',
  'Outdoor kitchen, bar, or fire feature',
  'Drainage or grading problem',
  'Landscape renovation or new planting design',
  'Artificial turf or putting green',
  'Full backyard transformation',
  'Repair or restoration of existing hardscape',
  'Something else',
] as const;

/**
 * Services whose contact form swaps the construction questions for a simpler
 * request. The 2026-11-09 review found holiday-lighting visitors being asked
 * what they wanted to build, offered budget ranges from under $10,000 to over
 * $100,000 and prompted about drainage. A profile hides the project type, budget and
 * timing questions (fields marked `data-hide-for="<id>"` in contact.astro) and
 * replaces the message label and prompt. The message stays required, because
 * the contact Function requires one for every customer request.
 *
 * Keys are service slugs from services.ts.
 */
export interface ServiceFormProfile {
  /**
   * Set on <html data-contact-profile>. contact.astro's global CSS keys its
   * hide/show rules to each id, so a new id needs matching rules there.
   */
  id: 'holiday';
  messageLabel: string;
  messagePlaceholder: string;
}

export const serviceFormProfiles: Record<string, ServiceFormProfile> = {
  'holiday-lighting': {
    id: 'holiday',
    messageLabel: 'What Would You Like Lit?',
    messagePlaceholder: 'The roofline, a few front trees, a wreath on the door? Tell us what you have in mind.',
  },
};
