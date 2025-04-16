# Directus Configuration

This directory contains configuration files and utility scripts for Directus integration with the AlternaDevStudio.com website.

## Configuration

The project is configured to interact with Directus as a headless CMS for content management.

## Prerequisites

- A running instance of Directus (self-hosted or cloud)
- Directus API URL and credentials

## Getting Started

1. **Generate secure keys** for your Directus instance:
   ```bash
   cd tools/directus
   ./generate-keys.sh
   ```
   This will generate random secure strings for the `KEY` and `SECRET` environment variables.

2. **Create an environment file**:
   ```bash
   cp example.env .env
   ```

3. **Edit the .env file** with your Directus settings:
   - Update the generated `KEY` and `SECRET` values
   - Set your admin credentials (`ADMIN_EMAIL` and `ADMIN_PASSWORD`)
   - Configure any other settings as needed

4. **Set up the collections**:
   ```bash
   pnpm directus:setup-collections
   ```

## Setup Scripts

The following utility scripts are provided:

### generate-keys.sh
Generates secure random keys for Directus authentication.

### setup-dev-environment.sh
Configures the environment variables and sets up collections in Directus.

### clean.sh
Removes environment files for a clean setup.

## Version Control

A `.gitignore` file template (`directus.gitignore`) is provided to ensure sensitive files are not committed to version control. To use it:

```bash
# If you're using this in a Git repository
cp directus.gitignore .gitignore
```

This will prevent the following from being committed:
- Environment variables (.env)
- Logs and temporary files

## Testing

Test scripts are provided to verify the connection to Directus:

- `test-connection.js`: Tests the connection to Directus
- `test-curl.sh`: Simple curl tests for Directus API endpoints

## Sample Content

The `create-sample-content.js` script can be used to populate Directus with sample content for development purposes:

```bash
pnpm directus:sample-content
```

## Collections

The project is configured with the following collections:

- **blog_posts**: Articles written by team members
- **projects**: Showcase of completed and in-progress work
- **stream_recap**: Summaries of live development streams

These collections are defined in the `src/directus/collections/` directory.

## Integration with the Website

The website uses the Directus SDK to fetch content from the CMS at build time. The connection is configured in `src/_data/utils/directus.js`.

For more information on using Directus, refer to the [official Directus documentation](https://docs.directus.io/).
