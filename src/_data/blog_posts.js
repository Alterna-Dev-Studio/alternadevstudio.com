/**
 * Data file for fetching blog posts from Directus
 * 
 * This file demonstrates how to connect to the Directus API
 * and fetch blog posts for use in Eleventy templates.
 */

import { readItems } from '@directus/sdk';
import { createDirectusClient, loginToDirectus, isDirectusAvailable } from './utils/directus.js';

/**
 * Get sample blog posts data
 * This is used when Directus is not available
 * @returns {Array} Array of sample blog posts
 */
export function getSampleBlogPosts() {
  return [
    {
      id: 1,
      title: 'Getting Started with Eleventy',
      slug: 'getting-started-with-eleventy',
      date_published: new Date('2025-04-01T12:00:00Z'),
      author: 'AlternaDev',
      excerpt: 'Learn how to build static sites with Eleventy, a simpler static site generator.',
      content: `
# Getting Started with Eleventy

Eleventy is a simpler static site generator. It transforms a directory of templates into HTML.

## Why Eleventy?

- Zero client-side JavaScript
- Flexible templating
- Works with multiple template languages
- Data cascade for easy content management
- Fast build times

## Quick Start

\`\`\`bash
pnpm add -g @11ty/eleventy
echo '# Hello World' > index.md
pnpm exec @11ty/eleventy
\`\`\`

And just like that, you've built your first Eleventy site!
      `,
      tags: ['eleventy', 'static-site-generator', 'jamstack']
    },
    {
      id: 2,
      title: 'Using Directus as a Headless CMS',
      slug: 'using-directus-as-headless-cms',
      date_published: new Date('2025-04-05T14:30:00Z'),
      author: 'AlternaDev',
      excerpt: 'Discover how to use Directus to manage content for your Jamstack website.',
      content: `
# Using Directus as a Headless CMS

Directus is an open-source headless CMS that gives you the freedom to manage your content and use it anywhere.

## Benefits of Directus

- Complete control over your database
- Powerful content modeling
- Flexible API
- User-friendly admin interface
- Self-hosted or cloud options

## Connecting to Eleventy

Using the Directus JavaScript SDK, you can easily fetch content for your Eleventy site:

\`\`\`javascript
// src/_data/blog_posts.js
import { createDirectus, rest, readItems } from '@directus/sdk';

export default async function() {
  const directus = createDirectus('http://localhost:8055').with(rest());
  
  try {
    const posts = await directus.request(
      readItems('blog_posts', {
        filter: {
          status: {
            _eq: 'published'
          }
        },
        sort: ['-date_published']
      })
    );
    
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}
\`\`\`
      `,
      tags: ['directus', 'headless-cms', 'jamstack']
    }
  ];
}

export default async function() {
  // Check if Directus is running
  const directusAvailable = await isDirectusAvailable();
  if (!directusAvailable) {
    console.warn('Directus is not available. Using sample data for blog posts.');
    return getSampleBlogPosts();
  }
  
  // Initialize Directus client
  const client = createDirectusClient();
  
  try {
    // Login to Directus
    const loginSuccess = await loginToDirectus(client);
    if (!loginSuccess) {
      console.warn('Failed to login to Directus. Using sample data for blog posts.');
      return getSampleBlogPosts();
    }
    
    // Fetch blog posts from Directus
    console.log('Fetching blog posts from Directus...');
    
    const posts = await client.request(
      readItems('blog_posts', {
        filter: {
          status: {
            _eq: 'published'
          }
        },
        sort: ['-date_published'],
        fields: [
          'id',
          'title',
          'slug',
          'date_published',
          'author',
          'featured_image',
          'excerpt',
          'content',
          'tags'
        ]
      })
    );
    
    console.log(`Successfully fetched ${posts.length} blog posts from Directus`);
    return posts;
  } catch (error) {
    // If Directus is not running or there's an error, return sample data
    console.warn('Could not connect to Directus. Using sample data instead.');
    console.error('Error details:', error.message);
    
    return getSampleBlogPosts();
  }
}
