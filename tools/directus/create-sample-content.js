/**
 * Script to create sample content in Directus
 * 
 * This script demonstrates how to create content in Directus using the API.
 * It creates a sample blog post, project, and stream recap.
 */

import { createDirectus, rest, authentication, createItem } from '@directus/sdk';
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

/**
 * Create sample content in Directus
 */
async function createSampleContent() {
  console.log('Creating sample content in Directus...');
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
    
    // Create a sample blog post
    console.log('Creating a sample blog post...');
    const blogPost = await client.request(
      createItem('blog_posts', {
        status: 'published',
        title: 'Getting Started with Directus and Eleventy',
        slug: 'getting-started-with-directus-and-eleventy',
        date_published: new Date().toISOString(),
        author: 'AlternaDevStudio',
        content: `
# Getting Started with Directus and Eleventy

This is a sample blog post created via the API to demonstrate how to integrate Directus with Eleventy.

## What is Directus?

Directus is a headless CMS that gives you the freedom to manage your content and use it anywhere. It's database-first, which means it can work with any existing SQL database.

## What is Eleventy?

Eleventy (11ty) is a simpler static site generator. It transforms a directory of templates into HTML.

## Why use them together?

Combining Directus and Eleventy gives you:

1. A powerful, user-friendly CMS for content management
2. Fast, static site generation for optimal performance
3. Complete flexibility in how you structure and display your content
4. A modern Jamstack architecture

## Getting Started

To get started with this setup:

1. Run \`pnpm directus:setup\` to set up Directus
2. Create content in the Directus admin interface
3. Run \`pnpm start\` to start the Eleventy development server
4. Your content will be automatically pulled from Directus and displayed on your site
        `,
        excerpt: 'Learn how to integrate Directus as a headless CMS with Eleventy for a powerful and flexible website setup.',
        tags: ['directus', 'eleventy', 'jamstack', 'headless-cms']
      })
    );
    console.log(`Blog post created with ID: ${blogPost.id}`);
    console.log('');
    
    // Create a sample project
    console.log('Creating a sample project...');
    const project = await client.request(
      createItem('projects', {
        status: 'published',
        title: 'AlternaDevStudio Website',
        slug: 'alternadevstudio-website',
        date_completed: new Date().toISOString(),
        description: `
# AlternaDevStudio Website

This is the website you're currently viewing! It's built with Eleventy and uses Directus as a headless CMS.

## Features

- Static site generation with Eleventy
- Content management with Directus
- Blog posts, projects, and stream recaps
- Responsive design

## Technical Details

- Eleventy for static site generation
- Directus as a headless CMS
- Docker for local development
- Deployed on Netlify
        `,
        short_description: 'The AlternaDevStudio website, built with Eleventy and Directus.',
        technologies: ['Eleventy', 'Directus', 'JavaScript', 'Docker', 'Netlify'],
        github_url: 'https://github.com/alternadev/alternadevstudio.com',
        live_url: 'https://alternadevstudio.com',
        featured: true,
        sort_order: 1
      })
    );
    console.log(`Project created with ID: ${project.id}`);
    console.log('');
    
    // Create a sample stream recap
    console.log('Creating a sample stream recap...');
    const streamRecap = await client.request(
      createItem('stream_recap', {
        status: 'published',
        title: 'Setting Up Directus with Eleventy',
        slug: 'setting-up-directus-with-eleventy',
        stream_date: new Date().toISOString(),
        summary: `
# Setting Up Directus with Eleventy

In this stream, we explored how to set up Directus as a headless CMS for an Eleventy website.

## What We Covered

1. Installing and configuring Directus with Docker
2. Creating collections for blog posts, projects, and stream recaps
3. Connecting Eleventy to the Directus API
4. Implementing fallback data for when Directus is not available
5. Deploying the setup to production

## Key Takeaways

- Directus provides a flexible, database-first approach to content management
- Eleventy makes it easy to consume API data and generate static sites
- The combination provides a powerful, yet simple, development experience
        `,
        topics_covered: ['Directus', 'Eleventy', 'Headless CMS', 'Docker', 'API'],
        code_repository: 'https://github.com/alternadev/directus-eleventy-demo',
        resources: [
          {
            title: 'Directus Documentation',
            url: 'https://docs.directus.io/',
            description: 'Official documentation for Directus'
          },
          {
            title: 'Eleventy Documentation',
            url: 'https://www.11ty.dev/docs/',
            description: 'Official documentation for Eleventy'
          }
        ],
        duration_minutes: 90,
        featured: true
      })
    );
    console.log(`Stream recap created with ID: ${streamRecap.id}`);
    console.log('');
    
    console.log('Sample content created successfully!');
    console.log('');
    console.log('You can now view the content in the Directus admin interface:');
    console.log(`${directusUrl}`);
    
  } catch (error) {
    console.error('Error creating sample content:');
    console.error(error.message);
    console.error('');
    console.error('Possible solutions:');
    console.error('1. Make sure Directus is running (pnpm directus:start)');
    console.error('2. Check your .env file for correct credentials');
    console.error('3. Run the setup script (pnpm directus:setup)');
    process.exit(1);
  }
}

// Run the script
createSampleContent();
