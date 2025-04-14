# Active Context

## Current Work Focus

The AlternaDevStudio.com website is currently in the early development phase. The project has completed the initial setup and is now focused on implementing the core pages and features as outlined in the specification.

### Current Focus Areas

1. **Directus CMS Integration**: The Directus headless CMS has been set up with the required collections (blog_posts, projects, stream_recap). The data fetching layer is implemented with fallback mechanisms for when Directus is unavailable.

2. **Basic Site Structure**: The basic site structure is in place with a minimal layout and initial pages (Home, About). The project is using 11ty with Nunjucks templating.

3. **Testing Infrastructure**: Jest tests have been set up to verify the Directus connection and collection structure.

## Recent Changes

### Completed

- ✅ Project initialization with 11ty and Nunjucks
- ✅ Directus configuration setup
- ✅ Creation of required collections in Directus
- ✅ Implementation of data fetching from Directus with fallback to sample data
- ✅ Basic layout and initial pages (Home, About)
- ✅ Testing infrastructure with Jest

### In Progress

- 🔄 Responsive styling (not yet implemented)
- 🔄 Projects page and project detail pages
- 🔄 Blog listing and individual blog post pages
- 🔄 Live Product Development page with streaming integration

## Next Steps

Based on the todo.md file, the following tasks are next in the pipeline:

1. **Implement responsive styling**: Set up either Tailwind or custom CSS for the site.
2. **Complete the global layout**: Ensure header and footer scale properly on mobile vs. desktop.
3. **Develop the Projects section**: Create the projects listing page and project detail pages.
4. **Implement the Blog section**: Create the blog listing page and individual blog post pages.
5. **Build the Live Product Development page**: Implement Twitch and YouTube integrations.
6. **Create the Contact page**: Implement the consultation request form.

## Active Decisions and Considerations

### Styling Approach

We have implemented Tailwind CSS for styling the site. The setup includes:

- Tailwind CSS v4.1.4 with PostCSS for processing
- Custom color palette defined in tailwind.config.js (primary, secondary, accent, highlight)
- CSS variables for custom colors in src/_assets/css/main.css
- Responsive design patterns using Tailwind's utility classes

The implementation follows a utility-first approach, with custom CSS added only when necessary. The custom color palette is based on the design style guidelines from the product context document.

### Content Rendering

The project currently uses Nunjucks for templating. For rich text content from Directus (like blog post content), a decision needs to be made on how to render Markdown or rich text.

### Streaming Integration

The specification calls for integration with Twitch and YouTube. A decision needs to be made on whether to use serverless functions, client-side JavaScript, or a hybrid approach for checking stream status.

## Important Patterns and Preferences

### Code Organization

- **ES Modules**: The project uses ES Modules (type: "module" in package.json)
- **Data Files**: Data fetching logic is isolated in dedicated files in `src/_data/`
- **Utility Functions**: Common functionality is extracted to utility files

### Error Handling

- **Fallback Data**: Sample data is provided when Directus is unavailable
- **Graceful Degradation**: The site should work even when external services are down

### Testing

- **Collection-Centered**: Tests are organized around Directus collections
- **Connection Testing**: Tests verify the connection to Directus

## Learnings and Project Insights

### Directus Integration

The integration with Directus has been successful, with a robust fallback mechanism for when Directus is unavailable. This approach allows for local development without requiring Directus to be running.

### 11ty Configuration

The 11ty configuration is working well, with Nunjucks as the templating engine. The project structure follows 11ty conventions with some additions for Directus integration.

### External CMS Integration

The project is configured to interact with an external Directus instance (self-hosted or cloud) rather than running Directus locally. This simplifies the development environment while still allowing for headless CMS capabilities.

## Current Challenges

1. **Responsive Design**: The site needs a responsive design approach that works well on all devices.
2. **Content Rendering**: A solution is needed for rendering rich text content from Directus.
3. **Streaming Integration**: The integration with Twitch and YouTube needs to be implemented.
4. **Form Handling**: The contact form needs to be implemented with validation and submission handling.
