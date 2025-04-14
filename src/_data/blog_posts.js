/**
 * Data file for blog posts
 * 
 * This file exports blog posts data fetched from Directus
 */

import { fetchBlogPosts } from './utils/directus.js';

export default async function() {
  console.log('Blog posts data file loaded');
  
  // Fetch blog posts data
  const blogPosts = await fetchBlogPosts();
  
  // Log the blog posts data
  console.log('Blog posts array length:', blogPosts.length);
  
  // Return the blog posts data
  return blogPosts;
}
