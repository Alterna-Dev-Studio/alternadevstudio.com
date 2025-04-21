/**
 * Generate stream recap pages programmatically
 */

import { getSampleStreamRecaps } from './stream_recaps.js';

export default function() {
  // Get stream recap data from the centralized source
  const sampleStreamRecaps = getSampleStreamRecaps();
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
