/**
 * Global setup for Jest tests
 * 
 * This file is responsible for verifying Directus is available before tests run.
 * It also sets up the collections using the shared module.
 */

import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { setTimeout } from 'timers/promises';
import { setupCollections } from '../src/directus/setup-collections.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const directusDir = join(rootDir, 'util', 'directus');

/**
 * Verify Directus is available for tests
 */
export default async function setup() {
  console.log('Verifying Directus availability for tests...');
  
  try {
    // Wait for Directus to be ready (30 seconds max)
    console.log('Checking if Directus is ready...');
    let isReady = false;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (!isReady && attempts < maxAttempts) {
      try {
        // Try to connect to Directus health endpoint
        const response = await fetch(`${process.env.DIRECTUS_URL || 'http://localhost:8055'}/server/health`);
        const data = await response.json();
        
        if (data.status === 'ok') {
          isReady = true;
          console.log('Directus is ready!');
        } else {
          console.log(`Waiting for Directus... (${attempts + 1}/${maxAttempts})`);
          await setTimeout(1000); // Wait 1 second
          attempts++;
        }
      } catch (error) {
        console.log(`Waiting for Directus... (${attempts + 1}/${maxAttempts})`);
        await setTimeout(1000); // Wait 1 second
        attempts++;
      }
    }
    
    if (!isReady) {
      throw new Error('Directus failed to start within the timeout period');
    }
    
    // Set up collections using the shared module
    console.log('Setting up collections for tests...');
    const success = await setupCollections();
    
    if (success) {
      console.log('Collections set up successfully!');
    } else {
      console.warn('Failed to set up collections. Tests may fail if collections do not exist.');
    }
    
    // Set global variable to indicate Directus is running
    global.__DIRECTUS_RUNNING__ = true;
    
  } catch (error) {
    console.error('Error verifying Directus availability:', error.message);
    process.exit(1);
  }
}
