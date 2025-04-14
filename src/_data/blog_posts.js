/**
 * Data file for blog posts
 * 
 * This file exports the blog posts data from the directus.js file
 */

import directusData from './directus.js';

export default async function() {
  console.log('Blog posts data file loaded');
  
  // Get the data from directus.js
  const data = await directusData();
  
  // Log the blog posts data
  console.log('Blog posts data:', data.blog_posts);
  console.log('Blog posts array length:', data.blog_posts.length);
  
  // Return the blog posts data
  return data.blog_posts;
}
