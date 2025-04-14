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
    const response = await fetch(`${url}/fields/${collection}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get fields for collection ${collection}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data;
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
    
    test('has date field (datetime)', () => {
      const field = fields.find(f => f.field === 'date');
      expect(field).toBeDefined();
      expect(field.type).toBe('datetime');
    });
    
    test('has author field (string)', () => {
      const field = fields.find(f => f.field === 'author');
      expect(field).toBeDefined();
      expect(field.type).toBe('string');
    });
    
    test('has body field (text/rich)', () => {
      const field = fields.find(f => f.field === 'body');
      expect(field).toBeDefined();
      expect(['text', 'json'].includes(field.type)).toBe(true);
    });
    
    test('has tags field (json or multiple select)', () => {
      const field = fields.find(f => f.field === 'tags');
      expect(field).toBeDefined();
      expect(['json', 'csv', 'array'].includes(field.type)).toBe(true);
    });
    
    test('has image field (file relationship optional)', () => {
      const field = fields.find(f => f.field === 'image');
      expect(field).toBeDefined();
      expect(['uuid', 'file', 'integer'].includes(field.type)).toBe(true);
    });
  });
  
  describe('projects collection', () => {
    let fields;
    
    beforeAll(async () => {
      fields = await getCollectionFields('projects');
    });
    
    test('has name field (string)', () => {
      const field = fields.find(f => f.field === 'name');
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
    
    test('has problem_solved field (text)', () => {
      const field = fields.find(f => f.field === 'problem_solved');
      expect(field).toBeDefined();
      expect(['text', 'string'].includes(field.type)).toBe(true);
    });
    
    test('has outcomes_results field (text)', () => {
      const field = fields.find(f => f.field === 'outcomes_results');
      expect(field).toBeDefined();
      expect(['text', 'string'].includes(field.type)).toBe(true);
    });
    
    test('has image field (file optional)', () => {
      const field = fields.find(f => f.field === 'image');
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
    
    test('has date field (datetime)', () => {
      const field = fields.find(f => f.field === 'date');
      expect(field).toBeDefined();
      expect(field.type).toBe('datetime');
    });
    
    test('has youtube_link field (string)', () => {
      const field = fields.find(f => f.field === 'youtube_link');
      expect(field).toBeDefined();
      expect(field.type).toBe('string');
    });
    
    test('has description field (text)', () => {
      const field = fields.find(f => f.field === 'description');
      expect(field).toBeDefined();
      expect(['text', 'string'].includes(field.type)).toBe(true);
    });
  });
});
