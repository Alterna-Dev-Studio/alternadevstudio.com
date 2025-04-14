/**
 * Data file for fetching stream recaps from Directus
 * 
 * This file demonstrates how to connect to the Directus API
 * and fetch stream recaps for use in Eleventy templates.
 */

import { readItems } from '@directus/sdk';
import { createDirectusClient, loginToDirectus, isDirectusAvailable } from './utils/directus.js';

/**
 * Get sample stream recaps data
 * This is used when Directus is not available
 * @returns {Array} Array of sample stream recaps
 */
function getSampleStreamRecaps() {
  return [
    {
      id: 1,
      title: 'Building a Headless CMS with Directus',
      slug: 'building-headless-cms-directus',
      stream_date: new Date('2025-04-12T19:00:00Z'),
      summary: `
# Building a Headless CMS with Directus

In this stream, we explored how to set up Directus as a headless CMS for a JAMstack website. We covered:

## Topics Covered

1. Setting up Directus with Docker Compose
2. Creating custom collections and fields
3. Configuring the API
4. Connecting to Eleventy
5. Deploying the setup

## Key Takeaways

- Directus provides a flexible, database-first approach to content management
- The API is powerful and customizable
- Docker makes it easy to set up for local development
- The admin interface is intuitive and user-friendly
      `,
      topics_covered: ['Directus', 'Headless CMS', 'Docker', 'API', 'Eleventy'],
      code_repository: 'https://github.com/alternadev/directus-demo',
      resources: [
        {
          title: 'Directus Documentation',
          url: 'https://docs.directus.io/',
          description: 'Official documentation for Directus'
        },
        {
          title: 'Docker Compose Guide',
          url: 'https://docs.docker.com/compose/gettingstarted/',
          description: 'Getting started with Docker Compose'
        }
      ],
      duration_minutes: 120,
      featured: true
    },
    {
      id: 2,
      title: 'Advanced Eleventy Techniques',
      slug: 'advanced-eleventy-techniques',
      stream_date: new Date('2025-04-05T19:00:00Z'),
      summary: `
# Advanced Eleventy Techniques

This stream focused on advanced techniques for building sites with Eleventy. We explored:

## Topics Covered

1. Custom data sources and filters
2. Advanced templating with Nunjucks
3. Creating custom shortcodes
4. Optimizing build performance
5. Implementing pagination and collections

## Code Examples

We built several examples during the stream:

- A custom markdown parser with code syntax highlighting
- A data cascade example with multiple layers
- A pagination system for blog posts
- A tag-based filtering system
      `,
      topics_covered: ['Eleventy', 'Nunjucks', 'JavaScript', 'Static Site Generation', 'Performance'],
      code_repository: 'https://github.com/alternadev/eleventy-advanced',
      resources: [
        {
          title: 'Eleventy Documentation',
          url: 'https://www.11ty.dev/docs/',
          description: 'Official documentation for Eleventy'
        },
        {
          title: 'Nunjucks Templating',
          url: 'https://mozilla.github.io/nunjucks/',
          description: 'Documentation for the Nunjucks templating language'
        }
      ],
      duration_minutes: 90,
      featured: true
    }
  ];
}

export default async function() {
  // Check if Directus is running
  const directusAvailable = await isDirectusAvailable();
  if (!directusAvailable) {
    console.warn('Directus is not available. Using sample data for stream recaps.');
    return getSampleStreamRecaps();
  }
  
  // Initialize Directus client
  const client = createDirectusClient();
  
  try {
    // Login to Directus
    const loginSuccess = await loginToDirectus(client);
    if (!loginSuccess) {
      console.warn('Failed to login to Directus. Using sample data for stream recaps.');
      return getSampleStreamRecaps();
    }
    
    // Fetch stream recaps from Directus
    console.log('Fetching stream recaps from Directus...');
    
    const recaps = await client.request(
      readItems('stream_recap', {
        filter: {
          status: {
            _eq: 'published'
          }
        },
        sort: ['-stream_date'],
        fields: [
          'id',
          'title',
          'slug',
          'stream_date',
          'thumbnail',
          'video_url',
          'summary',
          'topics_covered',
          'code_repository',
          'resources',
          'duration_minutes',
          'featured'
        ]
      })
    );
    
    console.log(`Successfully fetched ${recaps.length} stream recaps from Directus`);
    return recaps;
  } catch (error) {
    // If Directus is not running or there's an error, return sample data
    console.warn('Could not connect to Directus. Using sample data instead.');
    console.error('Error details:', error.message);
    
    return getSampleStreamRecaps();
  }
}
