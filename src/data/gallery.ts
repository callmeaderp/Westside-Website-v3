/**
 * Photo and video gallery — drives /gallery/, its lightbox, and the "From our
 * work" strips on service pages.
 *
 * Evidence rules (these are published claims about real work):
 *  - Every item must be a real Westside job photo or clip from the Westside
 *    Media Library, never stock or wholly generated imagery. Inherited stock
 *    (the old holiday and snow images) is deliberately excluded.
 *  - Captions describe what Westside actually did there. Where another trade
 *    built part of the scene (a pool, a stone bridge, a home's hardscape), the
 *    caption names only Westside's scope.
 *  - `services` controls which service pages may show the item. Tag a service
 *    only when the photo is real evidence of that service; the scope behind
 *    the newer drone and field sets was checked against Jobber job records on
 *    2026-10-02 (local/marketing/website-media-refresh-2026-10-02/).
 *  - Public filenames stay neutral: no client names or street addresses.
 *
 * Array order is display order on /gallery/ and priority order for the
 * service-page strips, so keep the strongest and most varied items early.
 */
import type { ServiceSlug } from './services';

export type GalleryCategory = 'landscape' | 'lawn' | 'hardscape' | 'turf' | 'commercial' | 'process';

export interface GalleryItem {
  id: string;
  /** Photo filename resolved through getPhoto(). For a video, the poster frame. */
  image: string;
  /** Web-encoded MP4 under public/media/video/ (videos only). */
  video?: string;
  alt: string;
  category: GalleryCategory;
  /** Short label shown above the caption. */
  tag: string;
  caption: string;
  /** Service pages that may feature this item. */
  services?: ServiceSlug[];
  /** Layout hint for the unfiltered gallery grid; ignored once filtered. */
  span?: 'wide' | 'tall' | 'large';
}

export const galleryCategories = [
  { value: 'all', label: 'All Work' },
  { value: 'landscape', label: 'Landscape & Gardens' },
  { value: 'lawn', label: 'Lawns & Maintenance' },
  { value: 'hardscape', label: 'Patios & Walls' },
  { value: 'turf', label: 'Turf & Putting Greens' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'process', label: 'Behind the Scenes' },
  { value: 'video', label: 'Video' },
] as const;

export type GalleryFilter = (typeof galleryCategories)[number]['value'];

export const gallery: GalleryItem[] = [
  {
    id: 'putting-green-estate-fall',
    image: 'hero-gallery-putting-green-estate.webp',
    alt: 'Aerial view of a wooded backyard in fall color with a synthetic putting green, white bunkers, and a stone bridge below the house',
    category: 'turf',
    tag: 'Synthetic Turf',
    caption: 'A private par-3 hole in peak fall color',
    services: ['artificial-grass'],
    span: 'large',
  },
  {
    id: 'estate-front-landscape',
    image: 'svc-landscape-design-estate.webp',
    alt: 'Aerial view of a white home with a freshly striped front lawn, curved foundation beds, and young trees planted along the driveway',
    category: 'landscape',
    tag: 'Landscape Installation',
    caption: 'Beds, trees, and lawn we installed and still maintain',
    services: ['landscape-design', 'landscape-maintenance', 'lawn-care', 'plant-health'],
  },
  {
    id: 'striped-estate-lawn',
    image: 'svc-maintenance-striped-lawn.webp',
    alt: 'Wide striped lawn curving along a driveway under a blue sky, with a pink redbud blooming at the far edge',
    category: 'lawn',
    tag: 'Lawn Maintenance',
    caption: 'Fresh stripes on a sweeping spring lawn',
    services: ['landscape-maintenance', 'lawn-care'],
  },
  {
    id: 'video-putting-green-autumn',
    image: 'video-putting-green-autumn.webp',
    video: '/media/video/video-putting-green-autumn.mp4',
    alt: 'Drone footage gliding through fall trees toward a synthetic putting green with white bunkers and a stone bridge',
    category: 'turf',
    tag: 'Drone Video',
    caption: 'Gliding in through October color',
    services: ['artificial-grass'],
    span: 'wide',
  },
  {
    id: 'apartment-turf-recreation-lawn',
    image: 'svc-commercial-turf-courts.webp',
    alt: 'Synthetic turf recreation lawn with white yard lines and a center logo, set between an apartment building and its pool deck',
    category: 'commercial',
    tag: 'Commercial Turf',
    caption: 'A turf recreation lawn for an apartment community',
    services: ['commercial-services', 'artificial-grass'],
  },
  {
    id: 'community-lawn-stripes',
    image: 'svc-lawn-care-community.webp',
    alt: 'Freshly striped lawn sweeping past a row of single-story homes under a deep blue sky',
    category: 'lawn',
    tag: 'Lawn Care',
    caption: 'Striped lawns across a patio-home community',
    services: ['lawn-care', 'landscape-maintenance', 'commercial-services'],
  },
  {
    id: 'tudor-foundation-beds',
    image: 'svc-landscape-design.webp',
    alt: 'Stone-and-timber home with fresh mulched foundation beds, a flowering purple rhododendron, and a striped front lawn',
    category: 'landscape',
    tag: 'Landscape Design',
    caption: 'Foundation beds and lawn for a stone Tudor',
    services: ['landscape-design'],
  },
  {
    id: 'raised-patio-bar',
    image: 'gallery-drone-patio.webp',
    alt: 'Aerial view at dusk of a raised paver patio with a lit stone bar counter and stools',
    category: 'hardscape',
    tag: 'Outdoor Living',
    caption: 'Raised patio and bar seating at dusk',
    services: ['hardscaping', 'outdoor-kitchens'],
  },
  {
    id: 'backyard-berm-plantings',
    image: 'svc-lawn-care-backyard.webp',
    alt: 'Striped backyard lawn framed by mulched berms of evergreens and ornamental trees, with Adirondack chairs around a fire pit on a paver patio',
    category: 'lawn',
    tag: 'Lawn & Beds',
    caption: 'Planted berms framing a striped backyard lawn',
    services: ['lawn-care', 'landscape-maintenance'],
    span: 'wide',
  },
  {
    id: 'snow-plow-truck',
    image: 'svc-snow-plow-truck.webp',
    alt: 'White Westside Professional Landscape pickup with a snow-crusted plow blade and amber lights glowing at dusk',
    category: 'commercial',
    tag: 'Snow & Ice',
    caption: 'One of our plow trucks between storms',
    services: ['snow-ice-management', 'commercial-services'],
  },
  {
    id: 'pondless-waterfall',
    image: 'gallery-pondless-waterfall.webp',
    alt: 'Pondless waterfall feature surrounded by natural stone',
    category: 'landscape',
    tag: 'Water Feature',
    caption: 'Pondless waterfall and stream',
    services: ['water-features'],
  },
  {
    id: 'tee-box-to-green',
    image: 'hero-projects-putting-green-tee.webp',
    alt: 'Synthetic turf tee box ringed by path lights, looking down a fairway to a putting green, white bunkers, and a stone bridge',
    category: 'turf',
    tag: 'Synthetic Turf',
    caption: 'From the tee box to the green',
    services: ['artificial-grass'],
  },
  {
    id: 'striped-lawn-sedum-bed',
    image: 'svc-maintenance-beds.webp',
    alt: 'Striped lawn beside a curved bed of pink sedum and clipped shrubs along a paver walkway with path lights',
    category: 'lawn',
    tag: 'Bed Maintenance',
    caption: 'Clean edges, fresh mulch, and a striped lawn',
    services: ['landscape-maintenance'],
  },
  {
    id: 'apartment-turf-aerial',
    image: 'gallery-turf-courts-aerial.webp',
    alt: 'Aerial view of a lined synthetic turf recreation lawn with a center logo next to an apartment pool deck',
    category: 'commercial',
    tag: 'Commercial Turf',
    caption: 'About 3,000 square feet of turf beside the pool deck',
    services: ['commercial-services', 'artificial-grass'],
  },
  {
    id: 'video-estate-lawn',
    image: 'video-estate-lawn.webp',
    video: '/media/video/video-estate-lawn.mp4',
    alt: 'Drone footage orbiting a striped front lawn, foundation planting beds, and young trees in front of a white home',
    category: 'lawn',
    tag: 'Drone Video',
    caption: 'A lawn and landscape we installed and maintain',
    services: ['lawn-care', 'landscape-design', 'landscape-maintenance', 'plant-health'],
    span: 'wide',
  },
  {
    id: 'night-landscape-lighting',
    image: 'hero-home.webp',
    alt: 'Stone-front home at night with uplit trees, lit foundation plantings, and a dark front lawn',
    category: 'landscape',
    tag: 'Landscape Lighting',
    caption: 'A front landscape lit for the evening',
    services: ['landscape-design'],
  },
  {
    id: 'apartment-grounds',
    image: 'svc-commercial-apartment-grounds.webp',
    alt: 'Mid-rise apartment building with a striped front lawn, clipped hedges, and red Japanese maples along the entry drive',
    category: 'commercial',
    tag: 'Commercial Grounds',
    caption: 'Clipped hedges and crisp stripes at an apartment entry',
    services: ['commercial-services', 'landscape-maintenance'],
  },
  {
    id: 'circular-brick-patio',
    image: 'svc-hardscape.webp',
    alt: 'Circular brick paver patio with a stone seat wall and built-in grill counter under a mature tree',
    category: 'hardscape',
    tag: 'Patio',
    caption: 'Circular brick patio with a built-in grill',
    services: ['hardscaping', 'outdoor-kitchens'],
  },
  {
    id: 'putting-green-fall-hillside',
    image: 'gallery-putting-green-fall-hillside.webp',
    alt: 'Aerial view of a synthetic putting green with white bunkers and a stone bridge surrounded by orange fall trees',
    category: 'turf',
    tag: 'Synthetic Turf',
    caption: 'A full golf hole tucked into a wooded hillside',
    services: ['artificial-grass'],
  },
  {
    id: 'estate-lawn-spruce-row',
    image: 'svc-plant-health-lawn.webp',
    alt: 'Large striped lawn running to a row of blue spruce at the edge of the woods',
    category: 'lawn',
    tag: 'Turf Program',
    caption: 'Dense, even turf on a regular mowing and feeding program',
    services: ['plant-health', 'lawn-care'],
  },
  {
    id: 'estate-lawn-house-spruce',
    image: 'svc-plant-health-lawn-card.webp',
    alt: 'Wide striped lawn behind a white home, edged by mulched beds and a curving row of blue spruce',
    category: 'lawn',
    tag: 'Lawn Care',
    caption: 'An estate lawn we mow and feed through the season',
    services: ['lawn-care', 'plant-health', 'landscape-maintenance'],
  },
  {
    id: 'estate-tree-plantings',
    image: 'gallery-estate-trees-lawn.webp',
    alt: 'Aerial view of an estate lawn dotted with young shade trees in mulch rings and a long row of ornamental trees',
    category: 'landscape',
    tag: 'Landscape Installation',
    caption: 'New shade trees and an ornamental row across an estate lawn',
    services: ['landscape-design'],
  },
  {
    id: 'lit-seat-wall-patio',
    image: 'gallery-lit-patio.webp',
    alt: 'Illuminated seat wall and patio at dusk with under-cap lighting',
    category: 'hardscape',
    tag: 'Outdoor Living',
    caption: 'Accent-lit seat wall and patio',
    services: ['hardscaping', 'retaining-walls'],
  },
  {
    id: 'curved-stone-seat-wall',
    image: 'svc-retaining-walls-seat-wall.webp',
    alt: 'Curved stacked-stone seat wall with lantern pillars wrapping a backyard patio beside a two-story home',
    category: 'hardscape',
    tag: 'Seat Walls',
    caption: 'Curved stone seat wall around a backyard patio',
    services: ['retaining-walls', 'hardscaping'],
  },
  {
    id: 'townhome-drive-cleared',
    image: 'svc-snow-cleared-drive.webp',
    alt: 'Plowed drive between rows of brick townhomes at dawn, with snowbanks lit by porch lights',
    category: 'commercial',
    tag: 'Snow & Ice',
    caption: 'A townhome drive cleared before sunrise',
    services: ['snow-ice-management', 'commercial-services'],
  },
  {
    id: 'turfed-stone-bridge',
    image: 'gallery-putting-green-bridge.webp',
    alt: 'Low view across a stone arch bridge surfaced in synthetic turf toward a putting green and bunkers',
    category: 'turf',
    tag: 'Synthetic Turf',
    caption: 'Putting-grade turf carried right across the bridge',
    services: ['artificial-grass'],
  },
  {
    id: 'backyard-putting-green',
    image: 'proj-backyard-putting-green.webp',
    alt: 'Backyard synthetic putting green with flags, fringe, and a white-turf bunker beside a paver patio and natural stone wall',
    category: 'turf',
    tag: 'Putting Green',
    caption: 'A three-cup putting green beside the pool patio',
    services: ['artificial-grass'],
    span: 'tall',
  },
  {
    id: 'stone-kitchen-lit-bar',
    image: 'svc-outdoor-kitchen-lit-bar.webp',
    alt: 'Stone outdoor kitchen island with a stainless door and grill, lit by warm sconces on a paver patio at dusk',
    category: 'hardscape',
    tag: 'Outdoor Kitchen',
    caption: 'A stone outdoor kitchen glowing at dusk',
    services: ['outdoor-kitchens', 'hardscaping'],
  },
  {
    id: 'westside-truck-lawn',
    image: 'home-westside-truck-lawn.webp',
    alt: 'Westside Professional Landscape truck door with logo and phone number beside a striped lawn and stone ranch home',
    category: 'lawn',
    tag: 'On the Job',
    caption: 'Our truck at a property we care for',
    services: ['landscape-maintenance', 'lawn-care'],
  },
  {
    id: 'front-entry-screen-plantings',
    image: 'svc-landscape-design-front-entry.webp',
    alt: 'Aerial view of a front lawn bordered by a row of ornamental trees and shrubs, with foundation plantings along the house',
    category: 'landscape',
    tag: 'Landscape Installation',
    caption: 'Layered screening trees and foundation plantings',
    services: ['landscape-design'],
  },
  {
    id: 'video-apartment-turf',
    image: 'video-apartment-turf-courts.webp',
    video: '/media/video/video-apartment-turf-courts.mp4',
    alt: 'Drone footage moving across an apartment courtyard toward a pool deck and a lined synthetic turf recreation lawn',
    category: 'commercial',
    tag: 'Drone Video',
    caption: 'Across the courtyard to the finished turf',
    services: ['commercial-services', 'artificial-grass'],
    span: 'wide',
  },
  {
    id: 'golf-balls-turf',
    image: 'gallery-golf-balls-turf.webp',
    alt: 'Golf balls stacked in a small pyramid on dewy synthetic turf with fall trees behind',
    category: 'turf',
    tag: 'Turf Detail',
    caption: 'Golf balls on dew-covered synthetic turf',
    services: ['artificial-grass'],
  },
  {
    id: 'show-garden',
    image: 'gallery-show-garden.webp',
    alt: 'Curved cobblestone path through a flowering show garden of tulips and spring blooms',
    category: 'landscape',
    tag: 'Garden Show',
    caption: 'Our spring garden show display',
    services: ['landscape-design'],
    span: 'tall',
  },
  {
    id: 'stream-waterfall-patio',
    image: 'svc-water-features.webp',
    alt: 'Boulder-lined stream and small waterfall running past a paver patio with a table and cushioned chairs',
    category: 'landscape',
    tag: 'Water Feature',
    caption: 'Boulder stream and waterfall beside the patio',
    services: ['water-features'],
  },
  {
    id: 'travertine-patio',
    image: 'hero-outdoor-living.webp',
    alt: 'Travertine patio with a curved seat wall, lantern pillar, and lounge seating',
    category: 'hardscape',
    tag: 'Patio',
    caption: 'A travertine patio set up for lounging',
    services: ['hardscaping', 'retaining-walls'],
  },
  {
    id: 'woodland-fire-pit-patio',
    image: 'proj-woodland-firepit-patio.webp',
    alt: 'Paver patio in a wooded backyard with cushioned seating arranged around a fire pit',
    category: 'hardscape',
    tag: 'Fire Feature',
    caption: 'A wooded patio built around the fire pit',
    services: ['outdoor-kitchens', 'hardscaping'],
  },
  {
    id: 'curved-walk-porch',
    image: 'svc-walkways-steps.webp',
    alt: 'Curved paver walkway with a cobble border leading to a covered front porch past a mulched bed of mums and ornamental grass',
    category: 'hardscape',
    tag: 'Walkway',
    caption: 'Curved paver walk to the front porch',
    services: ['walkways-steps'],
  },
  {
    id: 'wide-front-walk',
    image: 'proj-front-walkway-beds.webp',
    alt: 'Wide curved paver walkway from the driveway to the front door beside newly planted foundation beds',
    category: 'hardscape',
    tag: 'Walkway',
    caption: 'A wide paver walk with new foundation beds',
    services: ['walkways-steps', 'landscape-design'],
  },
  {
    id: 'front-entry-rebuild',
    image: 'proj-front-entry-after.webp',
    alt: 'Rebuilt front entry with a paver landing, wide steps, a low retaining wall, and a fresh planting bed',
    category: 'hardscape',
    tag: 'Front Entry',
    caption: 'Rebuilt entry steps, landing, and low wall',
    services: ['walkways-steps', 'retaining-walls'],
    span: 'tall',
  },
  {
    id: 'low-seat-wall-pillars',
    image: 'svc-retaining-walls-curved-seat-wall.webp',
    alt: 'Curved segmental seat wall with capped pillars around a paver patio, edged by mulch beds and lawn',
    category: 'hardscape',
    tag: 'Seat Walls',
    caption: 'Capped pillars and a low wall around a paver patio',
    services: ['retaining-walls', 'hardscaping'],
  },
  {
    id: 'raised-shade-garden-wall',
    image: 'proj-retaining-wall-shade-garden.webp',
    alt: 'Long raised stone retaining wall creating a level planted shade garden beside a home',
    category: 'hardscape',
    tag: 'Retaining Wall',
    caption: 'A raised stone wall that levels a shade garden',
    services: ['retaining-walls'],
  },
  {
    id: 'two-level-patio',
    image: 'proj-multi-level-seat-wall.webp',
    alt: 'Multi-level paver patio with steps between levels and a stone seat wall enclosing the upper terrace',
    category: 'hardscape',
    tag: 'Patio',
    caption: 'Two patio levels joined by broad steps',
    services: ['hardscaping', 'retaining-walls'],
    span: 'tall',
  },
  {
    id: 'striped-colonial-lawn',
    image: 'gallery-striped-colonial.webp',
    alt: 'Pristine striped lawn on a colonial property',
    category: 'lawn',
    tag: 'Lawn Care',
    caption: 'Striped front lawn on a colonial',
    services: ['lawn-care'],
  },
  {
    id: 'striped-hillside-lawn',
    image: 'svc-maintenance.webp',
    alt: 'Wide sloping lawn mowed into clean stripes running up to a gray-sided house framed by fall foliage',
    category: 'lawn',
    tag: 'Lawn Maintenance',
    caption: 'A striped hillside lawn in early fall',
    services: ['landscape-maintenance'],
  },
  {
    id: 'putting-green-overhead',
    image: 'proj-private-putting-green-complex.webp',
    alt: 'Aerial view of a private synthetic putting green with three white bunkers, a flag, curved fringe, and a stone bridge',
    category: 'turf',
    tag: 'Synthetic Turf',
    caption: 'The green and its bunkers from straight above',
    services: ['artificial-grass'],
  },
  {
    id: 'putting-green-autumn-woods',
    image: 'hero-artificial-grass-putting-green.webp',
    alt: 'Synthetic putting green and white bunkers framed by autumn woods, with a stone bridge at the left',
    category: 'turf',
    tag: 'Synthetic Turf',
    caption: 'Bunkers and green framed by autumn woods',
    services: ['artificial-grass'],
  },
  {
    id: 'putting-green-bunker',
    image: 'gallery-putting-green-bunker.webp',
    alt: 'White-turf bunker in front of a backyard putting green with flags below a natural stone wall',
    category: 'turf',
    tag: 'Putting Green',
    caption: 'A practice bunker that fits a compact backyard',
    services: ['artificial-grass'],
    span: 'tall',
  },
  {
    id: 'pet-turf-area',
    image: 'svc-artificial-grass-backyard.webp',
    alt: 'Aerial view of a flat green artificial lawn ringed by a black iron fence, planted borders, and an adjoining paver patio',
    category: 'turf',
    tag: 'Pet Turf',
    caption: 'An artificial turf pet area with planted borders',
    services: ['artificial-grass'],
  },
  {
    id: 'apartment-turf-lengthwise',
    image: 'gallery-turf-courts-lengthwise.webp',
    alt: 'Ground-level view down a synthetic turf recreation lawn with white yard lines and a logo inlay',
    category: 'commercial',
    tag: 'Commercial Turf',
    caption: 'Yard lines and a custom logo built into the turf',
    services: ['commercial-services', 'artificial-grass'],
  },
  {
    id: 'lit-commercial-courtyard',
    image: 'proj-commercial-courtyard.webp',
    alt: 'Lit commercial courtyard with paver walkways, seating, and planting beds in the evening',
    category: 'commercial',
    tag: 'Commercial',
    caption: 'A lit courtyard with paver walks and plantings',
    services: ['commercial-services', 'landscape-design'],
  },
  {
    id: 'plow-fleet',
    image: 'hero-about.webp',
    alt: 'Row of white Westside pickup trucks fitted with snow plows',
    category: 'commercial',
    tag: 'Snow & Ice',
    caption: 'Plow trucks staged for the season',
    services: ['snow-ice-management'],
  },
  {
    id: 'video-putting-green-bridge',
    image: 'video-putting-green-bridge.webp',
    video: '/media/video/video-putting-green-bridge.mp4',
    alt: 'Drone footage passing low over a stone bridge and rising to reveal a synthetic putting green and flag',
    category: 'turf',
    tag: 'Drone Video',
    caption: 'Skimming the stone bridge on the way to the pin',
    services: ['artificial-grass'],
  },
  {
    id: 'video-putting-green-pan',
    image: 'video-putting-green-pan.webp',
    video: '/media/video/video-putting-green-pan.mp4',
    alt: 'Drone footage panning across a synthetic putting green and its white bunkers',
    category: 'turf',
    tag: 'Drone Video',
    caption: 'Sweeping across the green and bunkers',
    services: ['artificial-grass'],
  },
  {
    id: 'process-turf-recreation-lawn',
    image: 'gallery-process-turf-courts.webp',
    alt: 'Crew rolling out and fitting synthetic turf beside an apartment pool deck, with machines and gravel base still visible',
    category: 'process',
    tag: 'In Progress',
    caption: 'Rolling out turf at an apartment community',
    services: ['commercial-services', 'artificial-grass'],
  },
  {
    id: 'process-turf-edge',
    image: 'gallery-process-turf-edge.webp',
    alt: 'Crew member in a hard hat fastening the edge of new synthetic turf over a compacted gravel base',
    category: 'process',
    tag: 'In Progress',
    caption: 'Securing turf edges over a compacted base',
    services: ['artificial-grass', 'commercial-services'],
  },
  {
    id: 'process-seat-walls',
    image: 'gallery-process-seat-walls.webp',
    alt: 'Crew laying courses of segmental block for seat walls around a new patio base, with a laser level on site',
    category: 'process',
    tag: 'In Progress',
    caption: 'Seat walls going up around a sunken fire pit',
    services: ['retaining-walls', 'hardscaping', 'outdoor-kitchens'],
  },
  {
    id: 'process-pet-turf',
    image: 'gallery-process-pet-turf.webp',
    alt: 'Overhead view of a crew seaming synthetic turf for a backyard pet area beside a pool and planted border',
    category: 'process',
    tag: 'In Progress',
    caption: 'Seaming turf for a backyard pet area',
    services: ['artificial-grass'],
  },
  {
    id: 'process-tricycle-track',
    image: 'gallery-process-tricycle-track.webp',
    alt: 'Crew preparing the base of a looping tricycle track and play area behind a childcare center',
    category: 'process',
    tag: 'In Progress',
    caption: 'Base work for a childcare center tricycle track',
    services: ['commercial-services'],
  },
  {
    id: 'process-patio-excavation',
    image: 'svc-drainage-grading.webp',
    alt: 'Compact excavator regrading a stripped-back side yard, with fresh machine tracks in the exposed soil',
    category: 'process',
    tag: 'In Progress',
    caption: 'Digging out and regrading before a new patio',
    services: ['drainage-grading', 'hardscaping'],
  },
];

/**
 * Verified stock derivatives (Corbis originals, confirmed 2026-09-27). The
 * gallery is presented as Westside's own work, so these may never appear in it.
 * svc-holiday-lighting.webp is still the holiday page hero pending real photos.
 */
const KNOWN_STOCK = ['svc-holiday-lighting.webp', 'svc-snow.webp', 'gallery-holiday-festive.webp'];

const galleryIds = new Set<string>();
for (const item of gallery) {
  if (galleryIds.has(item.id)) throw new Error(`Duplicate gallery id: ${item.id}`);
  if (KNOWN_STOCK.includes(item.image)) {
    throw new Error(`Gallery item "${item.id}" uses verified stock image ${item.image}`);
  }
  if (item.video && !item.video.startsWith('/media/video/')) {
    throw new Error(`Gallery video "${item.id}" must live under public/media/video/`);
  }
  galleryIds.add(item.id);
}

/** Whether an item belongs under a gallery filter value. */
export function matchesFilter(item: GalleryItem, filter: GalleryFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'video') return Boolean(item.video);
  return item.category === filter;
}

/**
 * Items for a service page's "From our work" strip, in gallery priority order,
 * skipping photos the page already shows as its hero or intro image.
 */
export function galleryForService(slug: ServiceSlug, exclude: string[] = [], limit = 6): GalleryItem[] {
  return gallery
    .filter((item) => item.services?.includes(slug) && !exclude.includes(item.image))
    .slice(0, limit);
}
