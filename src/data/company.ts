export const company = {
  name: 'Westside Professional Landscape',
  legalName: 'Westside Professional Landscape, Inc.',
  tagline: 'Professional Landscape',
  description:
    'Professional landscaping, lawn care, hardscaping, and outdoor living services in Rochester, NY. NYS DEC certified, serving Greater Rochester since 2000.',
  foundingYear: 2000,
  priceRange: '$$',

  phone: '(585) 594-8420',
  phoneTel: '+1-585-594-8420',
  phoneHref: 'tel:+15855948420',
  email: 'office@westsideprolandscape.com',

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

  // Hours (null = closed; typed as union so ternary narrowing works with `as const`)
  hours: {
    weekdays: { open: '08:30', close: '16:00' },
    saturday: null as { open: string; close: string } | null,
    sunday: null as { open: string; close: string } | null,
  },

  url: 'https://westsideprolandscape.com',
  social: {
    facebook: 'https://www.facebook.com/Westside-Pro-Landscape-420584711317587/',
    instagram: 'https://www.instagram.com/westsideprolandscape/',
    twitter: 'https://x.com/westsideprolan',
    google: 'https://share.google/eUiYvhs6dSC2dhFVe',
  },

  certifications: ['NYS DEC Certified Commercial Pesticide Applicator', 'SYNLawn Authorized Dealer'],

  financing: {
    provider: 'Wells Fargo',
    program: 'Buy Today, Pay Over Time',
    url: 'https://retailservices.wellsfargo.com/pl/0033053059',
    /** Service slugs that should show the financing banner — construction work
     *  where the project size makes payment-over-time genuinely relevant. */
    eligibleServices: [
      'landscape-design',
      'hardscaping',
      'walkways-steps',
      'retaining-walls',
      'outdoor-kitchens',
      'drainage-grading',
      'artificial-grass',
      'water-features',
    ] as string[],
  },

  tracking: {
    ga4: 'G-HQYE7MKZ9P',
    metaPixel: '414143897932367',
    /** Google Ads conversion ID (AW-XXXXXXXXX). Set to '' to disable. */
    googleAdsId: 'AW-994077980',
    /** Conversion label for contact form submissions ($50 value). */
    googleAdsFormLabel: 'X0m7CO2BkYscEJzagdoD',
    /** Conversion label for phone number clicks ($25 value). */
    googleAdsPhoneLabel: 'TrMECPSIkYscEJzagdoD',
    /** Microsoft Advertising UET tag ID. Set to '' to disable. */
    microsoftUet: '97263322',
    /** Cloudflare Turnstile site key for contact form CAPTCHA. Set to '' to disable.
     *  Create a widget at: Cloudflare Dashboard → Turnstile → Add widget → set domain. */
    turnstileSiteKey: '0x4AAAAAACtQFQUXq4idMeWu',
  },

  // Domain verification codes (Meta Business, Google Search Console, etc.)
  verification: {
    /** Meta Business domain verification — get from Business Settings > Brand Safety > Domains */
    metaDomain: 'n38rl71cy605xav3vlh7tk9jjqpkdb',
    /** Google Search Console — get from Search Console > Settings > Ownership verification */
    googleSiteVerification: 'o8V0gG8CkDJ0oGu14-9rGA8s1QpZfbSGuJ7M3JOvVvU',
  },

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
    'Spencerport',
  ],
} as const;

export type Company = typeof company;
