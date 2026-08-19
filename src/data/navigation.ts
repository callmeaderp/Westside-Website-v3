/**
 * Site navigation structure — drives Header, Footer, and sitemap.
 * Single source of truth for all internal links.
 * All hrefs include trailing slashes to match trailingSlash: 'always' config.
 *
 * Construction lanes lead the Services menu deliberately: they are the
 * highest-value work and the reason most visitors arrive.
 */

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services/',
    children: [
      { label: 'Hardscaping & Outdoor Living', href: '/services/hardscaping/' },
      { label: 'Walkways, Steps & Entries', href: '/services/walkways-steps/' },
      { label: 'Retaining & Seat Walls', href: '/services/retaining-walls/' },
      { label: 'Outdoor Kitchens & Fire', href: '/services/outdoor-kitchens/' },
      { label: 'Drainage & Grading', href: '/services/drainage-grading/' },
      { label: 'Landscape Design', href: '/services/landscape-design/' },
      { label: 'Water Features', href: '/services/water-features/' },
      { label: 'Artificial Grass', href: '/services/artificial-grass/' },
      { label: 'Maintenance', href: '/services/landscape-maintenance/' },
      { label: 'Lawn Care', href: '/services/lawn-care/' },
      { label: 'Fertilization & Weed Control', href: '/services/plant-health/' },
      { label: 'Snow & Ice Management', href: '/services/snow-ice-management/' },
      { label: 'Holiday Decorating', href: '/services/holiday-lighting/' },
      { label: 'Commercial Services', href: '/services/commercial-services/' },
    ],
  },
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Careers', href: '/careers/' },
  { label: 'Contact', href: '/contact/' },
];

export const footerServices: NavItem[] = [
  { label: 'Hardscaping & Outdoor Living', href: '/services/hardscaping/' },
  { label: 'Walkways, Steps & Entries', href: '/services/walkways-steps/' },
  { label: 'Retaining & Seat Walls', href: '/services/retaining-walls/' },
  { label: 'Outdoor Kitchens & Fire', href: '/services/outdoor-kitchens/' },
  { label: 'Drainage & Grading', href: '/services/drainage-grading/' },
  { label: 'Landscape Design', href: '/services/landscape-design/' },
  { label: 'Water Features', href: '/services/water-features/' },
  { label: 'Artificial Grass', href: '/services/artificial-grass/' },
  { label: 'Maintenance', href: '/services/landscape-maintenance/' },
  { label: 'Lawn Care', href: '/services/lawn-care/' },
  { label: 'Fertilization & Weed Control', href: '/services/plant-health/' },
  { label: 'Snow & Ice Management', href: '/services/snow-ice-management/' },
  { label: 'Holiday Decorating', href: '/services/holiday-lighting/' },
  { label: 'Commercial Services', href: '/services/commercial-services/' },
];

export const footerCompany: NavItem[] = [
  { label: 'About Us', href: '/about/' },
  { label: 'Project Gallery', href: '/projects/' },
  { label: 'Service Areas', href: '/service-areas/' },
  { label: 'Photo Gallery', href: '/gallery/' },
  { label: 'Careers', href: '/careers/' },
  { label: 'Contact', href: '/contact/' },
  { label: '5-Step Program', href: '/services/plant-health/' },
  { label: 'Labels & SDS', href: '/labels-sds/' },
  { label: 'Free Estimate', href: '/contact/' },
];
