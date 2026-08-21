/**
 * Site-wide URL helpers — single source of truth for canonical, OG, and JSON-LD URLs.
 *
 * Production URLs use company.url (westsideprolandscape.com).
 * All page URLs respect trailingSlash: 'always'.
 * Asset URLs (with file extensions) do NOT get trailing slashes.
 */
import { company } from '@data/company';

const SITE_ORIGIN = company.url; // https://westsideprolandscape.com

/**
 * Build a full absolute URL for a page path. Always uses the production origin
 * so JSON-LD, OG, and canonical URLs are consistent regardless of preview env.
 *
 * Automatically adds trailing slash for page paths (no extension).
 *
 * @example siteUrl('/about') → 'https://westsideprolandscape.com/about/'
 * @example siteUrl('/assets/hero.CxAbC123.webp') → 'https://westsideprolandscape.com/assets/hero.CxAbC123.webp'
 * @example siteUrl('/') → 'https://westsideprolandscape.com/'
 */
export function siteUrl(path: string): string {
  // Ensure leading slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Add trailing slash for page paths (no file extension)
  const hasExtension = cleanPath.includes('.');
  const needsSlash = !hasExtension && !cleanPath.endsWith('/');

  return `${SITE_ORIGIN}${cleanPath}${needsSlash ? '/' : ''}`;
}
