/**
 * Data file for projects
 * 
 * This file exports the projects data from the directus.js file
 */

import directusData from './utils/directus.js';

export default async function() {
  console.log('Projects data file loaded');
  
  // Get the data from directus.js
  const data = await directusData();
  
  // Log the projects data
  console.log('Projects data:', data.projects);
  console.log('Projects array length:', data.projects.length);
  
  // Return the projects data
  return data.projects;
}
