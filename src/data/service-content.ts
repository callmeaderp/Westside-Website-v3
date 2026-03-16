/**
 * Rich content for service pages — ported from V2.
 * Separated from services.ts to keep base service data (nav, cards, schema) lean.
 * Keyed by ServiceSlug. Imported by [slug].astro and standalone service pages.
 */
import type { ServiceSlug } from './services';

export interface DetailCard {
  title: string;
  text: string;
  features: string[];
}

export interface ProcessStep {
  title: string;
  text: string;
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
  relatedSlugs: ServiceSlug[];
  ctaHeading: string;
  ctaText: string;
}

export const serviceContent: Partial<Record<ServiceSlug, ServiceContent>> = {
  'landscape-design': {
    introLabel: 'Your Vision, Our Expertise',
    introTitle: 'TRANSFORMING <span class="text-green">OUTDOOR SPACES</span>',
    introText: [
      "For over <strong>26 years</strong>, <strong>Westside Professional Landscape</strong> has been designing and building <em>stunning outdoor environments</em> for homeowners and businesses across Monroe County. Whether you're envisioning a complete property transformation or a targeted enhancement to your front entrance, our design team works closely with you to develop a plan that reflects your style, meets your functional needs, and respects your budget.",
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
    relatedSlugs: ['plant-health', 'landscape-design', 'snow-ice-management'],
    ctaHeading: 'KEEP YOUR PROPERTY LOOKING ITS <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">BEST</span>',
    ctaText: 'Get a customized maintenance quote for your property. Consistent care, predictable costs, exceptional results.',
  },

  'hardscaping': {
    introLabel: 'Craftsmanship That Endures',
    introTitle: 'OUTDOOR SPACES BUILT FOR <span class="text-green">ROCHESTER</span>',
    introText: [
      "Rochester's <strong>freeze-thaw cycles</strong> put outdoor structures to the test. A patio or retaining wall that isn't built with proper base preparation and drainage will heave, crack, and fail within a few winters. At Westside Professional Landscape, we've been building hardscapes across Monroe County for over 26 years — and <strong>we build them to last</strong>.",
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
    relatedSlugs: ['landscape-design', 'water-features', 'holiday-lighting'],
    ctaHeading: "LET'S BUILD SOMETHING <span style=\"text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;\">BEAUTIFUL</span>",
    ctaText: 'Every great outdoor space starts with a conversation. Tell us about your project and we\'ll make it happen.',
  },

  'water-features': {
    introLabel: 'Transform Your Outdoor Space',
    introTitle: 'THE BEAUTY OF <span class="text-green">WATER</span>',
    introText: [
      'There is <em>nothing quite like</em> the sight and sound of moving water in a landscape. A well-designed water feature becomes the <strong>focal point</strong> of your outdoor space — a place that draws you outside, calms the mind, and adds a dimension that no other element can replicate.',
      "At Westside Professional Landscape, we design and build water features that are tailored to your property, your aesthetic, and your lifestyle. Whether you envision a naturalistic waterfall cascading over native stone, a tranquil koi pond, or a sleek modern fountain, our team has the expertise to bring it to life. We've been creating water features for homeowners across Pittsford, Brighton, Penfield, and the greater Rochester area for over 26 years.",
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
    relatedSlugs: ['landscape-design', 'hardscaping', 'landscape-maintenance'],
    ctaHeading: 'ADD THE BEAUTY OF WATER TO YOUR <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">LANDSCAPE</span>',
    ctaText: 'Schedule a consultation and let us design a water feature that transforms your outdoor space.',
  },

  'snow-ice-management': {
    introLabel: "Rochester's Winters Demand More",
    introTitle: 'PROFESSIONAL <span class="text-green">SNOW MANAGEMENT</span>',
    introText: [
      'Rochester averages <strong>nearly 100 inches of snowfall per year</strong>, making it one of the snowiest cities in the United States. For commercial property owners and managers across Monroe County, that means months of liability exposure, operational disruptions, and the constant threat of slip-and-fall incidents.',
      "Westside Professional Landscape provides comprehensive commercial snow and ice management that keeps your property safe and accessible around the clock. Our crews monitor weather conditions continuously and deploy proactively — often <em>before the first flake hits the ground</em>. With seasonal contracts, dedicated equipment, and a response team ready <strong>24/7</strong>, we take the stress of winter off your plate.",
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
    relatedSlugs: ['landscape-maintenance', 'hardscaping', 'holiday-lighting'],
    ctaHeading: "DON'T WAIT FOR THE FIRST <span style=\"text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;\">STORM</span>",
    ctaText: "Secure your snow management contract now. Properties that plan ahead get priority response when Rochester's winters arrive.",
  },

  'artificial-grass': {
    introLabel: 'SYNLawn Authorized Dealer',
    introTitle: 'YEAR-ROUND <span class="text-green">GREEN</span>',
    introText: [
      "As an <strong>Authorized SYNLawn dealer</strong>, Westside Professional Landscape installs premium artificial turf for homeowners and businesses across Greater Rochester. Synthetic turf eliminates mowing, watering, fertilizing, and weed control — giving you a consistently green lawn <em>every day of the year</em>, even through Rochester's long winters.",
      "SYNLawn products are crafted from advanced synthetic fibers designed to replicate the look and feel of natural grass. Backed by <strong>industry-leading warranties</strong> and engineered for durability, they're built to handle foot traffic, pets, and our four-season climate without fading, matting, or deteriorating.",
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
    relatedSlugs: ['landscape-design', 'hardscaping', 'landscape-maintenance'],
    ctaHeading: 'READY FOR A LAWN THAT\'S ALWAYS <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">GREEN?</span>',
    ctaText: "Schedule a <strong>free consultation</strong>. We'll assess your property and show you how SYNLawn can transform your outdoor space.",
  },

  'commercial-services': {
    introLabel: 'Grounds Management for Business',
    introTitle: 'COMMERCIAL <span class="text-green">LANDSCAPE SERVICES</span>',
    introText: [
      "<strong>Westside Professional Landscape</strong> provides full-service grounds management for commercial properties across Greater Rochester. From weekly landscape maintenance to seasonal snow and ice management, we give property managers and business owners <em>a single point of contact</em> for all exterior property care.",
      "Our commercial crews are <strong>well-trained and uniformed</strong>, and we bring over two decades of experience maintaining office parks, retail centers, medical facilities, HOA communities, and industrial properties throughout Monroe County. As members of industry trade associations, we hold ourselves to professional standards of service, safety, and continuing education.",
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
      { title: 'INSTALLATION', text: 'Our experienced crew installs lights and decorations with care — <em>no damage to your property</em>.' },
      { title: 'MAINTENANCE', text: "If a bulb goes out or a strand needs adjustment, one call and we're there to fix it." },
      { title: 'REMOVAL', text: 'After the holidays, we remove everything, inspect it, and store it for next year.' },
    ],
    relatedSlugs: ['landscape-design', 'snow-ice-management', 'landscape-maintenance'],
    ctaHeading: 'MAKE YOUR PROPERTY SHINE THIS <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.4); text-underline-offset: 6px;">SEASON</span>',
    ctaText: "Book your holiday decorating early — <strong>reservations fill up fast</strong>. Let us handle the lights while you enjoy the holidays.",
  },
};
