/**
 * Data file for Directus integration
 * 
 * This file attempts to fetch data from Directus first,
 * and falls back to sample data if Directus is unavailable.
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

/**
 * Create a Directus client
 * @returns {Object} Directus client
 */
export function createDirectusClient() {
  return createDirectus(directusUrl)
    .with(authentication())
    .with(rest());
}

/**
 * Login to Directus
 * @param {Object} client - Directus client
 * @returns {Promise} Promise that resolves when login is complete
 */
export async function loginToDirectus(client) {
  try {
    await client.login(email, password);
    return true;
  } catch (error) {
    console.warn('Failed to login to Directus:', error.message);
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
    return data.status === 'ok';
  } catch (error) {
    console.warn('Directus health check failed:', error.message);
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

// Function to load sample data from JSON files
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

// Function to parse dates in sample data
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
    // Return sample data as fallback
    return null;
  }
}

/**
 * Main data function that exports all Directus data
 */
export default async function() {
  console.log('Directus data file loaded');
  
  // Load sample data
  console.log('Loading sample data...');
  const sampleBlogPostsRaw = await loadSampleData('blog_posts.json');
  console.log('Sample blog posts loaded:', sampleBlogPostsRaw);
  
  const sampleBlogPosts = parseDates(
    sampleBlogPostsRaw, 
    ['date_published']
  );
  console.log('Sample blog posts after date parsing:', sampleBlogPosts);
  
  const sampleProjects = parseDates(
    await loadSampleData('projects.json'), 
    ['date_completed']
  );
  
  const sampleStreamRecaps = parseDates(
    await loadSampleData('stream_recaps.json'), 
    ['stream_date']
  );
  
  // Check if Directus is available
  const directusAvailable = await isDirectusAvailable();
  
  if (!directusAvailable) {
    console.log('Directus is not available. Using sample data.');
    return {
      blog_posts: sampleBlogPosts,
      projects: sampleProjects,
      stream_recaps: sampleStreamRecaps,
      directus_status: 'unavailable'
    };
  }
  
  // Create Directus client and attempt to login
  const client = createDirectusClient();
  const loggedIn = await loginToDirectus(client);
  
  if (!loggedIn) {
    console.log('Failed to login to Directus. Using sample data.');
    return {
      blog_posts: sampleBlogPosts,
      projects: sampleProjects,
      stream_recaps: sampleStreamRecaps,
      directus_status: 'authentication_failed'
    };
  }
  
  // Fetch data from Directus
  console.log('Fetching data from Directus...');
  
  // Fetch all collections in parallel
  const [blogPosts, projects, streamRecaps] = await Promise.all([
    fetchFromDirectus(client, 'blog_posts', { sort: ['-date_published'] }),
    fetchFromDirectus(client, 'projects', { sort: ['-date_completed'] }),
    fetchFromDirectus(client, 'stream_recap', { sort: ['-stream_date'] })
  ]);
  
  // For each collection, use Directus data if available, otherwise fall back to sample data
  // If we got a 403 error, we'll use the sample data
  const useSampleData = !blogPosts || !projects || !streamRecaps;
  
  if (useSampleData) {
    console.log('Using sample data due to permission issues or missing data from Directus.');
    const returnData = {
      blog_posts: sampleBlogPosts,
      projects: sampleProjects,
      stream_recaps: sampleStreamRecaps,
      directus_status: 'permission_denied'
    };
    console.log('Returning data:', returnData);
    console.log('blog_posts array length:', returnData.blog_posts.length);
    return returnData;
  }
  
  return {
    blog_posts: blogPosts,
    projects: projects,
    stream_recaps: streamRecaps,
    directus_status: 'connected'
  };
}
