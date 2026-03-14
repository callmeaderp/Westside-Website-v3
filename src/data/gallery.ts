/**
 * Gallery / portfolio items — drives the gallery page and lightbox.
 */

export interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  category: 'landscape' | 'hardscape' | 'water-feature' | 'lighting' | 'maintenance' | 'commercial';
  caption?: string;
  featured?: boolean;
}

export const galleryCategories = [
  { value: 'all', label: 'All Projects' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'hardscape', label: 'Hardscaping' },
  { value: 'water-feature', label: 'Water Features' },
  { value: 'lighting', label: 'Holiday Lighting' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'commercial', label: 'Commercial' },
] as const;

export const gallery: GalleryItem[] = [
  {
    id: 'drone-patio',
    image: 'gallery-drone-patio.webp',
    alt: 'Aerial view of custom patio and landscape design',
    category: 'hardscape',
    caption: 'Custom patio with landscape surround',
    featured: true,
  },
  {
    id: 'show-garden',
    image: 'gallery-show-garden.webp',
    alt: 'Award-winning landscape design with water feature',
    category: 'landscape',
    caption: 'Show garden landscape installation',
    featured: true,
  },
  {
    id: 'striped-colonial',
    image: 'gallery-striped-colonial.webp',
    alt: 'Pristine striped lawn on colonial property',
    category: 'maintenance',
    caption: 'Professional lawn maintenance',
    featured: true,
  },
  {
    id: 'pondless-waterfall',
    image: 'gallery-pondless-waterfall.webp',
    alt: 'Pondless waterfall feature surrounded by natural stone',
    category: 'water-feature',
    caption: 'Pondless waterfall installation',
    featured: true,
  },
  {
    id: 'holiday-festive',
    image: 'gallery-holiday-festive.webp',
    alt: 'Professional holiday lighting on residential home',
    category: 'lighting',
    caption: 'Holiday decorating and lighting',
  },
  {
    id: 'lit-patio',
    image: 'gallery-lit-patio.webp',
    alt: 'Illuminated patio and landscape at dusk',
    category: 'hardscape',
    caption: 'Patio with landscape lighting',
  },
];
