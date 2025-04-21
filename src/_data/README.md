# Stream Pages Generation

## Issue Solved

This directory contains a custom data file (`stream_pages.js`) that was added to resolve a permalink conflict between the main streams listing page and individual stream pages.

## Problem

Previously, both the aggregate stream listing (`/streams/index.html`) and the individual stream pages (via pagination in `streams/stream_recap.njk`) were attempting to write to the same location, causing a build error with duplicate outputs:

```
Output conflict: multiple input files are writing to `./_site/streams/index.html`. Use distinct `permalink` values to resolve this conflict.
```

## Solution

1. Removed the problematic `src/streams/stream_recap.njk` template as it was causing conflicts
2. Created a programmatic approach for generating stream pages:
   - Added `stream_pages.js` to generate pages with proper slugs
   - Created `stream_page.njk` template to render those pages
   - Ensured unique permalinks for all pages

Now the site has:
- Main stream listing at `/streams/`
- Individual stream pages at `/streams/[slug]/`

This approach is more robust as it:
- Properly handles pages with missing or empty slugs
- Separates the concerns of listings and individual pages
- Ensures permalink uniqueness
