# Alterna Dev Studio Website – Master To-Do Checklist (Expanded)

Below is a **detailed, actionable** checklist with micro-level tasks for each phase. Refer to the [Website Specification](#) for context. Each section is broken into multiple, smaller tasks to ensure thoroughness.

---

## 1. **Project Setup**

### 1.1 Initialize the Repository
- [x] Create a new GitHub repo or choose an existing one.
- [x] Clone repository locally.
- [x] Add `.gitignore` (ignore `node_modules`, `.DS_Store`, etc.).
- [x] Create `package.json`:
- [x] for package management, use pnpm
  - [x] Scripts: `"build": "eleventy"`, `"start": "eleventy --serve"`.
  - [x] Include dev dependencies: `@11ty/eleventy`.
- [x] Include dev dependencies: `nunjucks`.
- [x] Run `pnpm install` to install dependencies.

### 1.2 Configure Eleventy with Nunjucks
- [x] Create `eleventy.config.js` in root. (https://www.11ty.dev/docs/config/)
  - [x] Use ESM instead of CommonJS for modules.
  - [x] Set input folder to `src`, output folder to `_site`.
  - [x] Configure `markdownTemplateEngine`, `htmlTemplateEngine`, and `dataTemplateEngine` to `njk`.
- [x] Create `src` folder.
  - [x] Add `index.njk` with a simple "Hello World" message.
- [x] Test locally:
  - [x] `pnpm build` (builds to `_site`).
  - [x] `pnpm start` (serves `_site`).

### 1.3 GitHub Pages Deployment
- [x] Create `.github/workflows/deploy.yml`.
  - [x] Use Node setup.
  - [x] Run `pnpm install`, `pnpm build`.
  - [x] Deploy `_site` to `gh-pages` branch.
- [x] Enable GitHub Pages in repo settings.
- [x] Confirm site is published at `[username].github.io/[repo-name]` or custom domain.

### 1.4 Development Workflow
- [x] Create streamlined Makefile with essential targets.
  - [x] Add targets for dev, shutdown, reset, build, clean, and test.
  - [x] Document usage in README.md.

---

## 2. **Directus CMS Integration**

### 2.1 Directus Setup
- [x] Deploy or configure existing Directus instance.
- [x] Create necessary collections:
  1. `blog_posts`
  2. `projects`
  3. `stream_recap`
- [x] Define fields for blog_posts:
  - [x] title (string)
  - [x] date (datetime)
  - [x] author (string)
  - [x] body (text/rich)
  - [x] tags (json or multiple select)
  - [x] image (file relationship optional)
- [x] Define fields for projects:
  - [x] name (string)
  - [x] status (enum: 'launched', 'in development')
  - [x] description (text)
  - [x] technologies (json or multiple select)
  - [x] problem_solved (text)
  - [x] outcomes_results (text)
  - [x] image (file optional)
- [x] Define fields for stream_recap:
  - [x] title (string)
  - [x] date (datetime)
  - [x] youtube_link (string)
  - [x] description (text)

### 2.2 API Token
- [x] Generate read-only or read/write token in Directus.
- [x] Store token in `.env` (never commit `.env` to version control).

### 2.3 Fetch Data in 11ty
- [x] Create `_data/directus.js`:
  - [x] Read token from `.env`.
  - [x] Fetch collections (`blog_posts`, `projects`, `stream_recap`).
  - [x] Export an object: `{ blogPosts, projects, streamRecap }`.
- [x] Implement error handling (try-catch, fallback to empty arrays).
- [x] Test data fetching:
  - [x] Implemented Jest tests for Directus connection and SDK.
  - [x] Confirm returned data matches expected shapes.

---

## 3. **Global Layout & Navigation**

### 3.1 Base Layout
- [x] Create `src/_layouts/base.njk`:
  - [x] HTML `<head>` with meta tags, link to CSS.
  - [x] `<header>` for site title/logo.
  - [x] `<nav>` with links to Home, About, Projects, Blog, Live Product Dev, Contact.
  - [x] `<footer>` with social icons & Plausible script.

### 3.2 Responsive Styling
- [ ] Either set up Tailwind or custom CSS.
- [ ] Confirm `<header>` and `<footer>` scale properly on mobile vs. desktop.
- [ ] Add basic resets or global styling if needed.

### 3.3 Test Layout
- [ ] Create test page (e.g., `layout-test.njk`) that extends `base.njk`.
- [ ] Verify nav links work.
- [ ] Check responsive design in browser dev tools.

---

## 4. **Home Page**

### 4.1 Content Structure
- [ ] Add `src/home.njk` or treat `index.njk` as the homepage.
- [ ] Sections:
  1. Mission statement
  2. Brief team intro
  3. Featured projects
  4. Optional hero for the latest stream

### 4.2 Featured Projects
- [ ] Fetch from Directus (`projects`).
- [ ] Show top 3–6 (or filter by a field, e.g., `featured = true`).
- [ ] Display name, short description, status, link to detail.

### 4.3 Conditional Hero (Latest Stream)
- [ ] Check if `stream_recap` has any entries.
  - [ ] If yes, show a hero banner with the newest recap.
  - [ ] If no, hide the hero.

### 4.4 Test
- [ ] Validate layout, data integrity.
- [ ] Confirm mobile responsiveness.

---

## 5. **About Page**

### 5.1 Nunjucks Template
- [x] Create `src/about.njk` that extends `base.njk`.
- [x] Add inspirational copy about mission and how the studio works.

### 5.2 Optional CMS Integration
- [ ] If you want dynamic content, create a Directus collection (e.g., `about_content`).
- [ ] Fetch and display it. Otherwise, keep it static.

### 5.3 Test & Polish
- [ ] Ensure styling matches brand.
- [ ] Check responsive design.

---

## 6. **Projects**

### 6.1 Projects Listing Page
- [ ] Create `src/projects.njk`.
- [ ] Loop over `projects` from `_data/directus.js`.
- [ ] Display a grid or list with minimal details.
- [ ] Link each item to a detail page.

### 6.2 Project Detail
- [ ] Use a dynamic route or manual approach with Eleventy collections.
- [ ] Fields: name, extended description, technologies, problem_solved, outcomes_results, images.
- [ ] Show a fallback if a field is empty.

### 6.3 Test
- [ ] Confirm each project is accessible at a nice URL (e.g., `/projects/project-name/`).
- [ ] Check mobile styling.

---

## 7. **Blog**

### 7.1 Blog Listing
- [ ] Create `src/blog.njk`.
- [ ] Loop over `blogPosts` from `_data/directus.js`.
- [ ] Show title, date, excerpt, tags.
- [ ] Provide pagination if desired.

### 7.2 Single Post
- [ ] Create a template for individual blog posts.
- [ ] Render full `body` field with Nunjucks.
- [ ] Show author, date, tags, images.

### 7.3 Tag/Category Filters (Optional)
- [ ] If implementing tag pages, generate them with Eleventy collections.
- [ ] Test logic for filtering.

### 7.4 Test & QA
- [ ] Check that blog posts appear in order.
- [ ] Validate formatting of body content.

---

## 8. **Live Product Development**

### 8.1 Page Setup
- [ ] Create `src/live-product-dev.njk`.
- [ ] Add embed for Twitch.
  - [ ] Show embed if live, fallback link if offline.
- [ ] Embed latest YouTube VOD.
  - [ ] Link to full YouTube channel.

### 8.2 Floating CTA
- [ ] Global check if stream is live (via serverless or polling an API) and set a flag.
- [ ] If `isLive` = true, show "Watch Dev Live!" on all pages.
  - [ ] Button opens Twitch in new tab.

### 8.3 Stream Recap Entries
- [ ] Fetch from `stream_recap`.
- [ ] List them on the page.
- [ ] Alternatively, embed them if you have links.

### 8.4 Home Page Hero Integration
- [ ] If a recap exists, show it on homepage.
- [ ] Hide if none exist.

### 8.5 Test & QA
- [ ] Manually toggle a live/offline scenario.
- [ ] Confirm CTA appears.
- [ ] Confirm embed works.

---

## 9. **Contact Page**

### 9.1 Basic Form
- [ ] Create `src/contact.njk`.
- [ ] Fields: name, email, phone, company, project description.

### 9.2 Form Handling
- [ ] For this scope, show a confirmation message on form submit.
- [ ] No advanced back-end integration.
- [ ] Add basic client-side validation.

### 9.3 Test
- [ ] Ensure all fields are captured.
- [ ] Confirm success/fail states.

---

## 10. **Analytics (Plausible CE)**

### 10.1 Script Integration
- [ ] Insert `<script>` snippet in `base.njk` or a dedicated partial.
- [ ] Reference your site domain in the script.

### 10.2 Verification
- [ ] Deploy to GH Pages.
- [ ] Visit site, confirm hits appear in Plausible dashboard.

---

## 11. **Final Integration & Launch**

### 11.1 Cross-Page Linking
- [ ] Verify nav links all point to correct pages.
- [ ] Link from homepage to About, Projects, Blog, Contact, etc.

### 11.2 Responsive & Cross-Browser Testing
- [ ] Check Chrome, Firefox, Safari, Edge.
- [ ] Use responsive dev tools to test phone/tablet breakpoints.

### 11.3 Polish & Bug Fixes
- [ ] Fix any layout quirks.
- [ ] Ensure brand consistency (colors, typography).

### 11.4 Go Live
- [ ] Confirm GH Pages domain.
- [ ] If using a custom domain, set DNS + CNAME.
- [ ] Announce launch.

---

## 12. **Testing Infrastructure**

### 12.1 Jest Setup
- [x] Configure Jest for testing.
- [x] Create test setup and teardown scripts.
- [x] Implement utility functions for testing.

### 12.2 Directus Testing
- [x] Migrate shell script tests to Jest.
- [x] Create SDK-based tests for Directus connection.
- [x] Test collection existence and accessibility.
- [x] Implement error handling in tests.
- [x] Test field existence for each collection:
  - [x] Test blog_posts fields (title, date, author, body, tags, image)
  - [x] Test projects fields (name, status, description, technologies, problem_solved, outcomes_results, image)
  - [x] Test stream_recap fields (title, date, youtube_link, description)
- [x] Reorganize tests to be centered around each collection

### 12.3 Future Test Improvements
- [ ] Add tests for data fetching in Eleventy.
- [ ] Implement component testing for UI elements.
- [ ] Add end-to-end tests for critical user flows.

## 13. **Accessibility Implementation**

### 13.1 WCAG Compliance
- [ ] Audit site for WCAG 2.1 AA compliance
- [ ] Implement proper semantic HTML throughout all templates
- [ ] Ensure sufficient color contrast ratios for all text and UI elements
- [ ] Add appropriate ARIA attributes where necessary
- [ ] Implement keyboard navigation support
- [ ] Ensure all form inputs have proper labels and error states
- [ ] Add skip navigation links for keyboard users
- [ ] Test with screen readers (NVDA, VoiceOver)
- [ ] Implement dyslexia-friendly typography and layouts
  - [ ] Research best practices for dyslexia-friendly text (font choice, spacing, alignment)
  - [ ] Create alternative stylesheet option with dyslexia-friendly settings
  - [ ] Test with users who have dyslexia if possible
- [ ] Ensure color schemes are accessible to people with color blindness
  - [ ] Test site with color blindness simulators (protanopia, deuteranopia, tritanopia)
  - [ ] Avoid relying on color alone to convey information
  - [ ] Add patterns or icons to differentiate where color alone isn't sufficient

### 13.2 Eleventy Accessibility Plugin
- [ ] Research and implement an Eleventy accessibility plugin
- [ ] Configure plugin to check for common accessibility issues
- [ ] Set up automated accessibility testing in the build process
- [ ] Document accessibility standards and practices in project README

## 14. **Refactoring and Optimization**

### 14.1 Script Consolidation
- [x] Incorporate Minio setup directly into the calling scripts.
- [x] Remove unnecessary configuration options from Minio setup.
- [x] Eliminate separate Minio setup scripts.
- [x] Use environment variables for Minio configuration if available.
- [x] Add Minio configuration values to example environment files.
- [x] Consolidate environment variables to use Minio server variables as fallbacks.
- [x] Make environment file names consistent (.env.example).
- [x] Remove redundant code that updates .env files with Minio configuration.
- [x] Refactor Minio bucket setup into a separate reusable module.
- [x] Replace Minio Client (mc) with direct API calls using curl.

## Notes & Best Practices
- Use TDD or incremental testing for each feature.
- Keep commits atomic (one feature/fix per commit).
- Expand or refine tasks as needed.
