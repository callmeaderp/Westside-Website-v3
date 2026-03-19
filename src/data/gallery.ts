/**
 * Gallery / portfolio items — drives the gallery page and lightbox.
 * Matches V2's 11-item grid with strategic spanning for visual variety.
 */

export interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  category: 'landscape-design' | 'hardscape' | 'maintenance' | 'holiday-lighting';
  caption: string;
  tag: string;
}

export const galleryCategories = [
  { value: 'all', label: 'All Projects' },
  { value: 'landscape-design', label: 'Landscape' },
  { value: 'hardscape', label: 'Hardscaping' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'holiday-lighting', label: 'Holiday' },
] as const;

export const gallery: GalleryItem[] = [
  // 1 — hero span (2×2)
  {
    id: 'landscape-tudor',
    image: 'svc-landscape-design.webp',
    alt: 'Tudor Home Landscape Renovation',
    category: 'landscape-design',
    tag: 'Landscape Design',
    caption: 'Tudor Home Landscape Renovation',
  },
  // 2
  {
    id: 'night-lighting',
    image: 'hero-home.webp',
    alt: 'Night Landscape Lighting Design',
    category: 'landscape-design',
    tag: 'Landscape Design',
    caption: 'Night Landscape Lighting Design',
  },
  // 3
  {
    id: 'show-garden',
    image: 'gallery-show-garden.webp',
    alt: 'Custom landscape design with water feature',
    category: 'landscape-design',
    tag: 'Landscape Design',
    caption: 'Show Garden Display',
  },
  // 4
  {
    id: 'pondless-waterfall',
    image: 'gallery-pondless-waterfall.webp',
    alt: 'Pondless waterfall feature surrounded by natural stone',
    category: 'landscape-design',
    tag: 'Landscape Design',
    caption: 'Pondless Waterfall & Stream',
  },
  // 5 — wide span (2 cols)
  {
    id: 'outdoor-kitchen',
    image: 'svc-hardscape.webp',
    alt: 'Outdoor Kitchen & Patio',
    category: 'hardscape',
    tag: 'Hardscaping',
    caption: 'Outdoor Kitchen & Patio',
  },
  // 6
  {
    id: 'drone-patio',
    image: 'gallery-drone-patio.webp',
    alt: 'Aerial view of custom patio and landscape design',
    category: 'hardscape',
    tag: 'Hardscaping',
    caption: 'Dusk Aerial — Custom Patio',
  },
  // 7
  {
    id: 'lit-patio',
    image: 'gallery-lit-patio.webp',
    alt: 'Illuminated patio and landscape at dusk',
    category: 'hardscape',
    tag: 'Hardscaping',
    caption: 'Accent-Lit Seat Wall & Patio',
  },
  // 8
  {
    id: 'commercial-striping',
    image: 'svc-maintenance.webp',
    alt: 'Commercial Lawn Striping',
    category: 'maintenance',
    tag: 'Maintenance',
    caption: 'Commercial Lawn Striping',
  },
  // 9
  {
    id: 'striped-colonial',
    image: 'gallery-striped-colonial.webp',
    alt: 'Pristine striped lawn on colonial property',
    category: 'maintenance',
    tag: 'Maintenance',
    caption: 'Residential Lawn Care',
  },
  // 10 — wide span (2 cols)
  {
    id: 'holiday-display',
    image: 'svc-holiday-lighting.webp',
    alt: 'Professional Holiday Display',
    category: 'holiday-lighting',
    tag: 'Holiday Lighting',
    caption: 'Professional Holiday Display',
  },
  // 11
  {
    id: 'holiday-festive',
    image: 'gallery-holiday-festive.webp',
    alt: 'Professional holiday lighting on residential home',
    category: 'holiday-lighting',
    tag: 'Holiday Lighting',
    caption: 'Festive Holiday Lighting',
  },
];
