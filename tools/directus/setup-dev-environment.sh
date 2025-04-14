#!/bin/bash

# Script to set up a local development environment for Directus
# This script will:
# 1. Generate secure keys for Directus
# 2. Create a .env file if it doesn't exist
# 3. Launch Directus using docker-compose
# 4. Set up Minio for S3 storage
# 5. Create collections in Directus

# Set script to exit on error
set -e

# Change to the directus directory
cd "$(dirname "$0")"

echo "===== Setting up Directus Development Environment ====="
echo ""

# Step 1: Generate secure keys for Directus
echo "Generating secure keys for Directus..."
source ./generate-keys.sh
echo ""

# Step 2: Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from example.env..."
    cp example.env .env
    
    # Update the .env file with the generated keys
    sed -i "s/KEY=replace-with-random-key/KEY=$KEY/" .env
    sed -i "s/SECRET=replace-with-random-secret/SECRET=$SECRET/" .env
    
    # Set a default admin password for development
    sed -i "s/ADMIN_PASSWORD=change-me-please/ADMIN_PASSWORD=admin123/" .env
    sed -i "s/ADMIN_EMAIL=admin@example.com/ADMIN_EMAIL=admin@alternadevstudio.com/" .env
    
    echo "Environment file created with secure keys."
else
    echo ".env file already exists. Skipping creation."
fi
echo ""

# Step 3: Launch Directus using docker-compose
echo "Launching Directus using docker-compose..."
docker-compose down
docker-compose up -d
echo ""

# Wait for Directus to be ready
echo "Waiting for Directus to be ready..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:8055/server/health | grep -q "ok"; then
        echo "Directus is ready!"
        break
    fi
    attempt=$((attempt + 1))
    echo "Waiting for Directus to start... ($attempt/$max_attempts)"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "Directus failed to start within the expected time."
    echo "Please check the logs with: docker-compose logs directus"
    exit 1
fi
echo ""

# Step 4: Set up Minio for S3 storage (optional)
read -p "Do you want to set up Minio for S3 storage? (y/n): " setup_minio
if [ "$setup_minio" = "y" ] || [ "$setup_minio" = "Y" ]; then
    echo "Setting up Minio..."
    ./setup-minio.sh
    echo ""
fi

# Step 5: Create collections in Directus
echo "Setting up collections in Directus..."
echo "This will create the following collections:"
echo "- blog_posts"
echo "- projects"
echo "- stream_recap"
echo ""

# Get admin credentials from .env file
ADMIN_EMAIL=$(grep ADMIN_EMAIL .env | cut -d '=' -f2)
ADMIN_PASSWORD=$(grep ADMIN_PASSWORD .env | cut -d '=' -f2)

# Create a temporary directory for Node.js scripts
mkdir -p temp
cd temp

# Create package.json for the temporary Node.js project
cat > package.json << EOF
{
  "name": "directus-setup",
  "version": "1.0.0",
  "description": "Setup script for Directus collections",
  "type": "module",
  "main": "setup-collections.js",
  "scripts": {
    "setup": "node setup-collections.js"
  },
  "dependencies": {
    "@directus/sdk": "^13.0.2",
    "dotenv": "^16.3.1"
  }
}
EOF

# Create the setup-collections.js script
cat > setup-collections.js << EOF
import { createDirectus, rest, authentication, readItems, createCollection, createField } from '@directus/sdk';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from parent directory's .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
const envConfig = config({ path: envPath });

if (envConfig.error) {
  console.error('Error loading .env file:', envConfig.error);
  process.exit(1);
}

// Directus connection details
const directusUrl = 'http://localhost:8055';
const email = process.env.ADMIN_EMAIL || 'admin@alternadevstudio.com';
const password = process.env.ADMIN_PASSWORD || 'admin123';

// Initialize the Directus client
const client = createDirectus(directusUrl)
  .with(authentication())
  .with(rest());

async function setupCollections() {
  try {
    // Login to Directus
    console.log('Logging in to Directus...');
    await client.login(email, password);
    console.log('Login successful!');

    // Check if collections already exist
    const collections = await client.request(readItems('directus_collections'));
    const existingCollections = collections.map(collection => collection.collection);
    
    // Create blog_posts collection if it doesn't exist
    if (!existingCollections.includes('blog_posts')) {
      console.log('Creating blog_posts collection...');
      await client.request(
        createCollection({
          collection: 'blog_posts',
          meta: {
            icon: 'article',
            note: 'Blog posts for the website',
            display_template: '{{title}}',
            archive_field: 'status',
            archive_value: 'archived',
            unarchive_value: 'draft',
            singleton: false,
          },
          schema: {
            name: 'blog_posts',
          },
          fields: [
            {
              field: 'id',
              type: 'integer',
              meta: {
                hidden: true,
                readonly: true,
                interface: 'input',
                special: ['uuid'],
              },
              schema: {
                is_primary_key: true,
                has_auto_increment: true,
              },
            },
            {
              field: 'status',
              type: 'string',
              meta: {
                interface: 'select-dropdown',
                options: {
                  choices: [
                    { text: 'Published', value: 'published' },
                    { text: 'Draft', value: 'draft' },
                    { text: 'Archived', value: 'archived' },
                  ],
                },
                width: 'half',
                required: true,
              },
              schema: {
                default_value: 'draft',
              },
            },
            {
              field: 'title',
              type: 'string',
              meta: {
                interface: 'input',
                width: 'full',
                required: true,
              },
            },
            {
              field: 'slug',
              type: 'string',
              meta: {
                interface: 'input',
                width: 'full',
                note: 'URL-friendly version of the title',
                required: true,
              },
            },
            {
              field: 'date_published',
              type: 'timestamp',
              meta: {
                interface: 'datetime',
                width: 'half',
                display: 'datetime',
                required: true,
              },
            },
            {
              field: 'author',
              type: 'string',
              meta: {
                interface: 'input',
                width: 'half',
              },
            },
            {
              field: 'featured_image',
              type: 'uuid',
              meta: {
                interface: 'file-image',
                special: ['file'],
                width: 'full',
              },
            },
            {
              field: 'content',
              type: 'text',
              meta: {
                interface: 'input-rich-text-md',
                width: 'full',
                note: 'Main content of the blog post',
                required: true,
              },
            },
            {
              field: 'excerpt',
              type: 'text',
              meta: {
                interface: 'input-multiline',
                width: 'full',
                note: 'Short summary of the blog post',
              },
            },
            {
              field: 'tags',
              type: 'json',
              meta: {
                interface: 'tags',
                width: 'full',
                options: {
                  placeholder: 'Add a tag...',
                },
                special: ['cast-json'],
              },
            },
            {
              field: 'seo_title',
              type: 'string',
              meta: {
                interface: 'input',
                width: 'full',
                note: 'Title for SEO purposes (if different from main title)',
              },
            },
            {
              field: 'seo_description',
              type: 'text',
              meta: {
                interface: 'input-multiline',
                width: 'full',
                note: 'Description for SEO purposes',
              },
            },
          ],
        })
      );
      console.log('Blog posts collection created successfully!');
    } else {
      console.log('Blog posts collection already exists.');
    }

    // Create projects collection if it doesn't exist
    if (!existingCollections.includes('projects')) {
      console.log('Creating projects collection...');
      await client.request(
        createCollection({
          collection: 'projects',
          meta: {
            icon: 'code',
            note: 'Development projects showcase',
            display_template: '{{title}}',
            archive_field: 'status',
            archive_value: 'archived',
            unarchive_value: 'draft',
            singleton: false,
          },
          schema: {
            name: 'projects',
          },
          fields: [
            {
              field: 'id',
              type: 'integer',
              meta: {
                hidden: true,
                readonly: true,
                interface: 'input',
                special: ['uuid'],
              },
              schema: {
                is_primary_key: true,
                has_auto_increment: true,
              },
            },
            {
              field: 'status',
              type: 'string',
              meta: {
                interface: 'select-dropdown',
                options: {
                  choices: [
                    { text: 'Published', value: 'published' },
                    { text: 'Draft', value: 'draft' },
                    { text: 'Archived', value: 'archived' },
                  ],
                },
                width: 'half',
                required: true,
              },
              schema: {
                default_value: 'draft',
              },
            },
            {
              field: 'title',
              type: 'string',
              meta: {
                interface: 'input',
                width: 'full',
                required: true,
              },
            },
            {
              field: 'slug',
              type: 'string',
              meta: {
                interface: 'input',
                width: 'full',
                note: 'URL-friendly version of the title',
                required: true,
              },
            },
            {
              field: 'date_completed',
              type: 'timestamp',
              meta: {
                interface: 'datetime',
                width: 'half',
                display: 'datetime',
              },
            },
            {
              field: 'featured_image',
              type: 'uuid',
              meta: {
                interface: 'file-image',
                special: ['file'],
                width: 'full',
              },
            },
            {
              field: 'description',
              type: 'text',
              meta: {
                interface: 'input-rich-text-md',
                width: 'full',
                note: 'Detailed description of the project',
                required: true,
              },
            },
            {
              field: 'short_description',
              type: 'text',
              meta: {
                interface: 'input-multiline',
                width: 'full',
                note: 'Brief summary of the project',
              },
            },
            {
              field: 'technologies',
              type: 'json',
              meta: {
                interface: 'tags',
                width: 'full',
                options: {
                  placeholder: 'Add a technology...',
                },
                special: ['cast-json'],
              },
            },
            {
              field: 'github_url',
              type: 'string',
              meta: {
                interface: 'input',
                width: 'half',
                note: 'Link to GitHub repository',
              },
            },
            {
              field: 'live_url',
              type: 'string',
              meta: {
                interface: 'input',
                width: 'half',
                note: 'Link to live project',
              },
            },
            {
              field: 'featured',
              type: 'boolean',
              meta: {
                interface: 'boolean',
                width: 'half',
                note: 'Whether this project should be featured on the homepage',
              },
              schema: {
                default_value: false,
              },
            },
            {
              field: 'sort_order',
              type: 'integer',
              meta: {
                interface: 'input',
                width: 'half',
                note: 'Order in which to display the project (lower numbers first)',
              },
              schema: {
                default_value: 0,
              },
            },
            {
              field: 'gallery_images',
              type: 'json',
              meta: {
                interface: 'list',
                special: ['cast-json'],
                width: 'full',
                note: 'Additional images of the project',
                options: {
                  template: '{{image}}',
                  fields: [
                    {
                      field: 'image',
                      type: 'uuid',
                      meta: {
                        interface: 'file-image',
                        special: ['file'],
                        width: 'full',
                      },
                    },
                    {
                      field: 'caption',
                      type: 'string',
                      meta: {
                        interface: 'input',
                        width: 'full',
                      },
                    },
                  ],
                },
              },
            },
          ],
        })
      );
      console.log('Projects collection created successfully!');
    } else {
      console.log('Projects collection already exists.');
    }

    // Create stream_recap collection if it doesn't exist
    if (!existingCollections.includes('stream_recap')) {
      console.log('Creating stream_recap collection...');
      await client.request(
        createCollection({
          collection: 'stream_recap',
          meta: {
            icon: 'videocam',
            note: 'Recaps of streaming sessions',
            display_template: '{{title}}',
            archive_field: 'status',
            archive_value: 'archived',
            unarchive_value: 'draft',
            singleton: false,
          },
          schema: {
            name: 'stream_recap',
          },
          fields: [
            {
              field: 'id',
              type: 'integer',
              meta: {
                hidden: true,
                readonly: true,
                interface: 'input',
                special: ['uuid'],
              },
              schema: {
                is_primary_key: true,
                has_auto_increment: true,
              },
            },
            {
              field: 'status',
              type: 'string',
              meta: {
                interface: 'select-dropdown',
                options: {
                  choices: [
                    { text: 'Published', value: 'published' },
                    { text: 'Draft', value: 'draft' },
                    { text: 'Archived', value: 'archived' },
                  ],
                },
                width: 'half',
                required: true,
              },
              schema: {
                default_value: 'draft',
              },
            },
            {
              field: 'title',
              type: 'string',
              meta: {
                interface: 'input',
                width: 'full',
                required: true,
              },
            },
            {
              field: 'slug',
              type: 'string',
              meta: {
                interface: 'input',
                width: 'full',
                note: 'URL-friendly version of the title',
                required: true,
              },
            },
            {
              field: 'stream_date',
              type: 'timestamp',
              meta: {
                interface: 'datetime',
                width: 'half',
                display: 'datetime',
                required: true,
              },
            },
            {
              field: 'thumbnail',
              type: 'uuid',
              meta: {
                interface: 'file-image',
                special: ['file'],
                width: 'full',
              },
            },
            {
              field: 'video_url',
              type: 'string',
              meta: {
                interface: 'input',
                width: 'full',
                note: 'URL to the stream recording (YouTube, Twitch, etc.)',
              },
            },
            {
              field: 'summary',
              type: 'text',
              meta: {
                interface: 'input-rich-text-md',
                width: 'full',
                note: 'Summary of what was covered in the stream',
                required: true,
              },
            },
            {
              field: 'topics_covered',
              type: 'json',
              meta: {
                interface: 'tags',
                width: 'full',
                options: {
                  placeholder: 'Add a topic...',
                },
                special: ['cast-json'],
              },
            },
            {
              field: 'code_repository',
              type: 'string',
              meta: {
                interface: 'input',
                width: 'full',
                note: 'Link to the code repository used in the stream',
              },
            },
            {
              field: 'resources',
              type: 'json',
              meta: {
                interface: 'list',
                special: ['cast-json'],
                width: 'full',
                note: 'Additional resources mentioned in the stream',
                options: {
                  template: '{{title}}',
                  fields: [
                    {
                      field: 'title',
                      type: 'string',
                      meta: {
                        interface: 'input',
                        width: 'full',
                        required: true,
                      },
                    },
                    {
                      field: 'url',
                      type: 'string',
                      meta: {
                        interface: 'input',
                        width: 'full',
                        required: true,
                      },
                    },
                    {
                      field: 'description',
                      type: 'text',
                      meta: {
                        interface: 'input-multiline',
                        width: 'full',
                      },
                    },
                  ],
                },
              },
            },
            {
              field: 'duration_minutes',
              type: 'integer',
              meta: {
                interface: 'input',
                width: 'half',
                note: 'Duration of the stream in minutes',
              },
            },
            {
              field: 'featured',
              type: 'boolean',
              meta: {
                interface: 'boolean',
                width: 'half',
                note: 'Whether this stream recap should be featured on the homepage',
              },
              schema: {
                default_value: false,
              },
            },
          ],
        })
      );
      console.log('Stream recap collection created successfully!');
    } else {
      console.log('Stream recap collection already exists.');
    }

    console.log('All collections have been set up successfully!');
    
  } catch (error) {
    console.error('Error setting up collections:', error);
    process.exit(1);
  }
}

// Run the setup
setupCollections();
EOF

# Install dependencies and run the setup script
echo "Installing dependencies for collection setup..."
npm install
echo "Running collection setup script..."
node setup-collections.js

# Clean up temporary files
cd ..
rm -rf temp

echo ""
echo "===== Directus Development Environment Setup Complete ====="
echo ""
echo "Directus is running at: http://localhost:8055"
echo "Admin email: $ADMIN_EMAIL"
echo "Admin password: $ADMIN_PASSWORD"
echo ""
echo "The following collections have been created:"
echo "- blog_posts"
echo "- projects"
echo "- stream_recap"
echo ""
echo "You can now use these collections to manage content for your website."
