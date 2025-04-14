Below is an updated plan explicitly referencing **Nunjucks** for templating within 11ty. We’ll show how to integrate Nunjucks in each step, ensuring you have a smooth development workflow. The following sections describe:

1. **Detailed, Step-by-Step Blueprint** (High-Level)  
2. **Iterative Breakdown** (Phases & Micro-Steps)  
3. **Microscopic TDD Chunks** (With example prompts for a code-generation LLM)  

---

## 1. Detailed, Step-by-Step Blueprint (Nunjucks Included)

### A. Initial Project Setup
1. **Initialize Repository**  
   - Create a new GitHub repo (if not done already).  
   - Clone locally, set up a basic file structure.

2. **Configure 11ty with Nunjucks**  
   - Install 11ty and Nunjucks:  
     ```bash
     pnpm install nunjucks
     ```  
   - Create a minimal `eleventy.config.js` config, using ESM and specifying Nunjucks as the default template engine for pages and data files if desired.

3. **Basic “Hello World”**  
   - Create a `src` directory (or `_pages`, whichever you prefer).  
   - Add an `index.njk` with a simple “Hello World” message.  
   - Test build locally.

4. **Directus Setup**  
   - Deploy/configure Directus.  
   - Create collections (`blog_posts`, `projects`, `stream_recap`) with appropriate fields.  
   - Generate read-only API token.

5. **Fetch Data in 11ty**  
   - Create a `_data` folder.  
   - Write a `.js` file (e.g., `directus.js`) that fetches data from Directus and returns it for use in Nunjucks templates.  
   - Test by iterating over data in a sample template.

6. **Global Layout & Navigation**  
   - Create a `layouts` folder (e.g., `src/_includes/layouts`), add a `base.njk` for shared header, footer, and `<main>` structure.  
   - Add site-wide nav (Home, About, Projects, Blog, Live Product Dev, Contact).  
   - Include social links in the footer, plus the Plausible script.

7. **Pages**  
   - **Home**: mission statement, team intro, featured projects, optional hero for latest stream VOD if available.  
   - **About**: mission-driven text, how you work.  
   - **Projects**: listing of projects, then detail pages for each.  
   - **Blog**: listing page for posts, single post template.  
   - **Live Product Development**: Twitch embed/fallback, YouTube VOD, floating “Watch Dev Live!” CTA.  
   - **Contact**: form for name/email/phone/company/description, with a confirmation message on submit.

8. **Styling & Responsiveness**  
   - Implement styling (e.g., Tailwind) or custom CSS.  
   - Ensure Nunjucks templates reference the correct CSS.

9. **Deploy**  
   - Configure GitHub Pages with a GitHub Actions workflow.  
   - Confirm successful builds and hosting.

10. **Testing**  
   - TDD each chunk if possible (especially data fetching, form submission, etc.).  
   - Manual QA for cross-browser, responsive design, correctness of Nunjucks template rendering.

---

## 2. Iterative Breakdown (Phases & Micro-Steps)

### **Phase 1: Core Setup**
1. **Initialize Project**  
   - `git init`, `.gitignore`, `package.json`.
2. **Install 11ty & Nunjucks**  
   - `pnpm install @11ty/eleventy nunjucks`.
3. **Hello World Page**  
   - `index.njk` in `src` or `pages`.
4. **GitHub Actions & Pages**  
   - Configure CI/CD.

### **Phase 2: Directus Integration**
1. **Create Collections in Directus**  
2. **Generate API Token**  
3. **Fetch Data in 11ty**  
   - `_data/directus.js`.
4. **Template Test**  
   - Test iteration in a small `test.njk`.

### **Phase 3: Global Layout & Navigation**
1. **`base.njk`** Layout  
2. **Navigation (Home, About, Projects, Blog, Live PD, Contact)**  
3. **Footer** (social icons, Plausible)  
4. **Responsive CSS**  
5. **Test**

### **Phase 4: Homepage**
1. **Mission Statement / Team Intro**  
2. **Featured Projects** (fetched from Directus)  
3. **Optional Hero for Latest Stream**  
4. **Test & QA**

### **Phase 5: About**
1. **Static or CMS-driven**?  
   - Possibly `about.njk` with direct content.  
2. **Inspirational Copy**  
3. **Test & QA**

### **Phase 6: Projects**
1. **Projects List** (loop over Directus data in `projects.njk`)  
2. **Project Details** (`project-detail.njk`)  
3. **Data Fields** (description, images, etc.)  
4. **Test & QA**

### **Phase 7: Blog**
1. **Blog Listing** (`blog.njk`)  
2. **Single Post Template** (`post.njk`)  
3. **Tags/Categories**  
4. **Test & QA**

### **Phase 8: Live Product Development**
1. **Twitch Embed** (server-side check or fallback)  
2. **YouTube VOD Embed**  
3. **Floating CTA**  
4. **Stream Recap** entries in Directus  
5. **Test & QA**

### **Phase 9: Contact**
1. **Nunjucks Form Template**  
2. **Client-side Validation** (optional)  
3. **Submit Action** (email or success message)  
4. **Test & QA**

### **Phase 10: Final Integration & Polish**
1. **Cross-Page Linking**  
2. **Responsive & Browser Testing**  
3. **Bug Fixes**  
4. **Launch**

---

## 3. Microscopic TDD Chunks & Example Prompts

Below are example prompts to feed into a **code-generation LLM** in iterative fashion. Each prompt references and builds upon previous code, ensuring no orphaned logic. We’ll place them in separate code blocks:

### **Prompt Set 1: Phase 1 - Core Setup**

<details>
<summary>Prompt 1</summary>

```markdown
**Phase 1 - Step 1: Initialize Project**

You are a code-generation LLM. I have an empty GitHub repository for an Eleventy + Nunjucks project. Please generate:
1. A minimal `package.json` that includes "@11ty/eleventy" and "nunjucks" as dev dependencies.
2. A `.gitignore` for Node development (ignore node_modules, .DS_Store, etc.).

Include recommended scripts in `package.json`:
- "build": "eleventy"
- "start": "eleventy --serve"
```
</details>

<details>
<summary>Prompt 2</summary>

```markdown
**Phase 1 - Step 2: Eleventy Config & Hello World**

Create:
1. A minimal `.eleventy.js` config that sets:
   - Input directory: "src"
   - Output directory: "_site"
   - `markdownTemplateEngine` and `htmlTemplateEngine` set to "njk" for Nunjucks
2. A folder named `src` with an `index.njk` that prints "Hello World" in an HTML wrapper (e.g., `<h1>`).
3. Provide the final code for each file. Confirm we can run "pnpm run build" and "pnpm run start".
```
</details>

<details>
<summary>Prompt 3</summary>

```markdown
**Phase 1 - Step 3: GitHub Actions & GitHub Pages**

Now write a GitHub Actions YAML config (`.github/workflows/deploy.yml`) that:
- Checks out code
- Installs dependencies
- Builds with `pnpm run build`
- Deploys `_site` to the `gh-pages` branch

Finally, explain how to enable GitHub Pages from the repo settings to serve from `gh-pages`.
```
</details>

### **Prompt Set 2: Phase 2 - Directus Integration**

<details>
<summary>Prompt 1</summary>

```markdown
**Phase 2 - Step 1: Create Collections in Directus**

I have a Directus instance at `https://directus.example.com`. Provide a migration script (or instructions) that creates these collections:

- blog_posts
  - title (string)
  - date (datetime)
  - author (string)
  - body (text/rich)
  - tags (json or multiple select)
  - image (file relationship optional)

- projects
  - name (string)
  - status (enum: 'launched', 'in development')
  - description (text)
  - technologies (json or multiple select)
  - problem_solved (text)
  - outcomes_results (text)
  - image (file relationship optional)

- stream_recap
  - title (string)
  - date (datetime)
  - youtube_link (string)
  - description (text)

Provide a Node script using the Directus JS client or a set of REST calls with cURL. Then show how to run it.
```
</details>

<details>
<summary>Prompt 2</summary>

```markdown
**Phase 2 - Step 2: Generate API Token**

Demonstrate how to generate a read-only API token in Directus. Provide either a code snippet using Directus JS or an example cURL command. I will store this token in a `.env` file (ignored by git). Show me how to do so without exposing secrets in the codebase.
```
</details>

<details>
<summary>Prompt 3</summary>

```markdown
**Phase 2 - Step 3: Eleventy Data Fetch (Nunjucks)**

Create a file `_data/directus.js` in the Eleventy project. It should:

1. Read the API token from `.env`.
2. Fetch each collection (blog_posts, projects, stream_recap) from Directus.
3. Return an object like `{ blogPosts: [...], projects: [...], streamRecap: [...] }`.
4. Handle errors gracefully (log a message, return empty arrays if fetch fails).

Write a simple test with Jest or another framework to mock the fetch calls and ensure we receive arrays of objects. Provide the test file code as well.
```
</details>

### **Prompt Set 3: Phase 3 - Global Layout & Navigation**  
...and so on, continuing for each phase (Homepage, About, Projects, Blog, Live PD, Contact, etc.), always referencing the code from earlier steps, ensuring incremental development with Nunjucks templates.

---

## Conclusion

By following this plan:

1. You have a **high-level blueprint** outlining all features and structure.
2. It’s **iteratively broken down** into small, manageable tasks (Phases & Micro-Steps).
3. You have **code-generation prompts** carefully scoped so that each step produces testable, fully integrated code.  
4. **Nunjucks** is established as the template engine throughout the entire flow.

This approach ensures no big jumps in complexity, no orphaned code, and a straightforward path to **test-driven** Eleventy + Nunjucks + Directus development.
