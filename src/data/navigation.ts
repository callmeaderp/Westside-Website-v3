/**
 * Site navigation structure — drives Header, Footer, and sitemap.
 * Single source of truth for all internal links.
 * All hrefs include trailing slashes to match trailingSlash: 'always' config.
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
      { label: 'Landscape Design', href: '/services/landscape-design/' },
      { label: 'Maintenance', href: '/services/landscape-maintenance/' },
      { label: 'Lawn Care', href: '/services/lawn-care/' },
      { label: 'Fertilization & Weed Control', href: '/services/plant-health/' },
      { label: 'Hardscaping', href: '/services/hardscaping/' },
      { label: 'Water Features', href: '/services/water-features/' },
      { label: 'Snow & Ice Management', href: '/services/snow-ice-management/' },
      { label: 'Holiday Decorating', href: '/services/holiday-lighting/' },
      { label: 'Artificial Grass', href: '/services/artificial-grass/' },
      { label: 'Commercial Services', href: '/services/commercial-services/' },
    ],
  },
  { label: 'About', href: '/about/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Careers', href: '/careers/' },
  { label: 'Contact', href: '/contact/' },
];

export const footerServices: NavItem[] = [
  { label: 'Landscape Design', href: '/services/landscape-design/' },
  { label: 'Maintenance', href: '/services/landscape-maintenance/' },
  { label: 'Lawn Care', href: '/services/lawn-care/' },
  { label: 'Fertilization & Weed Control', href: '/services/plant-health/' },
  { label: 'Hardscaping', href: '/services/hardscaping/' },
  { label: 'Water Features', href: '/services/water-features/' },
  { label: 'Snow & Ice Management', href: '/services/snow-ice-management/' },
  { label: 'Holiday Decorating', href: '/services/holiday-lighting/' },
  { label: 'Artificial Grass', href: '/services/artificial-grass/' },
  { label: 'Commercial Services', href: '/services/commercial-services/' },
];

export const footerCompany: NavItem[] = [
  { label: 'About Us', href: '/about/' },
  { label: 'Service Areas', href: '/service-areas/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Careers', href: '/careers/' },
  { label: 'Contact', href: '/contact/' },
  { label: '5-Step Program', href: '/services/plant-health/' },
  { label: 'Labels & SDS', href: '/labels-sds/' },
  { label: 'Free Estimate', href: '/contact/' },
];
