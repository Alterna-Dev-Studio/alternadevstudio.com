/**
 * Global teardown for Jest tests
 * 
 * This file is responsible for stopping Directus after the tests run.
 * It uses docker-compose to stop the Directus services.
 */

import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const directusDir = join(rootDir, 'tools', 'directus');

/**
 * Stop Directus using docker-compose
 */
export default async function teardown() {
  // Only stop Directus if it was started by the setup
  if (global.__DIRECTUS_RUNNING__) {
    console.log('Stopping Directus...');
    
    try {
      // Stop Directus using docker-compose
      execSync('docker-compose down', {
        cwd: directusDir,
        stdio: 'inherit'
      });
      
      console.log('Directus stopped successfully');
      
      // Reset global variable
      global.__DIRECTUS_RUNNING__ = false;
      
      // Force process to exit after a short delay to ensure all resources are released
      setTimeout(() => {
        process.exit(0);
      }, 100);
      
    } catch (error) {
      console.error('Error stopping Directus:', error.message);
      process.exit(1);
    }
  }
}
