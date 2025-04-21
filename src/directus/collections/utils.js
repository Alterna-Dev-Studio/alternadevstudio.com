/**
 * Utility functions for working with Directus collections
 */

import { createCollection, readFields, createField } from '@directus/sdk';

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
 * Add missing fields to an existing collection
 * 
 * @param {Object} client - Authenticated Directus client
 * @param {string} collectionName - Collection name
 * @param {Array} definedFields - Fields defined in the collection schema
 * @returns {Promise<boolean>} - Promise that resolves to true if fields were added successfully
 */
export async function addMissingFields(client, collectionName, definedFields) {
  try {
    // Get existing fields
    console.log(`Getting existing fields for ${collectionName}...`);
    const existingFields = await client.request(readFields(collectionName));
    
    // Get field names from the existing fields
    const existingFieldNames = existingFields.map(field => field.field);
    
    // Filter defined fields to find missing ones
    const missingFields = definedFields.filter(
      field => !existingFieldNames.includes(field.field)
    );
    
    if (missingFields.length === 0) {
      console.log(`No missing fields for ${collectionName}.`);
      return true;
    }
    
    console.log(`Adding ${missingFields.length} missing fields to ${collectionName}:`);
    missingFields.forEach(field => console.log(` - ${field.field}`));
    
    // Add each missing field
    const errors = [];
    for (const field of missingFields) {
      try {
        await client.request(createField(collectionName, field));
        console.log(`Added field ${field.field} to ${collectionName}`);
      } catch (error) {
        console.error(`Error adding field ${field.field} to ${collectionName}:`, error.message);
        errors.push({ field: field.field, error: error.message });
      }
    }
    
    if (errors.length > 0) {
      console.error(`Failed to add the following fields to ${collectionName}:`, errors);
      return false;
    }
    
    return true;
    
    return true;
  } catch (error) {
    console.error(`Error adding missing fields to ${collectionName}:`, error.message);
    return false;
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
  console.log('This will create or update the following collections:');
  Object.keys(collections).forEach(key => {
    console.log(`- ${collections[key].collection}`);
  });
  console.log('');
  
  const results = [];
  
  // Process each collection
  for (const collection of Object.values(collections)) {
    const collectionName = collection.collection;
    
    if (!existingCollections.includes(collectionName)) {
      // Create new collection if it doesn't exist
      results.push(await createCollectionIfNotExists(client, existingCollections, collection));
    } else {
      // Add missing fields to existing collection
      console.log(`Checking for missing fields in ${collectionName}...`);
      results.push(await addMissingFields(client, collectionName, collection.fields));
    }
  }
  
  const allSuccessful = results.every(result => result === true);
  
  if (allSuccessful) {
    console.log('All collections have been set up or updated successfully!');
  } else {
    console.error('Some collections failed to set up or update.');
  }
  
  return allSuccessful;
}
