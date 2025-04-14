/**
 * Utility functions for interacting with Directus in tests
 */

import { createDirectus, rest, authentication, readItems } from '@directus/sdk';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');
const envPath = join(rootDir, '.env');

// Only load .env file if it exists
if (existsSync(envPath)) {
  config({ path: envPath });
} else {
  console.log('No .env file found in project root. Using default values.');
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
 * @returns {Promise<boolean>} Promise that resolves to true if login is successful
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
 * Get items from a collection
 * @param {Object} client - Authenticated Directus client
 * @param {string} collection - Collection name
 * @param {Object} query - Query parameters
 * @returns {Promise<Array>} Promise that resolves to an array of items
 */
export async function getItems(client, collection, query = {}) {
  try {
    return await client.request(readItems(collection, query));
  } catch (error) {
    console.warn(`Failed to get items from ${collection}:`, error.message);
    return [];
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
