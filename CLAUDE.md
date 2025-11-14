# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static blog theme built with Astro and UnoCSS, focused on typography and elegant design. The theme features i18n support (Korean and English), light/dark mode, MDX support, and rich content features including KaTeX math rendering, Mermaid diagrams, and comment systems (Giscus, Waline).

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (runs astro check first)
pnpm dev

# Build for production (includes astro check and LQIP image processing)
pnpm build

# Preview production build
pnpm preview

# Linting
pnpm lint          # Check for lint errors
pnpm lint:fix      # Auto-fix lint errors

# Content management
pnpm new-post [path/to/post]    # Create new post with frontmatter template
pnpm format-posts               # Format existing posts
pnpm apply-lqip                 # Apply Low Quality Image Placeholders to built images

# Theme updates
pnpm update-theme              # Update theme from upstream
```

## Architecture Overview

### Configuration System

- **`src/config.ts`**: Central theme configuration file containing all customizable settings:
  - Site information (title, author, URL, base path)
  - Color schemes (light/dark mode with OKLCH colors)
  - Global settings (locale, font style, date format, TOC, KaTeX)
  - Comment system configuration (Giscus, Waline)
  - SEO settings (analytics, verification, social)
  - Footer and preload settings

- **`astro.config.ts`**: Astro framework configuration with:
  - i18n routing based on `langMap` from `src/i18n/config.ts`
  - MDX integration with custom remark/rehype plugins
  - UnoCSS integration for styling
  - Sitemap, Partytown (analytics), and Compress integrations
  - Custom Vite plugin to prefix font URLs with base path

- **`uno.config.ts`**: UnoCSS configuration with:
  - Custom theme colors from `src/config.ts`
  - Font families for title, navbar, time, and serif text
  - Custom shortcuts and rules
  - Theme preset for dark mode color switching
  - CJK language variant for Chinese/Japanese/Korean typography

### Content Management

- **Content Collections** (`src/content.config.ts`):
  - `posts`: Blog posts with schema validation (title, published date, tags, draft status, etc.)
  - `about`: About pages with lang field
  - Uses Astro's glob loader for file-based content

- **Content Structure**:
  - `src/content/posts/`: Blog post markdown/MDX files
  - `src/content/about/`: About page content in multiple languages
  - Posts support language-specific versions (e.g., `post-en.md`, `post-zh.md`)
  - Frontmatter includes: title, published, description, updated, tags, draft, pin, toc, lang, abbrlink

### i18n System

- **`src/i18n/config.ts`**: Language configuration with:
  - `langMap`: Maps locale codes to language tags (ko, en)
  - Comment system locale mappings for Giscus and Waline
  - Fallback language handling for unsupported locales

- **Routing**: Dynamic routes use `[...locale]` patterns to handle multi-language paths
  - Default locale configured in `src/config.ts` (`global.locale`)
  - Additional locales in `global.moreLocales`

### Plugin System

Custom Markdown/MDX processing plugins in `src/plugins/`:

- **Remark plugins** (operate on Markdown AST):
  - `remark-reading-time.mjs`: Calculates reading time and injects into frontmatter
  - `remark-container-directives.mjs`: Container syntax (:::note, :::tip, :::important, :::warning, :::caution)
  - `remark-leaf-directives.mjs`: Inline directives (:badge, :kbd, :mark, :abbr, :ruby, :details, :github-card, :video, :bilibili, :youtube)

- **Rehype plugins** (operate on HTML AST):
  - `rehype-code-copy-button.mjs`: Adds copy buttons to code blocks
  - `rehype-external-links.mjs`: Adds external link indicators
  - `rehype-heading-anchor.mjs`: Generates heading anchors with hash links
  - `rehype-image-processor.mjs`: Processes images for optimization

### Utilities

Key utility modules in `src/utils/`:

- **`content.ts`**: Core content utilities
  - `getCollection()`: Fetches posts/about pages with locale filtering
  - `formatPost()`: Post formatting and URL generation
  - Post filtering (by draft status, language, date range)
  - Post sorting and pagination

- **`feed.ts`**: RSS/Atom feed generation with multi-language support

- **`cache.ts`**: Memoization utility for expensive function calls

- **`description.ts`**: Extracts and truncates post descriptions from content

- **`page.ts`**: Pagination utilities

### Page Structure

Dynamic routes in `src/pages/`:

- `[...index].astro`: Homepage with post list (multi-language)
- `[...posts_slug].astro`: Individual post pages
- `[...tags].astro`: Tag index page
- `[...tags_tag].astro`: Posts filtered by tag
- `[...about].astro`: About page
- `[lang]/`: Locale-specific route folder for language variants
- `atom.xml.ts` / `rss.xml.ts`: Feed generation
- `og/`: OpenGraph image generation
- `robots.txt.ts`: Dynamic robots.txt generation

### Component Organization

- **`src/components/`**: Reusable Astro components
  - Layout components: `Header.astro`, `Footer.astro`, `Navbar.astro`
  - Content components: `PostList.astro`, `TagList.astro`, `PostDate.astro`
  - Comment integrations: `Comment/` folder with Giscus and Waline
  - Widgets: `Widgets/` folder with TOC, ImageZoom, CodeCopyButton, etc.

- **`src/layouts/`**: Page layouts
  - `Layout.astro`: Base layout wrapper
  - `Head.astro`: HTML head with SEO meta tags

### Styling

- **UnoCSS**: Atomic CSS framework with custom theme
- **`src/styles/`**: Global styles and custom fonts
- **Theme Colors**: Configured in `src/config.ts` using OKLCH color space
- **Font Loading**: Custom fonts in `public/fonts/` with CSS font-face declarations

## Important Development Notes

### Working with Content

- Use `pnpm new-post <title>` to create posts with proper frontmatter structure
- Post files can be organized in subdirectories under `src/content/posts/`
- Language-specific posts use suffix convention: `post-en.md`, `post-ko.md`
- The `lang` frontmatter field determines post language; posts without lang or with empty lang default to Korean

### Theme Customization

- All user-facing configuration is in `src/config.ts` - avoid hardcoding values elsewhere
- Color changes should use OKLCH format for better perceptual uniformity
- To add new locales, update both `src/config.ts` and `src/i18n/config.ts`

### Build Pipeline

1. `astro check` runs TypeScript and Astro validation
2. `astro build` generates static site
3. `pnpm apply-lqip` processes images in `dist/` to add LQIP (Low Quality Image Placeholders)

### Plugin Development

- Remark plugins process Markdown AST before HTML conversion
- Rehype plugins process HTML AST after conversion
- Plugin execution order matters - defined in `astro.config.ts`
- Custom directives extend Markdown syntax without breaking standard rendering

### Git Hooks

- Pre-commit hook runs `pnpm lint-staged` automatically
- Lints and auto-fixes `.js`, `.mjs`, `.ts`, and `.astro` files

## Testing

This theme doesn't include automated tests. Manual testing workflow:

1. Run `pnpm dev` and verify development server
2. Test content rendering with example posts
3. Verify i18n routing with different locale URLs
4. Check light/dark mode switching
5. Run `pnpm build` to ensure production build succeeds
6. Use `pnpm preview` to test production build locally
