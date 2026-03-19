/**
 * Client testimonials — used on homepage, structured data, and review sections.
 */

export interface Testimonial {
  author: string;
  role?: string;
  text: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    author: 'Mr. & Mrs. Previtt',
    role: 'Rochester Homeowners',
    text: 'Other landscapers end up doing the bare minimum, but not Westside Professional Landscape. They do a great job and they always make my home look nice.',
    rating: 5,
  },
  {
    author: 'M. Sperandio',
    role: 'Owner & Manager, Cedarwood Office Park',
    text: "I have been using Westside for my office park's landscaping and snow removal needs for 5 years. Their work is top quality, done on-time and competitively priced.",
    rating: 5,
  },
  {
    author: 'J. Wolford',
    role: 'Attorney, Wolford Law Firm',
    text: 'Westside Pro is the place to go. They are 100% professional and stand behind their work. I never hesitate recommending Westside Pro to my friends and relatives.',
    rating: 5,
  },
  {
    author: 'Mrs. M Woodings',
    role: 'Fairport Homeowner',
    text: 'I always use Westside Professional Landscape when it comes to renovating my home. I know the job is going to be handled with the utmost care.',
    rating: 5,
  },
  {
    author: 'C. Simmons',
    role: 'Grounds Manager, Crofton Associates',
    text: 'I have been doing business with Westside Professional Landscape since 2004. I have found Westside Pro to be Competitive, Courteous, and Complete.',
    rating: 5,
  },
  {
    author: 'Mr. & Mrs. Smith',
    role: 'Spencerport Homeowners',
    text: 'We are always pleased with the work done by Westside Professional. Their attention to detail and craftsmanship is above and beyond.',
    rating: 5,
  },
];
