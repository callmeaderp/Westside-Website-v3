/**
 * Representative investment bands for construction / outdoor-living work.
 *
 * These are deliberately BROAD planning ranges, not quotes. They exist so a
 * visitor can self-qualify before booking a site visit instead of bouncing to
 * a competitor who published numbers. Every band renders next to
 * `INVESTMENT_CAVEAT` — do not surface a band without it.
 *
 * Sourcing rules for anything added here:
 *  - anchor on published Greater Rochester market ranges, then keep bands broad
 *    enough for Westside's project mix; never copy a competitor's guarantee,
 *    promotion, or per-unit price as if it were ours;
 *  - keep the low end genuinely reachable and the high end open-ended where
 *    scope has no natural ceiling (`openEnded: true` renders a trailing "+");
 *  - band boundaries must stay internally consistent — a walkway cannot start
 *    above a full patio, and a bundled project must not undercut its parts.
 */

export interface InvestmentBand {
  /** Stable key used by service pages and the contact form budget select. */
  id: string;
  /** Short scope label, e.g. "Paver patio". */
  label: string;
  /** What a project at this size typically includes. */
  scope: string;
  low: number;
  high: number;
  /** Render the high end as "$X+" — scope has no natural ceiling. */
  openEnded?: boolean;
}

export const INVESTMENT_CAVEAT =
  'Ranges are planning figures based on published Greater Rochester market pricing, not quotes or a promise that every project will fall within them. Westside’s written estimate controls. Site conditions, access, excavation and disposal, base depth, material selection, wall engineering, lighting, and design complexity all move the final number.';

/** Formats a band as "$8,000–$20,000" or "$40,000+". */
export function formatBand(band: InvestmentBand): string {
  const money = (n: number) => `$${n.toLocaleString('en-US')}`;
  return band.openEnded ? `${money(band.low)}+` : `${money(band.low)}–${money(band.high)}`;
}

export const investmentBands: InvestmentBand[] = [
  {
    id: 'walkway-entry',
    label: 'Front walkway & entry steps',
    scope: 'Replacing a failing walk and entry landing with a properly based paver or natural-stone walk, new steps, and refreshed foundation beds.',
    low: 7500,
    high: 16000,
  },
  {
    id: 'patio-small',
    label: 'Compact paver patio',
    scope: 'A right-sized seating patio, roughly the footprint of a dining set and grill, with full base work, edge restraint, and polymeric jointing.',
    low: 9000,
    high: 20000,
  },
  {
    id: 'patio-outdoor-room',
    label: 'Patio with seat wall or fire feature',
    scope: 'A larger patio built as an outdoor room: seating walls or pillars, a fire pit or fire table, steps where grade requires them, and low-voltage lighting.',
    low: 18000,
    high: 45000,
  },
  {
    id: 'outdoor-kitchen',
    label: 'Outdoor kitchen or fireplace',
    scope: 'A masonry cooking or gathering feature such as a stone bar and counter, built-in grill, utility runs, or a full outdoor fireplace, usually built with or onto a patio.',
    low: 15000,
    high: 60000,
    openEnded: true,
  },
  {
    id: 'retaining-wall',
    label: 'Retaining wall',
    scope: 'Engineered segmental block, natural stone, or boulder wall with drainage stone, filter fabric, and compacted backfill. Height, length, and what the wall holds back drive the cost.',
    low: 12000,
    high: 65000,
  },
  {
    id: 'drainage-grading',
    label: 'Drainage & grading',
    scope: 'French drains, catch basins, downspout tie-ins, dry creek beds, swales, and regrading to move water away from the foundation.',
    low: 1800,
    high: 12000,
    openEnded: true,
  },
  {
    id: 'landscape-renovation',
    label: 'Landscape renovation',
    scope: 'Removing tired, overgrown plantings and rebuilding the beds with a new design, soil work, edging, plant material, mulch, and repair of the surrounding lawn.',
    low: 5000,
    high: 30000,
    openEnded: true,
  },
  {
    id: 'artificial-turf',
    label: 'Artificial turf or putting green',
    scope: 'SYNLawn turf over an engineered aggregate base for pet areas, small lawns, and backyard putting greens with cups, fringe, and contouring.',
    low: 8000,
    high: 40000,
  },
  {
    id: 'full-backyard',
    label: 'Full backyard transformation',
    scope: 'A whole-yard build combining patio, walls, drainage, plantings, and lighting on one schedule, phased when that suits your budget better.',
    low: 45000,
    high: 150000,
    openEnded: true,
  },
];

const bandsById = new Map(investmentBands.map((b) => [b.id, b]));

export function getBand(id: string): InvestmentBand {
  const band = bandsById.get(id);
  if (!band) {
    throw new Error(`Unknown investment band: ${id}. Known: ${[...bandsById.keys()].join(', ')}`);
  }
  return band;
}

export function getBands(ids: string[]): InvestmentBand[] {
  return ids.map(getBand);
}

/**
 * Budget options offered on the contact form. Deliberately coarser than the
 * scope bands above — a homeowner picking a range before a site visit is
 * signalling comfort level, not costing the project.
 */
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

/**
 * Project-type options for the contact form. Values are stored verbatim in the
 * notification email and GA4/Meta parameters, so keep them human-readable.
 */
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

// Internal consistency guards — a band with a crossed or nonsensical range is a
// content bug that would otherwise ship silently into published pricing.
investmentBands.forEach((band) => {
  if (band.low <= 0 || band.high <= band.low) {
    throw new Error(`Investment band "${band.id}" has an invalid range: ${band.low}–${band.high}`);
  }
});
