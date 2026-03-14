---
paths:
  - "src/styles/**"
  - "src/**/*.astro"
---

# Tailwind v4 CSS Layer Gotcha

In Tailwind v4, `@import 'tailwindcss'` generates layered CSS (`@layer base`, `@layer utilities`, etc.). **CSS rules written outside any `@layer` have higher cascade priority than ALL layered rules**, including utilities.

This means unlayered base styles like `img { height: auto }` will silently override Tailwind utility classes like `h-9`, `h-12`, etc. The image renders at its natural size instead of the utility-specified size, with no warning.

**Fix:** Wrap all base/reset styles in `@layer base {}` so Tailwind utilities can properly override them. This is already done in `global.css` — don't undo it.

**Symptoms when broken:** Elements ignore Tailwind sizing/spacing classes, images render at natural dimensions despite explicit height classes, layout unexpectedly large.
