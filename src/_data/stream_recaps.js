/**
 * Data file for stream recaps
 */

const sampleStreamRecaps = [
  {
    id: 1,
    title: 'Building a Headless CMS with Directus',
    slug: 'building-headless-cms-directus',
    stream_date: new Date('2025-04-12T19:00:00Z'),
    topics_covered: ['Directus', 'Headless CMS', 'Docker', 'API', 'Eleventy'],
    code_repository: 'https://github.com/alternadev/directus-demo',
    duration_minutes: 120,
    featured: true,
    summary: `
    In this stream, we explored how to set up Directus as a headless CMS and connect it to an Eleventy site.
    
    We covered Docker setup, API authentication, and content modeling with Directus.
    `
  },
  {
    id: 2,
    title: 'Advanced Eleventy Techniques',
    slug: 'advanced-eleventy-techniques',
    stream_date: new Date('2025-04-05T19:00:00Z'),
    topics_covered: ['Eleventy', 'Nunjucks', 'JavaScript', 'Static Site Generation', 'Performance'],
    code_repository: 'https://github.com/alternadev/eleventy-advanced',
    duration_minutes: 90,
    featured: true,
    summary: `
    This stream covered advanced techniques for building with Eleventy.
    
    Topics included custom data sources, advanced template techniques, and performance optimization.
    `
  }
];

/**
 * Get sample stream recaps for testing
 * @returns {Array} Array of sample stream recaps
 */
export function getSampleStreamRecaps() {
  return sampleStreamRecaps;
}

export default function() {
  console.log('Stream recaps data file loaded');
  return sampleStreamRecaps;
}
