# Testing Framework for Directus

This directory contains a testing framework for Directus that can:

1. Launch Directus in the background using Docker Compose
2. Interact with Directus using the Directus SDK
3. Shut down Directus when tests are complete

## Structure

- `setup.js`: Global setup file that starts Directus before tests run
- `teardown.js`: Global teardown file that stops Directus after tests run
- `utils/directus.js`: Utility functions for interacting with Directus
- `directus-connection.test.js`: Test that verifies Directus is running and accessible using the SDK
- `directus-sdk.test.js`: Test that verifies Directus is running and accessible using the SDK with more detailed output (migrated from `tools/directus/test-connection.js`)
- `collections/blog_posts.test.js`: Test that verifies the blog_posts collection exists and has the required fields
- `collections/projects.test.js`: Test that verifies the projects collection exists and has the required fields
- `collections/stream_recap.test.js`: Test that verifies the stream_recap collection exists and has the required fields

## How to Use

### Running Tests

To run all tests:

```bash
pnpm test
```

To run tests in watch mode (tests will re-run when files change):

```bash
pnpm test:watch
```

To run only Directus-related tests:

```bash
pnpm test:directus
```

### Writing Tests

1. Create a new test file in the `tests` directory with a `.test.js` extension
2. Import the utility functions from `./utils/directus.js`
3. Use the utility functions to interact with Directus

Example:

```javascript
import { 
  createDirectusClient, 
  loginToDirectus, 
  getItems 
} from './utils/directus.js';

describe('My Test', () => {
  let client;
  
  beforeAll(async () => {
    // Create Directus client and login
    client = createDirectusClient();
    await loginToDirectus(client);
  });
  
  test('Can get blog posts', async () => {
    const blogPosts = await getItems(client, 'blog_posts', { limit: 10 });
    expect(Array.isArray(blogPosts)).toBe(true);
    // Add more assertions as needed
  });
});
```

## How It Works

1. When you run `pnpm test`, Jest will:
   - Execute the global setup file (`setup.js`) which starts Directus using Docker Compose
   - Run all test files
   - Execute the global teardown file (`teardown.js`) which stops Directus

2. The setup file:
   - Starts Directus using `docker-compose up -d`
   - Waits for Directus to be ready by polling the health endpoint
   - Sets a global variable to indicate Directus is running

3. The teardown file:
   - Stops Directus using `docker-compose down`
   - Resets the global variable

## Utility Functions

The `utils/directus.js` file provides several utility functions:

- `createDirectusClient()`: Creates a Directus client
- `loginToDirectus(client)`: Logs in to Directus
- `isDirectusAvailable()`: Checks if Directus is available
- `getItems(client, collection, query)`: Gets items from a collection
- `getDirectusConfig()`: Gets Directus connection details

## Environment Variables

The testing framework uses the following environment variables from your `.env` file:

- `DIRECTUS_URL`: The URL of your Directus instance (default: `http://localhost:8055`)
- `DIRECTUS_EMAIL`: The email address for the admin user (default: `admin@example.com`)
- `DIRECTUS_PASSWORD`: The password for the admin user (default: `change-me-please`)
