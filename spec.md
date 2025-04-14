# Alterna Dev Studio Website Specification

## Overview
A modern, responsive brochure-style website for "Alterna Dev Studio" — a product and consulting company focused on mission-driven software and game development. The primary goals of the website are to:
- Generate client leads via consultation requests
- Establish credibility for recruitment and partnerships

## Stack & Tools
- **Static Site Generator**: 11ty (Eleventy)
- **CMS**: Directus (Headless)
- **Hosting**: GitHub Pages
- **Analytics**: Plausible CE (Client-side script)
- **Streaming Integrations**: Twitch (Live), YouTube (Archived)
- **Deployment**: Automated via GitHub Actions

## Navigation Structure
- Home
- About
- Projects
- Blog
- Live Product Development
- Contact

Footer:
- Social links: GitHub, Bluesky, Medium, LinkedIn, YouTube
- Copyright and optional links to legal pages (future scope)

## Pages & Components

### Home
- Mission statement
- Brief team intro (collective narrative)
- Featured Projects (3–6)
  - Name, short description, logo/image, status (launched/in dev), link to detail page
- Hero banner for latest Live Product Dev video (hidden if none)

### About
- Mission-driven and inspirational tone
- Studio philosophy and how the team works
- Collective narrative (no individual bios for now)

### Projects
- Grid/list of projects
- Each item links to a detail page

**Project Detail Page Includes:**
- Name
- Extended description
- Technologies used
- Problem solved
- Screenshots or video
- Outcomes/results

### Blog
- Posts written by individual team members
- Categories/tags supported (e.g., project updates, tech for good, culture)
- Sorted chronologically

**Blog Post Fields (in Directus):**
- Title
- Author
- Date
- Body
- Tags
- Optional image/video

### Contact
- Purpose: schedule a consultation
- Basic contact form (no budget or timeline)
  - Fields: name, email, phone number, company, project description
  - Confirmation message shown on form submit

### Live Product Development
- Embedded Twitch player (when live) or link (when not live)
- Latest YouTube VOD embedded
- Link to full YouTube archive
- List of stream recap entries (uploaded via API to Directus as a special blog type)

**Floating CTA:**
- Appears on all pages when stream is live
- Label: "Watch Dev Live!"
- Opens Twitch stream in new window

**Recap Entries:**
- Appear only on Live Product Development page
- Latest recap featured as homepage hero (if available)

## Data Handling & API Integration

### Twitch
- Use Twitch webhook or polling + serverless function (e.g., Lambda)
- Stream status check triggers frontend behavior:
  - Toggle floating CTA visibility
  - Embed Twitch iframe or show link on Live Product Development page

### YouTube
- Most recent VOD embed via YouTube API or manual embed field
- Archive link to channel or playlist

### Directus
- Custom blog post type: `stream_recap`
- Posts added via API when stream is uploaded to YouTube
- Homepage logic checks for latest recap and conditionally displays hero

## Error Handling
- If Twitch API fails: show fallback link instead of embed
- If YouTube embed fails: hide the embed and show fallback link
- If Directus content is unavailable: log error, display fallback message
- Contact form should have basic validation and a success/failure state

## Testing Plan

### Functional Testing
- Confirm all pages load correctly on desktop, tablet, and mobile
- Validate contact form functionality
- Confirm blog, project, and stream content renders properly

### Streaming Integration Testing
- Test Twitch embed toggle behavior
- Validate floating CTA appears only when streaming
- Ensure latest VOD is embedded correctly

### Visual Testing
- Cross-browser checks (Chrome, Firefox, Safari, Edge)
- Mobile-first responsiveness (using device emulators and physical devices)

### CMS Testing
- Author can post blog entries and stream recaps through Directus UI or API
- Blog tags/categories render and filter correctly

## Out of Scope (Future Enhancements)
- Budget/timeline input on form
- Multilingual support
- Legal policy pages
- Team member bios
- Newsletter signup
- Newsletter archive

---
This specification provides everything a developer needs to begin implementation of the Alterna Dev Studio website. All architecture, behavior, and content guidelines are included for initial delivery.

