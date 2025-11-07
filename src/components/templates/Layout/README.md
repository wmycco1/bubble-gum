# Layout Component (Template)

**God-Tier Development Protocol 2025**

A page-level layout component with header, footer, sidebar, and main content areas. Uses semantic HTML5 structure for accessibility.

## Overview

The Layout component is a fundamental page structure that:

- Provides semantic HTML5 structure (header, main, aside, footer)
- Supports optional header, footer, and sidebar
- Offers sticky header/footer positioning
- Allows left or right sidebar placement
- Supports full viewport height layouts
- Integrates with the Template Context API

## Usage

### Basic Example

```tsx
import { Layout } from '@/components/templates/Layout';

function Page() {
  return (
    <Layout header={<Header />} footer={<Footer />}>
      <MainContent />
    </Layout>
  );
}
```

### Layout with Sidebar

```tsx
<Layout
  header={<Navbar />}
  sidebar={<Sidebar />}
  sidebarPosition="left"
  footer={<Footer />}
>
  <Article />
</Layout>
```

### Sticky Header Layout

```tsx
<Layout header={<Navbar />} stickyHeader={true} fullHeight={true}>
  <Content />
</Layout>
```

### Right Sidebar

```tsx
<Layout sidebar={<TableOfContents />} sidebarPosition="right">
  <BlogPost />
</Layout>
```

### Minimal Layout

```tsx
<Layout>
  <LandingPage />
</Layout>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `header` | `React.ReactNode` | `undefined` | Header content (navbar, etc.) |
| `footer` | `React.ReactNode` | `undefined` | Footer content |
| `sidebar` | `React.ReactNode` | `undefined` | Sidebar content |
| `sidebarPosition` | `'left' \| 'right'` | `'left'` | Sidebar position |
| `stickyHeader` | `boolean` | `false` | Make header sticky (fixed to top) |
| `stickyFooter` | `boolean` | `false` | Make footer sticky (fixed to bottom) |
| `fullHeight` | `boolean` | `false` | Full viewport height layout |
| `sidebarWidth` | `string` | `'250px'` | Sidebar width (CSS value) |
| `children` | `React.ReactNode` | **required** | Main content |
| `className` | `string` | `undefined` | Custom CSS class |
| `data-testid` | `string` | `'layout'` | Test ID for testing |
| `style` | `React.CSSProperties` | `undefined` | Custom inline styles |

## Examples

### Application Layout

```tsx
<Layout
  header={
    <Navbar>
      <Logo />
      <Navigation />
      <UserMenu />
    </Navbar>
  }
  sidebar={
    <Sidebar>
      <Menu items={menuItems} />
    </Sidebar>
  }
  sidebarWidth="280px"
  footer={
    <Footer>
      <Copyright />
      <Links />
    </Footer>
  }
>
  <Dashboard />
</Layout>
```

### Blog Layout

```tsx
<Layout
  header={<BlogHeader />}
  sidebar={
    <aside>
      <RecentPosts />
      <Categories />
      <Tags />
    </aside>
  }
  sidebarPosition="right"
  sidebarWidth="300px"
>
  <article>
    <BlogPost />
  </article>
</Layout>
```

### Documentation Layout

```tsx
<Layout
  header={<DocsHeader />}
  sidebar={
    <nav>
      <TableOfContents />
    </nav>
  }
  sidebarWidth="250px"
  stickyHeader={true}
>
  <Documentation />
</Layout>
```

### Full-Height App Layout

```tsx
<Layout
  header={<AppBar />}
  stickyHeader={true}
  fullHeight={true}
>
  <AppContent />
</Layout>
```

### Landing Page (No Header/Footer)

```tsx
<Layout>
  <Hero />
  <Features />
  <Pricing />
  <CTA />
</Layout>
```

### With Context API

```tsx
import { TemplateProvider } from '@/context/parameters/ParameterContext';

<TemplateProvider value={{ stickyHeader: true, fullHeight: true }}>
  <Layout header={<Header />}>
    {/* Inherits stickyHeader and fullHeight from context */}
    <Content />
  </Layout>
</TemplateProvider>
```

## Semantic HTML Structure

The Layout component uses semantic HTML5 elements:

```html
<div class="layout">
  <!-- Header (if provided) -->
  <header class="layout-header">
    {header}
  </header>

  <!-- Body (Main + Sidebar) -->
  <div class="layout-body">
    <!-- Sidebar (if provided, left position) -->
    <aside class="layout-sidebar">
      {sidebar}
    </aside>

    <!-- Main Content (always present) -->
    <main class="layout-main">
      {children}
    </main>

    <!-- Sidebar (if provided, right position) -->
    <aside class="layout-sidebar">
      {sidebar}
    </aside>
  </div>

  <!-- Footer (if provided) -->
  <footer class="layout-footer">
    {footer}
  </footer>
</div>
```

## Sticky Positioning

### Sticky Header

When `stickyHeader={true}`:
- Header sticks to top on scroll
- Background color applied for visibility
- Box shadow for depth

### Sticky Footer

When `stickyFooter={true}`:
- Footer sticks to bottom
- Background color applied
- Inverted box shadow

## Full-Height Layout

When `fullHeight={true}`:
- Layout takes full viewport height (100vh)
- Overflow hidden on layout container
- Main content scrolls independently

Perfect for:
- Single-page applications
- Dashboard layouts
- Chat interfaces

## Sidebar Positioning

### Left Sidebar (default)

```tsx
<Layout sidebar={<Nav />} sidebarPosition="left">
  <Content />
</Layout>
```

Order: Sidebar → Main

### Right Sidebar

```tsx
<Layout sidebar={<TOC />} sidebarPosition="right">
  <Article />
</Layout>
```

Order: Main → Sidebar

## Responsive Behavior

The Layout component is responsive:

- **Mobile (< 768px)**: Sidebar stacks below main content
- **Tablet (768px+)**: Sidebar appears beside main content
- **Desktop (1024px+)**: Full layout with sidebar

## Accessibility

- Uses semantic HTML5 elements (`<header>`, `<main>`, `<aside>`, `<footer>`)
- Header has `role="banner"`
- Main has `role="main"`
- Footer has `role="contentinfo"`
- Sidebar has `role="complementary"` (implied by `<aside>`)
- Supports ARIA attributes
- Keyboard navigation friendly
- Screen reader friendly structure

## Testing

The Layout component has 42 comprehensive tests covering:

- Basic rendering
- Header (with/without, sticky)
- Footer (with/without, sticky)
- Sidebar (left/right, custom width)
- Full-height mode
- Body container
- Main content
- Complete layouts
- Context API integration
- Custom styles
- Accessibility
- Edge cases

Run tests:

```bash
npm test Layout.test.tsx
```

## Performance

- Pure CSS layout (no JavaScript calculations)
- CSS Modules for scoped styles
- Flexbox for responsive behavior
- Semantic HTML for accessibility

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Related Components

- **Container** - Max-width wrapper
- **Section** - Content section with background
- **Grid** - Multi-column grid layout

## Migration from Legacy Layouts

If migrating from older layout patterns:

```tsx
// OLD (manual layout)
<div className="page">
  <header>...</header>
  <div className="content-wrapper">
    <aside>...</aside>
    <main>...</main>
  </div>
  <footer>...</footer>
</div>

// NEW (Layout component)
<Layout
  header={<Header />}
  sidebar={<Sidebar />}
  footer={<Footer />}
>
  <MainContent />
</Layout>
```

## Best Practices

1. **Semantic structure**: Always provide header and footer for complete pages
2. **Sticky headers**: Use sparingly, mainly for app-like interfaces
3. **Sidebar width**: 250-300px is ideal for most cases
4. **Full-height**: Use for single-page apps, not multi-page sites
5. **Mobile-first**: Sidebar stacks below on mobile by default

## Common Patterns

### Application Shell

```tsx
<Layout
  header={<AppBar />}
  sidebar={<Navigation />}
  stickyHeader={true}
  fullHeight={true}
>
  <Routes />
</Layout>
```

### Blog Post

```tsx
<Layout
  header={<BlogHeader />}
  sidebar={<TableOfContents />}
  sidebarPosition="right"
  footer={<BlogFooter />}
>
  <article>
    <Post />
  </article>
</Layout>
```

### Dashboard

```tsx
<Layout
  header={<DashboardHeader />}
  sidebar={<DashboardNav />}
  sidebarWidth="280px"
  stickyHeader={true}
  fullHeight={true}
>
  <DashboardContent />
</Layout>
```

## Print Styles

In print mode, the Layout component:
- Removes sticky positioning
- Hides sidebar
- Stacks all content vertically
- Ensures proper page breaks

## Dark Mode

The Layout component supports dark mode via CSS media query `prefers-color-scheme: dark`:
- Adjusts header/footer shadows
- Updates sidebar background
- Maintains contrast ratios

## License

MIT © Bubble Gum Project
