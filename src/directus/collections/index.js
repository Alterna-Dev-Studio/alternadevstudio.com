/**
 * Collection definitions for Directus
 * 
 * This module exports collection definitions that can be used
 * in both the development environment setup and tests.
 * 
 * The collection definitions are stored in JSON files and imported
 * directly to separate data from code.
 */

import blogPostsSchema from './blog_posts.json' assert { type: 'json' };
import projectsSchema from './projects.json' assert { type: 'json' };
import streamRecapSchema from './stream_recap.json' assert { type: 'json' };
import { createCollectionIfNotExists, createAllCollections } from './utils.js';

// Export the collection schemas
export const blogPosts = blogPostsSchema;
export const projects = projectsSchema;
export const streamRecap = streamRecapSchema;

// Export default object with all collections
export default {
  blogPosts,
  projects,
  streamRecap
};

// Export utility functions
export {
  createCollectionIfNotExists,
  createAllCollections
};
