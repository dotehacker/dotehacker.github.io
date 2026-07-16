---
title: "The Tatva Journey: Building a Custom Jekyll-like Static Site Generator"
date: 2025-07-04
category: "Engineering"
author: Sumit Yadav
---

# The Tatva Journey: Building a Custom Jekyll-like Static Site Generator

*A technical memoir of creating a personal blog from scratch*

## The Beginning - June 2025

Five days ago, with a simple commit message "initial", I embarked on what would become an intense journey of building Tatva - not just another blog, but a completely custom static site generator that mimics Jekyll's elegance while being built entirely in JavaScript.

## Phase 1: The GitHub Actions Odyssey (Day 1-2)

The early commits tell a story of persistence and learning:
- `Fix GitHub Actions deployment permissions and workflow`
- `Transform to GitHub Actions auto-deployment workflow`
- `Fix multiple GitHub Pages artifacts issue`
- `Add simpler GitHub Pages deployment workflow`

Like many developers, I started by wrestling with CI/CD. The GitHub Actions configuration went through multiple iterations as I learned the intricacies of automated deployment. Each commit represents a small victory over YAML indentation errors and permission issues.

## Phase 2: The Great Transformation (Day 3-4)

Then came the pivotal moment - two commits that changed everything:

### `Complete rewrite: Create minimal Tatva blog`
### `Transform into Jekyll-like static site generator`

This is where Tatva truly began. Instead of using Jekyll or another existing static site generator, I made the bold decision to build my own. The 865-line `build.js` file became the heart of the system, implementing:

- **Jekyll-compatible frontmatter parsing** using `js-yaml`
- **Custom Liquid-like templating engine** with support for:
  - Variables: `{{ site.title }}`
  - Conditionals: `{% if page.title %}`
  - Loops: `{% for post in site.posts %}`
  - Includes: `{% include header.html %}`
  - Filters: `{{ post.date | date: "%B %d, %Y" }}`

Why reinvent the wheel? Because sometimes you need a wheel that fits your exact cart.

## Phase 3: The Feature Factory (Day 3-4)

With the foundation solid, I went into feature development mode:

### SEO & Optimization
- `Add sitemap.xml for SEO`
- `Add sitemap.xml generation and build process integration`
- `Add llms.txt for LLM-friendly site overview`

### Visual Polish
- `Add favicon copying to build process`
- `sass` - SCSS compilation support
- `dark` - Initial dark mode implementation with CSS custom properties

### Infrastructure
- `better sitemap` - Enhanced sitemap generation
- `copy google` - Google Search Console verification
- Multiple `baseurl` fixes for proper deployment

## Phase 4: Content Creation Era (Day 2-4)

With the technical foundation complete, I shifted focus to content:

- **Family Tree** - Personal genealogy in Nepali
- **Bio** - Professional introduction as "Rocker Ritesh"
- **AI Agents** - Technical posts about multi-agent systems
- **Life** - Philosophical reflections on existence

Each post triggered the automated build system: `Auto-build: Update Jekyll-like blog [skip ci]`

## Phase 5: The Mermaid Enhancement (Day 4-5)

A significant milestone came with the integration of Mermaid.js for diagram rendering:

### `🎨 Add comprehensive Mermaid.js diagram support`

This wasn't just about adding a library - it required sophisticated integration:
- **Placeholder System**: Protected Mermaid syntax from markdown processing
- **Theme Integration**: Diagrams automatically adapt to site theme
- **Build Pipeline**: Enhanced the custom build system to handle code blocks
- **Demo Content**: Created comprehensive examples showcasing various diagram types

Technical implementation highlights:
- Custom regex processing: `/```mermaid\n([\s\S]*?)\n```/g`
- Dual-phase rendering: Extract → Process Markdown → Restore
- Dynamic theme adaptation for light/dark modes

## Phase 6: The Dark Mode Revolution (Latest - July 4, 2025)

Today marked another major milestone with the implementation of a comprehensive dark/light mode toggle system:

### `✨ Add dark/light mode toggle functionality`

This wasn't just a simple theme switcher - it's a complete user experience enhancement:

#### **Interactive Theme Toggle**
- Circular button with animated sun (☀️) and moon (🌙) icons
- Smooth transitions with rotation effects (0.3s ease)
- Hover animations with scaling and color changes
- Accessible design with proper ARIA labels

#### **Smart Theme Management**
- **Manual Override**: Users can override system preferences
- **System Respect**: Automatically detects and follows system dark/light mode
- **Persistent Memory**: Choice saved in localStorage across sessions
- **Real-time Updates**: Responds to system theme changes dynamically

#### **Technical Architecture**
```scss
// Three-tier CSS approach:
:root { /* Default light theme */ }
:root.dark-theme { /* Manual dark override */ }
:root.light-theme { /* Manual light override */ }
@media (prefers-color-scheme: dark) { /* System preference */ }
```

#### **Enhanced Visual Design**
- **Light Mode**: Clean whites (#fdfdfd), dark text (#333), blue links (#0066cc)
- **Dark Mode**: Rich darks (#1a1a1a), light text (#e0e0e0), bright links (#4da6ff)
- **Unified Theming**: All components including Mermaid diagrams adapt instantly
- **Responsive Design**: Mobile-optimized toggle (36x36px on small screens)

#### **Advanced JavaScript Features**
- Theme detection and application logic
- Mermaid.js theme synchronization
- Event-driven architecture
- System preference monitoring
- Smooth transitions between themes

This implementation elevates Tatva from a simple blog to a modern, user-centric web experience that adapts to individual preferences and usage contexts.

## Phase 7: The Polish Phase (Recent)

The latest commits show attention to detail:
- `footer note` - Adding copyright and attribution
- `layout` - Template refinements
- Final content updates and fixes
- Merge conflict resolutions and deployment optimizations

## Technical Achievements

### Custom Template Engine
Built a complete Liquid-like templating system that supports:
- Nested layouts (`home.html` extends `default.html`)
- Complex filters and conditionals
- Date formatting and URL generation
- Include system for reusable components

### Advanced Diagram Integration
- **Mermaid.js Support**: Flowcharts, sequence diagrams, system architecture
- **Theme Synchronization**: Diagrams automatically adapt to light/dark modes
- **Build Pipeline Integration**: Sophisticated processing preserves diagram syntax
- **Comprehensive Examples**: Demo content showcasing capabilities

### Modern Theme System
- **Dual-Mode Support**: Light and dark themes with smooth transitions
- **User Choice Persistence**: localStorage-based preference management
- **System Integration**: Respects user's OS-level theme preferences
- **Accessibility Focus**: ARIA labels, keyboard navigation, contrast optimization

### Automated Pipeline
Created a GitHub Actions workflow that:
- Builds the site on every content change
- Compiles SCSS to CSS with theme support
- Generates SEO files (sitemap.xml, robots.txt)
- Deploys to GitHub Pages automatically
- Handles merge conflicts and updates gracefully

### Modern Web Standards
- Responsive design with mobile-first approach
- Dark mode support with CSS custom properties
- Semantic HTML structure
- Accessibility considerations (WCAG compliance)
- Performance optimization (smooth transitions, efficient CSS)

## The Philosophy Behind Tatva

**Tatva** (तत्त्व) means "truth" or "essence" in Sanskrit. This project embodies that philosophy:

- **Truth in Simplicity**: No unnecessary dependencies or complexity
- **Essence of Control**: Complete ownership of every line of code
- **Truth in Learning**: Each commit represents genuine understanding
- **User-Centric Truth**: Adapting to individual preferences and needs

## Lessons Learned

1. **GitHub Actions can be tricky** - YAML indentation matters more than you think
2. **Custom solutions offer freedom** - When you build it yourself, you control everything
3. **Incremental development works** - Small commits, big progress
4. **Documentation through commits** - A good git history tells the story
5. **User experience is paramount** - Features like dark mode significantly enhance usability
6. **Theme systems are complex** - Balancing system preferences with user choice requires careful design
7. **Integration challenges** - Making third-party libraries (like Mermaid) work seamlessly with custom themes
8. **Deployment vs Development** - What works locally might need adjustments for production
9. **CSS Grid vs Flexbox** - Sometimes older, more compatible solutions are more reliable
10. **Professional presentation matters** - A sidebar transforms a blog into a portfolio

## Phase 8: The Sidebar Revolution (October 2025)

The latest major enhancement brought professional profile integration:

### `Add sidebar with profile details to all pages`
### `Fix sidebar layout for deployment`

This phase introduced a comprehensive sidebar system that transforms the site into a professional portfolio:

#### **Profile Integration**
- **Dynamic Profile Card**: Fetches GitHub avatar automatically
- **Professional Information**: Name, title, location, and bio
- **Social Media Row**: Horizontal layout with all professional links
- **Google Scholar Integration**: Academic profile linking

#### **Research Highlights Section**
- **AI & Machine Learning**: Showcases technical expertise
- **Software Development**: Highlights development skills  
- **Current Focus**: Dynamic research interests

#### **Recent Posts Widget**
- **Live Updates**: Shows 5 most recent posts automatically
- **Quick Navigation**: Direct links to latest content
- **Date Display**: Formatted publication dates

#### **Advanced Layout System**
- **Flexbox Architecture**: Robust two-column layout
- **Sticky Positioning**: Sidebar follows scroll on desktop
- **Mobile Optimization**: Reorders to top on small screens
- **Deployment Compatibility**: Flexbox ensures cross-platform reliability

#### **Technical Challenges Overcome**
- **CSS Grid Compatibility**: Initial grid layout failed in deployment, solved with flexbox
- **Responsive Breakpoints**: Complex media queries for different screen sizes
- **Social Media Layout**: Transformed vertical links to horizontal row design
- **Profile Image Handling**: Fallback system for missing GitHub avatars
- **Cross-Browser Testing**: Ensuring consistent appearance across platforms

## The Numbers (Updated)

- **130+ commits** across 10 months
- **900+ lines** of custom JavaScript build system
- **25 blog posts** covering diverse topics from AI to philosophy
- **1 custom static site generator** built from scratch
- **2 major theme modes** with seamless switching
- **Multiple diagram types** supported with theme integration
- **Professional sidebar** with dynamic profile integration
- **6 social media platforms** integrated in clean row layout

## Current Feature Set

### Core Functionality
- ✅ Jekyll-compatible frontmatter parsing
- ✅ Custom Liquid-like templating engine
- ✅ SCSS compilation with live reloading
- ✅ Automated GitHub Pages deployment
- ✅ SEO optimization (sitemap, robots.txt, meta tags)

### User Experience
- ✅ **Dark/Light mode toggle with system preference detection**
- ✅ **Professional sidebar with profile integration**
- ✅ **Responsive design for all screen sizes**
- ✅ **Smooth animations and transitions**
- ✅ **Accessibility features (ARIA labels, keyboard navigation)**
- ✅ **Social media integration in horizontal row layout**

### Content Features
- ✅ **Mermaid.js diagram rendering with theme integration**
- ✅ **Markdown processing with custom enhancements**
- ✅ **Post excerpts and metadata**
- ✅ **Asset copying and management**

### Technical Infrastructure
- ✅ **Custom build system with error handling**
- ✅ **Git integration with automated workflows**
- ✅ **Performance optimization**
- ✅ **Cross-browser compatibility**

## What's Next?

The foundation is solid, the content is flowing, and the automation is humming. Tatva has evolved from a simple idea to a fully functional, modern publishing platform.

Future enhancement possibilities:
- **Enhanced markdown processing** with custom syntax extensions
- **Comment system integration** (possibly using GitHub Discussions)
- **Analytics and performance monitoring** integration
- **Search functionality** with client-side indexing
- **RSS feed generation** for content syndication
- **Progressive Web App (PWA)** features
- **Advanced diagram types** beyond Mermaid.js
- **Theme customization** allowing users to create custom color schemes

## Reflection

This journey represents more than just building a website - it's about understanding the tools we use daily. By rebuilding Jekyll's functionality from scratch and adding modern enhancements like intelligent dark mode, I gained deep insights into:

- Static site generation principles and best practices
- Template processing algorithms and optimization
- Build system architecture and automation
- Modern web development practices (CSS custom properties, responsive design)
- User experience design (theme management, accessibility)
- JavaScript event handling and state management
- CSS architecture for maintainable theming systems

The latest dark mode implementation showcases how modern web development has evolved - users expect intelligent, adaptive interfaces that respect their preferences and provide smooth, delightful interactions.

Sometimes the best way to learn a technology is to recreate it yourself, then improve upon it.

---

*View the complete source code and commit history at [GitHub](https://github.com/rockerritesh/tatva)*

**"The purpose of Tatva is not just to publish content, but to understand the essence of how modern web publishing works - from the build system to the user experience."** 