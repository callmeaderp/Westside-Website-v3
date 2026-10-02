/**
 * Contact-form property types, shared by the form (src/pages/contact.astro) and
 * the notification Function (functions/api/contact.ts). The Function accepts
 * only these values and flags every non-home type in the email subject, so the
 * office can spot business, HOA, and apartment requests from the inbox list.
 *
 * `value` is what is stored and sent to analytics; keep values short and stable.
 * `label` is what visitors see.
 */
export const RESIDENTIAL_PROPERTY_TYPE = 'Home';

/** Selected automatically when a visitor arrives from the commercial page CTA. */
export const COMMERCIAL_PROPERTY_TYPE = 'Commercial';

export const propertyTypes = [
  { value: RESIDENTIAL_PROPERTY_TYPE, label: 'Home' },
  { value: COMMERCIAL_PROPERTY_TYPE, label: 'Business or commercial property' },
  { value: 'HOA / community', label: 'HOA or townhome community' },
  { value: 'Apartment / multifamily', label: 'Apartment or multifamily community' },
  { value: 'Other', label: 'Other' },
] as const;

export type PropertyType = (typeof propertyTypes)[number]['value'];

export function isPropertyType(value: unknown): value is PropertyType {
  return typeof value === 'string' && propertyTypes.some((type) => type.value === value);
}
