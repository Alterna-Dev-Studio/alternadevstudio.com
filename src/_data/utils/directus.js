/**
 * Utility functions for Directus integration
 * 
 * This file provides functions to connect to Directus and fetch data,
 * with fallback to sample data if Directus is unavailable.
 */

import { createDirectus, rest, authentication } from '@directus/sdk';
import { readItems } from '@directus/sdk';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { existsSync } from 'fs';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..', '..');
const envPath = join(rootDir, '.env');

// Only load .env file if it exists
if (existsSync(envPath)) {
  config({ path: envPath });
}

// Directus connection details with fallbacks
const directusUrl = process.env.DIRECTUS_URL || 'http://localhost:8055';
const email = process.env.DIRECTUS_EMAIL || 'admin@example.com';
const password = process.env.DIRECTUS_PASSWORD || 'change-me-please';

// Cache for Directus client and connection status
let directusClient = null;
let isLoggedIn = false;
let connectionStatus = 'unknown';

// Cache for fetched data
const dataCache = {
  blog_posts: null,
  projects: null,
  stream_recaps: null
};

/**
 * Create a Directus client
 * @returns {Object} Directus client
 */
export function createDirectusClient() {
  if (!directusClient) {
    directusClient = createDirectus(directusUrl)
      .with(authentication())
      .with(rest());
  }
  return directusClient;
}

/**
 * Login to Directus
 * @param {Object} client - Directus client
 * @returns {Promise<boolean>} Promise that resolves to true if login successful
 */
export async function loginToDirectus(client) {
  if (isLoggedIn) return true;
  
  try {
    await client.login(email, password);
    isLoggedIn = true;
    return true;
  } catch (error) {
    console.warn('Failed to login to Directus:', error.message);
    isLoggedIn = false;
    return false;
  }
}

/**
 * Check if Directus is available
 * @returns {Promise<boolean>} Promise that resolves to true if Directus is available
 */
export async function isDirectusAvailable() {
  try {
    const response = await fetch(`${directusUrl}/server/health`);
    const data = await response.json();
    connectionStatus = data.status === 'ok' ? 'available' : 'unavailable';
    return data.status === 'ok';
  } catch (error) {
    console.warn('Directus health check failed:', error.message);
    connectionStatus = 'unavailable';
    return false;
  }
}

/**
 * Get Directus connection details
 * @returns {Object} Directus connection details
 */
export function getDirectusConfig() {
  return {
    url: directusUrl,
    email,
    password
  };
}

/**
 * Load sample data from JSON files
 * @param {string} filename - Name of the sample data file
 * @returns {Promise<Array>} Promise that resolves to an array of items
 */
async function loadSampleData(filename) {
  try {
    const filePath = join(process.cwd(), 'src', '_data', 'sample', filename);
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading sample data from ${filename}:`, error);
    return [];
  }
}

/**
 * Parse dates in sample data
 * @param {Array} items - Array of items
 * @param {Array} dateFields - Array of field names that contain dates
 * @returns {Array} Array of items with parsed dates
 */
function parseDates(items, dateFields) {
  return items.map(item => {
    const newItem = { ...item };
    for (const field of dateFields) {
      if (newItem[field]) {
        newItem[field] = new Date(newItem[field]);
      }
    }
    return newItem;
  });
}

/**
 * Fetch items from a Directus collection
 * @param {Object} client - Authenticated Directus client
 * @param {string} collection - Collection name
 * @param {Object} query - Query parameters
 * @returns {Promise<Array>} Promise that resolves to an array of items
 */
async function fetchFromDirectus(client, collection, query = {}) {
  try {
    // Log the query for debugging
    console.log(`Fetching ${collection} with query:`, JSON.stringify(query));
    
    // Use the query as is, without adding status filter
    const result = await client.request(readItems(collection, query));
    console.log(`Successfully fetched ${collection} from Directus:`, result ? `${result.length} items` : 'no items');
    return result;
  } catch (error) {
    console.error(`Failed to fetch ${collection} from Directus:`, error);
    return null;
  }
}

/**
 * Initialize connection to Directus
 * @returns {Promise<Object>} Promise that resolves to an object with connection status
 */
async function initializeDirectus() {
  // Check if Directus is available
  const directusAvailable = await isDirectusAvailable();
  
  if (!directusAvailable) {
    console.log('Directus is not available. Will use sample data.');
    return { status: 'unavailable' };
  }
  
  // Create Directus client and attempt to login
  const client = createDirectusClient();
  const loggedIn = await loginToDirectus(client);
  
  if (!loggedIn) {
    console.log('Failed to login to Directus. Will use sample data.');
    return { status: 'authentication_failed' };
  }
  
  return { status: 'connected', client };
}

/**
 * Get sample data for a specific collection
 * @param {string} collection - Collection name
 * @returns {Promise<Array>} Promise that resolves to an array of items
 */
async function getSampleData(collection) {
  switch (collection) {
    case 'blog_posts':
      const sampleBlogPostsRaw = await loadSampleData('blog_posts.json');
      return parseDates(sampleBlogPostsRaw, ['date_published']);
    
    case 'projects':
      const sampleProjectsRaw = await loadSampleData('projects.json');
      return parseDates(sampleProjectsRaw, ['date_completed']);
    
    case 'stream_recaps':
      const sampleStreamRecapsRaw = await loadSampleData('stream_recaps.json');
      return parseDates(sampleStreamRecapsRaw, ['stream_date']);
    
    default:
      console.error(`Unknown collection: ${collection}`);
      return [];
  }
}

/**
 * Fetch blog posts from Directus
 * @returns {Promise<Array>} Promise that resolves to an array of blog posts
 */
export async function fetchBlogPosts() {
  // Return cached data if available
  if (dataCache.blog_posts) {
    console.log('Using cached blog posts data');
    return dataCache.blog_posts;
  }
  
  // Initialize Directus connection
  const { status, client } = await initializeDirectus();
  
  // If Directus is not available, use sample data
  if (status !== 'connected') {
    console.log(`Directus status: ${status}. Using sample blog posts data.`);
    dataCache.blog_posts = await getSampleData('blog_posts');
    return dataCache.blog_posts;
  }
  
  // Fetch blog posts from Directus
  const blogPosts = await fetchFromDirectus(client, 'blog_posts', { sort: ['-date_published'] });
  
  // If fetch failed, use sample data
  if (!blogPosts) {
    console.log('Failed to fetch blog posts from Directus. Using sample data.');
    dataCache.blog_posts = await getSampleData('blog_posts');
    return dataCache.blog_posts;
  }
  
  // Cache and return the data
  dataCache.blog_posts = blogPosts;
  return blogPosts;
}

/**
 * Fetch projects from Directus
 * @returns {Promise<Array>} Promise that resolves to an array of projects
 */
export async function fetchProjects() {
  // Return cached data if available
  if (dataCache.projects) {
    console.log('Using cached projects data');
    return dataCache.projects;
  }
  
  // Initialize Directus connection
  const { status, client } = await initializeDirectus();
  
  // If Directus is not available, use sample data
  if (status !== 'connected') {
    console.log(`Directus status: ${status}. Using sample projects data.`);
    dataCache.projects = await getSampleData('projects');
    return dataCache.projects;
  }
  
  // Fetch projects from Directus
  const projects = await fetchFromDirectus(client, 'projects', { sort: ['-date_completed'] });
  
  // If fetch failed, use sample data
  if (!projects) {
    console.log('Failed to fetch projects from Directus. Using sample data.');
    dataCache.projects = await getSampleData('projects');
    return dataCache.projects;
  }
  
  // Cache and return the data
  dataCache.projects = projects;
  return projects;
}

/**
 * Fetch stream recaps from Directus
 * @returns {Promise<Array>} Promise that resolves to an array of stream recaps
 */
export async function fetchStreamRecaps() {
  // Return cached data if available
  if (dataCache.stream_recaps) {
    console.log('Using cached stream recaps data');
    return dataCache.stream_recaps;
  }
  
  // Initialize Directus connection
  const { status, client } = await initializeDirectus();
  
  // If Directus is not available, use sample data
  if (status !== 'connected') {
    console.log(`Directus status: ${status}. Using sample stream recaps data.`);
    dataCache.stream_recaps = await getSampleData('stream_recaps');
    return dataCache.stream_recaps;
  }
  
  // Fetch stream recaps from Directus
  const streamRecaps = await fetchFromDirectus(client, 'stream_recap', { sort: ['-stream_date'] });
  
  // If fetch failed, use sample data
  if (!streamRecaps) {
    console.log('Failed to fetch stream recaps from Directus. Using sample data.');
    dataCache.stream_recaps = await getSampleData('stream_recaps');
    return dataCache.stream_recaps;
  }
  
  // Cache and return the data
  dataCache.stream_recaps = streamRecaps;
  return streamRecaps;
}

/**
 * Get the current Directus connection status
 * @returns {string} Connection status
 */
export function getDirectusStatus() {
  return connectionStatus;
}
