# Technical Context

## Technology Stack

AlternaDevStudio.com uses a modern JAMstack architecture with the following core technologies:

### Frontend

- **Static Site Generator**: [11ty (Eleventy)](https://www.11ty.dev/) v3.0.0
- **Templating Engine**: [Nunjucks](https://mozilla.github.io/nunjucks/) v3.2.4
- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/) v4.1.4
- **CSS Processing**: [PostCSS](https://postcss.org/) v8.5.3 with [Autoprefixer](https://github.com/postcss/autoprefixer) v10.4.21

### Content Management

- **Headless CMS**: [Directus](https://directus.io/) v10.x
- **SDK**: @directus/sdk v13.0.2
- **Database**: PostgreSQL (via Docker)
- **File Storage**: Minio (S3-compatible)

### Development & Build Tools

- **Package Manager**: [pnpm](https://pnpm.io/) v10.8.0
- **Module System**: ES Modules (type: "module" in package.json)
- **Environment Variables**: dotenv v16.3.1
- **Cross-Environment Support**: cross-env v7.0.3

### Testing

- **Testing Framework**: [Jest](https://jestjs.io/) v29.7.0
- **Test Environment**: Node.js

### Deployment & Hosting

- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions
- **Analytics**: Plausible CE (Client-side script)

### External Integrations

- **Streaming**: Twitch (Live), YouTube (Archived)
- **Email Testing**: MailDev (for local development)

## Development Environment

### Local Setup

The project uses Docker Compose for local development of the Directus CMS:

```
├── util/
│   └── directus/
│       ├── docker-compose.yml    # Defines Directus, PostgreSQL, and Minio services
│       ├── setup-dev-environment.sh  # Sets up the development environment
│       └── ...
```

### Environment Variables

The project uses environment variables for configuration:

| Variable | Description | Default |
|----------|-------------|---------|
| `DIRECTUS_URL` | URL of the Directus instance | `http://localhost:8055` (configurable) |
| `DIRECTUS_EMAIL` | Admin email for Directus | `admin@example.com` |
| `DIRECTUS_PASSWORD` | Admin password for Directus | `change-me-please` |

### NPM Scripts

Key development scripts include:

```json
{
  "clean": "rm -rf _site && mkdir -p _site",
  "build": "pnpm exec eleventy",
  "start": "pnpm exec eleventy --serve --quiet",
  "test": "NODE_OPTIONS=--experimental-vm-modules pnpm exec jest --detectOpenHandles",
  "directus:setup": "cd util/directus && ./setup-dev-environment.sh",
  "directus:start": "cd util/directus && docker-compose up -d",
  "directus:stop": "cd util/directus && docker-compose down",
  "directus:clean": "cd util/directus && ./clean.sh"
}
```

## Project Structure

The project follows a standard 11ty structure with some additions for Directus integration:

```
├── src/                  # Source files
│   ├── _data/            # Data files for 11ty
│   │   ├── blog_posts.js # Fetches blog posts from Directus
│   │   ├── projects.js   # Fetches projects from Directus
│   │   ├── stream_recaps.js # Fetches stream recaps from Directus
│   │   └── utils/        # Utility functions
│   │       └── directus.js # Directus connection utilities
│   ├── _layouts/         # Layout templates
│   │   └── base.njk      # Base layout
│   ├── about.html        # About page
│   └── index.html        # Homepage
├── tests/                # Test files
│   ├── collections/      # Tests for Directus collections
│   │   ├── blog_posts.test.js
│   │   ├── projects.test.js
│   │   └── stream_recaps.test.js
│   └── utils/            # Test utilities
├── util/                 # Development tools
│   └── directus/         # Directus setup and configuration
├── _site/                # Generated site (not in version control)
├── .env.example          # Example environment variables
├── eleventy.config.js    # 11ty configuration
└── package.json          # Project dependencies and scripts
```

## Data Flow

The data flow in the application follows this pattern:

1. **Data Fetching**: At build time, 11ty executes the JavaScript files in `src/_data/`
2. **API Connection**: These files connect to Directus using the SDK
3. **Content Retrieval**: Content is fetched from Directus collections
4. **Fallback Mechanism**: If Directus is unavailable, sample data is used
5. **Template Rendering**: 11ty uses the data to render Nunjucks templates
6. **Static Generation**: HTML files are generated in the `_site/` directory

## Directus Collections

The CMS is configured with three main collections:

### Blog Posts (`blog_posts`)

Fields include:
- title (string)
- slug (string)
- date_published (datetime)
- author (string)
- featured_image (file, optional)
- excerpt (text)
- content (text/rich)
- tags (array)
- status (published/draft)

### Projects (`projects`)

Fields include:
- title (string)
- slug (string)
- date_completed (datetime)
- short_description (text)
- description (text/rich)
- technologies (array)
- github_url (string, optional)
- live_url (string, optional)
- featured_image (file, optional)
- gallery_images (files, optional)
- featured (boolean)
- sort_order (integer)
- status (published/draft)

### Stream Recaps (`stream_recaps`)

Fields include:
- title (string)
- slug (string)
- stream_date (datetime)
- thumbnail (file, optional)
- video_url (string)
- summary (text/rich)
- topics_covered (array)
- code_repository (string, optional)
- resources (json)
- duration_minutes (integer)
- featured (boolean)
- status (published/draft)

## Testing Infrastructure

The project uses Jest for testing with a focus on Directus integration:

- **Test Setup**: `tests/setup.js` runs before all tests
- **Test Teardown**: `tests/teardown.js` runs after all tests
- **Collection Tests**: Verify the existence and structure of Directus collections
- **Connection Tests**: Verify the connection to Directus

## Deployment Process

The site is deployed to GitHub Pages using GitHub Actions:

1. Code is pushed to the repository
2. GitHub Actions workflow is triggered
3. Dependencies are installed using pnpm
4. The site is built using 11ty
5. The built site is deployed to GitHub Pages

## Technical Constraints

- **Static Site**: No server-side rendering or dynamic content at runtime
- **API Dependency**: Content updates require rebuilding the site
- **Local Development**: Requires Docker for Directus
- **ES Modules**: Uses ES Modules, requiring Node.js 14+ for development
