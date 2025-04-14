/**
 * Data file for projects
 * 
 * This file exports projects data fetched from Directus
 */

import { fetchProjects } from './utils/directus.js';

export default async function() {
  console.log('Projects data file loaded');
  
  // Fetch projects data
  const projects = await fetchProjects();
  
  // Log the projects data
  console.log('Projects array length:', projects.length);
  
  // Return the projects data
  return projects;
}
