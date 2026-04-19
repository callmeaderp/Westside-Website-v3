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
}

export const serviceContent: Partial<Record<ServiceSlug, ServiceContent>> = {
  'landscape-design': {
    introLabel: 'Your Vision, Our Expertise',
    introTitle: 'TRANSFORMING <span class="text-green">OUTDOOR SPACES</span>',
    introText: [
      `For over <strong>${yearsInBusiness} years</strong>, <strong>Westside Professional Landscape</strong> has been designing and building <em>stunning outdoor environments</em> for homeowners and businesses across Monroe County. Whether you\u2019re envisioning a complete property transformation or a targeted enhancement to your front entrance, our design team works closely with you to develop a plan that reflects your style, meets your functional needs, and respects your budget.`,
      "Every project begins with a thorough site assessment. We evaluate your property's soil conditions, sun exposure, drainage patterns, and existing features. This allows us to recommend plants, materials, and layouts that will thrive in Rochester's unique four-season climate — from the humid summers to the harsh winters that define our region.",
    ],
    introCta: 'Request a Design Consultation',
    detailLabel: 'What We Offer',
    detailTitle: 'DESIGN & INSTALLATION <span class="text-green">SERVICES</span>',
    detailSubtitle: 'Comprehensive landscape design solutions for residential and commercial properties throughout the Greater Rochester area.',
    detailCards: [
      {
        title: 'CUSTOM LANDSCAPE ARCHITECTURE',
        text: "Our designers create <strong>detailed landscape plans</strong> that account for every element of your property. We consider sight lines, traffic patterns, seasonal interest, and long-term growth to deliver a design that looks beautiful today and matures gracefully over the years. Homeowners in Pittsford, Brighton, and Penfield trust us to match their landscape to their home's architectural style.",
        features: ['Full property design plans', 'Phased installation options', "Plant selection for Rochester's climate"],
      },
      {
        title: 'PLANTING DESIGN & INSTALLATION',
        text: "We select trees, shrubs, perennials, and ornamental grasses that are suited to Western New York's USDA Zone 6a growing conditions. Our planting designs consider bloom times, foliage color, mature sizes, and maintenance requirements — so your landscape delivers year-round beauty with manageable upkeep. From specimen trees to foundation plantings, every plant has a purpose.",
        features: ['Native and adapted species', 'Four-season interest design', 'Specimen trees & ornamentals'],
      },
      {
        title: 'GRADING & DRAINAGE',
        text: "Proper grading and drainage are <strong>the foundation of any lasting landscape</strong>. Rochester's clay-heavy soils and frequent rain events demand careful water management. We design and install French drains, catch basins, dry creek beds, and regrading solutions that protect your home's foundation and keep your lawn from becoming a swamp every spring.",
        features: ['French drains & catch basins', 'Dry creek beds & swales', 'Foundation protection grading'],
      },
      {
        title: 'OUTDOOR LIGHTING',
        text: 'Extend the beauty and usability of your landscape into the evening hours with professionally designed outdoor lighting. We create layered lighting schemes that highlight architectural features, illuminate walkways for safety, and set the mood for outdoor entertaining. LED technology keeps energy costs low while delivering warm, inviting ambiance.',
        features: ['Path & accent lighting', 'Uplighting & tree lighting', 'Energy-efficient LED systems'],
      },
    ],
    processLabel: 'How It Works',
    processTitle: 'OUR DESIGN <span class="text-green">PROCESS</span>',
    processSubtitle: "A proven approach that turns your vision into a finished landscape you'll enjoy for years to come.",
    processSteps: [
      { title: 'CONSULTATION', text: 'We meet at your property, discuss your goals, assess existing conditions, and establish a budget range.' },
      { title: 'DESIGN', text: 'Our team creates a detailed landscape plan with plant selections, material specifications, and layout drawings.' },
      { title: 'INSTALLATION', text: 'Our experienced crews bring the design to life with precision, care, and attention to every detail.' },
      { title: 'CARE', text: 'Ongoing maintenance programs protect your investment and keep your landscape thriving season after season.' },
    ],
    faqs: [
      {
        question: 'How much does landscape design cost in Rochester?',
        answer: 'Costs vary based on the scope of the project, property size, and materials selected. We provide free on-site consultations and detailed estimates so you know exactly what to expect before any work begins. Most residential projects in the Greater Rochester area range from a few thousand dollars for targeted enhancements to significantly more for full property transformations.',
      },
      {
        question: 'What is the best time of year to start a landscaping project?',
        answer: "In Rochester, spring (April\u2013June) and fall (September\u2013October) are the ideal windows for planting and installation. Cooler temperatures and reliable rainfall help new plants establish roots. However, hardscape work and design consultations can happen year-round \u2014 starting the design process in winter means you're ready to break ground as soon as the season opens.",
      },
      {
        question: 'Do you work with existing landscaping or only start from scratch?',
        answer: "Both. Many of our projects involve enhancing or renovating existing landscapes rather than starting over. During the site assessment, we evaluate what's working, what can be preserved, and what should be replaced \u2014 then build a plan that makes the most of your property's existing features.",
      },
      {
        question: 'How long does a typical landscape installation take?',
        answer: 'Timeline depends on the project scope. A targeted front-entry redesign might take a few days, while a full property transformation with hardscaping, planting, and grading can take several weeks. We provide a detailed timeline during the proposal phase so you can plan accordingly.',
      },
    ],
    relatedSlugs: ['hardscaping', 'water-features', 'landscape-maintenance'],
    ctaHeading: 'READY TO DESIGN YOUR <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">DREAM LANDSCAPE?</span>',
    ctaText: "Schedule a <strong>free on-site consultation</strong>. We'll walk your property, discuss your vision, and develop a plan that fits your budget.",
  },

  'landscape-maintenance': {
    introLabel: 'Protect Your Investment',
    introTitle: 'PROFESSIONAL <span class="text-green">LANDSCAPE CARE</span>',
    introText: [
      'A beautiful landscape is <strong>an investment</strong> — and like any investment, it needs ongoing care to maintain its value. Without regular maintenance, plantings become overgrown, lawns thin out, beds fill with weeds, and the curb appeal you worked hard to create gradually disappears.',
      "<strong>Westside Professional Landscape</strong> provides comprehensive maintenance programs for residential and commercial properties throughout the Greater Rochester area. Our trained crews deliver consistent, high-quality service on a predictable schedule — so your property always looks its best, whether it's a private home in Pittsford or a commercial campus in Henrietta.",
    ],
    detailLabel: 'What We Offer',
    detailTitle: 'MAINTENANCE <span class="text-green">SERVICES</span>',
    detailSubtitle: 'Comprehensive landscape maintenance solutions for residential and commercial properties.',
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
        text: 'Fresh mulch suppresses weeds, retains moisture, and gives beds a clean, finished appearance. We apply premium-quality mulch at the right depth and maintain clean bed edges throughout the season. Weed control — both chemical and hand-pulling — keeps your beds looking sharp.',
        features: ['Premium mulch installation', 'Bed edging & definition', 'Weed control'],
      },
      {
        title: 'PRUNING & HEDGE TRIMMING',
        text: 'Proper pruning promotes healthy growth, maintains shape, and prevents disease. Our crews know when and how to prune each species — timing matters, especially for flowering shrubs. Hedge trimming keeps borders sharp and formal plantings looking their best.',
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
        answer: "During the growing season (typically April through October), weekly mowing is standard for most Rochester-area lawns. In peak growth periods during spring and early summer, some properties benefit from twice-weekly service. We adjust mowing height seasonally \u2014 higher in summer to reduce heat stress, shorter in spring and fall.",
      },
      {
        question: "What's included in a landscape maintenance program?",
        answer: "Our maintenance programs typically include weekly mowing and edging, string trimming, spring and fall cleanups, mulching, bed maintenance, pruning, and seasonal color rotations. Programs are customized to your property's needs and budget \u2014 you choose the services that matter most to you.",
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
    relatedSlugs: ['plant-health', 'landscape-design', 'snow-ice-management'],
    ctaHeading: 'KEEP YOUR PROPERTY LOOKING ITS <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">BEST</span>',
    ctaText: 'Get a customized maintenance quote for your property. Consistent care, predictable costs, exceptional results.',
  },

  'lawn-care': {
    introLabel: 'Complete Lawn Care',
    introTitle: 'A THICKER, GREENER LAWN IN <span class="text-green">ROCHESTER</span>',
    introText: [
      `For over <strong>${yearsInBusiness} years</strong>, <strong>Westside Professional Landscape</strong> has been caring for lawns across Monroe County — from shaded yards in Brighton to sun-baked corner lots in Gates. A healthy lawn isn't the result of one service; it's the product of <em>mowing, feeding, weed control, aeration, and timely repair</em> all working together across the season.`,
      'We handle every part of that program in-house. Our crews mow on a consistent schedule, our <strong>NYS DEC certified applicators</strong> run the 5-step fertilization and weed control program, and our specialists handle aeration, overseeding, grub protection, and lawn repair. One company, one point of contact, one thick green lawn.',
    ],
    introCta: 'Get a Free Lawn Care Quote',
    detailLabel: 'Every Part of the Program',
    detailTitle: 'OUR LAWN CARE <span class="text-green">SERVICES</span>',
    detailSubtitle: 'Pick the services your lawn needs, or bundle the whole program for the best results.',
    detailCards: [
      {
        title: 'WEEKLY MOWING & EDGING',
        text: "Consistent mowing is the foundation of a great-looking lawn. Our crews mow on a <strong>predictable weekly schedule</strong> with sharp blades, clean edges along walkways and beds, and careful string-trimming around obstacles. We adjust height seasonally — taller in summer heat, closer in spring and fall — so grass stays healthy, not just cut. Mowing is delivered as part of our full <a href=\"/services/landscape-maintenance/\" style=\"color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;\">landscape maintenance program</a>.",
        features: ['Weekly visits, same crew', 'Sharp blades & clean edges', 'Seasonal height adjustments'],
      },
      {
        title: 'FERTILIZATION & WEED CONTROL',
        text: 'Our <strong>5-Step Fertilization & Weed Control Program</strong> is a precisely timed sequence of applications designed for Western New York\'s climate and soils. Balanced fertilizer, pre- and post-emergent weed control, and a <em>grub-control application included</em> — all applied by NYS DEC certified technicians. <strong>50% off your first treatment — just $58 for the average Rochester lawn.</strong> Full details on our <a href="/services/plant-health/" style="color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;">5-step program page</a>.',
        features: ['5 precisely timed visits', 'Crabgrass & broadleaf weed control', 'Grub prevention included'],
      },
      {
        title: 'CORE AERATION & OVERSEEDING',
        text: "Rochester's clay-heavy soils compact under foot traffic, mower weight, and freeze-thaw cycles. <strong>Core aeration</strong> pulls small plugs of soil from your lawn, opening pathways for water, air, and nutrients to reach the root zone. Pair aeration with <strong>overseeding</strong> — a premium seed blend worked into fresh aeration holes — to thicken thin spots, crowd out weeds, and refresh older lawns. Early fall is the ideal window in Monroe County.",
        features: ['Best performed in early fall', 'Relieves compaction & thatch', 'Fills thin spots with premium seed'],
      },
      {
        title: 'GRUB CONTROL',
        text: 'Grubs — the larval stage of Japanese beetles, European chafers, and similar pests — are among <strong>the most destructive lawn pests</strong> in the Rochester area. They feed on grass roots and can kill large sections of lawn in a single season. We apply <strong>preventive grub control</strong> as part of our 5-step program and handle curative treatments when active infestations are found. Preventing grub damage costs a fraction of repairing it.',
        features: ['Preventive application included in 5-step', 'Curative treatment for active infestations', 'Targets Japanese beetle & chafer grubs'],
      },
      {
        title: 'LAWN REPAIR & RENOVATION',
        text: "Grub damage, pet spots, dog tracks, heavy-equipment ruts, and general thin or bare areas — we repair all of it. <strong>Slit-seeding, topdressing, and spot repair</strong> for targeted areas; <strong>full renovation</strong> (dethatching, aeration, overseeding, starter fertilizer) for lawns that need a reset. For projects where seed just won't do, we also install <strong>sod</strong>. Most Rochester lawns benefit from a repair pass every few years.",
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
    processSubtitle: "A straightforward approach — we assess, we recommend, we deliver.",
    processSteps: [
      { title: 'LAWN EVALUATION', text: "We walk your property, check soil and sun conditions, identify weed pressure, and listen to what you want from your lawn." },
      { title: 'CUSTOM PROGRAM', text: "We recommend the mix of services your lawn actually needs — nothing you don't, everything you do. Clear, itemized pricing." },
      { title: 'CONSISTENT SERVICE', text: 'Mowing crews run on a predictable schedule. Applications hit the right windows. You get visit notifications and application details in writing.' },
      { title: 'ONGOING RESULTS', text: "We monitor your lawn as the season progresses, catch issues early, and adjust the program where needed. Year after year, the lawn keeps improving." },
    ],
    faqs: [
      {
        question: 'How much does professional lawn care cost in Rochester?',
        answer: "It depends on lawn size and which services you include. Weekly mowing typically runs a flat seasonal or per-visit rate based on property size. The 5-Step Fertilization & Weed Control program averages around $58 per treatment for a typical Rochester lawn (with 50% off your first treatment). Aeration, overseeding, and lawn repair are quoted as one-time services. We provide <strong>free on-site estimates</strong> — you'll see itemized pricing before any work starts.",
      },
      {
        question: 'Do I need to sign up for every service, or can I pick and choose?',
        answer: "Pick what your lawn needs. Many clients start with just the 5-Step Fertilization & Weed Control program, then add mowing or aeration as the lawn improves and they see the difference. Others want the full program from day one. There's no requirement to bundle — though bundling does simplify scheduling and often delivers better overall results because the services are timed to work together.",
      },
      {
        question: "What's the difference between 'lawn care' and 'landscape maintenance'?",
        answer: "'<strong>Lawn care</strong>' focuses specifically on the turf — mowing, fertilization, weed control, aeration, grub protection, and repair. '<strong>Landscape maintenance</strong>' is broader and includes beds, shrubs, mulch, pruning, seasonal cleanups, and flower rotations in addition to lawn work. Most Rochester homeowners need both. Our <a href=\"/services/landscape-maintenance/\" style=\"color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;\">landscape maintenance program</a> bundles them, or you can work with us on lawn care only.",
      },
      {
        question: 'When should I start lawn care service?',
        answer: "In Rochester, the earlier the better. <strong>Early spring</strong> (March/April) is the window for pre-emergent crabgrass control and the first fertilizer application — miss it and weeds are harder to manage all year. Mowing contracts are set up before the growing season ramps in late April. Aeration and overseeding are best in <strong>early fall</strong> (late August through September). That said, we can start a program mid-season and still deliver strong results — just contact us and we'll design the right approach for where you are in the year.",
      },
      {
        question: 'Are your lawn care products safe for kids and pets?',
        answer: "Yes. Our <strong>NYS DEC Commercial Pesticide Applicators</strong> use products at precisely calibrated rates and follow all safety guidelines. After an application, we recommend staying off treated areas until the products have dried or been watered in (typically a few hours). All <a href=\"/labels-sds/\" style=\"color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;\">product labels and safety data sheets</a> are publicly available on our site so you can review exactly what we use.",
      },
      {
        question: 'Do you service my area?',
        answer: "We serve Rochester and the surrounding communities throughout Monroe County — including Pittsford, Brighton, Penfield, Webster, Fairport, Greece, Gates, Chili, Spencerport, Henrietta, and more. See our full <a href=\"/service-areas/\" style=\"color: var(--color-green-bright); text-decoration: underline; text-underline-offset: 3px;\">service areas page</a> for the complete list. If you're not sure, just call — if we can get there, we'll service you.",
      },
    ],
    relatedSlugs: ['plant-health', 'landscape-maintenance', 'artificial-grass'],
    ctaHeading: 'READY FOR A LAWN YOU\'RE <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">PROUD OF?</span>',
    ctaText: "Get a <strong>free on-site lawn evaluation</strong>. We'll walk your property, tell you honestly what it needs, and give you a clear itemized quote.",
  },

  'hardscaping': {
    introLabel: 'Craftsmanship That Endures',
    introTitle: 'OUTDOOR SPACES BUILT FOR <span class="text-green">ROCHESTER</span>',
    introText: [
      `Rochester\u2019s <strong>freeze-thaw cycles</strong> put outdoor structures to the test. A patio or retaining wall that isn\u2019t built with proper base preparation and drainage will heave, crack, and fail within a few winters. At Westside Professional Landscape, we\u2019ve been building hardscapes across Monroe County for over ${yearsInBusiness} years \u2014 and <strong>we build them to last</strong>.`,
      "Our crews understand the engineering that goes into a durable installation: compacted aggregate bases, proper pitch for water drainage, polymeric sand for joint stability, and the right materials for our climate. Whether you're a homeowner in Pittsford looking for an elegant patio or a commercial property in Greece that needs a functional retaining wall, we bring the same level of precision to every project.",
    ],
    detailLabel: 'What We Build',
    detailTitle: 'HARDSCAPING <span class="text-green">SERVICES</span>',
    detailSubtitle: "Built to withstand Rochester's demanding four-season climate.",
    detailCards: [
      {
        title: 'PATIOS & OUTDOOR KITCHENS',
        text: "Create the <em>ultimate outdoor entertaining space</em>. We build patios from natural stone, pavers, and concrete in configurations that complement your home's architecture. Add a built-in grill, countertop, or bar for a fully functional outdoor kitchen.",
        features: ['Natural stone & paver options', 'Built-in grills & counters', 'Seating walls & pergolas'],
      },
      {
        title: 'RETAINING & DECORATIVE WALLS',
        text: 'Manage slopes, prevent erosion, and add architectural interest with properly engineered retaining walls. From small garden walls to large structural installations, we use segmental block, natural stone, and boulder systems sized for the load.',
        features: ['Engineered structural walls', 'Natural stone & boulder walls', 'Proper drainage & backfill'],
      },
      {
        title: 'WALKWAYS & STEPS',
        text: "Guide visitors to your front door or connect outdoor living areas with elegant walkways and steps. We build with pavers, flagstone, and natural stone to create paths that are both beautiful and safe in all weather conditions — including Rochester's icy winters.",
        features: ['Front entry walkways', 'Garden paths & stepping stones', 'Natural stone steps'],
      },
      {
        title: 'FIRE PITS & FIREPLACES',
        text: 'Extend your outdoor season with a custom fire feature. From simple fire pits for casual evenings to full outdoor fireplaces that become a backyard focal point, we design and build fire features that bring warmth and ambiance to your outdoor living space.',
        features: ['Custom fire pits', 'Outdoor fireplaces', 'Gas & wood-burning options'],
      },
      {
        title: 'DRIVEWAYS & PARKING AREAS',
        text: "Upgrade your curb appeal and functionality with a paver or natural stone driveway. We also build commercial parking areas, turnarounds, and aprons that handle heavy traffic while looking sharp. All installations include <strong>proper base work</strong> for Rochester's freeze-thaw conditions.",
        features: ['Paver & stone driveways', 'Commercial parking areas', 'Permeable paver systems'],
      },
      {
        title: 'PERGOLAS & SHADE STRUCTURES',
        text: 'Define outdoor rooms and add shade with custom pergolas, arbors, and shade structures. We build with wood, vinyl, and aluminum to match your aesthetic and maintenance preferences. Perfect for framing a patio, dining area, or garden entrance.',
        features: ['Custom pergolas & arbors', 'Multiple material options', 'Integrated lighting available'],
      },
    ],
    processSteps: [],
    faqs: [
      {
        question: "How long do pavers last in Rochester's climate?",
        answer: "Properly installed pavers last 25\u201350 years or more, even in Rochester's demanding freeze-thaw climate. The key is proper base preparation \u2014 a compacted aggregate base with correct depth, adequate drainage, and polymeric sand joints. We engineer every installation for our specific climate conditions.",
      },
      {
        question: 'Do I need a permit for a patio or retaining wall?',
        answer: "In most Rochester-area municipalities, standard patios don't require a building permit. Retaining walls over a certain height (typically 4 feet) often do, and some towns require permits for structures near property lines. We handle the permitting process and ensure your project meets all local codes.",
      },
      {
        question: "What's the best patio material for Rochester?",
        answer: "Concrete pavers and natural stone are the most durable options for our climate. Pavers flex with freeze-thaw movement rather than cracking like poured concrete. Natural flagstone offers a timeless look. We help you choose materials based on your aesthetic preference, budget, and how you plan to use the space.",
      },
      {
        question: 'Can hardscape work be done in the fall or winter?',
        answer: "Fall is actually an excellent time for hardscaping in Rochester \u2014 cooler weather is easier on crews, and you avoid the spring rush. We can install pavers and walls into November as long as the ground isn't frozen. Winter is ideal for planning and design so you're ready to build when the season opens.",
      },
    ],
    relatedSlugs: ['landscape-design', 'water-features', 'holiday-lighting'],
    ctaHeading: "LET'S BUILD SOMETHING <span style=\"text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;\">BEAUTIFUL</span>",
    ctaText: 'Every great outdoor space starts with a conversation. Tell us about your project and we\'ll make it happen.',
  },

  'water-features': {
    introLabel: 'Transform Your Outdoor Space',
    introTitle: 'THE BEAUTY OF <span class="text-green">WATER</span>',
    introText: [
      'There is <em>nothing quite like</em> the sight and sound of moving water in a landscape. A well-designed water feature becomes the <strong>focal point</strong> of your outdoor space — a place that draws you outside, calms the mind, and adds a dimension that no other element can replicate.',
      `At Westside Professional Landscape, we design and build water features that are tailored to your property, your aesthetic, and your lifestyle. Whether you envision a naturalistic waterfall cascading over native stone, a tranquil koi pond, or a sleek modern fountain, our team has the expertise to bring it to life. We\u2019ve been creating water features for homeowners across Pittsford, Brighton, Penfield, and the greater Rochester area for over ${yearsInBusiness} years.`,
    ],
    detailLabel: 'What We Build',
    detailTitle: 'WATER FEATURE <span class="text-green">SERVICES</span>',
    detailSubtitle: 'Custom water feature design, installation, and year-round maintenance.',
    detailCards: [
      {
        title: 'PONDS & KOI PONDS',
        text: "A garden pond creates a living ecosystem in your backyard. We design ponds with proper filtration, aeration, and plant shelves to support aquatic life — from decorative koi to native plantings. Rochester's climate requires specific depth considerations for overwintering fish, and we engineer every pond with the local freeze line in mind.",
        features: ['Proper filtration & aeration', 'Fish-safe depth engineering', 'Aquatic plant integration'],
      },
      {
        title: 'WATERFALLS & STREAMS',
        text: "Cascading waterfalls and meandering streams add movement and sound to any landscape. We use natural boulders and native stone to create features that look like they've always been part of your property. Our recirculating systems are efficient and low-maintenance, with pumps sized for reliable year-round operation.",
        features: ['Natural boulder construction', 'Recirculating pump systems', 'Multi-tier cascade designs'],
      },
      {
        title: 'FOUNTAINS & BUBBLERS',
        text: "For properties where a full pond isn't practical, fountains and bubbling rocks deliver the calming presence of water in a compact footprint. These self-contained features are ideal for courtyards, entryways, patios, and small gardens. Minimal maintenance, maximum impact — perfect for busy homeowners in Webster, Fairport, and surrounding communities.",
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
        answer: "A well-built pond needs regular but manageable maintenance: filter cleaning, skimming debris, monitoring water quality, and seasonal plant care. We offer maintenance programs that handle all of this for you. Spring startup and fall winterization are the two most important service visits \u2014 they protect your investment through Rochester's harsh winters.",
      },
      {
        question: "Can a water feature run through Rochester's winter?",
        answer: "Most water features are winterized and shut down for the season to prevent freeze damage to pumps and plumbing. Some waterfall features can be run through early winter for a dramatic iced-over look, but ponds and fountains should be properly winterized before hard freezes set in. We handle the entire winterization process.",
      },
      {
        question: 'Do water features attract mosquitoes?',
        answer: "Moving water doesn't attract mosquitoes \u2014 they breed in stagnant water. Our water features are designed with recirculating pumps that keep water constantly moving. Ponds with fish (especially koi and goldfish) have a built-in mosquito control system, since fish eat mosquito larvae.",
      },
      {
        question: 'How much space do I need for a backyard water feature?',
        answer: "Water features can be designed for almost any space. A bubbling rock or small fountain fits in a courtyard or corner garden. Larger properties can accommodate full ponds, waterfalls, and streams. During the design consultation, we assess your space, discuss your vision, and recommend features that fit both the property and your budget.",
      },
    ],
    relatedSlugs: ['landscape-design', 'hardscaping', 'landscape-maintenance'],
    ctaHeading: 'ADD THE BEAUTY OF WATER TO YOUR <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">LANDSCAPE</span>',
    ctaText: 'Schedule a consultation and let us design a water feature that transforms your outdoor space.',
  },

  'snow-ice-management': {
    introLabel: "Rochester's Winters Demand More",
    introTitle: 'PROFESSIONAL <span class="text-green">SNOW MANAGEMENT</span>',
    introText: [
      'Rochester averages <strong>nearly 100 inches of snowfall per year</strong>, making it one of the snowiest cities in the United States. For commercial property owners and managers across Monroe County, that means months of liability exposure, operational disruptions, and the constant threat of slip-and-fall incidents.',
      "Westside Professional Landscape provides comprehensive commercial snow and ice management designed to keep your property safe and accessible. Our crews monitor weather conditions and aim to deploy proactively. With seasonal contracts, dedicated equipment, and a <strong>responsive team</strong>, we take the stress of winter off your plate.",
    ],
    detailLabel: 'Our Services',
    detailTitle: 'SNOW & ICE <span class="text-green">SERVICES</span>',
    detailSubtitle: 'Comprehensive winter services for commercial properties throughout Monroe County.',
    detailCards: [
      {
        title: '24/7 COMMERCIAL PLOWING',
        text: 'Our fleet of trucks and loaders are equipped and ready to handle everything from a light dusting to a major lake-effect event. We service parking lots, access roads, loading docks, and emergency lanes. Trigger depths and response times are established in advance so there are no surprises when a storm hits.',
        features: ['Parking lots & access roads', 'Loading docks & emergency lanes', 'Pre-determined trigger depths'],
      },
      {
        title: 'WALKWAY & ENTRANCE CLEARING',
        text: "<strong>Slip-and-fall liability</strong> is a serious concern for any commercial property. Our sidewalk crews clear walkways, building entrances, emergency exits, and ADA-accessible paths with snow blowers, shovels, and brooms. We don't leave until surfaces are safe for foot traffic.",
        features: ['Building entrances & exits', 'Sidewalks & pedestrian paths', 'ADA-accessible routes'],
      },
      {
        title: 'DE-ICING & SALT APPLICATION',
        text: 'We apply rock salt, treated salt, and liquid de-icers based on the specific conditions of each storm. Pre-treatment before storms, anti-icing during events, and post-storm de-icing ensure surfaces remain as safe as possible. Application rates are calibrated to minimize environmental impact while maximizing effectiveness.',
        features: ['Pre-treatment & anti-icing', 'Rock salt & treated salt', 'Environmentally conscious application'],
      },
      {
        title: 'SEASONAL CONTRACTS',
        text: "Lock in your winter budget with a seasonal contract that covers the entire snow season. No per-push surprises, no worrying about whether a storm triggers service. Our seasonal agreements are tailored to your property's needs and give you <strong>predictable costs</strong> from November through April.",
        features: ['Fixed seasonal pricing', 'Per-push options also available', 'Customized service plans'],
      },
    ],
    processSteps: [],
    faqs: [
      {
        question: 'What triggers a snow plowing visit?',
        answer: "Trigger depths are established in your contract \u2014 typically 1\u20132 inches for commercial properties. Once accumulation hits the trigger, our crews deploy automatically. You don't need to call us. We monitor weather conditions around the clock and aim to have your property cleared before your business opens.",
      },
      {
        question: 'Do you offer residential snow removal?',
        answer: "Our snow and ice management services are focused on commercial properties, HOAs, and multi-unit residential complexes where liability and access are critical. For large residential estates or properties with specific needs, contact us to discuss options.",
      },
      {
        question: 'How does a seasonal snow contract work?',
        answer: "A seasonal contract covers all snow and ice services for the entire winter season (typically November through April) at a fixed price. No per-push charges, no surprises regardless of how many storms hit. Your budget is locked in before the first flake falls. We also offer per-event pricing for properties that prefer it.",
      },
      {
        question: 'What de-icing products do you use?',
        answer: "We use a combination of rock salt, treated salt, and liquid de-icers, selected based on the specific conditions of each storm. Pre-treatment before storms is standard for high-traffic areas. Application rates are calibrated to be effective while minimizing environmental impact on surrounding landscaping and waterways.",
      },
    ],
    relatedSlugs: ['landscape-maintenance', 'hardscaping', 'holiday-lighting'],
    ctaHeading: "DON'T WAIT FOR THE FIRST <span style=\"text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;\">STORM</span>",
    ctaText: "Secure your snow management contract before winter. Planning ahead means you're covered when Rochester's weather arrives.",
  },

  'artificial-grass': {
    introLabel: 'SYNLawn Authorized Dealer',
    introTitle: 'YEAR-ROUND <span class="text-green">GREEN</span>',
    introText: [
      "As an <strong>Authorized SYNLawn dealer</strong>, Westside Professional Landscape installs premium artificial turf for homeowners and businesses across Greater Rochester. Synthetic turf eliminates mowing, watering, fertilizing, and weed control — giving you a consistently green lawn <em>every day of the year</em>, even through Rochester's long winters.",
      "SYNLawn products are crafted from advanced synthetic fibers designed to replicate the look and feel of natural grass. Backed by <strong>manufacturer warranties</strong> and engineered for durability, they're built to handle foot traffic, pets, and our four-season climate.",
    ],
    introCta: 'Request a Free Consultation',
    detailLabel: 'Applications',
    detailTitle: 'ARTIFICIAL TURF <span class="text-green">SOLUTIONS</span>',
    detailSubtitle: 'Premium SYNLawn products for residential, commercial, and specialty applications.',
    detailCards: [
      {
        title: 'RESIDENTIAL LAWNS',
        text: "Transform your yard into a <strong>maintenance-free landscape</strong> that stays green and inviting year-round. Ideal for front yards, side yards, and backyard living areas where you want the look of a perfect lawn without the ongoing work. Especially popular with homeowners tired of fighting Rochester's clay soils, shade issues, and seasonal brown-out.",
        features: ['Front & back yard installations', 'Pet-friendly options', 'Looks natural year-round'],
      },
      {
        title: 'PUTTING GREENS & SPORT TURF',
        text: "Practice your short game at home with a custom <strong>backyard putting green</strong>, or install sport turf for a play area that stands up to heavy use. SYNLawn's sport-specific products are engineered for consistent ball roll, proper drainage, and long-term durability under active play.",
        features: ['Custom putting greens', 'Playground & sport surfaces', 'Consistent performance'],
      },
      {
        title: 'COMMERCIAL & HOA INSTALLATIONS',
        text: 'Reduce grounds maintenance costs while keeping common areas, building entrances, and high-visibility landscaping looking pristine. Artificial turf is a smart choice for commercial properties where <strong>consistent appearance matters</strong> and irrigation is impractical or expensive.',
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
    processSubtitle: 'Professional installation ensures your turf looks great and lasts for years.',
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
        answer: "Artificial turf handles snow well. Snow can be shoveled or blown off without damaging the fibers, and it melts and drains through the turf quickly thanks to the permeable backing. Unlike natural grass, there's no mud season, no dormancy, and no spring recovery period \u2014 your lawn looks green the moment the snow clears.",
      },
    ],
    relatedSlugs: ['landscape-design', 'hardscaping', 'landscape-maintenance'],
    ctaHeading: 'READY FOR A LAWN THAT\'S ALWAYS <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">GREEN?</span>',
    ctaText: "Schedule a <strong>free consultation</strong>. We'll assess your property and show you how SYNLawn can transform your outdoor space.",
  },

  'commercial-services': {
    introLabel: 'Grounds Management for Business',
    introTitle: 'COMMERCIAL <span class="text-green">LANDSCAPE SERVICES</span>',
    introText: [
      "<strong>Westside Professional Landscape</strong> provides full-service grounds management for commercial properties across Greater Rochester. From weekly landscape maintenance to seasonal snow and ice management, we give property managers and business owners <em>a single point of contact</em> for all exterior property care.",
      "Our commercial crews bring over <strong>two decades of experience</strong> maintaining office parks, retail centers, medical facilities, HOA communities, and industrial properties throughout Monroe County. We hold ourselves to professional standards of service, safety, and quality.",
    ],
    introCta: 'Request a Commercial Proposal',
    detailLabel: 'What We Offer',
    detailTitle: 'COMMERCIAL <span class="text-green">SERVICES</span>',
    detailSubtitle: 'Everything your property needs from a single, reliable landscape partner.',
    detailCards: [
      {
        title: 'LANDSCAPE MAINTENANCE',
        text: "Consistent, <strong>reliable grounds care</strong> on a predictable schedule. Mowing, edging, bed maintenance, pruning, seasonal cleanups, and mulching — all handled by dedicated crews who know your property. We develop maintenance plans tailored to your property's specific needs and budget.",
        features: ['Weekly mowing & edging', 'Seasonal cleanups', 'Bed care & mulching'],
      },
      {
        title: 'SNOW & ICE MANAGEMENT',
        text: "Rochester's winters demand a <strong>proactive snow management partner</strong>. We offer seasonal contracts with 24/7 response for plowing, sidewalk clearing, and de-icing. Trigger depths, response times, and service areas are established in advance so your property stays safe and accessible all winter.",
        features: ['24/7 response', 'Seasonal contracts', 'Plowing, clearing & de-icing'],
      },
      {
        title: 'SEASONAL COLOR & ENHANCEMENTS',
        text: "Keep your property looking sharp and welcoming with seasonal flower rotations, container planting, and landscape enhancements. We handle <em>spring, summer, and fall</em> color programs that keep entrances, courtyards, and common areas vibrant throughout the growing season.",
        features: ['Seasonal flower rotations', 'Container planting', 'Entrance & focal point displays'],
      },
      {
        title: 'TURF & IRRIGATION',
        text: "Healthy turf and efficient irrigation are the foundation of a well-maintained commercial property. Our programs include fertilization, weed control, aeration, overseeding, and <strong>full irrigation management</strong> — spring startup, seasonal adjustments, and fall winterization.",
        features: ['Fertilization & weed control', 'Aeration & overseeding', 'Irrigation management'],
      },
    ],
    processSteps: [],
    faqs: [
      {
        question: 'Do you offer bundled year-round commercial services?',
        answer: "Yes. Many of our commercial clients bundle landscape maintenance, snow management, and seasonal enhancements into a single annual contract with one point of contact. Bundling simplifies vendor management, often reduces overall costs, and ensures seamless transitions between seasons \u2014 the same team that maintains your landscape in summer handles your snow in winter.",
      },
      {
        question: 'How do you handle emergency snow events?',
        answer: "Our commercial snow contracts include 24/7 response capability. We monitor weather forecasts continuously and pre-deploy equipment and materials before major storms. During multi-day events, our crews cycle through client properties around the clock. Emergency re-service requests are handled the same day.",
      },
      {
        question: 'Can you manage multiple properties for the same company?',
        answer: "Absolutely. We manage portfolios of commercial properties for several clients across Monroe County. Multi-site contracts are coordinated through a single account manager, with service schedules and reporting customized for each location. This is one of our core strengths as a commercial landscape partner.",
      },
    ],
    relatedSlugs: ['landscape-maintenance', 'snow-ice-management', 'plant-health'],
    ctaHeading: "LET'S TALK ABOUT YOUR <span style=\"text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;\">PROPERTY</span>",
    ctaText: "Get a <strong>customized commercial proposal</strong>. We'll walk your property, understand your needs, and build a plan that fits your budget and standards.",
  },

  'holiday-lighting': {
    introLabel: 'Let Us Handle the Lights',
    introTitle: 'PROFESSIONAL <span class="text-green">HOLIDAY DECORATING</span>',
    introText: [
      "The holiday season should be about <em>enjoying time with family</em> — not climbing ladders in the cold to untangle lights. At Westside Professional Landscape, we handle <strong>every aspect</strong> of your holiday decorating: design, installation, maintenance throughout the season, and takedown when the holidays are over.",
      "Whether you want a classic, elegant look for your home in Pittsford or an eye-catching commercial display for your business in Greece, our team creates custom designs that match your vision and your property's architecture. We've been adding seasonal magic to homes and businesses across the Greater Rochester area for years.",
    ],
    detailLabel: 'Our Services',
    detailTitle: 'HOLIDAY DECORATING <span class="text-green">SERVICES</span>',
    detailSubtitle: 'Full-service holiday decorating for homes and businesses across Greater Rochester.',
    detailCards: [
      {
        title: 'CUSTOM LIGHTING DESIGN',
        text: "<strong>Every property is unique</strong>, and your holiday display should be too. We visit your property, assess the architecture and landscaping, and create a custom lighting plan that highlights your home's best features. Choose from warm white elegance, multi-color festivity, or anything in between. LED technology keeps energy costs low and brightness high.",
        features: ['On-site design consultation', 'LED & traditional options', 'Roofline, tree, & landscape lighting'],
      },
      {
        title: 'WREATHS & GARLAND',
        text: "Complete your holiday look with fresh or artificial wreaths, garland, and bows. We install wreaths on doors, windows, and fences. Garland is draped along railings, entryways, columns, and mantels. Fresh greenery options include Fraser fir, noble fir, and mixed evergreen — all sourced for quality and longevity through Rochester's cold December weather.",
        features: ['Fresh & artificial options', 'Doors, windows & railings', 'Custom bows & ribbon'],
      },
      {
        title: 'COMMERCIAL DISPLAYS',
        text: 'Make your business stand out during the holiday season with a professional display that attracts attention and creates a welcoming atmosphere. We design and install commercial-grade lighting for storefronts, office buildings, retail centers, restaurants, and HOA common areas throughout Monroe County. Timers and automated controls ensure hassle-free operation.',
        features: ['Commercial-grade lighting', 'Storefronts & office buildings', 'Timers & automated controls'],
      },
      {
        title: 'TAKEDOWN & STORAGE',
        text: "When the season ends, we return to carefully remove all lights, decorations, and hardware. Everything is inspected, labeled, and stored for the following year. No tangled boxes in your attic, no forgotten lights still hanging in February. We handle the <strong>complete lifecycle</strong> so each year's installation is quick and seamless.",
        features: ['Careful removal', 'Inspection & repair', 'Organized storage'],
      },
    ],
    processLabel: 'How It Works',
    processTitle: 'OUR HOLIDAY <span class="text-green">PROCESS</span>',
    processSubtitle: 'A hassle-free experience from your first call to the final takedown.',
    processSteps: [
      { title: 'CONSULTATION', text: 'We visit your property, discuss your vision and budget, and develop a custom design plan.' },
      { title: 'INSTALLATION', text: 'Our experienced crew installs lights and decorations with care — <em>treating your property with respect</em>.' },
      { title: 'MAINTENANCE', text: "If a bulb goes out or a strand needs adjustment, one call and we're there to fix it." },
      { title: 'REMOVAL', text: 'After the holidays, we remove everything, inspect it, and store it for next year.' },
    ],
    faqs: [
      {
        question: 'When should I book holiday lighting installation?',
        answer: "The earlier the better \u2014 our schedule fills up fast. We begin consultations in September and start installations in late October through early November. Booking by mid-October ensures your preferred installation date and gives us time to design and source materials. Last-minute requests are accommodated when possible but availability is limited.",
      },
      {
        question: 'Do you provide the lights or do I supply them?',
        answer: "We provide everything: commercial-grade LED lights, extension cords, clips, timers, wreaths, garland, and all hardware. Our lights are more durable and energy-efficient than retail options. Everything is included in the price \u2014 you don't need to purchase, store, or maintain any equipment.",
      },
      {
        question: 'What happens if a light burns out during the season?',
        answer: "One call and we're there. Our service includes maintenance visits throughout the holiday season. If a bulb goes out, a strand fails, or a decoration needs adjustment, we handle it promptly at no extra charge. That's the advantage of professional installation \u2014 you don't climb a ladder in December.",
      },
      {
        question: 'Do you decorate commercial properties?',
        answer: "Yes. We design and install commercial-grade displays for storefronts, office buildings, retail centers, restaurants, and HOA common areas throughout Monroe County. Commercial displays include timers and automated controls for hassle-free operation. We work with your budget and brand to create a display that attracts attention and creates a welcoming atmosphere.",
      },
    ],
    relatedSlugs: ['landscape-design', 'snow-ice-management', 'landscape-maintenance'],
    ctaHeading: 'MAKE YOUR PROPERTY SHINE THIS <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">SEASON</span>',
    ctaText: "Book your holiday decorating early — <strong>the best time to plan is now</strong>. Let us handle the lights while you enjoy the holidays.",
  },
};
