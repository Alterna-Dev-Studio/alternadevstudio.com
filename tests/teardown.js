/**
 * Global teardown for Jest tests
 * 
 * This file is responsible for cleaning up after tests have completed.
 */

import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const directusDir = join(rootDir, 'util', 'directus');

/**
 * Clean up after tests
 */
export default async function teardown() {
  // Reset the global flag that was set during setup
  if (global.__DIRECTUS_RUNNING__) {
    console.log('Cleaning up after tests...');
    
    // Reset global variable
    global.__DIRECTUS_RUNNING__ = false;
    
    console.log('Test cleanup completed');
  }
}
