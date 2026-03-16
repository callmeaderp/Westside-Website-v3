/**
 * Dynamic image resolver for Astro's image optimization pipeline.
 *
 * Images live in src/images/photos/ and are resolved at build time via
 * import.meta.glob(). This gives us automatic format optimization,
 * responsive sizing, width/height inference, and content hashing.
 *
 * Usage:
 *   import { getImage } from '@lib/images';
 *   const img = getImage('hero-home.webp');  // returns ImageMetadata
 */
import type { ImageMetadata } from 'astro';

/** Eagerly import all photo assets at build time. */
const photoModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/images/photos/*.webp',
  { eager: true }
);

/**
 * Resolve a photo filename to its ImageMetadata.
 * @param filename - Just the filename, e.g. 'hero-home.webp'
 * @returns ImageMetadata for use with Astro's <Image> component
 * @throws If the image doesn't exist (build-time safety)
 */
export function getPhoto(filename: string): ImageMetadata {
  const key = `/src/images/photos/${filename}`;
  const mod = photoModules[key];
  if (!mod) {
    throw new Error(
      `Image not found: ${filename}. Available: ${Object.keys(photoModules).map(k => k.split('/').pop()).join(', ')}`
    );
  }
  return mod.default;
}

/**
 * Check if a photo exists without throwing.
 */
export function hasPhoto(filename: string): boolean {
  return `/src/images/photos/${filename}` in photoModules;
}
