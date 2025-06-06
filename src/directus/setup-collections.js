/**
 * Script to set up collections in Directus
 * 
 * This script can be used in both the development environment setup
 * and in tests to ensure collections are properly configured.
 */

import { createDirectus, rest, authentication, readItems, readFields, createField } from '@directus/sdk';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import collections, { createAllCollections } from './collections/index.js';

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
 * Set up collections in Directus
 * @param {Object} options - Options for setup
 * @param {string} options.url - Directus URL
 * @param {string} options.email - Admin email
 * @param {string} options.password - Admin password
 * @returns {Promise<boolean>} - Promise that resolves to true if setup was successful
 */
export async function setupCollections(options = {}) {
  const url = options.url || directusUrl;
  const adminEmail = options.email || email;
  const adminPassword = options.password || password;

  // Initialize the Directus client
  const client = createDirectus(url)
    .with(authentication())
    .with(rest());

  try {
    // Login to Directus
    console.log('Logging in to Directus...');
    await client.login(adminEmail, adminPassword);
    console.log('Login successful!');

    // Check if collections already exist by trying to get items from each collection
    const existingCollections = [];
    
    // Get the collection names from the collections object
    const collectionNames = Object.values(collections).map(collection => collection.collection);
    
    // Try to get items from each collection to see if it exists
    for (const collectionName of collectionNames) {
      try {
        await client.request(readItems(collectionName, { limit: 1 }));
        existingCollections.push(collectionName);
        console.log(`Collection ${collectionName} already exists.`);
      } catch (error) {
        console.log(`Collection ${collectionName} does not exist yet.`);
      }
    }
    
    // Create collections
    const success = await createAllCollections(client, existingCollections, collections);
    
    return success;
  } catch (error) {
    console.error('Error setting up collections:', error.message);
    return false;
  }
}

// If this script is run directly, execute the setup
if (import.meta.url === `file://${process.argv[1]}`) {
  // Check for command line arguments
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  
  if (dryRun) {
    console.log('DRY RUN MODE: No changes will be made to Directus');
    console.log('The following collections would be created or updated:');
    Object.values(collections).forEach(collection => {
      console.log(`- ${collection.collection} (${collection.fields.length} fields)`);
    });
    process.exit(0);
  }
  
  setupCollections()
    .then(success => {
      if (success) {
        console.log('Collections setup completed successfully.');
        process.exit(0);
      } else {
        console.error('Collections setup failed.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unhandled error during collections setup:', error);
      process.exit(1);
    });
}
