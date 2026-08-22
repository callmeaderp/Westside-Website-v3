/**
 * Rich content for service pages — ported from V2.
 * Separated from services.ts to keep base service data (nav, cards, schema) lean.
 * Keyed by ServiceSlug. Imported by [slug].astro and standalone service pages.
 */
import type { ServiceSlug } from './services';
import { company } from './company';

const yearsInBusiness = new Date().getFullYear() - company.foundingYear;

export interface DetailCard {
  title: string;
  text: string;
  features: string[];
}

export interface ProcessStep {
  title: string;
  text: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServiceContent {
  introLabel: string;
  introTitle: string;
  introText: string[];
  introCta?: string;
  detailLabel?: string;
  detailTitle?: string;
  detailSubtitle?: string;
  detailCards: DetailCard[];
  processLabel?: string;
  processTitle?: string;
  processSubtitle?: string;
  processSteps: ProcessStep[];
  faqs?: FaqItem[];
  relatedSlugs: ServiceSlug[];
  ctaHeading: string;
  ctaText: string;
  /**
   * Hero buttons for this service. Without these the generic ServiceLayout
   * hero has no call to action at all and the visitor has to scroll to find
   * one — the single biggest funnel leak on the construction pages.
   */
  heroButtons?: Array<{ text: string; href: string; style: 'primary' | 'dark' | 'outline' }>;
  /** Investment-band ids (src/data/investment.ts) to publish on this page. */
  investmentBandIds?: string[];
  investmentTitle?: string;
  investmentIntro?: string;
  /** Project slugs (src/data/projects.ts) to feature as proof. */
  featuredProjectSlugs?: string[];
}

export const serviceContent: Partial<Record<ServiceSlug, ServiceContent>> = {
  'landscape-design': {
    introLabel: 'Your Vision, Our Expertise',
    introTitle: 'TRANSFORMING <span class="text-green">OUTDOOR SPACES</span>',
    introText: [
      `For over <strong>${yearsInBusiness} years</strong>, <strong>Westside Professional Landscape</strong> has designed and built landscapes across Monroe County. Whether you want to rethink the whole property or fix the front entry, we start with how you use the space, what needs to work better, and what you want to spend.`,
      "Every project begins with the site. We check soil, sun, drainage, grade, and the features worth keeping. Then we choose plants, materials, and a layout suited to Rochester's humid summers, cold winters, and everything in between.",
    ],
    introCta: 'Request a Design Consultation',
    detailLabel: 'What We Offer',
    detailTitle: 'DESIGN & INSTALLATION <span class="text-green">SERVICES</span>',
    detailSubtitle: 'Plans and installations shaped around Greater Rochester homes, businesses, and growing conditions.',
    detailCards: [
      {
        title: 'CUSTOM LANDSCAPE DESIGN',
        text: "A <strong>detailed landscape plan</strong> puts sight lines, walking routes, seasonal interest, and mature plant sizes on paper before installation begins. The result fits the property now and still makes sense as the landscape grows, whether it is in Pittsford, Brighton, Penfield, or elsewhere in Monroe County.",
        features: ['Full property design plans', 'Phased installation options', "Plant selection for Rochester's climate"],
      },
      {
        title: 'PLANTING DESIGN & INSTALLATION',
        text: "We choose trees, shrubs, perennials, and ornamental grasses for Western New York's USDA Zone 6a conditions. Bloom times, foliage, mature size, and upkeep all matter. From a specimen tree to a foundation bed, every plant needs a reason to be there.",
        features: ['Native and adapted species', 'Four-season interest design', 'Specimen trees & ornamentals'],
      },
      {
        title: 'GRADING & DRAINAGE',
        text: "Proper grading and drainage are <strong>the foundation of any lasting landscape</strong>. Rochester's clay-heavy soils and frequent rain events demand careful water management. We design and install French drains, catch basins, dry creek beds, and regrading solutions that protect your home's foundation and keep your lawn from becoming a swamp every spring.",
        features: ['French drains & catch basins', 'Dry creek beds & swales', 'Foundation protection grading'],
      },
      {
        title: 'OUTDOOR LIGHTING',
        text: 'Good outdoor lighting lets you use the landscape after sunset. We light paths for safer footing, pick out trees and stonework, and add warm task lighting where people gather. LED fixtures keep energy use low.',
        features: ['Path & accent lighting', 'Uplighting & tree lighting', 'Energy-efficient LED systems'],
      },
    ],
    processLabel: 'How It Works',
    processTitle: 'OUR DESIGN <span class="text-green">PROCESS</span>',
    processSubtitle: "A clear path from the first walk-through to the finished installation.",
    processSteps: [
      { title: 'CONSULTATION', text: 'We meet at your property, discuss your goals, assess existing conditions, and establish a budget range.' },
      { title: 'DESIGN', text: 'Our team creates a detailed landscape plan with plant selections, material specifications, and layout drawings.' },
      { title: 'INSTALLATION', text: 'Our crews build from the approved plan and keep the installation aligned with its materials, grades, and layout.' },
      { title: 'CARE', text: 'Ongoing maintenance programs protect your investment and keep your landscape thriving season after season.' },
    ],
    faqs: [
      {
        question: 'How much does landscape design cost in Rochester?',
        answer: 'It depends on scope. A targeted front-entry redesign and a full property transformation are very different projects. The ranges above cover the renovation work we do most often in Greater Rochester. Design is developed as part of the proposal for the projects we build. Every number remains a planning figure until we walk the property; you receive a written, itemized estimate before work begins.',
      },
      {
        question: 'Do you have a licensed landscape architect on staff?',
        answer: "No, and we will not claim otherwise. In New York, \"landscape architect\" is a title protected by state license. We are a design-build landscape contractor. Our designers produce layout drawings, plant schedules, grading intent, and material specifications for work our own crews install. If a project needs stamped drawings or another licensed professional, we will tell you up front.",
      },
      {
        question: 'What is the best time of year to start a landscaping project?',
        answer: "In Rochester, spring (April\u2013June) and fall (September\u2013October) are the best windows for planting and installation. Cooler temperatures and reliable rainfall help roots establish. Hardscape work and design consultations can happen year-round. A winter design start can have you ready to build when the season opens.",
      },
      {
        question: 'Do you work with existing landscaping or only start from scratch?',
        answer: "Both. Many projects improve an existing landscape rather than erase it. During the site assessment, we identify what works, what can stay, and what needs to change. The plan makes the most of the good features already there.",
      },
      {
        question: 'How long does a typical landscape installation take?',
        answer: 'Timeline depends on the project scope. A targeted front-entry redesign might take a few days, while a full property transformation with hardscaping, planting, and grading can take several weeks. We provide a detailed timeline during the proposal phase so you can plan accordingly.',
      },
    ],
    heroButtons: [
      { text: 'Start Your Design', href: '/contact/?service=landscape-design', style: 'primary' },
      { text: 'See Investment Ranges', href: '#investment', style: 'outline' },
    ],
    investmentBandIds: ['landscape-renovation', 'walkway-entry', 'full-backyard'],
    investmentIntro:
      'Design and installation scope varies more than any other service we offer. These are the ranges renovation projects in Greater Rochester typically land in.',
    featuredProjectSlugs: ['front-walkway-planting-beds', 'commercial-courtyard-paver-plaza', 'stone-retaining-wall-shade-garden'],
    relatedSlugs: ['hardscaping', 'walkways-steps', 'drainage-grading'],
    ctaHeading: 'READY TO PUT A PLAN ON <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">PAPER?</span>',
    ctaText: "Schedule a <strong>free on-site consultation</strong>. We'll walk your property, discuss your vision, and develop a plan that fits your budget.",
  },

  'landscape-maintenance': {
    introLabel: 'Protect Your Investment',
    introTitle: 'PROFESSIONAL <span class="text-green">LANDSCAPE CARE</span>',
    introText: [
      'Landscapes do not stay sharp on their own. Without regular care, shrubs crowd the walk, lawn edges soften, weeds take over beds, and seasonal cleanup keeps sliding down the list.',
      "<strong>Westside Professional Landscape</strong> maintains homes and commercial properties throughout Greater Rochester on a dependable schedule, from Pittsford residences to Henrietta commercial campuses. We handle the recurring work so the lawn, beds, and shrubs look cared for each time you arrive.",
    ],
    detailLabel: 'What We Offer',
    detailTitle: 'MAINTENANCE <span class="text-green">SERVICES</span>',
    detailSubtitle: 'Scheduled care for lawns, beds, shrubs, and seasonal cleanup at homes and commercial properties.',
    detailCards: [
      {
        title: 'WEEKLY MOWING & EDGING',
        text: 'Professional-grade mowing with sharp blades, clean edges along walkways and beds, and trimming around obstacles. We adjust mowing height seasonally to promote healthy grass growth and leave your lawn looking crisp every visit.',
        features: ['Consistent weekly schedule', 'String trimming & edging', 'Seasonal height adjustments'],
      },
      {
        title: 'SPRING & FALL CLEANUPS',
        text: "Spring cleanup removes winter debris, dead foliage, and matted leaves to prepare your landscape for the growing season. Fall cleanup clears leaves, cuts back perennials, and prepares beds for winter. Both are essential in Rochester's four-season climate.",
        features: ['Debris & leaf removal', 'Perennial cutbacks', 'Bed preparation'],
      },
      {
        title: 'MULCHING & BED CARE',
        text: 'Fresh mulch suppresses weeds, holds moisture, and gives beds a clean edge. We apply it at the right depth, maintain the bed lines, and use chemical and hand weed control where each makes sense.',
        features: ['Premium mulch installation', 'Bed edging & definition', 'Weed control'],
      },
      {
        title: 'PRUNING & HEDGE TRIMMING',
        text: 'Pruning keeps growth healthy and plants in scale with the space. Timing matters, especially for flowering shrubs, so our crews prune by species instead of giving everything the same haircut. Hedge trimming keeps formal borders crisp.',
        features: ['Species-specific timing', 'Formal hedge shaping', 'Dead wood removal'],
      },
      {
        title: 'SEASONAL COLOR ROTATIONS',
        text: 'Keep your property vibrant throughout the growing season with planned flower rotations. We install spring bulbs, summer annuals, and fall mums at the right time to ensure continuous color from April through October. Perfect for commercial properties and HOA common areas.',
        features: ['Spring, summer & fall rotations', 'Container planting', 'Entrance & focal point displays'],
      },
      {
        title: 'IRRIGATION MANAGEMENT',
        text: "For properties with irrigation systems, we provide spring activation, mid-season adjustments, and fall winterization. We also monitor for leaks, broken heads, and coverage gaps. Proper irrigation management <em>saves water</em> and keeps your landscape healthy through Rochester's variable summers.",
        features: ['Spring activation & testing', 'Seasonal adjustments', 'Fall winterization & blowout'],
      },
    ],
    processSteps: [],
    faqs: [
      {
        question: 'How often should my lawn be mowed in Rochester?',
        answer: "During the growing season, typically April through October, weekly mowing is standard for most Rochester-area lawns. Some properties benefit from twice-weekly service during peak spring and early-summer growth. We also change mowing height by season: higher in summer to reduce heat stress and shorter in spring and fall.",
      },
      {
        question: "What's included in a landscape maintenance program?",
        answer: "Programs can include weekly mowing and edging, string trimming, spring and fall cleanups, mulching, bed maintenance, pruning, and seasonal color. We match the list to your property and budget, so you choose what belongs in the plan.",
      },
      {
        question: 'Do you offer one-time services or only seasonal contracts?',
        answer: "We offer both. Seasonal contracts provide the most consistent results and predictable pricing, but we also handle one-time projects like spring cleanups, mulch installation, or pruning. For ongoing lawn health, a regular program delivers far better results than occasional service.",
      },
      {
        question: 'When should spring cleanup happen in Rochester?',
        answer: "Spring cleanup in the Rochester area typically begins in late March or early April, once the snow has melted and the ground is firm enough to work. We remove winter debris, cut back dead perennials, clean out beds, and prepare your landscape for the growing season. Booking early ensures you're first on the schedule.",
      },
    ],
    heroButtons: [
      { text: 'Get a Maintenance Quote', href: '/contact/?service=landscape-maintenance', style: 'primary' },
      { text: 'Call (585) 594-8420', href: 'tel:+15855948420', style: 'outline' },
    ],
    relatedSlugs: ['plant-health', 'landscape-design', 'snow-ice-management'],
    ctaHeading: 'KEEP YOUR PROPERTY LOOKING ITS <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">BEST</span>',
    ctaText: 'Tell us what needs regular attention. We will walk the property and build a maintenance quote around it.',
  },

  'lawn-care': {
    introLabel: 'Complete Lawn Care',
    introTitle: 'A THICKER, GREENER LAWN IN <span class="text-green">ROCHESTER</span>',
    introText: [
      `For over <strong>${yearsInBusiness} years</strong>, <strong>Westside Professional Landscape</strong> has cared for lawns across Monroe County, from shaded yards in Brighton to sun-baked corner lots in Gates. A healthy lawn comes from mowing, feeding, weed control, aeration, and timely repair working together across the season.`,
      'We keep the program in-house. Our crews handle scheduled mowing, <strong>NYS DEC certified applicators</strong> run the 5-step fertilization and weed control program, and our specialists cover aeration, overseeding, grub protection, and repair. You have one company to call about the lawn.',
    ],
    introCta: 'Get a Free Lawn Care Quote',
    detailLabel: 'Every Part of the Program',
    detailTitle: 'OUR LAWN CARE <span class="text-green">SERVICES</span>',
    detailSubtitle: 'Pick the services your lawn needs, or bundle the whole program for the best results.',
    detailCards: [
      {
        title: 'WEEKLY MOWING & EDGING',
        text: "Consistent mowing is the foundation of a good-looking lawn. Our crews run on a <strong>predictable weekly schedule</strong> with sharp blades, clean edges, and careful trimming around obstacles. We cut taller in summer heat and closer in spring and fall so the turf stays healthy, not just short. Mowing is part of our full <a href=\"/services/landscape-maintenance/\" style=\"color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;\">landscape maintenance program</a>.",
        features: ['Weekly visits, same crew', 'Sharp blades & clean edges', 'Seasonal height adjustments'],
      },
      {
        title: 'FERTILIZATION & WEED CONTROL',
        text: 'Our <strong>5-Step Fertilization & Weed Control Program</strong> is timed for Western New York\'s climate and soils. NYS DEC certified technicians apply balanced fertilizer, pre- and post-emergent weed control, and an included grub-control application. <strong>Your first treatment is $58, half the usual $116 price for the average Rochester lawn.</strong> See the full schedule on our <a href="/services/plant-health/" style="color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;">5-step program page</a>.',
        features: ['5 precisely timed visits', 'Crabgrass & broadleaf weed control', 'Grub prevention included'],
      },
      {
        title: 'CORE AERATION & OVERSEEDING',
        text: "Rochester's clay-heavy soils compact under foot traffic, mower weight, and freeze-thaw cycles. <strong>Core aeration</strong> pulls small soil plugs so water, air, and nutrients can reach the root zone. Pairing it with <strong>overseeding</strong> works premium seed into the fresh holes, thickening thin spots and refreshing older turf. Early fall is the ideal Monroe County window.",
        features: ['Best performed in early fall', 'Relieves compaction & thatch', 'Fills thin spots with premium seed'],
      },
      {
        title: 'GRUB CONTROL',
        text: 'Grubs are the larval stage of Japanese beetles, European chafers, and similar pests, and they are among <strong>the most destructive lawn pests</strong> around Rochester. They feed on roots and can kill large sections of turf in one season. We include <strong>preventive grub control</strong> in the 5-step program and offer curative treatment when an active infestation is found. Prevention costs far less than repairing dead turf.',
        features: ['Preventive application included in 5-step', 'Curative treatment for active infestations', 'Targets Japanese beetle & chafer grubs'],
      },
      {
        title: 'LAWN REPAIR & RENOVATION',
        text: "We repair grub damage, pet spots, dog tracks, equipment ruts, and thin or bare areas. <strong>Slit-seeding, topdressing, and spot repair</strong> address focused trouble spots. Lawns that need a reset may call for <strong>full renovation</strong> with dethatching, aeration, overseeding, and starter fertilizer. We also install <strong>sod</strong> where seed is not the right fit.",
        features: ['Spot repair & slit-seeding', 'Full lawn renovation', 'Sod installation available'],
      },
      {
        title: 'SPRING & FALL CLEANUPS',
        text: 'A lawn care program works best on a <em>clean canvas</em>. Our <strong>spring cleanup</strong> removes winter debris, matted leaves, and dead growth so your grass wakes up cleanly and first-round fertilizer reaches the soil. Our <strong>fall cleanup</strong> clears leaves before they smother the turf, cuts back perennials, and prepares beds for winter. Both are critical in Rochester\'s four-season climate.',
        features: ['Winter debris & leaf removal', 'Bed & edge preparation', 'Bundles with mowing contracts'],
      },
    ],
    processLabel: 'How It Works',
    processTitle: 'YOUR PATH TO A <span class="text-green">BETTER LAWN</span>',
    processSubtitle: "We look at the lawn first, build the right program, and keep you informed as the season moves.",
    processSteps: [
      { title: 'LAWN EVALUATION', text: "We walk your property, check soil and sun conditions, identify weed pressure, and listen to what you want from your lawn." },
      { title: 'CUSTOM PROGRAM', text: "We recommend only the services the lawn needs, with clear, itemized pricing." },
      { title: 'CONSISTENT SERVICE', text: 'Mowing crews run on a predictable schedule. Applications hit the right windows. You get visit notifications and application details in writing.' },
      { title: 'ONGOING RESULTS', text: "We monitor your lawn as the season progresses, catch issues early, and adjust the program where needed. Year after year, the lawn keeps improving." },
    ],
    faqs: [
      {
        question: 'How much does professional lawn care cost in Rochester?',
        answer: "It depends on lawn size and the services you choose. Weekly mowing typically has a flat seasonal or per-visit rate based on the property. The 5-Step Fertilization & Weed Control program averages $116 per treatment for a typical Rochester lawn, and your <strong>first treatment is $58, half the usual price</strong>. Aeration, overseeding, and repair are quoted separately. After a <strong>free on-site estimate</strong>, you will see itemized pricing before work starts.",
      },
      {
        question: 'Do I need to sign up for every service, or can I pick and choose?',
        answer: "Pick what your lawn needs. Many clients start with the 5-Step Fertilization & Weed Control program, then add mowing or aeration as the lawn improves. Others want the full program from day one. Bundling is not required, though it can simplify scheduling and lets the services work on one coordinated calendar.",
      },
      {
        question: "What's the difference between 'lawn care' and 'landscape maintenance'?",
        answer: "'<strong>Lawn care</strong>' focuses on the turf: mowing, fertilization, weed control, aeration, grub protection, and repair. '<strong>Landscape maintenance</strong>' also covers beds, shrubs, mulch, pruning, seasonal cleanups, and flower rotations. Our <a href=\"/services/landscape-maintenance/\" style=\"color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;\">landscape maintenance program</a> can combine them, or you can hire us for lawn care only.",
      },
      {
        question: 'When should I start lawn care service?',
        answer: "In Rochester, <strong>early spring</strong> (March/April) is the window for pre-emergent crabgrass control and the first fertilizer application. Miss that timing and weeds become harder to manage. Mowing contracts are set before growth ramps up in late April. Aeration and overseeding are best in <strong>early fall</strong> (late August through September). We can still start mid-season and tailor the remaining work to the calendar.",
      },
      {
        question: 'Are your lawn care products safe for kids and pets?',
        answer: "Yes. Our <strong>NYS DEC Commercial Pesticide Applicators</strong> use products at precisely calibrated rates and follow all safety guidelines. After an application, we recommend staying off treated areas until the products have dried or been watered in (typically a few hours). All <a href=\"/labels-sds/\" style=\"color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;\">product labels and safety data sheets</a> are publicly available on our site so you can review exactly what we use.",
      },
      {
        question: 'Do you service my area?',
        answer: "We serve Rochester and communities throughout Monroe County, including Pittsford, Brighton, Penfield, Webster, Fairport, Greece, Gates, Chili, Spencerport, and Henrietta. See our <a href=\"/service-areas/\" style=\"color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;\">service areas page</a> for the full list. Not sure about your address? Call us and we will check.",
      },
    ],
    heroButtons: [
      { text: 'Get a Free Lawn Care Quote', href: '/contact/?service=lawn-care', style: 'primary' },
      { text: 'Call (585) 594-8420', href: 'tel:+15855948420', style: 'outline' },
    ],
    relatedSlugs: ['plant-health', 'landscape-maintenance', 'artificial-grass'],
    ctaHeading: 'READY FOR A LAWN YOU\'RE <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">PROUD OF?</span>',
    ctaText: "Get a <strong>free on-site lawn evaluation</strong>. We'll walk your property, tell you honestly what it needs, and give you a clear itemized quote.",
  },

  'hardscaping': {
    introLabel: 'Craftsmanship That Endures',
    introTitle: 'OUTDOOR SPACES BUILT FOR <span class="text-green">ROCHESTER</span>',
    introText: [
      `Rochester’s <strong>freeze-thaw cycles</strong> put outdoor structures to the test. A patio or retaining wall without proper base preparation and drainage will heave, crack, and fail within a few winters. Westside Professional Landscape has built hardscapes across Monroe County for over ${yearsInBusiness} years. <strong>We build for this climate.</strong>`,
      "Our crews understand the engineering that goes into a durable installation: compacted aggregate bases, proper pitch for water drainage, polymeric sand for joint stability, and the right materials for our climate. Whether you're a homeowner in Pittsford looking for an elegant patio or a commercial property in Greece that needs a functional retaining wall, we bring the same level of precision to every project.",
      'Most people arrive here with two questions: <em>what would this cost</em>, and <em>what does the process look like</em>. Both are answered on this page, before you have to talk to anyone.',
    ],
    introCta: 'Start Your Project',
    detailLabel: 'What We Build',
    detailTitle: 'HARDSCAPING <span class="text-green">SERVICES</span>',
    detailSubtitle: "Built to withstand Rochester's demanding four-season climate.",
    detailCards: [
      {
        title: 'PATIOS & OUTDOOR ROOMS',
        text: "A patio should work like an outdoor room, not a leftover rectangle. We build with natural stone, pavers, and large-format slabs, then use seat walls, steps, and lighting where they make the space more useful.",
        features: ['Natural stone & paver options', 'Seat walls, pillars & steps', 'Low-voltage lighting integration'],
      },
      {
        title: 'RETAINING & DECORATIVE WALLS',
        text: 'Manage slopes, prevent erosion, and add architectural interest with properly built retaining walls. From small garden walls to large structural installations, we use segmental block, natural stone, and boulder systems sized for the load. <a href="/services/retaining-walls/" style="color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;">More on retaining walls</a>.',
        features: ['Structural block & stone walls', 'Natural stone & boulder walls', 'Drainage stone & backfill standard'],
      },
      {
        title: 'WALKWAYS & STEPS',
        text: "A good walkway follows the route people naturally take and stays comfortable underfoot. We build entries and connecting paths with pavers, flagstone, and natural stone for Rochester weather. <a href=\"/services/walkways-steps/\" style=\"color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;\">More on walkways and entries</a>.",
        features: ['Front entry walkways & landings', 'Garden paths & stepping stones', 'Natural stone & paver steps'],
      },
      {
        title: 'FIRE FEATURES & OUTDOOR KITCHENS',
        text: 'Extend your outdoor season with a fire pit, fire table, or full masonry fireplace, and stop hauling everything in and out with a built-in grill and prep counter. <a href="/services/outdoor-kitchens/" style="color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;">More on kitchens and fire features</a>.',
        features: ['Wood & gas fire pits', 'Outdoor fireplaces', 'Stone bars & built-in grills'],
      },
      {
        title: 'DRIVEWAYS & PARKING AREAS',
        text: "Upgrade your curb appeal and functionality with a paver or natural stone driveway. We also build commercial parking areas, turnarounds, and aprons that handle heavy traffic while looking sharp. All installations include <strong>proper base work</strong> for Rochester's freeze-thaw conditions.",
        features: ['Paver & stone driveways', 'Commercial parking areas', 'Permeable paver systems'],
      },
      {
        title: 'DRAINAGE BUILT INTO THE WORK',
        text: 'Every hardscape changes how water moves. We plan pitch, base permeability, wall drainage, and the runoff path before the first spring reveals a problem. <a href="/services/drainage-grading/" style="color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;">More on drainage and grading</a>.',
        features: ['Designed pitch & runoff paths', 'Wall drainage & filter fabric', 'Downspout & catch basin tie-ins'],
      },
    ],
    processLabel: 'How It Works',
    processTitle: 'FROM FIRST CALL TO <span class="text-green">FINISHED BUILD</span>',
    processSubtitle: 'A clear sequence from site visit through final walkthrough, with scope and pricing documented before the build starts.',
    processSteps: [
      { title: 'SITE VISIT', text: 'We walk the property with you, take measurements, check grade and drainage, and talk honestly about what your budget will and will not reach.' },
      { title: 'DESIGN & PROPOSAL', text: 'You get a layout, material selections, and a written itemized estimate. Scope, materials, and price are on paper before you commit.' },
      { title: 'EXCAVATION & BASE', text: 'The part nobody photographs and everything depends on: excavation, disposal, compacted aggregate base, and drainage. This is where a build lasts or fails.' },
      { title: 'BUILD', text: 'Pavers, walls, steps, and features go in according to the agreed scope. We coordinate the work through completion and keep you informed when weather or site conditions affect the schedule.' },
      { title: 'WALKTHROUGH', text: 'We walk the finished project with you, close out the punch list, and explain how to care for the surface so it still looks right in year ten.' },
    ],
    faqs: [
      {
        question: 'How much does a paver patio cost in Rochester?',
        answer: "It depends on size, access, excavation, disposal, and the features you build into it. As a planning figure, compact seating patios in Greater Rochester typically begin around <strong>$9,000</strong>. Full outdoor rooms with seat walls, steps, a fire feature, or lighting commonly run <strong>$18,000 to $45,000</strong>. The ranges on this page reflect our usual project mix. They are not quotes; your written estimate comes after we walk the property.",
      },
      {
        question: 'Why is one contractor thousands cheaper than another for the same patio?',
        answer: "Almost always the base. A patio is several inches of compacted aggregate you never see, plus one finish layer you do. Cutting base depth, geotextile, compaction, or drainage saves money on day one and shows up as heaving and settling after a few Rochester winters. Ask any bidder about base depth, compaction, and the runoff path. Those answers usually explain the price gap.",
      },
      {
        question: "How long do pavers last in Rochester's climate?",
        answer: "Properly installed pavers last 25–50 years or more, even through Rochester freeze-thaw cycles. The key is the work underneath: a compacted aggregate base at the correct depth, adequate drainage, and polymeric sand joints. We build each installation for this climate.",
      },
      {
        question: 'Do I need a permit for a patio or retaining wall?',
        answer: "In most Rochester-area municipalities, standard patios don't require a building permit. Retaining walls over a certain height (typically 4 feet) often do, and some towns require permits for structures near property lines. We handle the permitting process and make sure your project meets local code.",
      },
      {
        question: "What's the best patio material for Rochester?",
        answer: "Concrete pavers and natural stone are the most durable options for our climate. Pavers flex with freeze-thaw movement rather than cracking like poured concrete. Natural flagstone offers a timeless look. We help you choose materials based on your aesthetic preference, budget, and how you plan to use the space.",
      },
      {
        question: 'Can hardscape work be done in the fall or winter?',
        answer: "Fall is an excellent time for hardscaping in Rochester. Cooler weather is easier on crews, and you avoid the spring rush. We can install pavers and walls into November while the ground remains workable. Winter is a good time to plan and design for the next build season.",
      },
      {
        question: 'Can I finance a hardscape project?',
        answer: 'Yes. We offer financing through <strong>Wells Fargo</strong>, so a larger project can be paid over time rather than all at once. You can apply directly from the financing section on this page; approval and terms are handled by Wells Fargo, not by us.',
      },
      {
        question: 'How long does a patio project take?',
        answer: 'Most residential patios take one to two weeks once construction begins, depending on size, excavation volume, walls, steps, and other features. Rochester weather can move the schedule. We put a realistic window in the proposal and tell you if it changes.',
      },
    ],
    heroButtons: [
      { text: 'Start Your Project', href: '/contact/?service=hardscaping', style: 'primary' },
      { text: 'See Investment Ranges', href: '#investment', style: 'outline' },
    ],
    investmentBandIds: ['patio-small', 'patio-outdoor-room', 'outdoor-kitchen', 'retaining-wall', 'walkway-entry', 'full-backyard'],
    investmentTitle: 'WHAT PROJECTS LIKE YOURS <span class="text-green">TYPICALLY RUN</span>',
    investmentIntro:
      'Most contractors make you book an appointment just to learn whether you are in the right ballpark. These broad Greater Rochester planning ranges let you decide whether the conversation makes sense before you pick up the phone.',
    featuredProjectSlugs: [
      'lit-bar-patio-outdoor-room',
      'circular-brick-patio-seat-wall',
      'multi-level-patio-seat-wall',
      'front-entry-steps-wall-rebuild',
    ],
    relatedSlugs: ['walkways-steps', 'retaining-walls', 'outdoor-kitchens'],
    ctaHeading: "LET'S BUILD SOMETHING <span style=\"text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;\">BEAUTIFUL</span>",
    ctaText: 'Tell us what needs to work better outside. We\'ll walk the site, talk through the options, and put the scope in writing.',
  },

  'walkways-steps': {
    introLabel: 'Curb Appeal & Safety',
    introTitle: 'THE PROJECT PEOPLE <span class="text-green">NOTICE FIRST</span>',
    introText: [
      'A settled front step, a walk that has heaved into a trip hazard, or a path too narrow for two people: guests notice these details before they reach your door. Homeowners often live with them for years because the project seems too small to tackle.',
      'They are also the fastest hardscape project to turn around. A front entry rebuild is usually a <strong>few days on site</strong>, not a few weeks, and it changes the first impression of the entire property. If your budget is not ready for a full backyard build, this is where it does the most visible work.',
    ],
    introCta: 'Get a Free Estimate',
    detailLabel: 'What We Build',
    detailTitle: 'WALKWAYS, STEPS & <span class="text-green">ENTRIES</span>',
    detailSubtitle: 'Rebuilt level, rebuilt safe, and rebuilt on a base that survives Rochester winters.',
    detailCards: [
      {
        title: 'FRONT ENTRY WALKWAYS',
        text: "The walk from the driveway or street to the front door. We size it so two people can walk together, run it on the line people <em>actually</em> use rather than the line the builder drew, and finish it with a contrasting soldier-course border so it reads as designed rather than poured.",
        features: ['Paver, flagstone & natural stone', 'Widened for two-abreast walking', 'Contrasting borders & banding'],
      },
      {
        title: 'ENTRY LANDINGS & STEPS',
        text: "Settled or out-of-level steps are among our most common repair calls, and they create a real liability. We remove the failing structure, rebuild on a compacted base, and set every riser to a consistent height. Uneven risers are what cause falls.",
        features: ['Full step removal & rebuild', 'Consistent riser heights', 'Wide landings at the door'],
      },
      {
        title: 'STONE STEPS & GRADE CHANGES',
        text: 'Where a property drops away, natural stone slab steps and terraced landings handle the grade without the boxed-in look of a poured stair. Often paired with a low wall that holds the surrounding bed and makes the change of level intentional.',
        features: ['Natural stone slab treads', 'Terraced landings', 'Integrated low walls'],
      },
      {
        title: 'GARDEN & CONNECTING PATHS',
        text: 'Connecting paths should follow the trips people actually make: driveway to side entry, patio to garden, or house to a fire pit at the back of the lot. They are narrower and more informal than a front walk, and can make a large yard feel far more usable.',
        features: ['Stepping stone & paver paths', 'Informal garden routes', 'Path lighting integration'],
      },
    ],
    processLabel: 'How It Works',
    processTitle: 'OUR ENTRY <span class="text-green">PROCESS</span>',
    processSubtitle: 'The project may be short. The base work still follows the same standard as a full patio.',
    processSteps: [
      { title: 'SITE VISIT', text: 'We measure, check how the grade and water move, and look at where people are actually walking today.' },
      { title: 'PROPOSAL', text: 'Layout, materials, and a written itemized price. No pressure to decide on the spot.' },
      { title: 'REMOVE & BASE', text: 'The failing walk or steps come out, and a compacted aggregate base goes in at full depth.' },
      { title: 'BUILD & FINISH', text: 'Pavers or stone are set, borders and jointing are finished, and the surrounding beds and lawn edge are restored.' },
    ],
    faqs: [
      {
        question: 'How much does a new front walkway cost in Rochester?',
        answer: 'Front walkway and entry projects in Greater Rochester typically begin around <strong>$7,500</strong> and run to roughly <strong>$16,000</strong> when they include steps, a wider landing, a retaining element, and rebuilt planting beds. That is a planning range, not a quote. Length, material, removal, and access all affect the number.',
      },
      {
        question: 'Why do my front steps keep settling?',
        answer: "Almost always, the base is too thin or poorly compacted. Steps set on native soil or a skim of stone move with Rochester freeze-thaw cycles until the risers go out of level. Resetting the top course will not solve it. The fix is excavation, a properly compacted aggregate base, and a path for water.",
      },
      {
        question: 'Can you match my existing pavers?',
        answer: "Sometimes. Paver lines change and colors are discontinued, so older work may not have an exact match. In that case, a complementary border or coordinated field usually looks better than a near-match. We show you the options before ordering.",
      },
      {
        question: 'How long does a front entry project take?',
        answer: 'Most front walkway and step projects are a <strong>two- to four-day build</strong> once we start. You will have a temporary route to the door throughout. Weather can shift the start date; we tell you when it does.',
      },
      {
        question: 'Do I need a permit for a walkway or steps?',
        answer: 'Standard walkways and entry steps generally do not require a building permit in Rochester-area municipalities. Retaining elements above a certain height and work close to a property line sometimes do. We check the requirements for your town and handle the permitting where one is needed.',
      },
    ],
    heroButtons: [
      { text: 'Get a Free Estimate', href: '/contact/?service=walkways-steps', style: 'primary' },
      { text: 'See Investment Ranges', href: '#investment', style: 'outline' },
    ],
    investmentBandIds: ['walkway-entry', 'landscape-renovation'],
    investmentIntro:
      'Entry projects are the most predictable construction work we do, which is why we can publish a fairly tight range for them.',
    featuredProjectSlugs: ['front-entry-steps-wall-rebuild', 'front-walkway-planting-beds'],
    relatedSlugs: ['hardscaping', 'retaining-walls', 'landscape-design'],
    ctaHeading: 'FIX THE FIRST THING EVERYONE <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">SEES</span>',
    ctaText: "Tell us what you want to improve at your entry and we'll take an honest look on site. <strong>Free on-site estimate</strong>, no obligation.",
  },

  'retaining-walls': {
    introLabel: 'Structural Hardscape',
    introTitle: 'A WALL IS A <span class="text-green">STRUCTURE</span>',
    introText: [
      'A retaining wall holds back heavy soil, and a wet Rochester spring makes that load heavier. Walls often fail because water collects behind them with nowhere to go, not because the face block was wrong.',
      '<strong>Drainage stone, filter fabric, and compacted backfill behind the wall are not upgrades.</strong> They are the wall. What you see is the finish. We build the part you do not see to the same standard either way, which is why our bids sometimes come in above a wall that will lean within five years.',
    ],
    introCta: 'Get a Free Estimate',
    detailLabel: 'What We Build',
    detailTitle: 'RETAINING & <span class="text-green">SEAT WALLS</span>',
    detailSubtitle: 'From a low garden wall to a terraced structural install.',
    detailCards: [
      {
        title: 'SEGMENTAL BLOCK WALLS',
        text: 'The workhorse of Rochester retaining work: manufactured units in a range of textures and colors, dry-stacked with a batter and locked with a pin or lip system. Fast to build, consistent, and available in the heavier units that taller walls require.',
        features: ['Multiple textures & colors', 'Capped and finished tops', 'Sized to the retained load'],
      },
      {
        title: 'NATURAL STONE & BOULDER WALLS',
        text: 'Quarried stone and placed boulders for a wall that looks like it belongs to the site rather than to a catalog. Boulder walls in particular handle irregular grade well and read as landscape rather than as construction.',
        features: ['Quarried & fieldstone options', 'Placed boulder walls', 'Naturalistic grade transitions'],
      },
      {
        title: 'SEAT WALLS & PILLARS',
        text: 'Low walls at seating height around a patio, often with lit pillars at the corners or flanking the steps. They define the outdoor room, add permanent seating that never needs to be stored for winter, and carry the lighting.',
        features: ['Seating-height wall runs', 'Lit stone pillars', 'Integrated low-voltage lighting'],
      },
      {
        title: 'TERRACED & MULTI-LEVEL WALLS',
        text: 'On a steep grade, two or three shorter walls with planted terraces can outperform one tall wall. Each structure carries less load, the property gains usable planting area, and the view from the house improves.',
        features: ['Stepped terrace design', 'Planted intermediate levels', 'Reduced load per structure'],
      },
      {
        title: 'FAILING WALL ASSESSMENT & REBUILD',
        text: 'If your wall is leaning, bulging, or shedding units, we will tell you honestly whether it can be reset or has to come out. Rebuilding a wall that is going to fail again is a waste of your money and our time.',
        features: ['Honest reset vs. rebuild call', 'Root cause diagnosis', 'Drainage corrected on rebuild'],
      },
      {
        title: 'DRAINAGE BEHIND THE WALL',
        text: 'Every wall we build gets drainage stone behind the face, filter fabric to keep fines out of that stone, and an outlet path for the water. Where the volume warrants it, a perforated drain line runs the length of the wall to daylight.',
        features: ['Clean drainage stone backfill', 'Filter fabric separation', 'Perforated drain to daylight'],
      },
    ],
    processLabel: 'How It Works',
    processTitle: 'HOW WE BUILD A <span class="text-green">WALL</span>',
    processSubtitle: 'Most of this work is invisible when we leave. That is the point.',
    processSteps: [
      { title: 'ASSESS', text: 'We look at the grade, what the wall has to hold, how water moves across the site, and whether a permit applies at that height.' },
      { title: 'PROPOSAL', text: 'Wall type, height, length, materials, drainage detail, and a written itemized price.' },
      { title: 'EXCAVATE & BASE', text: 'We over-excavate behind the wall line and compact a leveling pad. The base course sets the accuracy of every course above it.' },
      { title: 'BUILD & BACKFILL', text: 'Units go up with the correct batter, drainage stone and fabric go in behind as we climb, and backfill is compacted in lifts.' },
      { title: 'CAP & RESTORE', text: 'Caps are set and secured, the terrace above is graded and planted, and the surrounding lawn is restored.' },
    ],
    faqs: [
      {
        question: 'How much does a retaining wall cost in Rochester?',
        answer: 'Retaining wall projects here typically run <strong>$12,000 to $65,000</strong>. That is a wide range because height drives it non-linearly: a 3-foot garden wall and a 6-foot structural wall of the same length are different projects with different excavation, different units, and sometimes an engineering requirement. Square face footage, access for equipment, and material choice set where you land. It is a planning range, not a quote.',
      },
      {
        question: 'Why is my retaining wall leaning?',
        answer: 'Nearly always water. If drainage stone and an outlet were not built in behind the wall, saturated soil pushes on the back of the face with pressure the units were never meant to take, and the wall rotates outward. Frost heave from that same trapped water accelerates it. A leaning wall is telling you about its backfill, not its block.',
      },
      {
        question: 'Do I need a permit or an engineer for a retaining wall?',
        answer: 'It depends on height and your municipality. Many Rochester-area towns require a permit above roughly 4 feet. Taller or surcharged walls, such as one holding back a driveway or structure, can require a licensed engineer’s design. We check the local requirements, tell you when engineering is needed, and handle the permitting.',
      },
      {
        question: 'Can you repair a wall instead of replacing it?',
        answer: 'Sometimes. If the base is sound and only the top courses have shifted, a reset can be worth doing. If the wall is leaning from the bottom, bulging mid-face, or was built without drainage, a reset just buys a season or two. We give you the honest call and the reasoning, and let you decide.',
      },
      {
        question: 'How tall can a segmental block wall be?',
        answer: 'Taller than most people expect, with the right units, geogrid reinforcement, and engineering. In practice, we often recommend two shorter walls with a planted bench between them. That can cost less than one tall reinforced wall and usually looks better from the house.',
      },
    ],
    heroButtons: [
      { text: 'Get a Free Estimate', href: '/contact/?service=retaining-walls', style: 'primary' },
      { text: 'See Investment Ranges', href: '#investment', style: 'outline' },
    ],
    investmentBandIds: ['retaining-wall', 'patio-outdoor-room'],
    investmentIntro:
      'Wall pricing depends on square face footage, height, and what the wall holds back. The honest range stays wide until we see the site.',
    featuredProjectSlugs: [
      'stone-retaining-wall-shade-garden',
      'front-entry-steps-wall-rebuild',
      'multi-level-patio-seat-wall',
    ],
    relatedSlugs: ['hardscaping', 'drainage-grading', 'walkways-steps'],
    ctaHeading: 'BUILD IT ONCE, BUILD IT <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">RIGHT</span>',
    ctaText: "Whether it's a new wall or one that's already failing, we'll walk the site and give you an honest assessment. <strong>Free estimate</strong>.",
  },

  'outdoor-kitchens': {
    introLabel: 'Outdoor Living',
    introTitle: 'WHERE THE EVENING <span class="text-green">ACTUALLY HAPPENS</span>',
    introText: [
      'A fire feature is the single highest-return addition to a Rochester patio, because it adds weeks to each end of a short outdoor season. People stay outside in September and October around a fire in a way they simply do not around an empty patio.',
      'An outdoor kitchen solves a different problem: the trip back inside. A built-in grill, a prep counter, and somewhere to set a drink means the person cooking is still part of the evening instead of shuttling between the patio and the kitchen all night.',
      '<strong>Both are best planned with the patio.</strong> Utility runs, structural footings, and the seating layout around a fire are far cheaper to design in than to retrofit into a finished surface later.',
    ],
    introCta: 'Get a Free Estimate',
    detailLabel: 'What We Build',
    detailTitle: 'KITCHENS & <span class="text-green">FIRE FEATURES</span>',
    detailSubtitle: 'From a simple fire pit to a full masonry cooking run.',
    detailCards: [
      {
        title: 'FIRE PITS',
        text: 'A masonry fire pit can add weeks to the outdoor season, but its size and location have to suit the seating. Too small and nobody can sit back. Too close to the house and smoke finds the windows.',
        features: ['Wood-burning & gas', 'Sized to the seating circle', 'Built into the patio field'],
      },
      {
        title: 'OUTDOOR FIREPLACES',
        text: 'A full masonry fireplace becomes the backdrop of the whole backyard and gives you a wall to build seating against. Bigger commitment than a fire pit, and a fundamentally different piece of architecture.',
        features: ['Full masonry construction', 'Hearth & seating integration', 'Chimney sited for prevailing wind'],
      },
      {
        title: 'BUILT-IN GRILLS & COOKING RUNS',
        text: "A stone-faced counter run brings together a built-in grill, prep space, and storage. We size the cutout to the appliance you choose before a single block is set.",
        features: ['Appliance-specific cutouts', 'Granite & stone counters', 'Access doors & storage'],
      },
      {
        title: 'BARS & SERVING COUNTERS',
        text: 'A raised bar overhang with stool seating turns the cooking side into the social side. It is also the detail that most reliably makes a patio look finished rather than furnished.',
        features: ['Bar-height overhangs', 'Stool seating clearance', 'Under-counter accent lighting'],
      },
    ],
    processLabel: 'How It Works',
    processTitle: 'PLANNING A FIRE OR <span class="text-green">KITCHEN FEATURE</span>',
    processSubtitle: 'The sequencing matters more here than anywhere else in hardscape.',
    processSteps: [
      { title: 'HOW YOU USE IT', text: 'Who cooks, how many people gather, and what time of year you are outside. The answers drive size and placement more than style does.' },
      { title: 'LAYOUT & UTILITIES', text: 'We locate the feature for wind, smoke, and seating flow, then plan any gas or electrical runs before the base goes in.' },
      { title: 'PROPOSAL', text: 'Materials, appliance specifications, layout, and a written itemized price.' },
      { title: 'BUILD', text: 'Footings and base first, then masonry, counters, and appliances, with lighting run through the structure as it goes up.' },
    ],
    faqs: [
      {
        question: 'How much does an outdoor kitchen cost in Rochester?',
        answer: 'A stone bar and counter run with a built-in grill typically begins around <strong>$15,000</strong>. Larger cooking-and-gathering builds with more appliances, a fireplace, or granite counters go well beyond that. A simple masonry fire pit in an existing patio is a much smaller project. These are planning figures; appliance selection alone can move a kitchen budget by five figures.',
      },
      {
        question: 'Gas or wood-burning fire pit?',
        answer: 'Gas lights instantly, produces no smoke or sparks, and shuts off when you go inside. It works well for frequent use and smaller yards with close neighbors. Wood gives you the smell and sound of a traditional fire and costs less to build, but needs storage, cleanup, and more clearance. A gas line is far cheaper to plan before the patio is built.',
      },
      {
        question: 'Can you add a kitchen or fire feature to my existing patio?',
        answer: 'Usually yes. The constraints are whether the existing base can carry the load of a masonry structure, whether utilities can be run without tearing up the field, and whether there is clearance for both the feature and the seating around it. We assess all three on site and tell you honestly if the retrofit makes sense.',
      },
      {
        question: 'How close to my house can a fire feature be?',
        answer: "Clearance requirements vary by municipality and fuel type. Code is not the only concern; prevailing wind can put smoke on the patio or through a bedroom window. We plan for both and check the requirements in your town.",
      },
      {
        question: 'Do outdoor kitchens work through Rochester winters?',
        answer: 'The masonry does, when built with proper footings below frost. Appliances and water lines are the vulnerable part: any plumbing needs to be blown out before the freeze, and grills and refrigerators should be covered or pulled for the season. We walk you through the winterization at the final walkthrough.',
      },
    ],
    heroButtons: [
      { text: 'Get a Free Estimate', href: '/contact/?service=outdoor-kitchens', style: 'primary' },
      { text: 'See Investment Ranges', href: '#investment', style: 'outline' },
    ],
    investmentBandIds: ['outdoor-kitchen', 'patio-outdoor-room'],
    investmentIntro:
      'Fire and kitchen features are usually built with a patio, so these ranges assume the surface is part of the project or already exists.',
    featuredProjectSlugs: ['stone-outdoor-kitchen-bar', 'circular-brick-patio-seat-wall', 'lit-bar-patio-outdoor-room'],
    relatedSlugs: ['hardscaping', 'retaining-walls', 'landscape-design'],
    ctaHeading: 'EXTEND YOUR OUTDOOR <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">SEASON</span>',
    ctaText: "Tell us how you'd actually use the space and we'll design around that. <strong>Free on-site estimate</strong>.",
  },

  'drainage-grading': {
    introLabel: 'Water Management',
    introTitle: 'MOVE THE WATER <span class="text-green">FIRST</span>',
    introText: [
      "Standing water every spring, a soggy strip along the foundation, mulch washing across the walk, or a corner of lawn that never recovers all point to grade or drainage problems. New plants and fresh mulch will not fix them.",
      "Rochester makes this worse than most places: heavy clay subsoil that drains slowly, plenty of flat lots, and a freeze-thaw cycle that keeps rearranging the surface. Water that has nowhere to go finds your foundation.",
      '<strong>Drainage is the least glamorous work we do and the most likely to protect everything else on the property.</strong> It belongs ahead of the patio, wall, or planting bed, not underneath it as an afterthought.',
    ],
    introCta: 'Get a Free Estimate',
    detailLabel: 'What We Install',
    detailTitle: 'DRAINAGE & <span class="text-green">GRADING SOLUTIONS</span>',
    detailSubtitle: "Matched to the actual problem, not sold as a package.",
    detailCards: [
      {
        title: 'FRENCH & CURTAIN DRAINS',
        text: 'A perforated pipe in a stone-filled trench wrapped in filter fabric, intercepting subsurface water and carrying it somewhere useful. The most common fix for a chronically wet lawn area or a wet foundation wall.',
        features: ['Perforated pipe & clean stone', 'Filter fabric wrap', 'Outlet to daylight or dry well'],
      },
      {
        title: 'CATCH BASINS & YARD INLETS',
        text: 'Where surface water collects in a low spot faster than it can soak in, a catch basin and solid pipe run gets it off the lawn. Often paired with grading that intentionally directs water toward the inlet.',
        features: ['Grated basins at low points', 'Solid pipe conveyance', 'Silt trap & cleanout access'],
      },
      {
        title: 'DOWNSPOUT & SUMP TIE-INS',
        text: 'Downspouts dumping at the foundation are a common cause of wet basements and soggy beds. Piping them and a sump discharge underground to a proper outlet is often the least expensive drainage improvement that makes a real difference.',
        features: ['Underground downspout piping', 'Sump discharge routing', 'Pop-up emitters or daylight outlets'],
      },
      {
        title: 'DRY CREEK BEDS & SWALES',
        text: 'When water has to cross a property, a shaped swale or a stone-lined dry creek bed carries it on a designed path instead of an accidental one. Done well, it reads as a landscape feature rather than as a drainage fix.',
        features: ['Shaped and stabilized swales', 'Stone-lined creek beds', 'Planted edges for stability'],
      },
      {
        title: 'REGRADING & FOUNDATION PROTECTION',
        text: 'Positive slope away from the house for the first several feet is the baseline every property should have and many older Rochester lots have lost to settling. Regrading restores it, and often solves problems that looked like they needed a drain.',
        features: ['Positive slope restoration', 'Settled area correction', 'Topsoil & seed restoration'],
      },
      {
        title: 'DRAINAGE WITHIN HARDSCAPE',
        text: 'Patios, walls, and driveways all change how water moves. Pitch, permeable base options, wall drainage, and where the runoff is directed are designed into every hardscape project we build.',
        features: ['Designed patio pitch', 'Permeable paver systems', 'Wall drainage & outlets'],
      },
    ],
    processLabel: 'How It Works',
    processTitle: 'DIAGNOSE, THEN <span class="text-green">DIG</span>',
    processSubtitle: 'Installing the wrong drain in the wrong place is expensive and changes nothing.',
    processSteps: [
      { title: 'SEE THE PROBLEM', text: 'We walk the site, ideally after rain, and look at where water comes from, where it collects, and where it could legally and practically go.' },
      { title: 'DIAGNOSE', text: 'Surface runoff, subsurface flow, roof water, and a failed grade all look similar in a photo and need different fixes. We tell you which one you have.' },
      { title: 'PROPOSAL', text: 'You get the specific fix, its outlet path, and an itemized price in writing, including honest limits where the site cannot fully drain.' },
      { title: 'INSTALL & RESTORE', text: 'Trenching, pipe, stone, and fabric go in, then the lawn and beds are restored so the yard does not look excavated when we leave.' },
    ],
    faqs: [
      {
        question: 'How much does yard drainage cost in Rochester?',
        answer: 'Drainage projects commonly begin around <strong>$1,800</strong> for a focused correction and can exceed <strong>$12,000</strong> for a full-property solution with multiple basins, long pipe runs, and regrading. Run length, depth, obstructions, and especially a usable outlet drive the number. This is a broad market-based planning range, not a quote.',
      },
      {
        question: 'Why does water pool in the same spot every spring?',
        answer: "Usually a low point with clay beneath it: the surface collects water faster than the subsoil can take it. Sometimes it is a grade that has settled over years and now pitches back toward the house. Which one you have changes the fix entirely, which is why we want to look at the site rather than diagnose from a photo.",
      },
      {
        question: 'Will a French drain fix my wet basement?',
        answer: "It can help when water is arriving from the yard. In many Rochester homes, the culprit is a downspout discharging at the foundation, which is a much cheaper fix. Outdoor drainage cannot repair a failed foundation wall, bad interior drain tile, or high water table. We will say when the problem is outside our scope rather than sell you a trench that will not solve it.",
      },
      {
        question: 'Where does the water actually go?',
        answer: 'To daylight at a lower point, a dry well sized for the volume, or a legal storm connection where one exists and the municipality permits it. Every design needs a real outlet. A drain that ends nowhere simply moves the puddle. If the site lacks a good outlet, we say so up front.',
      },
      {
        question: 'Can drainage be done at the same time as my patio?',
        answer: 'It should be. Excavation is already happening, the equipment is already on site, and the patio pitch and base can be designed to work with the drainage rather than against it. Retrofitting drainage under a finished patio means taking the patio up.',
      },
    ],
    heroButtons: [
      { text: 'Get a Free Estimate', href: '/contact/?service=drainage-grading', style: 'primary' },
      { text: 'See Investment Ranges', href: '#investment', style: 'outline' },
    ],
    investmentBandIds: ['drainage-grading', 'landscape-renovation'],
    investmentIntro:
      'Drainage pricing depends almost entirely on run length and whether the site has a usable outlet, so treat these as planning figures only.',
    featuredProjectSlugs: ['stone-retaining-wall-shade-garden', 'multi-level-patio-seat-wall'],
    relatedSlugs: ['hardscaping', 'retaining-walls', 'landscape-design'],
    ctaHeading: 'STOP FIGHTING THE <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">WATER</span>',
    ctaText: "We'll walk the property and identify the likely cause, including when the right answer is not a drain. <strong>Free estimate</strong>.",
  },

  'water-features': {
    introLabel: 'Transform Your Outdoor Space',
    introTitle: 'THE BEAUTY OF <span class="text-green">WATER</span>',
    introText: [
      'Moving water changes the feel of a yard. A small bubbler can soften street noise near a patio, while a pond or stream can become the feature the rest of the landscape gathers around.',
      `Westside Professional Landscape designs and builds water features around the property and the way you want to use it. That might mean a natural-stone waterfall, a koi pond, or a compact fountain near the entry. We have built water features in Pittsford, Brighton, Penfield, and across Greater Rochester for over ${yearsInBusiness} years.`,
    ],
    detailLabel: 'What We Build',
    detailTitle: 'WATER FEATURE <span class="text-green">SERVICES</span>',
    detailSubtitle: 'Ponds, waterfalls, streams, and compact fountains, plus the seasonal care Rochester weather requires.',
    detailCards: [
      {
        title: 'PONDS & KOI PONDS',
        text: "A garden pond is a living backyard system. We plan filtration, aeration, and plant shelves around the aquatic life it will support, from koi to native plantings. Rochester winters also affect pond depth, so overwintering is part of the design from the start.",
        features: ['Proper filtration & aeration', 'Fish-safe depth engineering', 'Aquatic plant integration'],
      },
      {
        title: 'WATERFALLS & STREAMS',
        text: "Waterfalls and streams bring movement and sound through the landscape. We set natural boulders and stone so the water follows a believable path, then size the recirculating pump for dependable operation.",
        features: ['Natural boulder construction', 'Recirculating pump systems', 'Multi-tier cascade designs'],
      },
      {
        title: 'FOUNTAINS & BUBBLERS',
        text: "When a full pond does not fit, a fountain or bubbling rock brings the sound of water to a courtyard, entry, patio, or small garden. These self-contained features take up less space and need less care than a pond.",
        features: ['Self-contained systems', 'Low maintenance', 'Bubbling rocks & columns'],
      },
      {
        title: 'MAINTENANCE & WINTERIZATION',
        text: 'Water features in Rochester need <strong>seasonal care</strong>. We provide spring startup services, routine maintenance through the season, and fall winterization to protect your investment from freeze damage. Our maintenance programs include pump inspection, filter cleaning, water treatment, and debris removal to keep your feature running beautifully.',
        features: ['Spring startup & fall shutdown', 'Pump & filter service', 'Water quality management'],
      },
    ],
    processSteps: [],
    faqs: [
      {
        question: 'How much maintenance does a pond require?',
        answer: "A well-built pond needs regular but manageable care: filter cleaning, debris removal, water-quality checks, and seasonal plant work. We offer maintenance programs that cover it. Spring startup and fall winterization are the two most important visits because they protect the system through Rochester winters.",
      },
      {
        question: "Can a water feature run through Rochester's winter?",
        answer: "Most water features are winterized and shut down for the season to prevent freeze damage to pumps and plumbing. Some waterfall features can be run through early winter for a dramatic iced-over look, but ponds and fountains should be properly winterized before hard freezes set in. We handle the entire winterization process.",
      },
      {
        question: 'Do water features attract mosquitoes?',
        answer: "Mosquitoes breed in stagnant water, not moving water. Our recirculating pumps keep the water moving, and fish such as koi and goldfish eat mosquito larvae.",
      },
      {
        question: 'How much space do I need for a backyard water feature?',
        answer: "Water features can be designed for almost any space. A bubbling rock or small fountain fits in a courtyard or corner garden. Larger properties can accommodate full ponds, waterfalls, and streams. During the design consultation, we assess your space, discuss your vision, and recommend features that fit both the property and your budget.",
      },
    ],
    heroButtons: [
      { text: 'Get a Free Estimate', href: '/contact/?service=water-features', style: 'primary' },
      { text: 'See Our Projects', href: '/projects/', style: 'outline' },
    ],
    relatedSlugs: ['hardscaping', 'landscape-design', 'drainage-grading'],
    ctaHeading: 'BRING THE SOUND OF <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">WATER HOME</span>',
    ctaText: 'Tell us where you want to see and hear the water. We will look at the site and talk through the right scale and style.',
  },

  'snow-ice-management': {
    introLabel: "Rochester's Winters Demand More",
    introTitle: 'PROFESSIONAL <span class="text-green">SNOW MANAGEMENT</span>',
    introText: [
      'Rochester averages <strong>nearly 100 inches of snow each year</strong>. For Monroe County property managers, every storm affects parking, deliveries, entrances, and the people crossing the site on foot.',
      "Westside plans commercial snow and ice service around each property before winter. Trigger depths, priority areas, equipment, and pricing are written into the agreement, while our crews monitor conditions and work the route as storms develop.",
    ],
    detailLabel: 'Our Services',
    detailTitle: 'SNOW & ICE <span class="text-green">SERVICES</span>',
    detailSubtitle: 'Plowing, walkway clearing, and de-icing planned for commercial properties across Monroe County.',
    detailCards: [
      {
        title: 'COMMERCIAL PLOWING',
        text: 'Our fleet of trucks and loaders are equipped and ready to handle everything from a light dusting to a major lake-effect event. We service parking lots, access roads, loading docks, and emergency lanes. Trigger depths and response times are established in advance so there are no surprises when a storm hits.',
        features: ['Parking lots & access roads', 'Loading docks & emergency lanes', 'Pre-determined trigger depths'],
      },
      {
        title: 'WALKWAY & ENTRANCE CLEARING',
        text: "<strong>Walkway access</strong> matters as much as a clear parking lot. Sidewalk crews use snow blowers, shovels, and brooms on entrances, emergency exits, and ADA-accessible paths according to the property plan.",
        features: ['Building entrances & exits', 'Sidewalks & pedestrian paths', 'ADA-accessible routes'],
      },
      {
        title: 'DE-ICING & SALT APPLICATION',
        text: 'We select rock salt, treated salt, or liquid de-icer for the conditions. Pre-treatment, service during the event, and post-storm applications are scheduled where the contract calls for them. Calibrated rates target the surface without needless overapplication.',
        features: ['Pre-treatment & anti-icing', 'Rock salt & treated salt', 'Environmentally conscious application'],
      },
      {
        title: 'SEASONAL CONTRACTS',
        text: "A seasonal contract sets the winter budget and service plan before the first storm. Trigger depths, priority areas, and included work are matched to the property, giving you <strong>predictable costs</strong> from November through April. Per-push options are also available.",
        features: ['Fixed seasonal pricing', 'Per-push options also available', 'Customized service plans'],
      },
    ],
    processSteps: [],
    faqs: [
      {
        question: 'What triggers a snow plowing visit?',
        answer: "Trigger depths and response priorities are established in your contract. Once accumulation hits the agreed trigger, our crews follow the property's service plan. We monitor forecasts and conditions throughout each event so routes can be adjusted as Rochester weather changes.",
      },
      {
        question: 'Do you offer residential snow removal?',
        answer: "Our snow and ice management services are focused on commercial properties, HOAs, and multi-unit residential complexes where liability and access are critical. For large residential estates or properties with specific needs, contact us to discuss options.",
      },
      {
        question: 'How does a seasonal snow contract work?',
        answer: "A seasonal contract covers the agreed snow and ice services for the winter, typically November through April, at a fixed price. That sets your winter budget before the snow arrives. We also offer per-event pricing for properties that prefer it.",
      },
      {
        question: 'What de-icing products do you use?',
        answer: "We use a combination of rock salt, treated salt, and liquid de-icers, selected based on the specific conditions of each storm. Pre-treatment before storms is standard for high-traffic areas. Application rates are calibrated to be effective while minimizing environmental impact on surrounding landscaping and waterways.",
      },
    ],
    heroButtons: [
      { text: 'Request a Snow Proposal', href: '/contact/?service=snow-ice-management', style: 'primary' },
      { text: 'Call (585) 594-8420', href: 'tel:+15855948420', style: 'outline' },
    ],
    relatedSlugs: ['landscape-maintenance', 'hardscaping', 'holiday-lighting'],
    ctaHeading: "DON'T WAIT FOR THE FIRST <span style=\"text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;\">STORM</span>",
    ctaText: "Set the trigger depths, priority areas, and pricing before Rochester weather tests the property.",
  },

  'artificial-grass': {
    introLabel: 'SYNLawn Authorized Dealer',
    introTitle: 'YEAR-ROUND <span class="text-green">GREEN</span>',
    introText: [
      "As an <strong>Authorized SYNLawn dealer</strong>, Westside Professional Landscape installs artificial turf for homes and businesses across Greater Rochester. It stays green without mowing, watering, fertilizing, or weed control, even after a Rochester winter.",
      "SYNLawn fibers are made to look and feel like natural grass while handling foot traffic, pets, and our four-season climate. The products carry <strong>manufacturer warranties</strong>.",
    ],
    introCta: 'Request a Free Consultation',
    detailLabel: 'Applications',
    detailTitle: 'ARTIFICIAL TURF <span class="text-green">SOLUTIONS</span>',
    detailSubtitle: 'SYNLawn surfaces for home lawns, pet areas, putting greens, and commercial spaces.',
    detailCards: [
      {
        title: 'RESIDENTIAL LAWNS',
        text: "A <strong>low-maintenance artificial lawn</strong> stays green in front yards, side yards, and backyard living areas without mowing or watering. It is especially useful where Rochester clay, dense shade, or heavy traffic makes natural turf hard to maintain.",
        features: ['Front & back yard installations', 'Pet-friendly options', 'Looks natural year-round'],
      },
      {
        title: 'PUTTING GREENS & SPORT TURF',
        text: "Practice your short game at home with a custom <strong>backyard putting green</strong>, or install sport turf for a play area that stands up to heavy use. SYNLawn's sport-specific products are engineered for consistent ball roll, proper drainage, and long-term durability under active play.",
        features: ['Custom putting greens', 'Playground & sport surfaces', 'Consistent performance'],
      },
      {
        title: 'COMMERCIAL & HOA INSTALLATIONS',
        text: 'Artificial turf can reduce routine grounds work in common areas, entrances, and other high-visibility spaces. It fits commercial properties where <strong>a consistent green surface matters</strong> and irrigation is impractical or expensive.',
        features: ['Building entrances & courtyards', 'HOA common areas', 'High-traffic commercial zones'],
      },
      {
        title: 'PET AREAS',
        text: "SYNLawn's pet-specific products feature antimicrobial backing and excellent drainage for <em>easy cleanup</em>. No more mud tracked through the house, no brown spots from pet waste, and no chemicals your pets might encounter on a treated natural lawn. Designed for heavy pet use and simple maintenance.",
        features: ['Antimicrobial technology', 'Superior drainage', 'No mud or brown spots'],
      },
    ],
    processLabel: 'How It Works',
    processTitle: 'INSTALLATION <span class="text-green">PROCESS</span>',
    processSubtitle: 'The finish depends on careful drainage, base preparation, seams, and infill.',
    processSteps: [
      { title: 'SITE PREP', text: 'We remove existing vegetation, level the ground, and install proper drainage to create a stable foundation.' },
      { title: 'BASE WORK', text: 'A compacted aggregate base and geotextile fabric prevent weeds and ensure long-term stability.' },
      { title: 'TURF INSTALLATION', text: 'SYNLawn turf is precisely cut, fitted, and secured. Infill material is applied and brushed for a natural look.' },
      { title: 'FINAL INSPECTION', text: 'We walk the installation with you to ensure everything meets our standards and your expectations.' },
    ],
    faqs: [
      {
        question: 'How long does artificial grass last?',
        answer: "Premium SYNLawn turf typically lasts 15\u201320 years with normal use. The fibers are UV-stabilized to resist fading, and the backing is engineered for drainage and durability. Most installations come with a manufacturer warranty. Actual lifespan depends on foot traffic, use, and maintenance.",
      },
      {
        question: 'Is artificial turf safe for pets?',
        answer: "Yes. SYNLawn's pet-specific products feature antimicrobial backing that inhibits bacteria and odor, plus excellent drainage for easy cleanup. No fertilizers or pesticides means a chemical-free surface for your animals. Many pet owners choose artificial turf specifically because it eliminates mud, brown spots, and the maintenance cycle that comes with natural grass in pet areas.",
      },
      {
        question: "Does artificial grass get hot in the summer?",
        answer: "Artificial turf can get warm on very hot, sunny days, similar to a deck or patio surface. SYNLawn products incorporate cooling technology that reduces surface temperatures compared to standard synthetic turf. Shaded areas stay comfortable, and the turf cools quickly once the sun moves. For play areas, we can recommend products with enhanced cooling properties.",
      },
      {
        question: "How does artificial grass handle Rochester's snow?",
        answer: "Artificial turf handles snow well. You can shovel or blow snow off without damaging the fibers, and meltwater drains through the permeable backing. There is no mud season, dormancy, or spring recovery period. The lawn is green when the snow clears.",
      },
    ],
    heroButtons: [
      { text: 'Get a Free Consultation', href: '/contact/?service=artificial-grass', style: 'primary' },
      { text: 'See Investment Ranges', href: '#investment', style: 'outline' },
    ],
    investmentBandIds: ['artificial-turf'],
    investmentIntro:
      'Turf pricing depends on square footage, base preparation, and contouring. A flat pet area and a multi-break putting green are very different installations.',
    featuredProjectSlugs: [
      'private-putting-green-complex',
      'residential-artificial-lawn',
      'backyard-putting-green',
    ],
    relatedSlugs: ['hardscaping', 'landscape-design', 'landscape-maintenance'],
    ctaHeading: 'READY FOR A LAWN THAT\'S ALWAYS <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">GREEN?</span>',
    ctaText: "Schedule a <strong>free consultation</strong>. We'll assess the property and show you where SYNLawn fits, what the base needs, and what the project is likely to cost.",
  },

  'commercial-services': {
    introLabel: 'Grounds Management for Business',
    introTitle: 'COMMERCIAL <span class="text-green">LANDSCAPE SERVICES</span>',
    introText: [
      "<strong>Westside Professional Landscape</strong> manages commercial grounds across Greater Rochester. Weekly maintenance, seasonal enhancements, and snow and ice service run through <em>one point of contact</em> instead of a stack of vendors.",
      "Our crews bring over <strong>two decades of experience</strong> on office parks, retail centers, medical facilities, HOA communities, and industrial properties throughout Monroe County. Each property gets a defined scope and service schedule.",
    ],
    introCta: 'Request a Commercial Proposal',
    detailLabel: 'What We Offer',
    detailTitle: 'COMMERCIAL <span class="text-green">SERVICES</span>',
    detailSubtitle: 'Recurring grounds care and seasonal response through one local provider.',
    detailCards: [
      {
        title: 'LANDSCAPE MAINTENANCE',
        text: "Mowing, edging, bed maintenance, pruning, cleanup, and mulching run on a predictable schedule. A defined crew learns the property, and the maintenance plan reflects its needs and budget.",
        features: ['Weekly mowing & edging', 'Seasonal cleanups', 'Bed care & mulching'],
      },
      {
        title: 'SNOW & ICE MANAGEMENT',
        text: "Rochester's winters demand a <strong>prepared snow management partner</strong>. We offer seasonal contracts for plowing, sidewalk clearing, and de-icing. Trigger depths, response priorities, and service areas are established in advance so your property has a clear plan for winter weather.",
        features: ['Contract-based response', 'Seasonal contracts', 'Plowing, clearing & de-icing'],
      },
      {
        title: 'SEASONAL COLOR & ENHANCEMENTS',
        text: "Seasonal flowers and containers keep entrances, courtyards, and common areas looking cared for. We schedule <em>spring, summer, and fall</em> rotations around the property and growing season.",
        features: ['Seasonal flower rotations', 'Container planting', 'Entrance & focal point displays'],
      },
      {
        title: 'TURF & IRRIGATION',
        text: "Commercial turf programs can combine fertilization, weed control, aeration, and overseeding with <strong>full irrigation management</strong>. We handle spring startup, in-season adjustments, and fall winterization.",
        features: ['Fertilization & weed control', 'Aeration & overseeding', 'Irrigation management'],
      },
    ],
    processSteps: [],
    faqs: [
      {
        question: 'Do you offer bundled year-round commercial services?',
        answer: "Yes. Many commercial clients put landscape maintenance, snow management, and seasonal enhancements under one annual agreement and one point of contact. It reduces vendor handoffs and keeps the same provider responsible as the seasons change.",
      },
      {
        question: 'How do you handle emergency snow events?',
        answer: "Snow response is defined by each commercial contract, including trigger depths, priority areas, and service expectations. We monitor forecasts and conditions throughout storm events and route crews according to those agreed plans. Contact us if your property needs a specific response window or re-service arrangement.",
      },
      {
        question: 'Can you manage multiple properties for the same company?',
        answer: "Yes. We manage multi-property portfolios across Monroe County through one account manager, with a separate service schedule and reporting plan for each location.",
      },
    ],
    heroButtons: [
      { text: 'Request a Commercial Proposal', href: '/contact/?service=commercial-services', style: 'primary' },
      { text: 'Call (585) 594-8420', href: 'tel:+15855948420', style: 'outline' },
    ],
    relatedSlugs: ['landscape-maintenance', 'snow-ice-management', 'plant-health'],
    ctaHeading: "LET'S TALK ABOUT YOUR <span style=\"text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;\">PROPERTY</span>",
    ctaText: "Request a <strong>commercial proposal</strong>. We'll walk the property, define the service priorities, and put the schedule and price in writing.",
  },

  'holiday-lighting': {
    introLabel: 'Let Us Handle the Lights',
    introTitle: 'PROFESSIONAL <span class="text-green">HOLIDAY DECORATING</span>',
    introText: [
      "Enjoy the lights without climbing a cold ladder or sorting tangled strands. Westside handles the holiday display from the first design through installation, in-season maintenance, takedown, and storage.",
      "We design around the building instead of forcing the same display onto every property. A Pittsford home may call for a clean warm-white roofline, while a Greece commercial entrance needs a brighter display that reads from the road.",
    ],
    detailLabel: 'Our Services',
    detailTitle: 'HOLIDAY DECORATING <span class="text-green">SERVICES</span>',
    detailSubtitle: 'Custom displays for Greater Rochester homes and businesses, installed and removed by our crew.',
    detailCards: [
      {
        title: 'CUSTOM LIGHTING DESIGN',
        text: "We walk the property and build the lighting plan around its roofline, trees, entries, and best sight lines. Choose warm white, multicolor, or a mix that fits the property. LED lights keep energy use lower while delivering a bright, even display.",
        features: ['On-site design consultation', 'LED & traditional options', 'Roofline, tree, & landscape lighting'],
      },
      {
        title: 'WREATHS & GARLAND',
        text: "Wreaths, garland, and bows finish the parts of a display that lights alone cannot. We install them on doors, windows, fences, railings, entries, columns, and mantels. Fresh greenery options include Fraser fir, noble fir, and mixed evergreen selected to hold up through a Rochester December.",
        features: ['Fresh & artificial options', 'Doors, windows & railings', 'Custom bows & ribbon'],
      },
      {
        title: 'COMMERCIAL DISPLAYS',
        text: 'Commercial-grade lighting gives storefronts, offices, retail centers, restaurants, and HOA common areas a finished seasonal look. Timers and automated controls keep the display on schedule without adding another daily task for your staff.',
        features: ['Commercial-grade lighting', 'Storefronts & office buildings', 'Timers & automated controls'],
      },
      {
        title: 'TAKEDOWN & STORAGE',
        text: "After the season, we remove the lights, decorations, and hardware, then inspect, label, and store them for next year. No tangled attic boxes and no forgotten strand still hanging in February.",
        features: ['Careful removal', 'Inspection & repair', 'Organized storage'],
      },
    ],
    processLabel: 'How It Works',
    processTitle: 'OUR HOLIDAY <span class="text-green">PROCESS</span>',
    processSubtitle: 'You approve the plan. We handle the ladders, service calls, takedown, and storage.',
    processSteps: [
      { title: 'CONSULTATION', text: 'We visit your property, discuss your vision and budget, and develop a custom design plan.' },
      { title: 'INSTALLATION', text: 'Our crew installs the approved display carefully and keeps attachment points appropriate for the property.' },
      { title: 'MAINTENANCE', text: "If a bulb goes out or a strand needs adjustment, one call and we're there to fix it." },
      { title: 'REMOVAL', text: 'After the holidays, we remove everything, inspect it, and store it for next year.' },
    ],
    faqs: [
      {
        question: 'When should I book holiday lighting installation?',
        answer: "Earlier is better because the schedule fills quickly. Consultations begin in September, and installations start in late October through early November. Booking by mid-October gives us time to design the display, source materials, and hold your preferred installation window. We take later requests when the schedule allows.",
      },
      {
        question: 'Do you provide the lights or do I supply them?',
        answer: "We provide the commercial-grade LED lights, extension cords, clips, timers, wreaths, garland, and hardware included in your design. You do not need to buy, store, or maintain the equipment.",
      },
      {
        question: 'What happens if a light burns out during the season?',
        answer: "Call us if a bulb goes out, a strand fails, or a decoration shifts. In-season maintenance is included at no extra charge, so you do not have to climb a ladder in December.",
      },
      {
        question: 'Do you decorate commercial properties?',
        answer: "Yes. We design and install commercial-grade displays for storefronts, office buildings, retail centers, restaurants, and HOA common areas throughout Monroe County. Commercial displays include timers and automated controls for hassle-free operation. We work with your budget and brand to create a display that attracts attention and creates a welcoming atmosphere.",
      },
    ],
    heroButtons: [
      { text: 'Book Holiday Lighting', href: '/contact/?service=holiday-lighting', style: 'primary' },
      { text: 'Call (585) 594-8420', href: 'tel:+15855948420', style: 'outline' },
    ],
    relatedSlugs: ['landscape-design', 'snow-ice-management', 'landscape-maintenance'],
    ctaHeading: 'MAKE YOUR PROPERTY SHINE THIS <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">SEASON</span>',
    ctaText: "Book early for the best choice of installation dates. We will handle the lights while you enjoy the display.",
  },
};
