/**
 * Service definitions — drives service pages, nav, cards, and structured data.
 * Each service generates /services/[slug] via dynamic routing.
 */
import { z } from 'zod';

/** All valid service slugs — used for type-safe routing and content lookups. */
export const SERVICE_SLUGS = [
  'landscape-design',
  'landscape-maintenance',
  'lawn-care',
  'plant-health',
  'hardscaping',
  'walkways-steps',
  'retaining-walls',
  'outdoor-kitchens',
  'drainage-grading',
  'water-features',
  'snow-ice-management',
  'artificial-grass',
  'commercial-services',
  'holiday-lighting',
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

const ServiceSchema = z.object({
  slug: z.enum(SERVICE_SLUGS),
  name: z.string(),
  shortName: z.string(),
  tagline: z.string(),
  description: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  heroLabel: z.string(),
  heroHeading: z.string(),
  heroIntro: z.string(),
  heroImage: z.string(),
  cardImage: z.string(),
  icon: z.string(),
  features: z.array(z.string()),
  cta: z.string().default('Get a Free Estimate'),
  /**
   * 'core' services drive the homepage grid and the main services list.
   * 'construction' services are focused build lanes that hang off the
   * hardscaping hub — they get full pages and nav entries, but listing all of
   * them on the homepage would bury the primary offering.
   */
  tier: z.enum(['core', 'construction']).default('core'),
});

export type Service = z.infer<typeof ServiceSchema>;

export const services: Service[] = [
  {
    slug: 'landscape-design',
    name: 'Landscape Design & Installation',
    shortName: 'Landscape Design',
    tagline: 'From concept to completion',
    description:
      'Custom landscape design tailored to your property, lifestyle, and budget. From concept sketches to completed installations.',
    metaTitle: 'Landscape Design & Installation in Rochester, NY | Westside',
    metaDescription:
      'Rochester landscape design and installation — residential & commercial. Plantings, patios, grading, lighting, concept to full install. Call (585) 594-8420.',
    heroLabel: 'Design & Installation',
    heroHeading: 'LANDSCAPE DESIGN IN ROCHESTER, NY',
    heroIntro:
      'Custom landscape design tailored to your property, lifestyle, and budget. From concept sketches to completed installations.',
    heroImage: 'svc-landscape-design.webp',
    cardImage: 'svc-landscape-design.webp',
    icon: 'PenTool',
    features: [
      'Custom design consultations',
      'Property assessment & site analysis',
      'Planting design & installation',
      'Grading & drainage solutions',
      'Outdoor lighting design',
      'Seasonal color planning',
    ],
    cta: 'Get a Free Estimate',
    tier: 'core',
  },
  {
    slug: 'landscape-maintenance',
    name: 'Landscape Maintenance',
    shortName: 'Maintenance',
    tagline: 'Year-round care for your property',
    description:
      'Consistent, reliable maintenance that keeps your property looking its best through every season.',
    metaTitle: 'Landscape Maintenance in Rochester, NY | Westside Professional Landscape',
    metaDescription:
      'Professional landscape maintenance in Rochester, NY — weekly mowing, seasonal cleanups, mulching, pruning, and bed care. Residential and commercial. Call (585) 594-8420.',
    heroLabel: 'Year-Round Care',
    heroHeading: 'LANDSCAPE MAINTENANCE IN ROCHESTER, NY',
    heroIntro:
      'Consistent, reliable maintenance that keeps your property looking its best through every season.',
    heroImage: 'svc-maintenance.webp',
    cardImage: 'svc-maintenance.webp',
    icon: 'Leaf',
    features: [
      'Weekly mowing & edging',
      'Spring & fall cleanups',
      'Mulching & bed maintenance',
      'Shrub & hedge pruning',
      'Weed control in beds',
      'Seasonal flower rotations',
    ],
    cta: 'Get a Free Estimate',
    tier: 'core',
  },
  {
    slug: 'lawn-care',
    name: 'Lawn Care',
    shortName: 'Lawn Care',
    tagline: 'Complete lawn care for Rochester homes',
    description:
      'Mowing, fertilization, weed control, aeration, overseeding, grub protection, and lawn repair — a full lawn care program for Greater Rochester properties.',
    metaTitle: 'Lawn Care in Rochester, NY | Westside Professional Landscape',
    metaDescription:
      'Complete lawn care in Rochester, NY — mowing, 5-step fertilization, weed control, aeration, overseeding, grub control, and lawn repair. Serving Monroe County since 2000. Call (585) 594-8420.',
    heroLabel: 'Complete Lawn Care',
    heroHeading: 'LAWN CARE IN ROCHESTER, NY',
    heroIntro:
      'Mowing, fertilization, weed control, aeration, and repair — everything your lawn needs to stay thick, green, and healthy through every Rochester season.',
    heroImage: 'lawn-lush-backyard.webp',
    cardImage: 'lawn-lush-backyard.webp',
    icon: 'Sprout',
    features: [
      'Weekly mowing, edging & trimming',
      '5-step fertilization & weed control',
      'Core aeration & overseeding',
      'Grub prevention & treatment',
      'Spring & fall cleanups',
      'Lawn repair & renovation',
    ],
    cta: 'Get a Free Lawn Care Quote',
    tier: 'core',
  },
  {
    slug: 'plant-health',
    name: 'Fertilization & Weed Control',
    shortName: 'Fertilization & Weed Control',
    tagline: 'Science-backed lawn care',
    description:
      "Westside's 5-Step Fertilization & Weed Control Program — 50% off your first treatment. NYS DEC certified applicators.",
    metaTitle: 'Lawn Fertilization & Weed Control in Rochester, NY | 50% Off',
    metaDescription:
      "Westside's 5-Step Fertilization & Weed Control Program — 50% off your first treatment. Fertilization, weed control, grub protection included. NYS DEC certified. Rochester, NY.",
    heroLabel: 'Lawn Care Program',
    heroHeading: 'LAWN FERTILIZATION & WEED CONTROL IN ROCHESTER, NY',
    heroIntro:
      'Five precisely timed seasonal applications for a lush, healthy lawn you can be proud of. 50% off your first treatment — just $58 for the average lawn.',
    heroImage: 'hero-plant-health.webp',
    cardImage: 'svc-plant-health.webp',
    icon: 'Sprout',
    features: [
      'Early spring crabgrass prevention + fertilizer',
      'Late spring broadleaf weed treatment',
      'Summer fertilization + targeted weed control',
      'Early fall winterizer fertilizer',
      'Late fall final feed + weed prevention',
      'Free grub control included',
    ],
    cta: 'Start Your Program — 50% Off',
    tier: 'core',
  },
  {
    slug: 'hardscaping',
    name: 'Hardscaping & Outdoor Living',
    shortName: 'Hardscaping',
    tagline: 'Built to last',
    description:
      'Patios, retaining walls, walkways, fire pits, and outdoor kitchens — designed and built by experienced craftsmen.',
    metaTitle: 'Paver Patios & Outdoor Living in Rochester, NY | Cost Ranges',
    metaDescription:
      'Paver patios, walkways, retaining walls, fire features & outdoor kitchens in Rochester, NY. See representative project investment ranges. Building since 2000. (585) 594-8420.',
    heroLabel: 'Built to Last',
    heroHeading: 'HARDSCAPING & OUTDOOR LIVING IN ROCHESTER',
    heroIntro:
      'Paver patios, retaining walls, walkways, fire features, and outdoor kitchens — designed and built for our freeze-thaw climate. See what projects like yours typically run before you call.',
    heroImage: 'hero-outdoor-living.webp',
    cardImage: 'svc-hardscape.webp',
    icon: 'Blocks',
    features: [
      'Paver patios & outdoor rooms',
      'Retaining & seat walls',
      'Walkways, steps & front entries',
      'Outdoor kitchens & fire features',
      'Driveways & parking areas',
      'Drainage & grading built in',
    ],
    cta: 'Start Your Project',
    tier: 'core',
  },
  {
    slug: 'walkways-steps',
    name: 'Walkways, Steps & Front Entries',
    shortName: 'Walkways & Entries',
    tagline: 'The first thing anyone sees',
    description:
      'Paver and natural-stone walkways, entry landings, and steps — rebuilt level, safe, and properly based for Rochester winters.',
    metaTitle: 'Paver Walkways, Steps & Front Entries in Rochester, NY | Westside',
    metaDescription:
      'Rochester paver walkways, entry landings, and stone steps. Settled or unsafe steps rebuilt on a proper base. Typical projects and cost ranges. Call (585) 594-8420.',
    heroLabel: 'Curb Appeal & Safety',
    heroHeading: 'WALKWAYS, STEPS & FRONT ENTRIES IN ROCHESTER',
    heroIntro:
      'Settled steps and a cracked walk are the first thing every visitor notices — and the fastest hardscape project to turn around. Rebuilt level, safe, and on a base that survives our winters.',
    heroImage: 'svc-walkways-steps.webp',
    cardImage: 'svc-walkways-steps.webp',
    icon: 'Footprints',
    features: [
      'Paver & natural stone walkways',
      'Entry landings & wide steps',
      'Settled step replacement',
      'Garden paths & stepping stones',
      'Contrasting borders & banding',
      'Path lighting integration',
    ],
    cta: 'Get a Free Estimate',
    tier: 'construction',
  },
  {
    slug: 'retaining-walls',
    name: 'Retaining & Seat Walls',
    shortName: 'Retaining Walls',
    tagline: 'Engineered to hold',
    description:
      'Segmental block, natural stone, and boulder retaining walls with the drainage and backfill that keep them standing.',
    metaTitle: 'Retaining Wall Contractor in Rochester, NY | Costs & Repair',
    metaDescription:
      'Rochester retaining walls — segmental block, natural stone, and boulder walls built with proper drainage and backfill. Failing wall repair. Cost ranges. (585) 594-8420.',
    heroLabel: 'Structural Hardscape',
    heroHeading: 'RETAINING & SEAT WALLS IN ROCHESTER, NY',
    heroIntro:
      'A retaining wall is a structure, not a decoration. Drainage stone, filter fabric, compacted backfill, and the right block for the load are what separate a wall that lasts from one that leans in five years.',
    heroImage: 'svc-retaining-walls.webp',
    cardImage: 'svc-retaining-walls.webp',
    icon: 'Layers',
    features: [
      'Engineered segmental block walls',
      'Natural stone & boulder walls',
      'Seat walls & pillars',
      'Terraced multi-level walls',
      'Failing wall assessment & rebuild',
      'Drainage stone & filter fabric standard',
    ],
    cta: 'Get a Free Estimate',
    tier: 'construction',
  },
  {
    slug: 'outdoor-kitchens',
    name: 'Outdoor Kitchens & Fire Features',
    shortName: 'Kitchens & Fire',
    tagline: 'Where the evening happens',
    description:
      'Built-in grills, stone bars and counters, fire pits, fire tables, and full outdoor fireplaces built into your patio.',
    metaTitle: 'Outdoor Kitchens, Fire Pits & Fireplaces in Rochester, NY',
    metaDescription:
      'Rochester outdoor kitchens, stone bars, built-in grills, fire pits, and outdoor fireplaces. Built with your patio or added to one. Cost ranges. Call (585) 594-8420.',
    heroLabel: 'Outdoor Living',
    heroHeading: 'OUTDOOR KITCHENS & FIRE FEATURES IN ROCHESTER',
    heroIntro:
      'A fire feature adds weeks to each end of the Rochester outdoor season, and a built-in kitchen means you stop carrying everything in and out. Both are best planned with the patio, not bolted on later.',
    heroImage: 'svc-outdoor-kitchens.webp',
    cardImage: 'svc-outdoor-kitchens.webp',
    icon: 'Flame',
    features: [
      'Stone bars & prep counters',
      'Built-in grills & appliance cutouts',
      'Wood & gas fire pits',
      'Full outdoor fireplaces',
      'Utility & gas line coordination',
      'Task and accent lighting',
    ],
    cta: 'Get a Free Estimate',
    tier: 'construction',
  },
  {
    slug: 'drainage-grading',
    name: 'Drainage & Grading',
    shortName: 'Drainage & Grading',
    tagline: 'Move the water first',
    description:
      'French drains, catch basins, downspout tie-ins, dry creek beds, and regrading that move water away from your foundation.',
    metaTitle: 'Yard Drainage & Grading in Rochester, NY | French Drains',
    metaDescription:
      'Rochester yard drainage and grading — French drains, catch basins, downspout tie-ins, dry creek beds, regrading. Fix standing water and wet basements. (585) 594-8420.',
    heroLabel: 'Water Management',
    heroHeading: 'DRAINAGE & GRADING IN ROCHESTER, NY',
    heroIntro:
      "Rochester's clay soils, flat lots, and freeze-thaw cycles put water where you don't want it. Drainage is the least glamorous work we do and the most likely to protect everything else on your property.",
    heroImage: 'svc-drainage-grading.webp',
    cardImage: 'svc-drainage-grading.webp',
    icon: 'Droplets',
    features: [
      'French drains & curtain drains',
      'Catch basins & yard inlets',
      'Downspout & sump discharge tie-ins',
      'Dry creek beds & swales',
      'Foundation-protection regrading',
      'Drainage designed into hardscape',
    ],
    cta: 'Get a Free Estimate',
    tier: 'construction',
  },
  {
    slug: 'water-features',
    name: 'Water Features',
    shortName: 'Water Features',
    tagline: 'Serenity by design',
    description:
      'Custom ponds, waterfalls, fountains, and streams that bring the sound and beauty of water to your landscape.',
    metaTitle: 'Water Features in Rochester, NY | Westside Professional Landscape',
    metaDescription:
      'Custom water features in Rochester, NY — ponds, waterfalls, fountains, streams, and koi ponds. Design, installation, and maintenance. Serving Monroe County since 2000. Call (585) 594-8420.',
    heroLabel: 'Serenity by Design',
    heroHeading: 'WATER FEATURES IN ROCHESTER, NY',
    heroIntro:
      'Custom ponds, waterfalls, fountains, and streams that bring the sound and beauty of water to your landscape.',
    heroImage: 'svc-water-features.webp',
    cardImage: 'svc-water-features.webp',
    icon: 'Waves',
    features: [
      'Pondless waterfalls',
      'Koi & fish ponds',
      'Decorative fountains',
      'Natural streams',
      'Water garden design',
      'Maintenance & winterization',
    ],
    cta: 'Get a Free Estimate',
    tier: 'core',
  },
  {
    slug: 'snow-ice-management',
    name: 'Snow & Ice Management',
    shortName: 'Snow & Ice',
    tagline: 'Commercial winter protection',
    description:
      "Commercial snow and ice management tailored to your property. Keeping parking lots, walkways, and entrances accessible through Rochester's winters.",
    metaTitle: 'Snow & Ice Management in Rochester, NY | Westside Professional Landscape',
    metaDescription:
      'Commercial snow plowing and ice management in Rochester, NY. Seasonal contracts, de-icing, and walkway clearing throughout Monroe County.',
    heroLabel: 'Winter Services',
    heroHeading: 'SNOW & ICE MANAGEMENT IN ROCHESTER, NY',
    heroIntro:
      "Commercial snow and ice management planned around your property's trigger depths, service priorities, and winter access needs.",
    heroImage: 'svc-snow.webp',
    cardImage: 'svc-snow.webp',
    icon: 'Snowflake',
    features: [
      'Contract-based response plans',
      'Commercial plowing & removal',
      'Sidewalk & walkway clearing',
      'De-icing & salt application',
      'Seasonal contracts',
      'Event & on-call services',
    ],
    cta: 'Get a Free Estimate',
    tier: 'core',
  },
  {
    slug: 'artificial-grass',
    name: 'Artificial Grass',
    shortName: 'Artificial Grass',
    tagline: 'Year-round green, zero maintenance',
    description:
      'Authorized SYNLawn dealer — premium artificial turf installation for residential and commercial properties in Rochester, NY.',
    metaTitle: 'Artificial Grass & Turf Installation in Rochester, NY | SYNLawn',
    metaDescription:
      'Authorized SYNLawn dealer serving Rochester, NY. Premium artificial turf installation for lawns, pet areas, putting greens, and commercial landscapes. Call (585) 594-8420.',
    heroLabel: 'SYNLawn Authorized Dealer',
    heroHeading: 'ARTIFICIAL GRASS INSTALLATION IN ROCHESTER, NY',
    heroIntro:
      'Premium SYNLawn artificial turf — professionally installed for a lush, green lawn year-round with virtually zero maintenance.',
    heroImage: 'svc-artificial-turf.webp',
    cardImage: 'svc-artificial-turf.webp',
    icon: 'Sprout',
    features: [
      'SYNLawn authorized dealer',
      'Residential & commercial installation',
      'Pet-friendly turf options',
      'Putting greens & sport turf',
      'Professional base preparation',
      'Manufacturer-backed warranties',
    ],
    cta: 'Get a Free Estimate',
    tier: 'core',
  },
  {
    slug: 'commercial-services',
    name: 'Commercial Services',
    shortName: 'Commercial',
    tagline: 'Grounds management for business',
    description:
      'Full-service commercial landscape maintenance, snow management, and property care for businesses across Greater Rochester.',
    metaTitle: 'Commercial Landscaping Company in Rochester, NY | Westside',
    metaDescription:
      'Commercial landscaping company in Rochester, NY: landscape maintenance, snow & ice management, and grounds care for Monroe County businesses since 2000. (585) 594-8420.',
    heroLabel: 'Commercial Grounds Management',
    heroHeading: 'COMMERCIAL LANDSCAPING IN ROCHESTER, NY',
    heroIntro:
      'Full-service grounds management for commercial properties — landscape maintenance, snow and ice management, and seasonal services from a single provider.',
    heroImage: 'hero-services.webp',
    cardImage: 'hero-services.webp',
    icon: 'Building2',
    features: [
      'Commercial landscape maintenance',
      'Snow & ice management',
      'Seasonal color & bed care',
      'Irrigation management',
      'Turf care programs',
      'Single-provider convenience',
    ],
    cta: 'Get a Free Estimate',
    tier: 'core',
  },
  {
    slug: 'holiday-lighting',
    name: 'Holiday Decorating & Lighting',
    shortName: 'Holiday Decorating',
    tagline: 'Seasonal magic',
    description:
      'Professional holiday lighting design, installation, and removal. Enjoy the season while your property shines.',
    metaTitle: 'Holiday Decorating & Lighting in Rochester, NY | Westside Professional Landscape',
    metaDescription:
      'Professional holiday lighting and decorating in Rochester, NY — custom designs, installation, maintenance, and removal for homes and businesses. Call (585) 594-8420.',
    heroLabel: 'Seasonal Magic',
    heroHeading: 'HOLIDAY DECORATING & LIGHTING IN ROCHESTER, NY',
    heroIntro:
      'Professional holiday lighting design, installation, and removal. Enjoy the season while your property shines.',
    heroImage: 'svc-holiday-lighting.webp',
    cardImage: 'svc-holiday-lighting.webp',
    icon: 'Sparkles',
    features: [
      'Custom lighting design',
      'Professional installation',
      'Commercial & residential',
      'Wreaths & garland',
      'Maintenance & bulb replacement',
      'Post-season takedown & storage',
    ],
    cta: 'Get a Free Estimate',
    tier: 'core',
  },
];

// Validate all services at import time
services.forEach((s) => {
  ServiceSchema.parse(s);
});

export function getServiceBySlug(slug: ServiceSlug): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Primary offering — homepage grid and the top of the services index. */
export const coreServices = services.filter((s) => s.tier === 'core');

/** Focused build lanes that hang off the hardscaping hub. */
export const constructionServices = services.filter((s) => s.tier === 'construction');
