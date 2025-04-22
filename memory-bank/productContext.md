# Product Context

## Project Purpose

AlternaDevStudio.com is a modern, responsive brochure-style website for "Alterna Dev Studio" — a product and consulting company focused on mission-driven software and game development. The website serves as both a showcase of the studio's work and a platform for sharing knowledge through blog posts and live development streams.

## Primary Goals

1. **Generate client leads** via consultation requests
2. **Establish credibility** for recruitment and partnerships
3. **Share knowledge** through blog posts and stream recaps
4. **Showcase projects** to demonstrate expertise and capabilities

## Target Audience

- Potential clients looking for software development services
- Potential partners for collaboration
- Developers interested in the studio's work and knowledge sharing
- Viewers of live product development streams

## User Experience Goals

- **Professional Appearance**: Present a polished, modern interface that reflects the studio's expertise
- **Clear Navigation**: Make it easy for visitors to find information about services, projects, and content
- **Responsive Design**: Ensure the site works well on all devices (desktop, tablet, mobile)
- **Content-First Approach**: Prioritize showcasing the studio's work and knowledge
- **Streamlined Contact**: Make it simple for potential clients to request consultations
- **Accessibility**: Ensure the site follows WCAG 2.1 AA standards to make content accessible to a wider audience, including those with disabilities

## Content Strategy

The website features several key content types:

1. **Projects**: Showcase of completed and in-progress work
2. **Blog Posts**: Articles written by team members on technical topics
3. **Stream Recaps**: Summaries of live product development streams
4. **About Information**: Studio philosophy and collective narrative

## Integration with Live Streaming

A unique aspect of the site is its integration with live product development streams:

- **Twitch Integration**: Embedded player when live, link when not
- **YouTube Archive**: Latest VOD embedded, link to full archive
- **Stream Recaps**: Detailed summaries of stream content
- **Floating CTA**: Appears on all pages when stream is live

## Technical Approach

The site uses a JAMstack architecture with:

- **Static Site Generator**: 11ty (Eleventy)
- **Headless CMS**: Directus
- **Hosting**: GitHub Pages
- **Analytics**: Plausible CE

This approach provides:
- Fast loading times
- Easy content management
- Secure, scalable hosting
- Privacy-focused analytics


## Design Style Guidlines
A full logo and icon logos have been added to the src/_assets folder.

Here are some color style guidelines for a matching color scheme:

### 🎨 Color Palette

| Name          | Hex       | RGB             | Tailwind Name  | Suggested Usage                    |
|---------------|-----------|------------------|----------------|------------------------------------|
| Primary       | `#064672` | `rgb(6, 70, 114)` | `primary`      | Headers, nav, footer, buttons      |
| Secondary     | `#1C89D8` | `rgb(28, 137, 216)` | `secondary`    | Icons, links, backgrounds, hover   |
| Accent 1      | `#D8701C` | `rgb(216, 112, 28)` | `accent`       | CTA buttons, highlights, links     |
| Accent 2      | `#A67C00` | `rgb(166, 124, 0)`  | `highlight`    | Labels, badges, subtle callouts    |
