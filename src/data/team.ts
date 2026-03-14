/**
 * Team members — used on about page and structured data.
 */

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export const team: TeamMember[] = [
  {
    name: 'Brad',
    role: 'Owner / President',
    image: 'team-brad.webp',
    bio: 'Founded Westside Professional Landscape in 2000. Leads company vision and operations.',
  },
  {
    name: 'Brantley',
    role: 'Plant Health Manager',
    image: 'team-brantley.webp',
    bio: 'NYS DEC Certified Pesticide Applicator. Manages the 5-Step Fertilization & Weed Control program.',
  },
  {
    name: 'Heather',
    role: 'Office Manager',
    image: 'team-heather.webp',
    bio: 'Manages scheduling, client communications, and daily office operations.',
  },
  {
    name: 'Jeff',
    role: 'Landscape Operations Manager',
    image: 'team-jeff.webp',
    bio: 'Oversees landscape design installations, hardscaping, and field operations.',
  },
];
