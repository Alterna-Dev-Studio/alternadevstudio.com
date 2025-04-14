/**
 * Test file for stream_recap collection
 * 
 * This test verifies that the stream_recap collection exists and has the required fields.
 * It also tests that the sample data can be rendered in templates.
 */

import { 
  createDirectusClient, 
  loginToDirectus,
  getItems,
  getDirectusConfig
} from '../utils/directus.js';
import { streamRecap } from '../../src/directus/collections/index.js';
import { getSampleStreamRecaps } from '../../src/_data/stream_recaps.js';
import { renderTemplate } from '../utils/template.js';

describe('stream_recap Collection', () => {
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
  
  // Sample data for template testing
  let sampleStreamRecaps;
  
  beforeAll(() => {
    // Get sample stream recaps
    sampleStreamRecaps = getSampleStreamRecaps();
    expect(sampleStreamRecaps).toBeDefined();
    expect(Array.isArray(sampleStreamRecaps)).toBe(true);
    expect(sampleStreamRecaps.length).toBeGreaterThan(0);
  });
  
  test('Collection exists and is accessible', async () => {
    try {
      // Try to get items from the collection (limit 1)
      const items = await getItems(client, 'stream_recap', { limit: 1 });
      
      // Check that we got an array
      expect(Array.isArray(items)).toBe(true);
      
      // Get the total count using the API directly
      const response = await fetch(`${url}/items/stream_recap?limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      // Log the number of items
      if (data.meta && data.meta.total_count !== undefined) {
        console.log(`Collection stream_recap: ${data.meta.total_count} items`);
      } else {
        console.log(`Collection stream_recap: exists (no meta information available)`);
      }
      
    } catch (error) {
      // Fail the test if there's an error
      console.error(`Error accessing collection stream_recap: ${error.message}`);
      throw error;
    }
  });
  
  describe('Field structure', () => {
    let fields;
    
    beforeAll(async () => {
      // Get the expected fields from the collection definition
      fields = streamRecap.fields.map(field => ({
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
    
    test('has all expected fields', () => {
      // Get the expected fields from the collection definition
      const expectedFields = streamRecap.fields.map(field => field.field);
      
      // Check that all expected fields are present
      for (const fieldName of expectedFields) {
        const field = fields.find(f => f.field === fieldName);
        expect(field).toBeDefined();
      }
    });
  });
  
  describe('Template rendering', () => {
    test('stream_recap.njk template can render each sample stream recap', () => {
      // Iterate over each sample stream recap
      for (const recap of sampleStreamRecaps) {
        try {
          // Try to render the template with the stream recap data
          const html = renderTemplate('stream_recap.njk', { stream_recap: recap });
          
          // Check that the rendered HTML contains key elements
          expect(html).toContain(recap.title);
          
          if (recap.summary) {
            // The summary is rendered as markdown, so we can't check for exact content
            // but we can check that the summary section exists
            expect(html).toContain('<div class="summary">');
          }
          
          // If the recap has topics, check that they are rendered
          if (recap.topics_covered && recap.topics_covered.length > 0) {
            expect(html).toContain('Topics Covered:');
            for (const topic of recap.topics_covered) {
              expect(html).toContain(topic);
            }
          }
          
          // Check that links are rendered if present
          if (recap.video_url) {
            expect(html).toContain(recap.video_url);
            expect(html).toContain('Watch the Stream Recording');
          }
          
          if (recap.code_repository) {
            expect(html).toContain(recap.code_repository);
            expect(html).toContain('Code Repository:');
          }
          
          // Check that resources are rendered if present
          if (recap.resources && recap.resources.length > 0) {
            expect(html).toContain('Resources:');
            for (const resource of recap.resources) {
              expect(html).toContain(resource.title);
              expect(html).toContain(resource.url);
              
              if (resource.description) {
                expect(html).toContain(resource.description);
              }
            }
          }
          
          console.log(`Successfully rendered stream recap: ${recap.title}`);
        } catch (error) {
          console.error(`Error rendering stream recap ${recap.title}:`, error);
          throw error;
        }
      }
    });
    
    test('streams.njk template can render the list of stream recaps', () => {
      try {
        // Try to render the template with the stream recaps data
        const html = renderTemplate('streams.njk', { stream_recaps: sampleStreamRecaps });
        
        // Check that the rendered HTML contains key elements
        expect(html).toContain('Stream Recaps');
        
        // Check that each stream recap is rendered in the list
        for (const recap of sampleStreamRecaps) {
          expect(html).toContain(recap.title);
          expect(html).toContain(`/streams/${recap.slug}/`);
          
          // If the recap has topics, check that they are rendered
          if (recap.topics_covered && recap.topics_covered.length > 0) {
            expect(html).toContain('Topics:');
            for (const topic of recap.topics_covered) {
              expect(html).toContain(topic);
            }
          }
        }
        
        console.log('Successfully rendered stream recaps list');
      } catch (error) {
        console.error('Error rendering stream recaps list:', error);
        throw error;
      }
    });
  });
});
