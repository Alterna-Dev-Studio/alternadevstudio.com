/**
 * Global setup for Jest tests
 * 
 * This file is responsible for starting Directus before the tests run.
 * It uses docker-compose to start the Directus services in the background.
 */

import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { setTimeout } from 'timers/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const directusDir = join(rootDir, 'tools', 'directus');

/**
 * Start Directus using docker-compose
 */
export default async function setup() {
  console.log('Starting Directus for tests...');
  
  try {
    // Start Directus using docker-compose
    execSync('docker-compose up -d', {
      cwd: directusDir,
      stdio: 'inherit'
    });
    
    // Wait for Directus to be ready (30 seconds max)
    console.log('Waiting for Directus to be ready...');
    let isReady = false;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (!isReady && attempts < maxAttempts) {
      try {
        // Try to connect to Directus health endpoint
        const response = await fetch('http://localhost:8055/server/health');
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
    
    // Set global variable to indicate Directus is running
    global.__DIRECTUS_RUNNING__ = true;
    
  } catch (error) {
    console.error('Error starting Directus:', error.message);
    process.exit(1);
  }
}
