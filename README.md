# AlternaDevStudio.com

This is the source code for the AlternaDevStudio.com website, built with Eleventy and Directus.

## Features

- Static site generation with Eleventy
- Content management with Directus headless CMS
- Blog posts, projects, and stream recaps
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- pnpm (v7 or later)
- Docker and Docker Compose (for Directus)

### Quick Start

The easiest way to get started is to run the setup script:

```bash
# Install dependencies and set up the development environment
pnpm setup
```

This script will:
1. Install dependencies
2. Set up Directus with Docker Compose
3. Create the required collections in Directus
4. Start the development server

### Manual Setup

If you prefer to set up the environment manually:

```bash
# Install dependencies
pnpm install

# Set up Directus
pnpm directus:setup

# Start the development server
pnpm start
```

## Directus Integration

This project uses Directus as a headless CMS to manage content. For detailed information about the Directus integration, see [README-directus.md](README-directus.md).

### Managing Content

Once the development environment is set up, you can access the Directus admin interface at:

- **URL**: http://localhost:8055
- **Default Admin Email**: admin@alternadevstudio.com
- **Default Admin Password**: admin123

### Available Scripts

```bash
# Set up Directus with all collections
pnpm directus:setup

# Start Directus (if it's not already running)
pnpm directus:start

# Stop Directus
pnpm directus:stop

# Test connection to Directus
pnpm directus:test

# Create sample content in Directus
pnpm directus:sample-content
```

For detailed information about testing the connection to Directus, see [test-directus-connection.md](test-directus-connection.md).

## Development

```bash
# Start the development server
pnpm start

# Build the site for production
pnpm build

# Clean the build directory
pnpm clean
```

## License

This project is licensed under the ISC License - see the LICENSE file for details.
