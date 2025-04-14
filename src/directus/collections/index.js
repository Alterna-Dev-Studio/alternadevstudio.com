/**
 * Collection definitions for Directus
 * 
 * This module exports collection definitions that can be used
 * in both the development environment setup and tests.
 */

import blogPosts from './blog_posts.js';
import projects from './projects.js';
import streamRecap from './stream_recap.js';
import { createCollectionIfNotExists, createAllCollections } from './utils.js';

export default {
  blogPosts,
  projects,
  streamRecap
};

export {
  blogPosts,
  projects,
  streamRecap,
  createCollectionIfNotExists,
  createAllCollections
};
