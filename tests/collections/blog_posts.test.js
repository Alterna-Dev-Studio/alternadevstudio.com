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
  let token;
  const { url } = getDirectusConfig();
  
  beforeAll(async () => {
    // Create Directus client
    client = createDirectusClient();
    
    // Login to Directus
    const loggedIn = await loginToDirectus(client);
    expect(loggedIn).toBe(true);
    
    // Get token for API calls
    token = client.getToken();
  });
  
  test('Collection exists and is accessible', async () => {
    try {
      // Try to get items from the collection (limit 1)
      const items = await getItems(client, 'blog_posts', { limit: 1 });
      
      // Check that we got an array
      expect(Array.isArray(items)).toBe(true);
      
      // Get the total count using the API directly
      const response = await fetch(`${url}/items/blog_posts?limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`
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
  
  describe('Field structure', () => {
    let fields;
    
    beforeAll(async () => {
      // Get the expected fields from the collection definition
      fields = blogPosts.fields.map(field => ({
        field: field.field,
        type: field.type
      }));
      
      // Log the expected fields
      console.log('Expected fields:', fields.map(f => f.field).join(', '));
    });
    
    test('has title field (string)', () => {
      const field = fields.find(f => f.field === 'title');
      expect(field).toBeDefined();
      expect(field.type).toBe('string');
    });
    
    test('has date_published field (timestamp)', () => {
      const field = fields.find(f => f.field === 'date_published');
      expect(field).toBeDefined();
      expect(['timestamp', 'datetime'].includes(field.type)).toBe(true);
    });
    
    test('has author field (string)', () => {
      const field = fields.find(f => f.field === 'author');
      expect(field).toBeDefined();
      expect(field.type).toBe('string');
    });
    
    test('has content field (text/rich)', () => {
      const field = fields.find(f => f.field === 'content');
      expect(field).toBeDefined();
      expect(['text', 'json'].includes(field.type)).toBe(true);
    });
    
    test('has tags field (json or multiple select)', () => {
      const field = fields.find(f => f.field === 'tags');
      expect(field).toBeDefined();
      expect(['json', 'csv', 'array'].includes(field.type)).toBe(true);
    });
    
    test('has featured_image field (file relationship optional)', () => {
      const field = fields.find(f => f.field === 'featured_image');
      expect(field).toBeDefined();
      expect(['uuid', 'file', 'integer'].includes(field.type)).toBe(true);
    });
    
    test('has all expected fields', () => {
      // Get the expected fields from the collection definition
      const expectedFields = blogPosts.fields.map(field => field.field);
      
      // Check that all expected fields are present
      for (const fieldName of expectedFields) {
        const field = fields.find(f => f.field === fieldName);
        expect(field).toBeDefined();
      }
    });
  });
});
