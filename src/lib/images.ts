import type { ImageMetadata } from 'astro';

// Eager import keeps Astro image optimization, size inference, and hashing intact.
const photoModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/images/photos/*.webp',
  { eager: true }
);

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

