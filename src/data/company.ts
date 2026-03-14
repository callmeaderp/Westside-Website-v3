/**
 * Company-wide constants — single source of truth for business information.
 * Used by structured data, footer, contact page, meta tags, etc.
 */

export const company = {
  name: 'Westside Professional Landscape',
  legalName: 'Westside Professional Landscape, Inc.',
  tagline: 'Professional Landscape',
  description:
    'Professional landscaping, lawn care, hardscaping, and outdoor living services in Rochester, NY. NYS DEC certified, serving Greater Rochester since 2000.',
  foundingYear: 2000,
  priceRange: '$$',

  // Contact
  phone: '(585) 594-8420',
  phoneTel: '+1-585-594-8420',
  phoneHref: 'tel:+15855948420',
  email: 'info@westsideprolandscape.com',

  // Address
  address: {
    street: '2565 Buffalo Road',
    city: 'Rochester',
    state: 'NY',
    zip: '14624',
    country: 'US',
  },

  geo: {
    latitude: 43.1442945,
    longitude: -77.7239414,
  },

  // Hours
  hours: {
    weekdays: { open: '08:30', close: '16:00' },
    saturday: null,
    sunday: null,
  },

  // URLs
  url: 'https://westsideprolandscape.com',
  social: {
    facebook: 'https://www.facebook.com/Westside-Pro-Landscape-420584711317587/',
    instagram: 'https://www.instagram.com/westsideprolandscape/',
    twitter: 'https://x.com/westsideprolan',
    google: 'https://share.google/eUiYvhs6dSC2dhFVe',
  },

  // Certifications
  certifications: ['NYS DEC Certified Commercial Pesticide Applicator', 'SYNLawn Authorized Dealer'],

  // Tracking IDs
  tracking: {
    ga4: 'G-60GGNQVGCD',
    metaPixel: '414143897932367',
  },

  // Areas served
  areasServed: [
    'Rochester',
    'Pittsford',
    'Webster',
    'Penfield',
    'Fairport',
    'Brighton',
    'Greece',
    'Gates',
    'Chili',
    'Henrietta',
    'Victor',
  ],
} as const;

export type Company = typeof company;
