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
  // Hero span (2×2).
  {
    id: 'landscape-tudor',
    image: 'svc-landscape-design.webp',
    alt: 'Tudor Home Landscape Renovation',
    category: 'landscape-design',
    tag: 'Landscape Design',
    caption: 'Tudor Home Landscape Renovation',
  },
  {
    id: 'night-lighting',
    image: 'hero-home.webp',
    alt: 'Night Landscape Lighting Design',
    category: 'landscape-design',
    tag: 'Landscape Design',
    caption: 'Night Landscape Lighting Design',
  },
  {
    id: 'show-garden',
    image: 'gallery-show-garden.webp',
    alt: 'Custom landscape design with water feature',
    category: 'landscape-design',
    tag: 'Landscape Design',
    caption: 'Show Garden Display',
  },
  {
    id: 'pondless-waterfall',
    image: 'gallery-pondless-waterfall.webp',
    alt: 'Pondless waterfall feature surrounded by natural stone',
    category: 'landscape-design',
    tag: 'Landscape Design',
    caption: 'Pondless Waterfall & Stream',
  },
  // Wide span (2 cols).
  {
    id: 'outdoor-kitchen',
    image: 'svc-hardscape.webp',
    alt: 'Outdoor Kitchen & Patio',
    category: 'hardscape',
    tag: 'Hardscaping',
    caption: 'Outdoor Kitchen & Patio',
  },
  {
    id: 'drone-patio',
    image: 'gallery-drone-patio.webp',
    alt: 'Aerial view of custom patio and landscape design',
    category: 'hardscape',
    tag: 'Hardscaping',
    caption: 'Custom Patio from Above at Dusk',
  },
  {
    id: 'lit-patio',
    image: 'gallery-lit-patio.webp',
    alt: 'Illuminated patio and landscape at dusk',
    category: 'hardscape',
    tag: 'Hardscaping',
    caption: 'Accent-Lit Seat Wall & Patio',
  },
  {
    id: 'commercial-striping',
    image: 'svc-maintenance.webp',
    alt: 'Commercial Lawn Striping',
    category: 'maintenance',
    tag: 'Maintenance',
    caption: 'Commercial Lawn Striping',
  },
  {
    id: 'striped-colonial',
    image: 'gallery-striped-colonial.webp',
    alt: 'Pristine striped lawn on colonial property',
    category: 'maintenance',
    tag: 'Maintenance',
    caption: 'Residential Lawn Care',
  },
  // Wide span (2 cols).
  {
    id: 'holiday-display',
    image: 'svc-holiday-lighting.webp',
    alt: 'Professional Holiday Display',
    category: 'holiday-lighting',
    tag: 'Holiday Lighting',
    caption: 'Professional Holiday Display',
  },
  {
    id: 'holiday-festive',
    image: 'gallery-holiday-festive.webp',
    alt: 'Professional holiday lighting on residential home',
    category: 'holiday-lighting',
    tag: 'Holiday Lighting',
    caption: 'Festive Holiday Lighting',
  },
];
