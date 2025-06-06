/**
 * Data file for blog posts
 */

export default function() {
  console.log('Blog posts data file loaded');
  
  return [
    {
      id: 1,
      title: 'Getting Started with Eleventy',
      slug: 'getting-started-with-eleventy',
      date_published: new Date('2025-04-01T12:00:00Z'),
      author: 'AlternaDev',
      excerpt: 'Learn how to build static sites with Eleventy, a simpler static site generator.',
      content: 'Content for the first blog post'
    },
    {
      id: 2,
      title: 'Using Directus as a Headless CMS',
      slug: 'using-directus-as-headless-cms',
      date_published: new Date('2025-04-05T14:30:00Z'),
      author: 'AlternaDev',
      excerpt: 'Discover how to use Directus to manage content for your Jamstack website.',
      content: 'Content for the second blog post'
    }
  ];
}
