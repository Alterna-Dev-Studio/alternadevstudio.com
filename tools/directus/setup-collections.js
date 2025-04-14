/**
 * Script to set up collections in Directus
 * 
 * This script creates the necessary collections in Directus for the AlternaDevStudio.com website.
 * It can be used during development environment setup to ensure collections are properly configured.
 * 
 * It imports collection definitions from JSON files in the src/directus/collections/ directory.
 */

import { createDirectus, rest, authentication, readItems, createCollection } from '@directus/sdk';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, copyFileSync } from 'fs';
import blogPostsSchema from '../../src/directus/collections/blog_posts.json' assert { type: 'json' };
import projectsSchema from '../../src/directus/collections/projects.json' assert { type: 'json' };
import streamRecapSchema from '../../src/directus/collections/stream_recap.json' assert { type: 'json' };

// Setup environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '..', '.env');
const envLocalPath = join(__dirname, '..', '..', '.env.local');

// If .env doesn't exist but .env.local does, copy .env.local to .env
if (!existsSync(envPath) && existsSync(envLocalPath)) {
  try {
    copyFileSync(envLocalPath, envPath);
    console.log(`Copied ${envLocalPath} to ${envPath}`);
  } catch (error) {
    console.error(`Error copying ${envLocalPath} to ${envPath}:`, error.message);
  }
}

// Load environment variables from .env file
if (existsSync(envPath)) {
  config({ path: envPath });
  console.log(`Loaded environment variables from ${envPath}`);
} else {
  console.log('No .env file found in project root. Using default values.');
}

// Directus connection details with fallbacks
const directusUrl = process.env.DIRECTUS_URL || 'http://localhost:8055';
const email = process.env.DIRECTUS_EMAIL || 'admin@example.com';
const password = process.env.DIRECTUS_PASSWORD || 'change-me-please';

// Collection definitions
const collections = {
  blogPosts: blogPostsSchema,
  projects: projectsSchema,
  streamRecap: streamRecapSchema
};

/**
 * Create a collection in Directus if it doesn't exist
 * 
 * @param {Object} client - Authenticated Directus client
 * @param {Array} existingCollections - Array of existing collection names
 * @param {Object} collectionDefinition - Collection definition object
 * @returns {Promise<boolean>} - Promise that resolves to true if collection was created or already exists
 */
async function createCollectionIfNotExists(client, existingCollections, collectionDefinition) {
  const collectionName = collectionDefinition.collection;
  
  if (!existingCollections.includes(collectionName)) {
    console.log(`Creating ${collectionName} collection...`);
    try {
      await client.request(createCollection(collectionDefinition));
      console.log(`${collectionName} collection created successfully!`);
      return true;
    } catch (error) {
      console.error(`Error creating ${collectionName} collection:`, error.message);
      return false;
    }
  } else {
    console.log(`${collectionName} collection already exists.`);
    return true;
  }
}

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

    // Check if collections already exist
    console.log('Checking existing collections...');
    const existingCollectionsData = await client.request(readItems('directus_collections'));
    const existingCollections = existingCollectionsData.map(collection => collection.collection);
    
    console.log('Setting up collections in Directus...');
    console.log('This will create the following collections:');
    Object.values(collections).forEach(collection => {
      console.log(`- ${collection.collection}`);
    });
    console.log('');

    // Create each collection if it doesn't exist
    const results = await Promise.all(
      Object.values(collections).map(collection => 
        createCollectionIfNotExists(client, existingCollections, collection)
      )
    );

    const allSuccessful = results.every(result => result === true);

    if (allSuccessful) {
      console.log('All collections have been set up successfully!');
    } else {
      console.error('Some collections failed to set up.');
    }

    return allSuccessful;
  } catch (error) {
    console.error('Error setting up collections:', error.message);
    return false;
  }
}

// If this script is run directly, execute the setup
if (import.meta.url === `file://${process.argv[1]}`) {
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
