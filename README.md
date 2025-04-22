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
- GNU Make (for using the Makefile)

### Quick Start with Make

The easiest way to get started is to use the provided Makefile:

```bash
# Set up the complete development environment
make setup

# Start both Directus and the development server
make dev
```

This will:
1. Install dependencies
2. Set up Directus with Docker Compose
3. Create the required collections in Directus
4. Create sample content
5. Start both Directus and the development server

### Using the Makefile

The Makefile provides essential targets to simplify managing the development environment:

```bash
# Show available targets
make help

# Start both Directus and the development server
make dev

# Stop both Directus and the development server
make shutdown

# Reset the entire development environment
make reset

# Build the site for production
make build

# Clean the build directory
make clean

# Run all tests
make test
```

### Manual Setup (without Make)

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

- **URL**: The URL defined in DIRECTUS_URL (defaults to http://localhost:8055)
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

# Test connection to Directus (runs Jest tests)
pnpm test:directus

# Run all tests
pnpm test

# Create sample content in Directus
pnpm directus:sample-content

# Set up Minio for S3 storage with automated configuration
pnpm directus:minio-setup
```

#### Automated Minio Setup

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

For detailed information about testing the connection to Directus, see [test-directus-connection.md](test-directus-connection.md).

## Development

### Using Make

```bash
# Start both Directus and the development server
make dev

# Stop both Directus and the development server
make shutdown

# Reset the entire development environment
make reset

# Build the site for production
make build

# Run all tests
make test
```

### Using pnpm directly

```bash
# Start the development server in the background
pnpm start

# Start the development server with debug output in the background
pnpm debugstart

# Shut down the Eleventy server
pnpm eleventy:shutdown

# Build the site for production
pnpm build

# Clean the build directory
pnpm clean
```

> **Note**: The development server commands are configured to run in the background automatically. This allows you to continue using the terminal while the server is running. When you're done, use `make stop` or `pnpm eleventy:shutdown` to stop the server.

## Testing

This project uses Jest for testing. The tests are located in the `tests` directory.

### Using Make

```bash
# Run all tests
make test
```

### Using pnpm directly

```bash
# Run all tests
pnpm test

# Run tests in watch mode (tests will re-run when files change)
pnpm test:watch

# Run only Directus-related tests
pnpm test:directus
```

The testing framework includes:

- Tests for Directus connection using the SDK
- Tests for Directus collections and content

For more information about the testing framework, see [tests/README.md](tests/README.md).

## License

This project is licensed under the ISC License - see the LICENSE file for details.
