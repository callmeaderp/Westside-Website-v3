/**
 * Product Labels & Safety Data Sheets
 *
 * Products used in lawn care, tree & shrub, and landscape maintenance programs.
 * Each product links to its manufacturer Label and SDS (Safety Data Sheet) PDFs,
 * self-hosted in /public/documents/{category}/.
 *
 */

export interface ProductDocument {
  name: string;
  labelUrl: string;
  sdsUrl?: string;
}

export interface ProductCategory {
  name: string;
  slug: string;
  description: string;
  products: ProductDocument[];
}

export const productCategories: ProductCategory[] = [
  {
    name: 'Lawn Care',
    slug: 'lawn-care',
    description:
      'Fertilizers, herbicides, insecticides, and fungicides used in lawn treatment programs.',
    products: [
      {
        name: 'Allectus',
        labelUrl: '/documents/lawn-care/allectus-label.pdf',
        sdsUrl: '/documents/lawn-care/allectus-sds.pdf',
      },
      {
        name: 'Arkon',
        labelUrl: '/documents/lawn-care/arkon-label.pdf',
        sdsUrl: '/documents/lawn-care/arkon-sds.pdf',
      },
      {
        name: 'Cool Power',
        labelUrl: '/documents/lawn-care/cool-power-label.pdf',
        sdsUrl: '/documents/lawn-care/cool-power-sds.pdf',
      },
      {
        name: 'Crosscheck EZ',
        labelUrl: '/documents/lawn-care/crosscheck-ez-label.pdf',
        sdsUrl: '/documents/lawn-care/crosscheck-ez-sds.pdf',
      },
      {
        name: 'Crosscheck w/ Fertilizer',
        labelUrl: '/documents/lawn-care/crosscheck-w-fert-label.pdf',
        sdsUrl: '/documents/lawn-care/crosscheck-w-fert-sds.pdf',
      },
      {
        name: 'Dimension 2EW',
        labelUrl: '/documents/lawn-care/dimension-2ew-label.pdf',
        sdsUrl: '/documents/lawn-care/dimension-2ew-sds.pdf',
      },
      {
        name: 'Dylox 6.2',
        labelUrl: '/documents/lawn-care/dylox-label.pdf',
        sdsUrl: '/documents/lawn-care/dylox-sds.pdf',
      },
      {
        name: 'Fertilizer with Dimension',
        labelUrl: '/documents/lawn-care/fert-with-dimension-label.pdf',
        sdsUrl: '/documents/lawn-care/fert-with-dimension-sds.pdf',
      },
      {
        name: 'Fertilizer with Merit',
        labelUrl: '/documents/lawn-care/fert-with-merit-label.pdf',
        sdsUrl: '/documents/lawn-care/fert-with-merit-sds.pdf',
      },
      {
        name: 'Fertilizer with Stonewall',
        labelUrl: '/documents/lawn-care/fert-with-stonewall-label.pdf',
        sdsUrl: '/documents/lawn-care/fert-with-stonewall-sds.pdf',
      },
      {
        name: 'Headway G',
        labelUrl: '/documents/lawn-care/headway-g-label.pdf',
        sdsUrl: '/documents/lawn-care/headway-g-sds.pdf',
      },
      {
        name: 'Mossmax',
        labelUrl: '/documents/lawn-care/mossmax-label.pdf',
        sdsUrl: '/documents/lawn-care/mossmax-sds.pdf',
      },
      {
        name: 'Podium',
        labelUrl: '/documents/lawn-care/podium-label.pdf',
        sdsUrl: '/documents/lawn-care/podium-sds.pdf',
      },
      {
        name: 'Prophesy',
        labelUrl: '/documents/lawn-care/prophesy-label.pdf',
        sdsUrl: '/documents/lawn-care/prophesy-sds.pdf',
      },
      {
        name: 'Q4 Plus',
        labelUrl: '/documents/lawn-care/q4-plus-label.pdf',
        sdsUrl: '/documents/lawn-care/q4-plus-sds.pdf',
      },
      {
        name: 'Sedgehammer',
        labelUrl: '/documents/lawn-care/sedgehammer-label.pdf',
        sdsUrl: '/documents/lawn-care/sedgehammer-sds.pdf',
      },
      {
        name: 'Subdue GR',
        labelUrl: '/documents/lawn-care/subdue-gr-label.pdf',
        sdsUrl: '/documents/lawn-care/subdue-gr-sds.pdf',
      },
      {
        name: 'Talstar Xtra',
        labelUrl: '/documents/lawn-care/talstar-xtra-label.pdf',
        sdsUrl: '/documents/lawn-care/talstar-xtra-sds.pdf',
      },
      {
        name: 'Three Way',
        labelUrl: '/documents/lawn-care/three-way-label.pdf',
        sdsUrl: '/documents/lawn-care/three-way-sds.pdf',
      },
    ],
  },
  {
    name: 'Tree & Shrub Care',
    slug: 'tree-shrub',
    description:
      'Insecticides, fungicides, and plant health treatments for trees and ornamental shrubs.',
    products: [
      {
        name: 'Ace-Jet',
        labelUrl: '/documents/tree-shrub/ace-jet-label.pdf',
        sdsUrl: '/documents/tree-shrub/ace-jet-sds.pdf',
      },
      {
        name: 'Astro',
        labelUrl: '/documents/tree-shrub/astro-label.pdf',
        sdsUrl: '/documents/tree-shrub/astro-sds.pdf',
      },
      {
        name: 'Avid',
        labelUrl: '/documents/tree-shrub/avid-label.pdf',
        sdsUrl: '/documents/tree-shrub/avid-sds.pdf',
      },
      {
        name: 'Bandit 2F',
        labelUrl: '/documents/tree-shrub/bandit-2f-label.pdf',
        sdsUrl: '/documents/tree-shrub/bandit-2f-sds.pdf',
      },
      {
        name: 'Bandit 75 WSP',
        labelUrl: '/documents/tree-shrub/bandit-75-wsp-label.pdf',
        sdsUrl: '/documents/tree-shrub/bandit-75-wsp-sds.pdf',
      },
      {
        name: 'Crosscheck',
        labelUrl: '/documents/tree-shrub/crosscheck-label.pdf',
        sdsUrl: '/documents/tree-shrub/crosscheck-sds.pdf',
      },
      {
        name: 'Floramite',
        labelUrl: '/documents/tree-shrub/floramite-label.pdf',
        sdsUrl: '/documents/tree-shrub/floramite-sds.pdf',
      },
      {
        name: 'Horticultural Oil',
        labelUrl: '/documents/tree-shrub/horticultural-oil-label.pdf',
        sdsUrl: '/documents/tree-shrub/horticultural-oil-sds.pdf',
      },
      {
        name: 'IMA-JET',
        labelUrl: '/documents/tree-shrub/ima-jet-label.pdf',
        sdsUrl: '/documents/tree-shrub/ima-jet-sds.pdf',
      },
      {
        name: 'Junction',
        labelUrl: '/documents/tree-shrub/junction-label.pdf',
        sdsUrl: '/documents/tree-shrub/junction-sds.pdf',
      },
      {
        name: 'Manicure 6FL',
        labelUrl: '/documents/tree-shrub/manicure-6fl-label.pdf',
        sdsUrl: '/documents/tree-shrub/manicure-6fl-sds.pdf',
      },
      {
        name: 'Mn-Jet',
        labelUrl: '/documents/tree-shrub/mn-jet-label.pdf',
        sdsUrl: '/documents/tree-shrub/mn-jet-sds.pdf',
      },
      {
        name: 'Phosphojet',
        labelUrl: '/documents/tree-shrub/phosphojet-label.pdf',
        sdsUrl: '/documents/tree-shrub/phosphojet-sds.pdf',
      },
      {
        name: 'Propizol',
        labelUrl: '/documents/tree-shrub/propizol-label.pdf',
        sdsUrl: '/documents/tree-shrub/propizol-sds.pdf',
      },
      {
        name: 'Safari 20 SG',
        labelUrl: '/documents/tree-shrub/safari-20sg-label.pdf',
        sdsUrl: '/documents/tree-shrub/safari-20sg-sds.pdf',
      },
      {
        name: 'Sevin SL',
        labelUrl: '/documents/tree-shrub/sevin-sl-label.pdf',
        sdsUrl: '/documents/tree-shrub/sevin-sl-sds.pdf',
      },
      {
        name: 'T-Storm',
        labelUrl: '/documents/tree-shrub/t-storm-label.pdf',
        sdsUrl: '/documents/tree-shrub/t-storm-sds.pdf',
      },
      {
        name: 'Tree-Age R10',
        labelUrl: '/documents/tree-shrub/tree-age-r10-label.pdf',
        sdsUrl: '/documents/tree-shrub/tree-age-r10-sds.pdf',
      },
      {
        name: 'Twosome Fungicide',
        labelUrl: '/documents/tree-shrub/twosome-fungicide-label.pdf',
        sdsUrl: '/documents/tree-shrub/twosome-fungicide-sds.pdf',
      },
    ],
  },
  {
    name: 'Landscape Maintenance',
    slug: 'landscape-maintenance',
    description: 'Products used in general landscape maintenance and vegetation management.',
    products: [
      {
        name: 'Lesco Prosecutor Pro',
        labelUrl: '/documents/landscape-maintenance/prosecutor-pro-label.pdf',
      },
    ],
  },
];

/** Total product count across all categories */
export const totalProducts = productCategories.reduce(
  (sum, cat) => sum + cat.products.length,
  0
);
