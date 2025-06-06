/**
 * Data file for projects
 */

export default function() {
  console.log('Projects data file loaded');
  
  return [
    {
      id: 1,
      title: 'AlternaDevStudio Website',
      slug: 'alternadevstudio-website',
      date_completed: new Date('2025-04-10T00:00:00Z'),
      short_description: 'A modern JAMstack website built with Eleventy and Directus.',
      technologies: ['Eleventy', 'Directus', 'JavaScript', 'Nunjucks', 'CSS'],
      github_url: 'https://github.com/alternadev/alternadevstudio.com',
      live_url: 'https://alternadevstudio.com',
      featured: true
    },
    {
      id: 2,
      title: 'Task Management API',
      slug: 'task-management-api',
      date_completed: new Date('2025-03-15T00:00:00Z'),
      short_description: 'A RESTful API for task management built with Node.js and Express.',
      technologies: ['Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'JWT', 'Swagger'],
      github_url: 'https://github.com/alternadev/task-api',
      live_url: 'https://api.tasks.alternadevstudio.com',
      featured: true
    }
  ];
}
