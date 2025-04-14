# CLI Rules for AlternaDevStudio.com

This document outlines the CLI rules and conventions to follow when working on the AlternaDevStudio.com project.

## Package Manager

### Always Use pnpm

**RULE: Always use pnpm instead of npm or yarn for all package management operations.**

This project uses [pnpm](https://pnpm.io/) as its package manager. pnpm offers several advantages:

- Faster installation times
- Disk space efficiency through content-addressable storage
- Strict dependency resolution
- Consistent lockfile

#### Examples:

✅ **Correct:**
```bash
pnpm install
pnpm add package-name
pnpm remove package-name
pnpm run build
pnpm exec command
```

❌ **Incorrect:**
```bash
npm install
npm install package-name
npm uninstall package-name
npm run build
npx command
```

### Script Execution

When running scripts defined in package.json, always use `pnpm run` or `pnpm` (for shorthand commands):

✅ **Correct:**
```bash
pnpm run build
pnpm start
pnpm test
```

❌ **Incorrect:**
```bash
npm run build
npm start
npm test
```

## Docker Commands

For Docker-related commands, use the scripts defined in package.json:

```bash
pnpm directus:start
pnpm directus:stop
pnpm directus:setup
```

## Documentation

When documenting commands in README files, comments, or other documentation, always use pnpm syntax.

## CI/CD

In GitHub Actions workflows or other CI/CD configurations, use pnpm for all package management and script execution steps.
