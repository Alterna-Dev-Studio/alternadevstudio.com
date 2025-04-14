/**
 * Utility functions for working with Directus collections
 */

import { createCollection } from '@directus/sdk';

/**
 * Create a collection in Directus if it doesn't exist
 * 
 * @param {Object} client - Authenticated Directus client
 * @param {Array} existingCollections - Array of existing collection names
 * @param {Object} collectionDefinition - Collection definition object
 * @returns {Promise<boolean>} - Promise that resolves to true if collection was created or already exists
 */
export async function createCollectionIfNotExists(client, existingCollections, collectionDefinition) {
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
 * Create all collections in Directus
 * 
 * @param {Object} client - Authenticated Directus client
 * @param {Array} existingCollections - Array of existing collection names
 * @param {Object} collections - Object containing collection definitions
 * @returns {Promise<boolean>} - Promise that resolves to true if all collections were created successfully
 */
export async function createAllCollections(client, existingCollections, collections) {
  console.log('Setting up collections in Directus...');
  console.log('This will create the following collections:');
  Object.keys(collections).forEach(key => {
    console.log(`- ${collections[key].collection}`);
  });
  console.log('');
  
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
}
