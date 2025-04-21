/**
 * Generate stream recap pages programmatically
 */

// Define the stream_recap data directly here to avoid import issues
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
    In this stream we explored how to set up Directus as a headless CMS and connect it to an Eleventy site.

    We covered Docker setup API authentication and content modeling with Directus.
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

    Topics included custom data sources advanced template techniques and performance optimization.
    `
  }
];

export default function() {
  console.log('Generating stream pages from data');
  
  // Create an array of pages
  const pages = sampleStreamRecaps
    .filter(recap => recap.slug && recap.slug.trim() !== '')
    .map(recap => {
      return {
        // This is the data that will be available to the template
        ...recap,
        // This sets the layout to use for each page
        layout: 'stream_recap.njk',
        // This sets the URL for each page
        permalink: `/streams/${recap.slug}/`,
        // The original data is also available
        stream_recap: recap
      };
    });
  
  console.log(`Generated ${pages.length} stream pages`);
  return pages;
}
