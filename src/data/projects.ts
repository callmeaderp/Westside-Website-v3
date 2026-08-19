/**
 * Construction project case studies — drives /projects/ and the outdoor-living
 * hub proof section.
 *
 * Evidence rules (these are published claims about real work):
 *  - `image` must be a real Westside job photo from the organized marketing
 *    photo library, not stock and not AI;
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
  /** Optional "before" photo — only where a genuine before frame exists. */
  beforeImage?: string;
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
      'A new-build backyard dropped away from the house with nothing but bare grade behind the walkout — no usable flat surface and no reason to go outside after dinner.',
    solution:
      'We built the grade back up into a raised paver terrace held by a curved retaining wall, capped it with a bar-height counter and stool seating, and ran low-voltage lighting through the wall and step faces so the space works after dark.',
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
      'The homeowners entertained constantly but cooked on a rolling grill at the edge of the lawn, hauling everything in and out of the house each time.',
    solution:
      'A stone-faced kitchen run with a built-in grill, prep counter, and bar overhang, set on a large-format paver terrace with dedicated lighting on the working face and the seating side.',
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
      'A city backyard with an awkward shape and no defined gathering point — every layout the owners sketched fought the property lines.',
    solution:
      'A circular brick paver field solved the geometry: the radius ignores the lot lines entirely. A stone seat wall wraps the perimeter for permanent seating, with a grill station built into the wall run and planting beds softening the fence line.',
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
      'A deep lot where the interesting part of the yard sat far from the house, so the back half of the property went unused.',
    solution:
      'We anchored the near end with a brick paver patio and grill station, then ran a curved walk out to a pergola-covered destination at the far end — two outdoor rooms connected by a path instead of one stranded slab.',
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
      'A backyard that fell away from the house in one continuous slope — a single-level patio would have needed either a retaining wall taller than the owners wanted or a truckload of imported fill.',
    solution:
      'Two terraces at different elevations, linked by broad steps, follow the existing grade instead of fighting it. A stone seat wall encloses the upper level and gives the space a defined edge without a tall wall anywhere.',
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
      'A shaded, wooded lot where grass would never establish and the family only used the yard in the height of summer.',
    solution:
      'A paver terrace under the tree canopy gave them a surface that shade cannot kill, and a fire pit sized to its seating circle extended the usable season well into fall.',
    investmentBandId: 'patio-outdoor-room',
    relatedService: 'outdoor-kitchens',
  },
  {
    slug: 'front-entry-steps-wall-rebuild',
    title: 'Front Entry Rebuild — Steps, Landing, and Retaining Wall',
    image: 'proj-front-entry-after.webp',
    beforeImage: 'proj-front-entry-before.webp',
    alt: 'Rebuilt front entry with a paver landing, wide steps, a low retaining wall, and a fresh planting bed',
    year: 2020,
    category: 'walkways',
    categoryLabel: 'Walkway & Entry',
    problem:
      'Settled, out-of-level entry steps with a crumbling edge and an overgrown foundation bed — the first thing every visitor saw, and a genuine trip hazard.',
    solution:
      'We removed the failing steps, rebuilt on a compacted base with a wider paver landing and full-tread steps, held the grade change with a low block wall, and replanted the bed so the entry reads as one designed element.',
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
      'Guests parked in the driveway and cut across the lawn because the original walk took the long way around — a worn dirt track told the story.',
    solution:
      'We rebuilt the walk on the line people actually walk, widened it to let two people pass, added a contrasting soldier-course border, and rebuilt the foundation beds along the new curve.',
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
      'A long side-yard slope under mature trees that would not hold mulch, would not grow grass, and washed onto the walk every heavy rain.',
    solution:
      'A raised block wall with drainage stone and filter fabric behind it turned the slope into a level planted terrace. Shade-tolerant plantings hold the soil, and the wall stops the wash before it reaches the walk.',
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
      'A steep, hard-to-mow back corner that never grew decent grass and got no use at all.',
    solution:
      'A natural stone wall terraced the corner into a level pad, and a contoured SYNLawn putting surface with cups and fringe went over an engineered aggregate base. Nothing to mow, nothing to water, and it drains through.',
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
      'A tired shared courtyard between two buildings that tenants walked through but never stopped in, with failing walks and thin beds.',
    solution:
      'New paver walks on a commercial-duty base restored the circulation, seating and lighting made the space usable in the evening, and layered planting beds gave the courtyard the finish a shared amenity needs.',
    investmentBandId: 'landscape-renovation',
    relatedService: 'commercial-services',
  },
];
