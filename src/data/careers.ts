import { company } from './company';

export interface CareerRole {
  slug: string;
  title: string;
  category: 'Plant Health' | 'Design' | 'Construction' | 'Snow & ice';
  summary: string;
  employmentLabel: string;
  employmentType: Array<'FULL_TIME' | 'PART_TIME' | 'TEMPORARY'>;
  schedule: string;
  location: string;
  pay: { min: number; max: number; unit: 'HOUR' | 'YEAR'; note?: string };
  description: string[];
  responsibilities: string[];
  requirements: string[];
  helpful?: string[];
  benefits: string[];
  datePosted: string;
  validThrough?: string;
}

/** Published openings need currently authorized, good-faith base-pay ranges.
 * Keep private evidence and personnel context outside this public repository.
 * Order is display order (careers page, form and job-board packet): snow first while it is the biggest need. */
export const careerRoles: CareerRole[] = [
  {
    slug: 'snow-equipment-operator', title: 'Loader / Snow Equipment Operator', category: 'Snow & ice',
    summary: 'Put your loader or skid-steer skills to work clearing and stacking snow at commercial properties.',
    employmentLabel: 'Seasonal, part-time and on call', employmentType: ['PART_TIME', 'TEMPORARY'],
    schedule: 'Winter 2026–27. We call crews out when it snows, which can mean overnight, weekend and holiday shifts. Your hours depend on the weather, so they change from week to week and aren’t guaranteed.',
    location: 'Commercial properties in the Rochester area',
    pay: { min: 35, max: 50, unit: 'HOUR', note: 'Where you start in this range depends on your experience and your assignment. Hours over 40 in a week are paid at time and a half.' },
    description: ['Help keep commercial properties accessible through winter storms. We are looking for operators who can work carefully around buildings, parked vehicles, pedestrians and other crews.'],
    responsibilities: [
      'Operate assigned loaders, skid steers or other snow equipment safely.',
      'Clear designated areas, stack snow in approved locations and follow site plans.',
      'Complete equipment checks, report defects or hazards and record completed work.',
      'Coordinate with plow and sidewalk crews and assist with related snow or deicing tasks as assigned.',
    ],
    requirements: [
      'Experience running loaders, skid steers or similar equipment safely.',
      'Reliable transportation, day or night.',
      'Available when it snows, including overnight, weekends and holidays.',
      'Clear communication and the ability to work safely in cold, snowy conditions.',
      'If your assignment includes driving a company vehicle, the right license and a driving record that qualifies you to drive it.',
    ],
    helpful: ['Commercial snow-removal experience and familiarity with snow pushers or containment boxes.'],
    benefits: ['Paid sick leave.'],
    datePosted: '2026-10-19', validThrough: '2027-03-31T23:59:59-04:00',
  },
  {
    slug: 'snow-plow-driver', title: 'Snow Plow Truck Driver', category: 'Snow & ice',
    summary: 'Plow commercial parking lots and access drives this winter. We need careful drivers who show up when it snows.',
    employmentLabel: 'Seasonal, part-time and on call', employmentType: ['PART_TIME', 'TEMPORARY'],
    schedule: 'Winter 2026–27. We call crews out when it snows, which can mean overnight, weekend and holiday shifts. Your hours depend on the weather, so they change from week to week and aren’t guaranteed.',
    location: 'Commercial properties in the Rochester area',
    pay: { min: 30, max: 45, unit: 'HOUR', note: 'Where you start in this range depends on your plowing and driving experience. Hours over 40 in a week are paid at time and a half.' },
    description: ['Join our commercial snow team for the winter season. Work with other drivers, equipment operators and sidewalk crews to keep our customers’ properties open and safe.'],
    responsibilities: [
      'Operate an assigned plow truck and follow the property’s snow plan.',
      'Inspect the vehicle and equipment, identify hazards and report damage or mechanical concerns.',
      'Keep accurate service records and communicate progress and changing conditions.',
      'Assist with deicing and related snow work as assigned.',
    ],
    requirements: [
      'A valid driver’s license for the truck you’re assigned, and a driving record that qualifies you to drive it.',
      'Plowing experience, or similar experience driving and operating equipment, and the ability to show us you work safely.',
      'Reliable transportation, day or night.',
      'Available when it snows, including overnight, weekend and holiday shifts.',
    ],
    helpful: ['At least one winter of commercial plowing experience.'],
    benefits: ['Paid sick leave.'],
    datePosted: '2026-10-19', validThrough: '2027-03-31T23:59:59-04:00',
  },
  {
    slug: 'sidewalk-snow-crew', title: 'Sidewalk Snow Crew', category: 'Snow & ice',
    summary: 'Help clear walkways, entrances and pedestrian areas at commercial properties. Snow experience is helpful, but not required.',
    employmentLabel: 'Seasonal, part-time and on call', employmentType: ['PART_TIME', 'TEMPORARY'],
    schedule: 'Winter 2026–27. We call crews out when it snows, which can mean overnight, weekend and holiday shifts. Your hours depend on the weather, so they change from week to week and aren’t guaranteed.',
    location: 'Commercial properties in the Rochester area',
    pay: { min: 24, max: 35, unit: 'HOUR', note: 'Where you start in this range depends on your experience and responsibilities. Hours over 40 in a week are paid at time and a half.' },
    description: ['Dependable people make a big difference when winter weather arrives. Work with a crew to clear walkways and entrances and spread ice melt so people can come and go safely.'],
    responsibilities: [
      'Clear sidewalks, entrances and other walkways with shovels and other snow equipment.',
      'Spread salt or ice melt as directed and keep paths clear.',
      'Handle tools and materials safely, follow site instructions and report hazards.',
      'Communicate with the crew and record work as directed.',
    ],
    requirements: [
      'Dependability and reliable transportation, day or night.',
      'Available when it snows, including overnight, weekends and holidays.',
      'Able to do physical outdoor work safely in snow and cold, with or without reasonable accommodation.',
      'Willingness to learn and follow your crew’s safety practices. You only need a driver’s license if you’re assigned to drive.',
    ],
    helpful: ['Prior snow removal, landscaping or other outdoor work. Newcomers willing to learn are welcome.'],
    benefits: ['Paid sick leave.'],
    datePosted: '2026-10-19', validThrough: '2027-03-31T23:59:59-04:00',
  },
  {
    slug: 'lawn-care-technician',
    title: 'Plant Health / Lawn Care Technician',
    category: 'Plant Health',
    summary: 'Treat lawns and landscapes across the Rochester area, from fertilizing and weed control to spotting problems before they spread.',
    employmentLabel: 'Full-time, year-round',
    employmentType: ['FULL_TIME'],
    schedule: 'Hours follow the seasons, with the busiest stretch from spring through fall. We’ll go over overtime and winter work when we talk.',
    location: 'Rochester and surrounding communities; based in Gates, NY',
    pay: { min: 21, max: 32, unit: 'HOUR', note: 'Where you start in this range depends on your experience and qualifications. Hours over 40 in a week are paid at time and a half.' },
    description: ['Help customers keep their lawns and landscapes healthy. This is a field role for someone who notices problems, works carefully and can explain what a property needs.'],
    responsibilities: [
      'Apply fertilizer, weed control and other Plant Health treatments at the right rates, following our procedures.',
      'Spot turf, weed, insect and disease problems, and explain what you find.',
      'Keep accurate work records, maintain a clean truck and work safely around customers and coworkers.',
    ],
    requirements: [
      'At least one year of relevant fertilization or lawn-care experience.',
      'A valid driver’s license and a driving record that qualifies you to drive company vehicles.',
      'A NYS DEC pesticide technician or applicator certification, or willingness to work toward one. Until you’re certified, you’ll train under a certified applicator, as state rules require.',
      'Attention to detail, dependable attendance and clear communication.',
      'Able to do physical outdoor work safely in all kinds of weather, with or without reasonable accommodation.',
    ],
    benefits: [
      'Paid vacation and six paid holidays, after an initial waiting period.',
      'SIMPLE IRA retirement plan with a company match, once you meet the plan’s eligibility rules.',
      'Paid sick leave.',
      'Company-provided uniforms and safety glasses.',
    ],
    datePosted: '2026-10-19',
  },
  {
    slug: 'landscape-design-consultant', title: 'Landscape Design Consultant', category: 'Design',
    summary: 'Turn a customer’s ideas into a practical landscape plan, a clear proposal and a well-coordinated project.',
    employmentLabel: 'Full-time', employmentType: ['FULL_TIME'],
    schedule: 'Your week mixes office work, site visits and customer appointments, and it shifts with projects and the season.',
    location: 'Gates, NY office and customer properties in the Rochester area',
    pay: { min: 65000, max: 95000, unit: 'YEAR', note: 'Where you start in this range depends on your design, estimating and sales experience.' },
    description: ['This role combines design and sales. You’ll meet homeowners and property managers, design a landscape that fits what they want, price it, present the proposal and hand the sold project off cleanly to our crews.'],
    responsibilities: [
      'Meet with customers, assess sites, take measurements and discuss goals, budget and timing.',
      'Develop landscape concepts, prepare scopes and estimates, and present proposals.',
      'Follow up with prospective customers and keep project and communication records organized.',
      'Coordinate plans, materials and project details with the construction and operations team.',
    ],
    requirements: [
      'Experience designing or selling landscape projects, with examples of your work to share.',
      'Working knowledge of landscape materials, planting and outdoor construction.',
      'Comfort creating and presenting designs, estimates and proposals with design software and everyday office tools.',
      'Clear communication, follow-through and the ability to manage several customer projects.',
      'A valid driver’s license and ability to travel to local customer sites.',
    ],
    helpful: ['About three years of relevant experience.'],
    benefits: [
      'SIMPLE IRA retirement plan with a company match, once you meet the plan’s eligibility rules.',
      'Paid vacation and six paid holidays, after an initial waiting period.',
      'Paid sick leave.',
    ], datePosted: '2026-10-19',
  },
];

export const generalCareerInterest = 'General interest / future opportunities';

/** Westside's employee-referral program, from the company's October 2026 memo and the owner's explanation of it
 * to staff: the referring employee can earn $900 and the person they refer $300. The public copy offers the $300
 * only to referred hires, so never word it as a bonus for every new hire; the memo says "new successful hires",
 * so do not claim unreferred hires are excluded either. Shown on the careers page, each role page and each
 * JobPosting; keep it in step with the program. */
export const referralBonus = {
  /** Lead-in on the careers page and role pages. */
  lead: 'Know someone who works here?',
  howTo: 'Put their name on your application.',
  newHire: 'If you’re hired, you’ll earn a $300 bonus once you’ve been with us 30 days and worked at least 128 hours.',
  referrer: 'They’ll earn a referral bonus too.',
  /** Standalone statement for the JobPosting incentiveCompensation field. */
  incentive: 'Hires referred by a Westside employee earn a $300 bonus once they’ve been with the company 30 days and worked at least 128 hours.',
};

export function formatCareerPay(pay: CareerRole['pay']): string {
  const format = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
  const amount = pay.min === pay.max ? format(pay.min) : `${format(pay.min)}–${format(pay.max)}`;
  return `${amount} per ${pay.unit === 'HOUR' ? 'hour' : 'year'}`;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function careerJobPosting(role: CareerRole) {
  if (!Number.isFinite(role.pay.min) || !Number.isFinite(role.pay.max) || role.pay.min <= 0 || role.pay.max < role.pay.min) {
    throw new Error(`Invalid base-pay range for career role: ${role.slug}`);
  }
  const list = (items: string[]) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  const description = [
    ...role.description.map((text) => `<p>${escapeHtml(text)}</p>`),
    `<p>${escapeHtml(`${role.employmentLabel}. ${role.schedule}`)}</p>`,
    // Job boards often show only this text, so it states the range that the page shows beside the note.
    '<h3>Pay</h3>',
    `<p>${escapeHtml([`${formatCareerPay(role.pay)}.`, role.pay.note].filter(Boolean).join(' '))}</p>`,
    '<h3>What you will do</h3>', list(role.responsibilities),
    '<h3>What the role requires</h3>', list(role.requirements),
    ...(role.helpful?.length ? ['<h3>Helpful experience</h3>', list(role.helpful)] : []),
    ...(role.benefits.length ? ['<h3>Benefits</h3>', list(role.benefits)] : []),
    '<h3>Referral bonus</h3>',
    `<p>${escapeHtml(`Referred by a Westside employee? ${referralBonus.howTo} ${referralBonus.newHire}`)}</p>`,
  ].join('');
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: role.title,
    description,
    identifier: { '@type': 'PropertyValue', name: company.legalName, value: role.slug },
    datePosted: role.datePosted,
    ...(role.validThrough ? { validThrough: role.validThrough } : {}),
    employmentType: role.employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: company.legalName,
      sameAs: company.url,
      logo: `${company.url}/sig/westside-logo.png`,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: company.address.city,
        addressRegion: company.address.state,
        addressCountry: company.address.country,
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: {
        '@type': 'QuantitativeValue',
        ...(role.pay.min === role.pay.max ? { value: role.pay.min } : { minValue: role.pay.min, maxValue: role.pay.max }),
        unitText: role.pay.unit,
      },
    },
    incentiveCompensation: referralBonus.incentive,
    directApply: true,
    url: `${company.url}/careers/${role.slug}/`,
  };
}
