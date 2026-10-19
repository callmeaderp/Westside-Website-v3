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
 * Keep private evidence and personnel context outside this public repository. */
export const careerRoles: CareerRole[] = [
  {
    slug: 'lawn-care-technician',
    title: 'Plant Health / Lawn Care Technician',
    category: 'Plant Health',
    summary: 'Care for lawns and landscapes across the Rochester area with accurate applications, careful observations and clear customer communication.',
    employmentLabel: 'Full-time, year-round',
    employmentType: ['FULL_TIME'],
    schedule: 'Full-time, year-round work with seasonal scheduling. Overtime and winter assignments will be discussed during hiring; snow hours are not guaranteed.',
    location: 'Rochester and surrounding communities; based in Gates, NY',
    pay: { min: 20, max: 25, unit: 'HOUR', note: 'Base hourly pay depends on relevant experience and qualifications. Overtime, when applicable, is separate.' },
    description: ['Help customers keep their lawns and landscapes healthy. This is a field role for someone who notices problems, works carefully and can explain what a property needs.'],
    responsibilities: [
      'Perform lawn-care and Plant Health work using appropriate application rates and company procedures.',
      'Recognize turf, weed, disease and other landscape-health issues and communicate observations.',
      'Keep accurate work records, maintain a clean truck and work safely around customers and coworkers.',
    ],
    requirements: [
      'At least one year of relevant fertilization or lawn-care experience.',
      'A valid driver’s license and ability to meet company driving requirements.',
      'NYS DEC certification appropriate to the work, or willingness to work toward it. Trainees must work within the required training and supervision rules.',
      'Attention to detail, dependable attendance and clear communication.',
      'Ability to perform outdoor field work safely in changing weather, with reasonable accommodation where applicable.',
    ],
    benefits: [
      'Paid vacation and six paid holidays for eligible full-time, year-round employees, subject to service requirements.',
      'SIMPLE IRA with employer matching for eligible employees, subject to plan terms.',
      'Paid sick leave under applicable New York requirements.',
      'Company-provided uniforms and safety glasses.',
    ],
    datePosted: '2026-10-19',
  },
  {
    slug: 'landscape-design-consultant', title: 'Landscape Design Consultant', category: 'Design',
    summary: 'Turn a customer’s ideas into a practical landscape plan, a clear proposal and a well-coordinated project.',
    employmentLabel: 'Full-time', employmentType: ['FULL_TIME'],
    schedule: 'Full-time, with office work, local site visits and customer appointments. Scheduling varies with project and seasonal needs.',
    location: 'Gates, NY office and customer properties in the Rochester area',
    pay: { min: 65000, max: 80000, unit: 'YEAR', note: 'Base annual pay depends on relevant design, estimating and consultative sales experience.' },
    description: ['Work with homeowners and property managers to understand their goals, develop landscape solutions and carry the project from consultation through a clear handoff to our field team.'],
    responsibilities: [
      'Meet with customers, assess sites, take measurements and discuss goals, budget and timing.',
      'Develop landscape concepts, prepare scopes and estimates, and present proposals.',
      'Follow up with prospective customers and keep project and communication records organized.',
      'Coordinate plans, materials and project details with the construction and operations team.',
    ],
    requirements: [
      'Demonstrated landscape design/build or consultative project-sales ability, with examples of your work.',
      'Working knowledge of landscape materials, planting and outdoor construction.',
      'Ability to create and explain designs, estimates and proposals using appropriate design and office tools.',
      'Clear communication, follow-through and the ability to manage several customer projects.',
      'A valid driver’s license and ability to travel to local customer sites.',
    ],
    helpful: ['Approximately three years of relevant experience is preferred.', 'A portfolio showing landscape plans or completed project work.'],
    benefits: [
      'SIMPLE IRA with employer matching for eligible employees, subject to plan terms.',
      'Paid vacation and holidays for eligible full-time, year-round employees, subject to service requirements.',
      'Paid sick leave under applicable New York requirements.',
    ], datePosted: '2026-10-19',
  },
  {
    slug: 'landscape-construction-foreman', title: 'Landscape Construction Foreman', category: 'Construction',
    summary: 'Lead a hands-on crew building patios, walkways, walls and landscape installations around Rochester.',
    employmentLabel: 'Full-time construction-season work', employmentType: ['FULL_TIME'],
    schedule: 'Full-time during the construction season. Start times and schedules depend on projects and weather. Any winter assignment is discussed separately; year-round hours are not guaranteed.',
    location: 'Rochester-area job sites; based in Gates, NY',
    pay: { min: 26, max: 34, unit: 'HOUR', note: 'Base hourly pay depends on hardscape experience and crew-leadership ability. Overtime, when applicable, is separate.' },
    description: ['Keep a project moving while setting the standard for workmanship and safety. This is a working foreman role, combining skilled installation with daily crew direction and coordination.'],
    responsibilities: [
      'Lead and work alongside a landscape construction crew.',
      'Read plans and elevations, and install pavers, retaining walls, walkways and planting work.',
      'Coordinate daily tasks, materials and equipment with the project team.',
      'Operate equipment safely, check work quality and maintain clear time, material and progress records.',
    ],
    requirements: [
      'Proven hardscape installation experience and the ability to direct a crew.',
      'Ability to interpret plans, layouts and elevations and use construction tools safely.',
      'A valid driver’s license and ability to meet the requirements for assigned company vehicles.',
      'Ability to perform outdoor construction work and handle tools and materials safely, with reasonable accommodation where applicable.',
    ],
    helpful: ['Two to three years of relevant construction or hardscape experience.', 'Experience with skid steers, excavators and truck/trailer operation.'],
    benefits: ['Paid sick leave under applicable New York requirements.', 'Company-provided uniforms and safety glasses.', 'Retirement-plan and other benefit eligibility will be reviewed with you based on employment status and plan terms.'],
    datePosted: '2026-10-19',
  },
  {
    slug: 'snow-equipment-operator', title: 'Loader / Snow Equipment Operator', category: 'Snow & ice',
    summary: 'Put your loader or skid-steer skills to work clearing and stacking snow at commercial properties.',
    employmentLabel: 'Seasonal, part-time and on call', employmentType: ['PART_TIME', 'TEMPORARY'],
    schedule: 'Winter 2026–27. Weather-driven callouts may include overnight shifts, weekends and holidays. Hours vary with conditions; no weekly minimum or seasonal earnings are guaranteed.',
    location: 'Commercial properties in the Rochester area',
    pay: { min: 30, max: 40, unit: 'HOUR', note: 'Base hourly pay depends on relevant equipment and snow-removal experience. Overtime, when applicable, is separate.' },
    description: ['Help keep commercial properties accessible through winter storms. We are looking for operators who can work carefully around buildings, parked vehicles, pedestrians and other crews.'],
    responsibilities: [
      'Operate assigned loaders, skid steers or other snow equipment safely.',
      'Clear designated areas, stack snow in approved locations and follow site plans.',
      'Complete equipment checks, report defects or hazards and record completed work.',
      'Coordinate with plow and sidewalk crews and assist with related snow or deicing tasks as assigned.',
    ],
    requirements: [
      'Demonstrated safe operation of loaders, skid steers or comparable equipment.',
      'Reliable transportation to the assigned reporting location.',
      'Availability for weather-driven callouts, including overnight, weekend and holiday work.',
      'Clear communication and the ability to work safely in cold, snowy conditions.',
      'Any driving assignment requires the appropriate license and company driving eligibility.',
    ],
    helpful: ['Commercial snow-removal experience and familiarity with snow pushers or containment boxes.'],
    benefits: ['Paid sick leave under applicable New York requirements.', 'Seasonal employment has different benefit eligibility from full-time, year-round work.'],
    datePosted: '2026-10-19', validThrough: '2027-03-31T23:59:59-04:00',
  },
  {
    slug: 'snow-plow-driver', title: 'Snow Plow Truck Driver', category: 'Snow & ice',
    summary: 'Clear commercial parking areas and access routes with a focus on safe driving, dependable callout response and careful work.',
    employmentLabel: 'Seasonal, part-time and on call', employmentType: ['PART_TIME', 'TEMPORARY'],
    schedule: 'Winter 2026–27. Weather-driven callouts may include overnight shifts, weekends and holidays. Hours vary with conditions; no weekly minimum or seasonal earnings are guaranteed.',
    location: 'Commercial properties in the Rochester area',
    pay: { min: 30, max: 35, unit: 'HOUR', note: 'Base hourly pay depends on relevant plowing and driving experience. Overtime, when applicable, is separate.' },
    description: ['Join our commercial snow team for the winter season. Work with other drivers, equipment operators and sidewalk crews to keep assigned properties accessible.'],
    responsibilities: [
      'Operate an assigned plow truck and follow the property’s snow plan.',
      'Inspect the vehicle and equipment, identify hazards and report damage or mechanical concerns.',
      'Keep accurate service records and communicate progress and changing conditions.',
      'Assist with deicing and related snow work as assigned.',
    ],
    requirements: [
      'A valid driver’s license appropriate to the assigned vehicle and ability to meet company driving requirements.',
      'Relevant plowing or comparable vehicle-operation experience and the ability to demonstrate safe operation.',
      'Reliable transportation to the reporting location and availability for weather-driven callouts.',
      'Ability to work overnight, weekend and holiday shifts in winter conditions.',
    ],
    helpful: ['At least one winter of commercial plowing experience.'],
    benefits: ['Paid sick leave under applicable New York requirements.', 'Seasonal employment has different benefit eligibility from full-time, year-round work.'],
    datePosted: '2026-10-19', validThrough: '2027-03-31T23:59:59-04:00',
  },
  {
    slug: 'sidewalk-snow-crew', title: 'Sidewalk Snow Crew', category: 'Snow & ice',
    summary: 'Help clear walkways, entrances and pedestrian areas at commercial properties. Snow experience is helpful, but not required.',
    employmentLabel: 'Seasonal, part-time and on call', employmentType: ['PART_TIME', 'TEMPORARY'],
    schedule: 'Winter 2026–27. Weather-driven callouts may include overnight shifts, weekends and holidays. Hours vary with conditions; no weekly minimum or seasonal earnings are guaranteed.',
    location: 'Commercial properties in the Rochester area',
    pay: { min: 24, max: 30, unit: 'HOUR', note: 'Base hourly pay depends on relevant experience and assigned responsibilities. Overtime, when applicable, is separate.' },
    description: ['Dependable people make a difference when winter weather arrives. Work with a crew to clear pedestrian routes and apply deicing material using the tools and procedures appropriate to each site.'],
    responsibilities: [
      'Clear sidewalks, entrances and other pedestrian areas using shovels and assigned snow equipment.',
      'Apply deicing materials as directed and keep access routes clear.',
      'Handle tools and materials safely, follow site instructions and report hazards.',
      'Communicate with the crew and record work as directed.',
    ],
    requirements: [
      'Dependability and reliable transportation to the assigned reporting location.',
      'Availability for weather-driven callouts, including overnight, weekend and holiday work.',
      'Ability to safely perform physical outdoor work in snow and cold, with reasonable accommodation where applicable.',
      'Willingness to learn safe tool use and follow crew instructions. A driver’s license is required only for an assigned driving role.',
    ],
    helpful: ['Prior snow removal, landscaping or other outdoor work. Newcomers willing to learn are welcome.'],
    benefits: ['Paid sick leave under applicable New York requirements.', 'Seasonal employment has different benefit eligibility from full-time, year-round work.'],
    datePosted: '2026-10-19', validThrough: '2027-03-31T23:59:59-04:00',
  },
];

export const generalCareerInterest = 'General interest / future opportunities';

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
    `<p>${escapeHtml(role.schedule)}</p>`,
    '<h3>What you will do</h3>', list(role.responsibilities),
    '<h3>What the role requires</h3>', list(role.requirements),
    ...(role.helpful?.length ? ['<h3>Helpful experience</h3>', list(role.helpful)] : []),
    ...(role.benefits.length ? ['<h3>Pay and benefits</h3>', list(role.benefits)] : []),
    ...(role.pay.note ? [`<p>${escapeHtml(role.pay.note)}</p>`] : []),
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
    directApply: true,
    url: `${company.url}/careers/${role.slug}/`,
  };
}
