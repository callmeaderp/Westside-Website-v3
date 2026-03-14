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
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL;
  // Already prefixed — return as-is
  if (base !== '/' && path.startsWith(base)) return path;
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Add trailing slash for page paths (not assets with file extensions)
  if (cleanPath && !cleanPath.includes('.') && !cleanPath.endsWith('/')) {
    cleanPath += '/';
  }
  return `${base}${cleanPath}`;
}
