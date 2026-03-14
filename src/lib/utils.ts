/**
 * Prefix a path with the site's base URL.
 * Handles both asset paths (/images/...) and page paths (/about).
 * In dev or on a root domain, BASE_URL is "/". On GH Pages it's "/Westside-Website-v3/".
 *
 * Idempotent: if the path already starts with the base, it's returned as-is.
 * This prevents double-prefixing when url() is called in both a page and a component.
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL;
  // Already prefixed — return as-is
  if (base !== '/' && path.startsWith(base)) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}
