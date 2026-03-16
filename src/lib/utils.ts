/**
 * Prefix a path with the site's base URL.
 * Handles both asset paths (/images/...) and page paths (/about).
 * In dev or on a root domain, BASE_URL is "/". On GH Pages it's "/Westside-Website-v3/".
 *
 * Page paths (no file extension) automatically get a trailing slash to match
 * the trailingSlash: 'always' Astro config and avoid 301 redirects.
 *
 * Idempotent: if the path already starts with the base, it's returned as-is.
 * This prevents double-prefixing when url() is called in both a page and a component.
 *
 * Safe with query strings, hashes, and absolute URLs:
 *   url('/contact?src=ad')    → /base/contact/?src=ad
 *   url('/about#team')        → /base/about/#team
 *   url('https://example.com') → https://example.com (returned as-is)
 */
export function url(path: string): string {
  // Absolute URLs — leave untouched
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const base = import.meta.env.BASE_URL;

  // Already prefixed — return as-is
  if (base !== '/' && path.startsWith(base)) return path;

  // Split off query string and hash before processing the path portion
  let pathname = path;
  let suffix = '';
  const hashIdx = pathname.indexOf('#');
  if (hashIdx !== -1) {
    suffix = pathname.slice(hashIdx) + suffix;
    pathname = pathname.slice(0, hashIdx);
  }
  const queryIdx = pathname.indexOf('?');
  if (queryIdx !== -1) {
    suffix = pathname.slice(queryIdx) + suffix;
    pathname = pathname.slice(0, queryIdx);
  }

  let cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;

  // Add trailing slash for page paths (not assets with file extensions)
  if (cleanPath && !cleanPath.includes('.') && !cleanPath.endsWith('/')) {
    cleanPath += '/';
  }

  return `${base}${cleanPath}${suffix}`;
}
