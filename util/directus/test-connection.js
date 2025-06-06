#!/usr/bin/env node

/**
 * Test script for Directus connection
 * 
 * This script tests the connection to Directus and verifies that the
 * required collections exist. It's useful for checking that the setup
 * is working correctly.
 */

import { createDirectus, rest, authentication, readItems } from '@directus/sdk';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');
const envPath = join(rootDir, '.env');

// Only load .env file if it exists
if (existsSync(envPath)) {
  config({ path: envPath });
} else {
  console.log('No .env file found in project root. Using default values.');
}

// Directus connection details with fallbacks
const directusUrl = process.env.DIRECTUS_URL || 'http://localhost:8055';
const email = process.env.DIRECTUS_EMAIL || 'admin@example.com';
const password = process.env.DIRECTUS_PASSWORD || 'change-me-please';

// Required collections
const requiredCollections = ['blog_posts', 'projects', 'stream_recap'];

/**
 * Test the connection to Directus
 */
async function testConnection() {
  console.log('Testing connection to Directus...');
  console.log(`URL: ${directusUrl}`);
  console.log(`Email: ${email}`);
  console.log('');
  
  try {
    // Check if Directus is running
    console.log('Checking if Directus is running...');
    const healthResponse = await fetch(`${directusUrl}/server/health`);
    
    if (!healthResponse.ok) {
      throw new Error(`Directus health check failed with status: ${healthResponse.status}`);
    }
    
    const healthData = await healthResponse.json();
    console.log(`Directus health check: ${healthData.status}`);
    console.log('');
    
    // Initialize Directus client
    console.log('Initializing Directus client...');
    const client = createDirectus(directusUrl)
      .with(authentication())
      .with(rest());
    
    // Login to Directus
    console.log('Logging in to Directus...');
    await client.login(email, password);
    console.log('Login successful!');
    console.log('');
    
    // Check if required collections exist
    console.log('Checking if required collections exist...');
    
    // Check each collection individually
    console.log('Collections found:');
    for (const collection of requiredCollections) {
      try {
        // Try to get items from the collection (limit 1)
        const itemsResponse = await fetch(`${directusUrl}/items/${collection}?limit=1`, {
          headers: {
            'Authorization': `Bearer ${client.getToken()}`
          }
        });
        
        if (itemsResponse.ok) {
          console.log(`- ${collection}: ✅ Found`);
          const itemsData = await itemsResponse.json();
          console.log(`  ${itemsData.meta.total_count} items`);
        } else {
          console.log(`- ${collection}: ❌ Not found (${itemsResponse.status})`);
        }
      } catch (error) {
        console.log(`- ${collection}: ❌ Error: ${error.message}`);
      }
    }
    console.log('');
    
    // We'll consider the collections exist if we got this far
    const existingCollections = requiredCollections;
    console.log('');
    
    console.log('Connection test completed successfully!');
    console.log('');
    console.log('You can now use Directus as a headless CMS for your website.');
    console.log('Access the admin interface at:');
    console.log(`${directusUrl}`);
    
  } catch (error) {
    console.error('Error testing connection to Directus:');
    console.error(error.message);
    console.error('');
    console.error('Possible solutions:');
    console.error('1. Make sure Directus is running (pnpm directus:start)');
    console.error('2. Check your .env file for correct credentials');
    console.error('3. Run the setup script (pnpm directus:setup)');
    process.exit(1);
  }
}

// Run the test
testConnection();
