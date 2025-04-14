/**
 * Utility functions for testing templates
 */

import nunjucks from 'nunjucks';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { marked } from 'marked';

// Set up paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');
const srcDir = join(rootDir, 'src');

// Configure Nunjucks
const nunjucksEnv = nunjucks.configure([
  join(srcDir, '_includes'),
  join(srcDir, '_layouts'),
  srcDir // Add the src directory to look for templates
], {
  autoescape: true,
  throwOnUndefined: true
});

// Add filters
nunjucksEnv.addFilter('date', function(date, format) {
  if (!date) return '';
  
  // Simple date formatting for testing
  const d = new Date(date);
  
  if (format === 'YYYY-MM-DD') {
    return d.toISOString().split('T')[0];
  }
  
  if (format === 'MMMM D, YYYY') {
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  return d.toISOString();
});

// Add markdown filter
nunjucksEnv.addFilter('markdown', function(content) {
  if (!content) return '';
  return marked(content);
});

/**
 * Render a template with data
 * @param {string} templateName - Name of the template to render
 * @param {Object} data - Data to pass to the template
 * @returns {string} Rendered HTML
 */
export function renderTemplate(templateName, data) {
  try {
    return nunjucksEnv.render(templateName, data);
  } catch (error) {
    console.error(`Error rendering template ${templateName}:`, error);
    throw error;
  }
}

/**
 * Test if a template can be rendered with data
 * @param {string} templateName - Name of the template to render
 * @param {Object} data - Data to pass to the template
 * @returns {boolean} True if the template can be rendered
 */
export function canRenderTemplate(templateName, data) {
  try {
    renderTemplate(templateName, data);
    return true;
  } catch (error) {
    console.error(`Error rendering template ${templateName}:`, error);
    return false;
  }
}
