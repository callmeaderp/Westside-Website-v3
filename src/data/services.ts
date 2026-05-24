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
});

export type Service = z.infer<typeof ServiceSchema>;

export const services: Service[] = [
  {
    slug: 'landscape-design',
    name: 'Landscape Design & Installation',
    shortName: 'Landscape Design',
    tagline: 'From concept to completion',
    description:
      'Custom landscape architecture tailored to your property, lifestyle, and budget. From concept sketches to completed installations.',
    metaTitle: 'Landscape Design & Installation in Rochester, NY | Westside Professional Landscape',
    metaDescription:
      'Custom landscape design and installation in Rochester, NY. From concept sketches to full installations — patios, plantings, grading, and lighting. Serving Monroe County since 2000. Call (585) 594-8420.',
    heroLabel: 'Design & Installation',
    heroHeading: 'LANDSCAPE DESIGN IN ROCHESTER, NY',
    heroIntro:
      'Custom landscape architecture tailored to your property, lifestyle, and budget. From concept sketches to completed installations.',
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
  },
  {
    slug: 'plant-health',
    name: 'Fertilization & Weed Control',
    shortName: 'Fertilization & Weed Control',
    tagline: 'Science-backed lawn care',
    description:
      "Westside's 5-Step Fertilization & Weed Control Program — 50% off your first treatment. NYS DEC certified applicators.",
    metaTitle: 'Lawn Fertilization & Weed Control in Rochester, NY | Westside Professional Landscape',
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
  },
  {
    slug: 'hardscaping',
    name: 'Hardscaping & Outdoor Living',
    shortName: 'Hardscaping',
    tagline: 'Built to last',
    description:
      'Patios, retaining walls, walkways, fire pits, and outdoor kitchens — designed and built by experienced craftsmen.',
    metaTitle: 'Hardscaping & Outdoor Living in Rochester, NY | Westside Professional Landscape',
    metaDescription:
      'Expert hardscaping services in Rochester, NY — patios, retaining walls, walkways, outdoor kitchens, fire pits, and driveways. Built to last by Westside Professional Landscape. Call (585) 594-8420.',
    heroLabel: 'Built to Last',
    heroHeading: 'HARDSCAPING & OUTDOOR LIVING IN ROCHESTER',
    heroIntro:
      'Patios, retaining walls, walkways, fire pits, and outdoor kitchens — designed and built by experienced craftsmen.',
    heroImage: 'svc-hardscape.webp',
    cardImage: 'svc-hardscape.webp',
    icon: 'Blocks',
    features: [
      'Paver patios & walkways',
      'Retaining walls',
      'Outdoor kitchens & living spaces',
      'Fire pits & fireplaces',
      'Driveway installation',
      'Steps & stairways',
    ],
    cta: 'Get a Free Estimate',
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
  },
  {
    slug: 'snow-ice-management',
    name: 'Snow & Ice Management',
    shortName: 'Snow & Ice',
    tagline: '24/7 winter protection',
    description:
      "24/7 commercial snow and ice management. Keeping your property safe, accessible, and compliant through Rochester's winters.",
    metaTitle: 'Snow & Ice Management in Rochester, NY | Westside Professional Landscape',
    metaDescription:
      '24/7 commercial snow plowing and ice management in Rochester, NY. Seasonal contracts, de-icing, walkway clearing. Serving Monroe County since 2000. Call (585) 594-8420.',
    heroLabel: 'Winter Services',
    heroHeading: 'SNOW & ICE MANAGEMENT IN ROCHESTER, NY',
    heroIntro:
      "24/7 commercial snow and ice management. Keeping your property safe, accessible, and compliant through Rochester's winters.",
    heroImage: 'svc-snow.webp',
    cardImage: 'svc-snow.webp',
    icon: 'Snowflake',
    features: [
      '24/7 emergency response',
      'Commercial plowing & removal',
      'Sidewalk & walkway clearing',
      'De-icing & salt application',
      'Seasonal contracts',
      'Event & on-call services',
    ],
    cta: 'Get a Free Estimate',
  },
  {
    slug: 'artificial-grass',
    name: 'Artificial Grass',
    shortName: 'Artificial Grass',
    tagline: 'Year-round green, zero maintenance',
    description:
      'Authorized SYNLawn dealer — premium artificial turf installation for residential and commercial properties in Rochester, NY.',
    metaTitle: 'Artificial Grass Installation in Rochester, NY | SYNLawn Dealer | Westside Professional Landscape',
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
  },
  {
    slug: 'commercial-services',
    name: 'Commercial Services',
    shortName: 'Commercial',
    tagline: 'Grounds management for business',
    description:
      'Full-service commercial landscape maintenance, snow management, and property care for businesses across Greater Rochester.',
    metaTitle: 'Commercial Landscaping Services in Rochester, NY | Westside Professional Landscape',
    metaDescription:
      'Commercial landscape maintenance, snow removal, and grounds management in Rochester, NY. Experienced crews serving businesses across Monroe County since 2000. Call (585) 594-8420.',
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
  },
];

// Validate all services at import time
services.forEach((s) => {
  ServiceSchema.parse(s);
});

export function getServiceBySlug(slug: ServiceSlug): Service | undefined {
  return services.find((s) => s.slug === slug);
}
