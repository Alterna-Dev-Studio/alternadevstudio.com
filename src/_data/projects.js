/**
 * Data file for fetching projects from Directus
 * 
 * This file demonstrates how to connect to the Directus API
 * and fetch projects for use in Eleventy templates.
 */

import { readItems } from '@directus/sdk';
import { createDirectusClient, loginToDirectus, isDirectusAvailable } from './utils/directus.js';

/**
 * Get sample projects data
 * This is used when Directus is not available
 * @returns {Array} Array of sample projects
 */
export function getSampleProjects() {
  return [
    {
      id: 1,
      title: 'AlternaDevStudio Website',
      slug: 'alternadevstudio-website',
      date_completed: new Date('2025-04-10T00:00:00Z'),
      short_description: 'A modern JAMstack website built with Eleventy and Directus.',
      description: `
# AlternaDevStudio Website

This website showcases my work as a developer and provides a platform for sharing knowledge through blog posts and stream recaps.

## Technical Details

Built with:
- Eleventy for static site generation
- Directus as a headless CMS
- Nunjucks for templating
- CSS custom properties for theming
- Deployed on Netlify

## Features

- Responsive design
- Blog with markdown support
- Project showcase
- Stream recaps
- Dark/light mode toggle
      `,
      technologies: ['Eleventy', 'Directus', 'JavaScript', 'Nunjucks', 'CSS'],
      github_url: 'https://github.com/alternadev/alternadevstudio.com',
      live_url: 'https://alternadevstudio.com',
      featured: true,
      sort_order: 1
    },
    {
      id: 2,
      title: 'Task Management API',
      slug: 'task-management-api',
      date_completed: new Date('2025-03-15T00:00:00Z'),
      short_description: 'A RESTful API for task management built with Node.js and Express.',
      description: `
# Task Management API

A robust RESTful API for managing tasks and projects, built with Node.js and Express.

## Features

- User authentication with JWT
- Task CRUD operations
- Project management
- Task assignments
- Due date tracking
- Priority levels
- Tagging system

## Technical Implementation

- Node.js and Express for the API
- PostgreSQL for data storage
- Sequelize ORM for database interactions
- JWT for authentication
- Jest for testing
- Swagger for API documentation
      `,
      technologies: ['Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'JWT', 'Swagger'],
      github_url: 'https://github.com/alternadev/task-api',
      live_url: 'https://api.tasks.alternadevstudio.com',
      featured: true,
      sort_order: 2
    }
  ];
}

export default async function() {
  // Check if Directus is running
  const directusAvailable = await isDirectusAvailable();
  if (!directusAvailable) {
    console.warn('Directus is not available. Using sample data for projects.');
    return getSampleProjects();
  }
  
  // Initialize Directus client
  const client = createDirectusClient();
  
  try {
    // Login to Directus
    const loginSuccess = await loginToDirectus(client);
    if (!loginSuccess) {
      console.warn('Failed to login to Directus. Using sample data for projects.');
      return getSampleProjects();
    }
    
    // Fetch projects from Directus
    console.log('Fetching projects from Directus...');
    
    const projects = await client.request(
      readItems('projects', {
        filter: {
          status: {
            _eq: 'published'
          }
        },
        sort: ['sort_order', '-date_completed'],
        fields: [
          'id',
          'title',
          'slug',
          'date_completed',
          'featured_image',
          'short_description',
          'description',
          'technologies',
          'github_url',
          'live_url',
          'featured',
          'sort_order',
          'gallery_images'
        ]
      })
    );
    
    console.log(`Successfully fetched ${projects.length} projects from Directus`);
    return projects;
  } catch (error) {
    // If Directus is not running or there's an error, return sample data
    console.warn('Could not connect to Directus. Using sample data instead.');
    console.error('Error details:', error.message);
    
    return getSampleProjects();
  }
}
