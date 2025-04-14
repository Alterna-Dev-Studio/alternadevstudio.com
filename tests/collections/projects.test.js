/**
 * Test file for projects collection
 * 
 * This test verifies that the projects collection exists and has the required fields.
 * It also tests that the sample data can be rendered in templates.
 */

import { 
  createDirectusClient, 
  loginToDirectus,
  getItems,
  getDirectusConfig
} from '../utils/directus.js';
import { projects } from '../../src/directus/collections/index.js';
import { getSampleProjects } from '../../src/_data/projects.js';
import { renderTemplate } from '../utils/template.js';

describe('projects Collection', () => {
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
  let sampleProjects;
  
  beforeAll(() => {
    // Get sample projects
    sampleProjects = getSampleProjects();
    expect(sampleProjects).toBeDefined();
    expect(Array.isArray(sampleProjects)).toBe(true);
    expect(sampleProjects.length).toBeGreaterThan(0);
  });
  
  test('Collection exists and is accessible', async () => {
    try {
      // Try to get items from the collection (limit 1)
      const items = await getItems(client, 'projects', { limit: 1 });
      
      // Check that we got an array
      expect(Array.isArray(items)).toBe(true);
      
      // Get the total count using the API directly
      const response = await fetch(`${url}/items/projects?limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      // Log the number of items
      if (data.meta && data.meta.total_count !== undefined) {
        console.log(`Collection projects: ${data.meta.total_count} items`);
      } else {
        console.log(`Collection projects: exists (no meta information available)`);
      }
      
    } catch (error) {
      // Fail the test if there's an error
      console.error(`Error accessing collection projects: ${error.message}`);
      throw error;
    }
  });
  
  describe('Field structure', () => {
    let fields;
    
    beforeAll(async () => {
      // Get the expected fields from the collection definition
      fields = projects.fields.map(field => ({
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
    
    test('has all expected fields', () => {
      // Get the expected fields from the collection definition
      const expectedFields = projects.fields.map(field => field.field);
      
      // Check that all expected fields are present
      for (const fieldName of expectedFields) {
        const field = fields.find(f => f.field === fieldName);
        expect(field).toBeDefined();
      }
    });
  });
  
  describe('Template rendering', () => {
    test('project.njk template can render each sample project', () => {
      // Iterate over each sample project
      for (const project of sampleProjects) {
        try {
          // Try to render the template with the project data
          const html = renderTemplate('project.njk', { project });
          
          // Check that the rendered HTML contains key elements
          expect(html).toContain(project.title);
          
          if (project.short_description) {
            expect(html).toContain(project.short_description);
          }
          
          // If the project has technologies, check that they are rendered
          if (project.technologies && project.technologies.length > 0) {
            expect(html).toContain('Technologies Used:');
            for (const tech of project.technologies) {
              expect(html).toContain(tech);
            }
          }
          
          // Check that links are rendered if present
          if (project.github_url) {
            expect(html).toContain(project.github_url);
            expect(html).toContain('GitHub Repository');
          }
          
          if (project.live_url) {
            expect(html).toContain(project.live_url);
            expect(html).toContain('Live Demo');
          }
          
          console.log(`Successfully rendered project: ${project.title}`);
        } catch (error) {
          console.error(`Error rendering project ${project.title}:`, error);
          throw error;
        }
      }
    });
    
    test('projects.njk template can render the list of projects', () => {
      try {
        // Try to render the template with the projects data
        const html = renderTemplate('projects.njk', { projects: sampleProjects });
        
        // Check that the rendered HTML contains key elements
        expect(html).toContain('Projects');
        
        // Check that each project is rendered in the list
        for (const project of sampleProjects) {
          expect(html).toContain(project.title);
          expect(html).toContain(`/projects/${project.slug}/`);
          
          if (project.short_description) {
            expect(html).toContain(project.short_description);
          }
          
          // If the project has technologies, check that they are rendered
          if (project.technologies && project.technologies.length > 0) {
            expect(html).toContain('Technologies:');
            for (const tech of project.technologies) {
              expect(html).toContain(tech);
            }
          }
        }
        
        console.log('Successfully rendered projects list');
      } catch (error) {
        console.error('Error rendering projects list:', error);
        throw error;
      }
    });
  });
});
