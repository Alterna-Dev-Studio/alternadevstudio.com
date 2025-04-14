/**
 * Utility functions for connecting to Directus
 */

import { createDirectus, rest, authentication } from '@directus/sdk';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
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
const email = process.env.DIRECTUS_EMAIL || 'admin@alternadevstudio.com';
const password = process.env.DIRECTUS_PASSWORD || 'admin123';

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
