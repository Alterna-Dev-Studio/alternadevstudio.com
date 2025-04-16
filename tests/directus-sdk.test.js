/**
 * Test file for Directus SDK
 * 
 * This test verifies that Directus is running and accessible using the Directus SDK.
 * It's a migration of the util/directus/test-connection.js script to Jest.
 */

import { 
  createDirectusClient, 
  loginToDirectus, 
  isDirectusAvailable,
  getItems,
  getDirectusConfig
} from './utils/directus.js';

// Required collections that should exist in Directus
const requiredCollections = ['blog_posts', 'projects', 'stream_recap'];

describe('Directus SDK', () => {
  let client;
  const { url } = getDirectusConfig();
  
  beforeAll(async () => {
    // Create Directus client
    client = createDirectusClient();
    
    // Login to Directus
    const loggedIn = await loginToDirectus(client);
    expect(loggedIn).toBe(true);
  });
  
  test('Directus is available', async () => {
    const available = await isDirectusAvailable();
    expect(available).toBe(true);
  });
  
  test('Can authenticate with Directus', async () => {
    // The token should be available after login in beforeAll
    const token = client.getToken();
    expect(token).toBeDefined();
    expect(token).not.toBeNull();
  });
  
  describe('Collections', () => {
    // Test each collection individually
    for (const collection of requiredCollections) {
      test(`Collection ${collection} exists and is accessible`, async () => {
        try {
          // Try to get items from the collection (limit 1)
          const items = await getItems(client, collection, { limit: 1 });
          
          // Check that we got an array
          expect(Array.isArray(items)).toBe(true);
          
          // Get the total count using the API directly
          const response = await fetch(`${url}/items/${collection}?limit=1`, {
            headers: {
              'Authorization': `Bearer ${client.getToken()}`
            }
          });
          
          const data = await response.json();
          
          // Log the number of items (similar to the test-connection.js script)
          if (data.meta && data.meta.total_count !== undefined) {
            console.log(`Collection ${collection}: ${data.meta.total_count} items`);
          } else {
            console.log(`Collection ${collection}: exists (no meta information available)`);
          }
          
        } catch (error) {
          // Fail the test if there's an error
          console.error(`Error accessing collection ${collection}: ${error.message}`);
          throw error;
        }
      });
    }
  });
});
