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
    bio: 'Founded Westside Professional Landscape in 2000. [PLACEHOLDER: How Brad got started — what drove him to start the company, background in landscaping/business, personal connection to Rochester area, philosophy on quality and client relationships. 2-3 sentences with personality.]',
  },
  {
    name: 'Brantley',
    role: 'Plant Health Manager',
    image: 'team-brantley.webp',
    bio: 'NYS DEC Certified Pesticide Applicator heading our Fertilization & Weed Control program. [PLACEHOLDER: Years with Westside, how he got into plant health/lawn care, what he enjoys about the work, any specialties or certifications beyond DEC. 1-2 sentences.]',
  },
  {
    name: 'Heather',
    role: 'Office Manager',
    image: 'team-heather.webp',
    bio: 'The organizational backbone of daily operations. [PLACEHOLDER: Years with Westside, what she manages day-to-day (scheduling, client communications, billing?), what clients can expect when they call the office. 1-2 sentences.]',
  },
  {
    name: 'Jeff',
    role: 'Landscape Operations Manager',
    image: 'team-jeff.webp',
    bio: 'Oversees landscape design installations, hardscaping, and field crew operations. [PLACEHOLDER: Years with Westside, background/experience in landscape construction, types of projects he specializes in, what he brings to the field. 1-2 sentences.]',
  },
];
