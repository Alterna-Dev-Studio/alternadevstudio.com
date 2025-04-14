/**
 * Test file for Directus connection
 * 
 * This test verifies that Directus is running and accessible,
 * and that we can authenticate and interact with it.
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

describe('Directus Connection', () => {
  let client;
  
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
    // In the latest Directus SDK, the token might be an object instead of a string
    expect(token).not.toBeNull();
  });
  
  test.each(requiredCollections)('Collection %s exists', async (collection) => {
    // Try to get items from the collection (limit 1)
    const items = await getItems(client, collection, { limit: 1 });
    
    // We don't care about the actual items, just that the collection exists
    // and we can query it without errors
    expect(Array.isArray(items)).toBe(true);
  });
});
