# Directus Integration for AlternaDevStudio.com

This document explains how to set up and use Directus as a headless CMS for local development of the AlternaDevStudio.com website.

## Overview

The website uses Directus as a headless CMS to manage content for:
- Blog posts
- Projects
- Stream recaps

The setup includes:
- Directus with PostgreSQL database
- Minio for S3-compatible file storage
- MailDev for email testing

## Prerequisites

- Docker and Docker Compose installed on your system
- Node.js and pnpm installed for running the website

## Quick Start

To set up the complete development environment:

```bash
# Set up Directus with all collections
pnpm directus:setup
```

This script will:
1. Generate secure keys for Directus
2. Create a `.env` file if it doesn't exist
3. Launch Directus using Docker Compose
4. Optionally set up Minio for S3 storage
5. Create the required collections in Directus

## Managing Directus

The following npm scripts are available for managing Directus:

```bash
# Set up Directus with all collections
pnpm directus:setup

# Start Directus (if it's not already running)
pnpm directus:start

# Stop Directus
pnpm directus:stop

# Clean up Directus (stop containers and remove volumes)
pnpm directus:clean

# Test connection to Directus
pnpm directus:test

# Create sample content in Directus
pnpm directus:sample-content

# Set up Minio for S3 storage with automated configuration
pnpm directus:minio-setup
```

### Automated Minio Setup

The `directus:minio-setup` script allows you to configure Minio for S3 storage without interactive prompts. You can pass options to customize the configuration:

```bash
# Use default configuration
pnpm directus:minio-setup

# Specify a custom bucket name
pnpm directus:minio-setup -- --bucket my-custom-bucket

# Specify custom credentials
pnpm directus:minio-setup -- --access-key mykey --secret-key mysecret

# Test mode - print configuration without executing
pnpm directus:minio-setup-test

# See all available options
pnpm directus:minio-setup -- --help
```

You can also use environment variables to configure Minio:

```bash
MINIO_BUCKET_NAME=my-bucket MINIO_SET_PUBLIC=n pnpm directus:minio-setup
```

The test mode option (`--test` or `-t`) is particularly useful for verifying your configuration without actually making any changes. This can be helpful when automating the setup process or when you want to ensure your configuration is correct before proceeding.

During the setup process with `pnpm directus:setup` or `pnpm setup`, you'll also be given the option to set up Minio with automated configuration, which will prompt you for the configuration values but will not require interactive prompts during the actual Minio setup. You'll also be asked if you want to run in test mode, which will show you the configuration without making any changes.

### Testing the Connection

The test script will check:
- If Directus is running
- If you can log in with your credentials
- If the required collections exist
- How many items are in each collection

For detailed information about testing the connection, see [test-directus-connection.md](test-directus-connection.md).

### Creating Sample Content

The sample content script will create:
- A sample blog post about Directus and Eleventy
- A sample project for the AlternaDevStudio website
- A sample stream recap about setting up Directus with Eleventy

This is useful for testing the integration between Directus and Eleventy without having to manually create content.

## Accessing Directus

Once Directus is running, you can access it at:
- **URL**: http://localhost:8055
- **Default Admin Email**: admin@alternadevstudio.com
- **Default Admin Password**: admin123

## Available Collections

The setup script creates the following collections:

### Blog Posts (`blog_posts`)
Fields include:
- Title
- Slug
- Date published
- Author
- Featured image
- Content (Markdown)
- Excerpt
- Tags
- SEO metadata

### Projects (`projects`)
Fields include:
- Title
- Slug
- Date completed
- Featured image
- Description (Markdown)
- Short description
- Technologies used
- GitHub URL
- Live URL
- Featured flag
- Sort order
- Gallery images

### Stream Recaps (`stream_recap`)
Fields include:
- Title
- Slug
- Stream date
- Thumbnail
- Video URL
- Summary (Markdown)
- Topics covered
- Code repository link
- Additional resources
- Duration
- Featured flag

## Environment Variables

The project uses environment variables to configure the connection to Directus. Copy the `.env.example` file to `.env` in the project root and modify as needed:

```bash
# Copy the example environment file
cp .env.example .env
```

Available environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DIRECTUS_URL` | URL of the Directus instance | `http://localhost:8055` |
| `DIRECTUS_EMAIL` | Admin email for Directus | `admin@alternadevstudio.com` |
| `DIRECTUS_PASSWORD` | Admin password for Directus | `admin123` |
| `SITE_URL` | URL of the website | `http://localhost:8080` |
| `SITE_TITLE` | Title of the website | `AlternaDevStudio` |
| `SITE_DESCRIPTION` | Description of the website | `Web development, streaming, and open source projects` |

## Connecting to the API

The project includes utility functions to connect to Directus. These functions handle authentication, error handling, and fallback to sample data when Directus is not available.

Example data files are provided in the `src/_data` directory:

- `blog_posts.js` - Fetches blog posts from Directus
- `projects.js` - Fetches projects from Directus
- `stream_recaps.js` - Fetches stream recaps from Directus

These files use the utility functions in `src/_data/utils/directus.js` to connect to Directus and fetch data.

Here's a basic example of how to fetch data from Directus in your Eleventy data files:

```javascript
// src/_data/blog_posts.js
import { readItems } from '@directus/sdk';
import { createDirectusClient, loginToDirectus, isDirectusAvailable } from './utils/directus.js';

export default async function() {
  // Check if Directus is running
  const directusAvailable = await isDirectusAvailable();
  if (!directusAvailable) {
    console.warn('Directus is not available. Using sample data for blog posts.');
    return getSampleBlogPosts();
  }
  
  // Initialize Directus client
  const client = createDirectusClient();
  
  try {
    // Login to Directus
    const loginSuccess = await loginToDirectus(client);
    if (!loginSuccess) {
      console.warn('Failed to login to Directus. Using sample data for blog posts.');
      return getSampleBlogPosts();
    }
    
    // Fetch blog posts from Directus
    console.log('Fetching blog posts from Directus...');
    
    const posts = await client.request(
      readItems('blog_posts', {
        filter: {
          status: {
            _eq: 'published'
          }
        },
        sort: ['-date_published'],
        fields: [
          'id',
          'title',
          'slug',
          'date_published',
          'author',
          'featured_image',
          'excerpt',
          'content',
          'tags'
        ]
      })
    );
    
    console.log(`Successfully fetched ${posts.length} blog posts from Directus`);
    return posts;
  } catch (error) {
    console.warn('Could not connect to Directus. Using sample data instead.');
    console.error('Error details:', error.message);
    return getSampleBlogPosts();
  }
}

// Sample data function
function getSampleBlogPosts() {
  return [
    {
      id: 1,
      title: 'Sample Blog Post',
      // ... other fields
    }
  ];
}
```

## Advanced Configuration

For more advanced configuration options, refer to:
- [Directus Documentation](https://docs.directus.io/)
- The configuration files in the `tools/directus` directory

## Backup and Restore

To backup or restore your Directus database:

```bash
# Create a backup
cd tools/directus
./backup-database.sh

# Restore from a backup
cd tools/directus
./restore-database.sh
```

## Troubleshooting

If you encounter issues with the Directus setup:

1. Check the Docker logs:
   ```bash
   cd tools/directus
   docker-compose logs directus
   ```

2. Ensure all services are running:
   ```bash
   cd tools/directus
   docker-compose ps
   ```

3. Try restarting the services:
   ```bash
   cd tools/directus
   docker-compose restart
   ```

4. If all else fails, you can reset the environment:
   ```bash
   # Option 1: Using the clean script (recommended)
   pnpm directus:clean
   pnpm directus:setup
   
   # Option 2: Manual reset
   cd tools/directus
   docker-compose down -v
   pnpm directus:setup
   ```
   Note: This will delete all data in your Directus instance.
