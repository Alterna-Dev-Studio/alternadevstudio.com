# Alterna Dev Studio Website – Master To-Do Checklist (Expanded)

Below is a **detailed, actionable** checklist with micro-level tasks for each phase. Refer to the [Website Specification](#) for context. Each section is broken into multiple, smaller tasks to ensure thoroughness.

---

## 1. **Project Setup**

### 1.1 Initialize the Repository
- [x] Create a new GitHub repo or choose an existing one.
- [x] Clone repository locally.
- [x] Add `.gitignore` (ignore `node_modules`, `.DS_Store`, etc.).
- [x] Create `package.json`:
  - [ ] for package management, use pnpm
  - [x] Scripts: `"build": "eleventy"`, `"start": "eleventy --serve"`.
  - [x] Include dev dependencies: `@11ty/eleventy`.
  - [ ] Include dev dependencies: `nunjucks`.
- [ ] Run `pnpm install` to install dependencies.

### 1.2 Configure Eleventy with Nunjucks
- [ ] Create `eleventy.config.js` in root. (https://www.11ty.dev/docs/config/)
  - [ ] Use ESM instead of CommonJS for modules.
  - [ ] Set input folder to `src`, output folder to `_site`.
  - [ ] Configure `markdownTemplateEngine`, `htmlTemplateEngine`, and `dataTemplateEngine` to `njk`.
- [ ] Create `src` folder.
  - [ ] Add `index.njk` with a simple "Hello World" message.
- [ ] Test locally:
  - [ ] `pnpm build` (builds to `_site`).
  - [ ] `pnpm start` (serves `_site`).

### 1.3 GitHub Pages Deployment
- [x] Create `.github/workflows/deploy.yml`.
  - [x] Use Node setup.
  - [x] Run `pnpm install`, `pnpm build`.
  - [x] Deploy `_site` to `gh-pages` branch.
- [x] Enable GitHub Pages in repo settings.
- [x] Confirm site is published at `[username].github.io/[repo-name]` or custom domain.

---

## 2. **Directus CMS Integration**

### 2.1 Directus Setup
- [ ] Deploy or configure existing Directus instance.
- [ ] Create necessary collections:
  1. `blog_posts`
  2. `projects`
  3. `stream_recap`
- [ ] Define fields:
  - **blog_posts**: title (string), date (datetime), author (string), body (text/rich), tags (json or multiple select), image (file relationship optional)
  - **projects**: name (string), status (enum: 'launched', 'in development'), description (text), technologies (json or multiple select), problem_solved (text), outcomes_results (text), image (file optional)
  - **stream_recap**: title (string), date (datetime), youtube_link (string), description (text)

### 2.2 API Token
- [ ] Generate read-only or read/write token in Directus.
- [ ] Store token in `.env` (never commit `.env` to version control).

### 2.3 Fetch Data in 11ty
- [ ] Create `_data/directus.js`:
  - [ ] Read token from `.env`.
  - [ ] Fetch collections (`blog_posts`, `projects`, `stream_recap`).
  - [ ] Export an object: `{ blogPosts, projects, streamRecap }`.
- [ ] Implement error handling (try-catch, fallback to empty arrays).
- [ ] Test data fetching:
  - [ ] Possibly write a Jest test that mocks fetch calls.
  - [ ] Confirm returned data matches expected shapes.

---

## 3. **Global Layout & Navigation**

### 3.1 Base Layout
- [ ] Create `src/_includes/layouts/base.njk`:
  - [ ] HTML `<head>` with meta tags, link to CSS.
  - [ ] `<header>` for site title/logo.
  - [ ] `<nav>` with links to Home, About, Projects, Blog, Live Product Dev, Contact.
  - [ ] `<footer>` with social icons & Plausible script.

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
- [ ] Create `src/about.njk` that extends `base.njk`.
- [ ] Add inspirational copy about mission and how the studio works.

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
- [ ] If `isLive` = true, show “Watch Dev Live!” on all pages.
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

## Notes & Best Practices
- Use TDD or incremental testing for each feature.
- Keep commits atomic (one feature/fix per commit).
- Expand or refine tasks as needed.

**End of `todo.md`**

