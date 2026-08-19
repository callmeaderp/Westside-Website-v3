/**
 * Construction project examples — drives /projects/ and the outdoor-living hub
 * proof section.
 *
 * Evidence rules (these are published claims about real work):
 *  - `image` must be a real Westside job photo from the organized marketing
 *    photo library, not stock and not AI;
 *  - describe only visible features. Without the original proposal or job notes,
 *    do not invent the homeowner's original problem, hidden construction details,
 *    use patterns, or project outcome;
 *  - `town` is OPTIONAL and may only be set when the location is independently
 *    supported. Photo EXIF in the current library carries capture dates and
 *    camera models but NO GPS, so no town is asserted here. Omit rather than
 *    guess — a wrong town is a trust problem, and the honest alternative
 *    ("Greater Rochester") is already implied site-wide;
 *  - `year` comes from EXIF DateTimeOriginal on the source photo where present;
 *  - `investmentBandId` points at src/data/investment.ts. Never inline a price.
 */
import type { ServiceSlug } from './services';

export interface Project {
  slug: string;
  title: string;
  /** Photo filename resolved through getPhoto(). */
  image: string;
  /** Optional second completed-work view of the same project. */
  secondaryImage?: string;
  secondaryAlt?: string;
  alt: string;
  /** Municipality — set ONLY when provable. Omitted otherwise. */
  town?: string;
  /** Capture year from source photo EXIF, where available. */
  year?: number;
  category: 'patios' | 'walkways' | 'walls' | 'outdoor-kitchens' | 'drainage' | 'renovation' | 'turf';
  categoryLabel: string;
  problem: string;
  solution: string;
  /** Key of an entry in investmentBands. */
  investmentBandId: string;
  relatedService: ServiceSlug;
}

export const projectCategories = [
  { value: 'all', label: 'All Projects' },
  { value: 'patios', label: 'Patios' },
  { value: 'walkways', label: 'Walkways & Entries' },
  { value: 'walls', label: 'Retaining Walls' },
  { value: 'outdoor-kitchens', label: 'Kitchens & Fire' },
  { value: 'renovation', label: 'Renovations' },
  { value: 'turf', label: 'Turf & Greens' },
] as const;

export const projects: Project[] = [
  {
    slug: 'lit-bar-patio-outdoor-room',
    title: 'Raised Paver Patio with Lit Bar Seating',
    image: 'gallery-drone-patio.webp',
    alt: 'Raised paver patio at dusk with a stone bar counter, stools, and integrated wall lighting',
    category: 'patios',
    categoryLabel: 'Patio & Outdoor Living',
    problem:
      'A sloped backyard needed a level place for dining and gathering.',
    solution:
      'The finished project combines a raised paver terrace, curved wall, bar-height counter, stool seating, broad steps, and integrated lighting.',
    investmentBandId: 'patio-outdoor-room',
    relatedService: 'hardscaping',
  },
  {
    slug: 'stone-outdoor-kitchen-bar',
    title: 'Stone Outdoor Kitchen and Bar',
    image: 'proj-outdoor-kitchen-bar.webp',
    alt: 'Stone-faced outdoor kitchen and bar with built-in grill and warm accent lighting at dusk',
    year: 2022,
    category: 'outdoor-kitchens',
    categoryLabel: 'Outdoor Kitchen',
    problem:
      'The yard needed a permanent cooking and serving area integrated with its patio.',
    solution:
      'A stone-faced kitchen run brings together a built-in grill, prep counter, bar overhang, paver terrace, and warm task and accent lighting.',
    investmentBandId: 'outdoor-kitchen',
    relatedService: 'hardscaping',
  },
  {
    slug: 'circular-brick-patio-seat-wall',
    title: 'Circular Brick Patio with Seat Wall and Grill Station',
    image: 'proj-brick-patio-grill.webp',
    alt: 'Circular red brick paver patio ringed by a stone seat wall with a built-in grill station',
    year: 2019,
    category: 'patios',
    categoryLabel: 'Patio & Outdoor Living',
    problem:
      'The compact fenced yard called for a gathering space that fit the available geometry without feeling boxed in.',
    solution:
      'A circular brick paver field defines the room, with a curved stone seat wall, built-in grill station, and planted perimeter softening the fence line.',
    investmentBandId: 'patio-outdoor-room',
    relatedService: 'hardscaping',
  },
  {
    slug: 'pergola-patio-walkway-connection',
    title: 'Brick Patio, Pergola, and Connecting Walkway',
    image: 'proj-pergola-grill-patio.webp',
    alt: 'Brick paver patio with an outdoor grill station and a concrete walkway leading to a shaded pergola',
    year: 2019,
    category: 'patios',
    categoryLabel: 'Patio & Outdoor Living',
    problem:
      'The large yard needed a deliberate connection between the patio by the house and a second destination farther into the property.',
    solution:
      'A brick paver patio and grill station anchor the house end, while a curved walk leads to a separate pergola-covered gathering area.',
    investmentBandId: 'full-backyard',
    relatedService: 'hardscaping',
  },
  {
    slug: 'multi-level-patio-seat-wall',
    title: 'Multi-Level Paver Patio with Seat Wall',
    image: 'proj-multi-level-seat-wall.webp',
    alt: 'Multi-level paver patio with steps between levels and a stone seat wall enclosing the upper terrace',
    year: 2016,
    category: 'patios',
    categoryLabel: 'Patio & Outdoor Living',
    problem:
      'The grade changed continuously behind the house, so the design needed usable flat areas without one visually dominant wall.',
    solution:
      'Two paver terraces follow the slope at separate elevations, connected by broad steps and framed by a stone seat wall on the upper level.',
    investmentBandId: 'patio-outdoor-room',
    relatedService: 'hardscaping',
  },
  {
    slug: 'woodland-firepit-patio',
    title: 'Woodland Paver Patio with Fire Pit Seating',
    image: 'proj-woodland-firepit-patio.webp',
    alt: 'Paver patio in a wooded backyard with cushioned seating arranged around a fire pit',
    year: 2015,
    category: 'outdoor-kitchens',
    categoryLabel: 'Fire Feature',
    problem:
      'The wooded setting needed a durable gathering surface where shade made a conventional lawn impractical.',
    solution:
      'A paver terrace fits beneath the tree canopy, with a centered fire feature and room for a full seating circle.',
    investmentBandId: 'patio-outdoor-room',
    relatedService: 'outdoor-kitchens',
  },
  {
    slug: 'front-entry-steps-wall-rebuild',
    title: 'Front Entry Rebuild — Steps, Landing, and Retaining Wall',
    image: 'proj-front-entry-after.webp',
    secondaryImage: 'proj-front-entry-before.webp',
    secondaryAlt: 'Second completed view of the paver front entry from the driveway, showing broad steps and the low wall',
    alt: 'Rebuilt front entry with a paver landing, wide steps, a low retaining wall, and a fresh planting bed',
    year: 2020,
    category: 'walkways',
    categoryLabel: 'Walkway & Entry',
    problem:
      'The original entry combined settled steps, uneven edges, and overgrown planting beds in one highly visible area.',
    solution:
      'The rebuilt entry pairs a wider paver landing and broad steps with a low block wall and refreshed foundation planting.',
    investmentBandId: 'walkway-entry',
    relatedService: 'hardscaping',
  },
  {
    slug: 'front-walkway-planting-beds',
    title: 'Curved Front Walkway with New Foundation Beds',
    image: 'proj-front-walkway-beds.webp',
    alt: 'Wide curved paver walkway from driveway to front door beside newly planted foundation beds',
    year: 2019,
    category: 'walkways',
    categoryLabel: 'Walkway & Entry',
    problem:
      'The route from the driveway to the front door needed a clearer, wider approach tied into the surrounding landscape.',
    solution:
      'A broad curved paver walk uses a contrasting soldier-course border and follows the foundation beds into the entry.',
    investmentBandId: 'walkway-entry',
    relatedService: 'hardscaping',
  },
  {
    slug: 'stone-retaining-wall-shade-garden',
    title: 'Raised Stone Retaining Wall and Shade Garden',
    image: 'proj-retaining-wall-shade-garden.webp',
    alt: 'Long raised stone retaining wall creating a level planted shade garden beside a home',
    year: 2014,
    category: 'walls',
    categoryLabel: 'Retaining Wall',
    problem:
      'A long shaded side-yard slope needed a cleaner transition between the house, planted area, and lower walk.',
    solution:
      'A raised stone wall creates a level planting terrace beneath the mature trees and gives the garden a defined lower edge.',
    investmentBandId: 'retaining-wall',
    relatedService: 'hardscaping',
  },
  {
    slug: 'backyard-putting-green',
    title: 'Backyard Putting Green with Stone Wall Surround',
    image: 'proj-putting-green-wall.webp',
    alt: 'Contoured artificial putting green bordered by a natural stone wall and planted beds',
    category: 'turf',
    categoryLabel: 'Turf & Putting Green',
    problem:
      'A steep back corner needed to become a playable feature rather than unused grade.',
    solution:
      'A stone wall terraces the corner around a contoured SYNLawn putting surface with cups, fringe, and planted edges.',
    investmentBandId: 'artificial-turf',
    relatedService: 'artificial-grass',
  },
  {
    slug: 'commercial-courtyard-paver-plaza',
    title: 'Commercial Courtyard Paver Plaza',
    image: 'proj-commercial-courtyard.webp',
    alt: 'Lit commercial courtyard with paver walkways, seating, and planting beds in the evening',
    year: 2019,
    category: 'renovation',
    categoryLabel: 'Commercial Renovation',
    problem:
      'The shared courtyard needed clearer circulation and a more finished place for tenants and visitors to pause.',
    solution:
      'Paver walks organize the routes through the space, while seating, lighting, and layered planting beds complete the courtyard.',
    investmentBandId: 'landscape-renovation',
    relatedService: 'commercial-services',
  },
];
