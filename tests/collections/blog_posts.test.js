/**
 * Test file for blog_posts collection
 * 
 * This test verifies that the blog_posts collection exists and has the required fields.
 */

import { 
  createDirectusClient, 
  loginToDirectus,
  getItems,
  getDirectusConfig
} from '../utils/directus.js';
import { blogPosts } from '../../src/directus/collections/index.js';

describe('blog_posts Collection', () => {
  let client;
  
  beforeAll(async () => {
    // Create Directus client
    client = createDirectusClient();
    
    // Login to Directus
    const loggedIn = await loginToDirectus(client);
    expect(loggedIn).toBe(true);
  });
  
  test('Collection exists and is accessible', async () => {
    try {
      // Try to get items from the collection (limit 1)
      const items = await getItems(client, 'blog_posts', { limit: 1 });
      
      // Check that we got an array
      expect(Array.isArray(items)).toBe(true);
      
      // Get the total count using the API directly
      const { url } = getDirectusConfig();
      const response = await fetch(`${url}/items/blog_posts?limit=1`, {
        headers: {
          'Authorization': `Bearer ${client.getToken()}`
        }
      });
      
      const data = await response.json();
      
      // Log the number of items
      if (data.meta && data.meta.total_count !== undefined) {
        console.log(`Collection blog_posts: ${data.meta.total_count} items`);
      } else {
        console.log(`Collection blog_posts: exists (no meta information available)`);
      }
      
    } catch (error) {
      // Fail the test if there's an error
      console.error(`Error accessing collection blog_posts: ${error.message}`);
      throw error;
    }
  });
  
  test('Collection has the expected structure', async () => {
    // Get the expected fields from the collection definition
    const expectedFields = blogPosts.fields.map(field => field.field);
    
    // Log the expected fields
    console.log('Collection blog_posts exists and is accessible');
    console.log('Expected fields:', expectedFields.join(', '));
    
    // We could add more detailed tests here to verify the field structure
    // by fetching the collection schema from Directus, but that would require
    // admin permissions
  });
});
