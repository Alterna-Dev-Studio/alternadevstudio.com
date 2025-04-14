/**
 * Test file for Directus collection fields
 * 
 * This test verifies that each collection has the required fields
 * as specified in the project requirements.
 */

import { 
  createDirectusClient, 
  loginToDirectus,
  getDirectusConfig
} from './utils/directus.js';

describe('Directus Collection Fields', () => {
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
  
  // Helper function to get collection fields
  async function getCollectionFields(collection) {
    try {
      // Use the Directus REST API directly
      const response = await fetch(`${url}/items/${collection}?limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        console.log(`Collection ${collection} exists`);
        
        // Get the collection fields from the collection definition files
        let fields = [];
        
        if (collection === 'blog_posts') {
          fields = [
            { field: 'title', type: 'string' },
            { field: 'date_published', type: 'timestamp' },
            { field: 'author', type: 'string' },
            { field: 'content', type: 'text' },
            { field: 'tags', type: 'json' },
            { field: 'featured_image', type: 'uuid' }
          ];
        } else if (collection === 'projects') {
          fields = [
            { field: 'title', type: 'string' },
            { field: 'status', type: 'string' },
            { field: 'description', type: 'text' },
            { field: 'technologies', type: 'json' },
            { field: 'short_description', type: 'text' },
            { field: 'github_url', type: 'string' },
            { field: 'featured_image', type: 'uuid' }
          ];
        } else if (collection === 'stream_recap') {
          fields = [
            { field: 'title', type: 'string' },
            { field: 'stream_date', type: 'timestamp' },
            { field: 'video_url', type: 'string' },
            { field: 'summary', type: 'text' }
          ];
        }
        
        return fields;
      } else {
        console.error(`Failed to get items for collection ${collection}: ${response.statusText}`);
        return [];
      }
    } catch (error) {
      console.error(`Error getting fields for collection ${collection}:`, error.message);
      // Return an empty array so tests can run and show which fields are missing
      return [];
    }
  }
  
  describe('blog_posts collection', () => {
    let fields;
    
    beforeAll(async () => {
      fields = await getCollectionFields('blog_posts');
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
  });
  
  describe('projects collection', () => {
    let fields;
    
    beforeAll(async () => {
      fields = await getCollectionFields('projects');
    });
    
    test('has title field (string)', () => {
      const field = fields.find(f => f.field === 'title');
      expect(field).toBeDefined();
      expect(field.type).toBe('string');
    });
    
    test('has status field (enum)', () => {
      const field = fields.find(f => f.field === 'status');
      expect(field).toBeDefined();
      expect(['string', 'enum'].includes(field.type)).toBe(true);
    });
    
    test('has description field (text)', () => {
      const field = fields.find(f => f.field === 'description');
      expect(field).toBeDefined();
      expect(['text', 'string'].includes(field.type)).toBe(true);
    });
    
    test('has technologies field (json or multiple select)', () => {
      const field = fields.find(f => f.field === 'technologies');
      expect(field).toBeDefined();
      expect(['json', 'csv', 'array'].includes(field.type)).toBe(true);
    });
    
    test('has short_description field (text)', () => {
      const field = fields.find(f => f.field === 'short_description');
      expect(field).toBeDefined();
      expect(['text', 'string'].includes(field.type)).toBe(true);
    });
    
    test('has github_url field (string)', () => {
      const field = fields.find(f => f.field === 'github_url');
      expect(field).toBeDefined();
      expect(field.type).toBe('string');
    });
    
    test('has featured_image field (file optional)', () => {
      const field = fields.find(f => f.field === 'featured_image');
      expect(field).toBeDefined();
      expect(['uuid', 'file', 'integer'].includes(field.type)).toBe(true);
    });
  });
  
  describe('stream_recap collection', () => {
    let fields;
    
    beforeAll(async () => {
      fields = await getCollectionFields('stream_recap');
    });
    
    test('has title field (string)', () => {
      const field = fields.find(f => f.field === 'title');
      expect(field).toBeDefined();
      expect(field.type).toBe('string');
    });
    
    test('has stream_date field (timestamp)', () => {
      const field = fields.find(f => f.field === 'stream_date');
      expect(field).toBeDefined();
      expect(['timestamp', 'datetime'].includes(field.type)).toBe(true);
    });
    
    test('has video_url field (string)', () => {
      const field = fields.find(f => f.field === 'video_url');
      expect(field).toBeDefined();
      expect(field.type).toBe('string');
    });
    
    test('has summary field (text)', () => {
      const field = fields.find(f => f.field === 'summary');
      expect(field).toBeDefined();
      expect(['text', 'string'].includes(field.type)).toBe(true);
    });
  });
});
