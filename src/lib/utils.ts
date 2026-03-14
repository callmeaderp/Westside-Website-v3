/**
 * Prefix a path with the site's base URL.
 * Handles both asset paths (/images/...) and page paths (/about).
 * In dev or on a root domain, BASE_URL is "/". On GH Pages it's "/Westside-Website-v3/".
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}
