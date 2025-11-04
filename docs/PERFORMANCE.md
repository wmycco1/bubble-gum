# Performance Optimization Guide

## Overview

This guide covers critical performance optimizations for Bubble Gum to achieve and maintain a **Lighthouse score of 95+** and meet all Core Web Vitals targets.

**Target:** Production-ready performance with <2.5s LCP across all pages and devices.

---

## Core Web Vitals Targets

The foundation of performance optimization. These metrics directly impact user experience and SEO ranking.

| Metric | Target | Description | Impact |
|--------|--------|-------------|--------|
| **LCP** (Largest Contentful Paint) | <2.5s | Largest element load time | User perceives page load speed |
| **FID** (First Input Delay) | <100ms | Input responsiveness | Interaction is responsive |
| **CLS** (Cumulative Layout Shift) | <0.1 | Visual stability | No unexpected layout jumps |
| **TTFB** (Time to First Byte) | <600ms | Server response time | Server is fast |
| **FCP** (First Contentful Paint) | <1.8s | First content render | Something appears quickly |
| **TTI** (Time to Interactive) | <3.8s | Page becomes interactive | Page is usable |

**Lighthouse Scoring:**
- 90-100: Good (green)
- 50-89: Needs Improvement (yellow)
- 0-49: Poor (red)

---

## Next.js Configuration

Complete `next.config.js` with all critical performance settings.

### Full Configuration File

```javascript
/** @type {import('next').NextConfig} */
module.exports = {
  // SWC Minification (faster builds than Terser)
  swcMinify: true,

  // Image Optimization - Critical for LCP
  images: {
    // Serve modern formats first
    formats: ['image/avif', 'image/webp'],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for different contexts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache optimized images for 1 year (immutable)
    minimumCacheTTL: 31536000,

    // Image hosts allowed
    domains: ['bubblegum.app', 'r2.cloudflarestorage.com', 'cloudflare.com'],

    // Disable static imports for dynamic images
    disableStaticImages: false,
  },

  // Compiler Options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',

    // Remove unused style definitions
    styledComponents: true,
  },

  // Webpack Bundle Analysis
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize client-side bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,

          // Separate React/Next framework code
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
            reuseExistingChunk: true,
            minChunks: 1,
          },

          // Separate shared code used by 2+ chunks
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
            reuseExistingChunk: true,
          },

          // Separate large vendor libraries
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },

  // Experimental Features
  experimental: {
    // Optimize CSS across the app
    optimizeCss: true,

    // Only load necessary parts of packages
    optimizePackageImports: [
      '@clerk/nextjs',
      'lucide-react',
      '@radix-ui/react-*',
      'zustand',
    ],

    // Enable React Server Components (future)
    serverComponentsExternalPackages: ['prisma'],
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  // Redirects (minimal performance impact)
  async redirects() {
    return [];
  },

  // Build optimizations
  productionBrowserSourceMaps: false, // Disable source maps in prod
  optimizeFonts: true, // Optimize font loading
  poweredByHeader: false, // Remove X-Powered-By header
};
```

---

## Image Optimization

Images are often the largest asset on a page. Proper optimization is critical for LCP.

### Using Next.js Image Component

```typescript
import Image from 'next/image';

// ✅ GOOD - Optimized image with blur placeholder
// This is the most common use case
<Image
  src="/product.jpg"
  alt="Product"
  width={800}
  height={600}
  quality={85} // 85 is optimal for most images (balances quality/size)
  placeholder="blur" // Show blur while loading
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJ..." // Pre-generated
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// ✅ GOOD - Priority for above-the-fold images (LCP critical)
// Use for hero images, logos, etc.
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  priority // Preload this image (removes loading phase)
  quality={90} // Higher quality for hero
  sizes="100vw"
  style={{ objectFit: 'cover' }}
/>

// ✅ GOOD - Responsive images with proper sizes
// Tell Next.js which size to load at each breakpoint
<Image
  src="/portfolio-image.png"
  alt="Portfolio"
  width={1200}
  height={800}
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         (max-width: 1280px) 33vw,
         25vw"
  placeholder="blur"
  blurDataURL={await generateBlur(src)} // Dynamic blur
/>

// ❌ BAD - Native HTML img tag (no optimization)
// Avoid! Will be large, not optimized, slow LCP
<img src="/image.jpg" alt="Image" />
```

### Image Optimization Settings

**Recommended Quality Levels:**

- **Hero/Large Images:** 85-90 (user-facing, important)
- **Product Images:** 80-85 (e-commerce critical)
- **Thumbnail/Small:** 75-80 (less important)
- **Backgrounds:** 70-75 (less noticeable)

**Format Priority:**

1. **AVIF** - Best compression (40% smaller than JPG)
2. **WebP** - Good compression, wide support
3. **JPG** - Fallback for old browsers
4. **PNG** - Only for transparent images

**Blur Placeholder Generation:**

```typescript
// lib/image-optimization.ts
import plaiceholder from 'plaiceholder';

export async function generateBlurDataURL(src: string): Promise<string> {
  try {
    const { base64 } = await plaiceholder.getPlaiceholder(src, {
      size: 10, // 10x10 is optimal
    });
    return base64;
  } catch (error) {
    return 'data:image/jpeg;base64,...'; // Fallback
  }
}
```

---

## Code Splitting & Lazy Loading

Reduce initial JavaScript bundle by loading code only when needed.

### Dynamic Imports for Heavy Components

```typescript
import dynamic from 'next/dynamic';

// ✅ Lazy load chart library (heavy: ~50KB)
// Only loads when user navigates to analytics page
const AnalyticsChart = dynamic(() => import('./AnalyticsChart'), {
  loading: () => <div className="animate-pulse h-96 bg-gray-200" />,
  ssr: false, // Skip server-side rendering (client-only)
});

// ✅ Lazy load modal (shown on interaction)
// Only loads when user clicks a button
const DeleteConfirmModal = dynamic(() => import('./DeleteConfirmModal'));

// ✅ Lazy load editor with custom loading state
const PageEditor = dynamic(() => import('./PageEditor'), {
  loading: () => <EditorSkeleton />,
  ssr: false,
});

// Usage in component
export function Dashboard() {
  const [showChart, setShowChart] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowChart(true)}>
        Show Analytics
      </button>

      <button onClick={() => setShowModal(true)}>
        Delete Project
      </button>

      {/* Only loads when showChart is true */}
      {showChart && <AnalyticsChart data={data} />}

      {/* Only loads when showModal is true */}
      {showModal && <DeleteConfirmModal onConfirm={handleDelete} />}
    </>
  );
}
```

### Route-Based Code Splitting

Next.js automatically code-splits at the route level:

```
/app/dashboard/page.tsx → dashboard-chunk.js
/app/editor/page.tsx → editor-chunk.js
/app/settings/page.tsx → settings-chunk.js
```

Each route's code is only loaded when user navigates there.

### Lazy-Loading Libraries

```typescript
// ✅ BAD - Imports heavy library on initial page
import TiptapEditor from '@tiptap/react'; // 150KB!

// ✅ GOOD - Lazy load on demand
const TiptapEditor = dynamic(() => import('@tiptap/react'), {
  ssr: false,
  loading: () => <EditorPlaceholder />,
});
```

---

## Caching Strategy

Multi-layer caching approach: Browser → CDN → Redis → Database

### 1. Browser Cache (Service Worker)

```typescript
// app/layout.tsx
'use client';

import { useEffect } from 'react';

export default function RootLayout({ children }: any) {
  useEffect(() => {
    // Register service worker for PWA + caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

```javascript
// public/sw.js - Service Worker for offline support
const CACHE_NAME = 'bubble-gum-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
];

// Cache on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### 2. HTTP Caching (Vercel Edge / CDN)

```typescript
// app/page.tsx - Page cached for 1 hour
export const revalidate = 3600; // ISR: revalidate every hour

// app/api/static/route.ts - Static asset cached for 1 year
export async function GET(request: Request) {
  return new Response(asset, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'image/webp',
    },
  });
}

// app/api/dynamic/route.ts - Don't cache API responses
export async function GET(request: Request) {
  return new Response(data, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
```

### 3. Redis Caching (Server-Side)

```typescript
// lib/cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function getPageViews(projectId: string): Promise<number> {
  // Check Redis first
  const cacheKey = `page-views:${projectId}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return parseInt(cached as string);
  }

  // Cache miss - query database
  const views = await prisma.pageView.count({
    where: { projectId },
  });

  // Store in Redis for 5 minutes
  await redis.set(cacheKey, views.toString(), {
    ex: 300, // Expire after 5 minutes
  });

  return views;
}

// Usage with ttl management
export async function invalidateCache(projectId: string): Promise<void> {
  const cacheKey = `page-views:${projectId}`;
  await redis.del(cacheKey); // Immediately invalidate
}
```

### 4. React Query (Client-Side)

```typescript
// lib/queries.ts
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc-client';

export function useProjects(orgId: string) {
  return useQuery({
    queryKey: ['projects', orgId],
    queryFn: () => trpc.projects.list.query({ orgId }),
    staleTime: 5 * 60 * 1000, // Data fresh for 5 min
    cacheTime: 30 * 60 * 1000, // Cache in memory for 30 min
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
  });
}

export function usePageViews(projectId: string) {
  return useQuery({
    queryKey: ['page-views', projectId],
    queryFn: () => fetch(`/api/analytics/${projectId}`).then(r => r.json()),
    staleTime: 1 * 60 * 1000, // 1 minute (analytics can be slightly stale)
    cacheTime: 10 * 60 * 1000, // 10 minute cache
  });
}
```

---

## Database Optimization

Slow database queries kill performance. Optimize with proper indexes and query patterns.

### Critical Indexes

```prisma
// prisma/schema.prisma
model Page {
  id        String   @id @default(cuid())
  title     String
  slug      String
  projectId String
  content   Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Foreign key index (automatic)
  // @@index([projectId])

  // Query optimization - find pages by slug
  @@index([slug])

  // Prevent duplicate pages in same project
  @@unique([projectId, slug])
}

model PageView {
  id        String   @id @default(cuid())
  projectId String
  timestamp DateTime @default(now())

  // Analytics queries filter by projectId + timestamp
  @@index([projectId, timestamp])
  @@index([timestamp]) // For time-range queries
}

model Asset {
  id             String   @id @default(cuid())
  organizationId String
  projectId      String
  type           AssetType
  createdAt      DateTime @default(now())

  // Storage limit checks query by organizationId
  @@index([organizationId])

  // Project assets query
  @@index([projectId])

  // Filter by type (images, videos, etc.)
  @@index([type])
}
```

### N+1 Query Prevention

```typescript
// ❌ BAD - N+1 Query Problem
// Executes 1 query for projects + 1 query per project = N+1 queries!
async function getProjectsWithPages(orgId: string) {
  const projects = await prisma.project.findMany({
    where: { organizationId: orgId },
  });

  // This loop causes N additional queries
  const result = await Promise.all(
    projects.map(async (project) => {
      const pages = await prisma.page.findMany({
        where: { projectId: project.id },
      });
      return { ...project, pages };
    })
  );

  return result;
}

// ✅ GOOD - Single query with include
// Executes 1 query total (eager loading)
async function getProjectsWithPages(orgId: string) {
  return await prisma.project.findMany({
    where: { organizationId: orgId },
    include: {
      pages: true, // Eager load pages
    },
  });
}

// ✅ GOOD - Alternative: select only needed fields
async function getProjectsCount(orgId: string) {
  return await prisma.project.findMany({
    where: { organizationId: orgId },
    select: {
      id: true,
      name: true,
      _count: {
        select: { pages: true }, // Count without loading all pages
      },
    },
  });
}
```

### Query Performance Tips

```typescript
// ✅ GOOD - Pagination for large datasets
async function getPages(projectId: string, page: number = 1) {
  const pageSize = 50;

  return await prisma.page.findMany({
    where: { projectId },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { updatedAt: 'desc' },
  });
}

// ✅ GOOD - Count with where (don't load all)
async function getPageCount(projectId: string) {
  return await prisma.page.count({
    where: { projectId },
  });
}

// ✅ GOOD - Use select to limit columns
async function getUserEmails(orgId: string) {
  return await prisma.user.findMany({
    where: { organizations: { some: { id: orgId } } },
    select: { email: true, id: true }, // Only these fields
  });
}
```

---

## Bundle Size Optimization

JavaScript bundle size directly impacts LCP and FID. Target <300KB.

### Performance Budget

```json
{
  "Total Page Size": "<1 MB",
  "JavaScript": "<300 KB",
  "CSS": "<100 KB",
  "Images": "<500 KB",
  "Fonts": "<100 KB",
  "Breakpoints": {
    "Critical (LCP)": "<2.5s",
    "Good (FID)": "<100ms",
    "Excellent (CLS)": "<0.1"
  }
}
```

### Analyze Bundle Size

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build

# This generates a visual report of all chunks and their sizes
# Helps identify large dependencies to lazy-load
```

### Bundle Analysis Configuration

```javascript
// next.config.js - Add to existing config
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(module.exports);
```

### Reducing Bundle Size

```typescript
// ❌ BAD - Importing entire library
import * as lodash from 'lodash'; // 70KB!

// ✅ GOOD - Import only what you need
import { debounce } from 'lodash-es'; // 1KB

// ❌ BAD - Heavy date library
import moment from 'moment'; // 65KB!

// ✅ GOOD - Lightweight alternative
import { format } from 'date-fns'; // 10KB

// ❌ BAD - Heavy form library
import { Formik } from 'formik'; // 35KB!

// ✅ GOOD - React Hook Form (lighter)
import { useForm } from 'react-hook-form'; // 8KB

// ✅ GOOD - Dynamic imports for optional features
const HeavyChart = dynamic(() => import('recharts'), {
  loading: () => <ChartPlaceholder />,
});
```

### Tree Shaking

Ensure unused code is removed:

```typescript
// package.json - Mark packages as side-effect free
{
  "sideEffects": false,
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}

// tsconfig.json - Enable tree shaking
{
  "compilerOptions": {
    "module": "esnext", // Enable ES6 modules
    "target": "esnext",
    "lib": ["esnext", "dom", "dom.iterable"]
  }
}
```

---

## CDN & Edge Configuration

Deploy to edge locations globally for <100ms TTFB worldwide.

### Vercel Edge Functions

```typescript
// app/api/edge/route.ts
// Runs on Vercel Edge Network (distributed globally)
export const runtime = 'edge';

export async function GET(request: Request) {
  // This runs on edge, responds in <100ms globally
  return Response.json({ message: 'Hello from edge' });
}

// Example: Edge function for geolocation-based content
export async function GET(request: Request) {
  const country = request.geo?.country;
  const city = request.geo?.city;

  return Response.json({
    message: `Hello from ${city}, ${country}!`,
  });
}
```

### Cache Headers Strategy

```typescript
// app/api/assets/[id]/route.ts
// Immutable assets (hashed filenames)
export async function GET(request: Request) {
  const asset = await getAsset(id);

  return new Response(asset.file, {
    headers: {
      // Cache forever (1 year) - safe because filename has hash
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': asset.mimeType,
      'ETag': asset.hash, // For cache validation
    },
  });
}

// Dynamic content - Don't cache
export async function POST(request: Request) {
  const result = await handleRequest(request);

  return new Response(JSON.stringify(result), {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Content-Type': 'application/json',
    },
  });
}

// HTML pages - Cache with revalidation
export async function GET(request: Request) {
  const page = await getPage(id);

  return new Response(page.html, {
    headers: {
      // Cache for 10 seconds, revalidate in background
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=300',
      'Content-Type': 'text/html',
    },
  });
}
```

### Cloudflare Integration (if using)

```javascript
// wrangler.toml - Cloudflare Workers config
[env.production]
name = "bubble-gum-production"
route = "example.com/*"

[env.production.analytics_binding]
dataset = "web_analytics"

# Cache rules
[env.production.cache]
default_ttl = 3600
```

---

## Performance Checklist (Pre-Deploy)

**14-point checklist to ensure production readiness:**

### Metrics
- [ ] **Lighthouse score 95+ (Desktop & Mobile)**
  - Run: `npm run test:lighthouse`
  - Check on real devices, not just emulation

- [ ] **LCP <2.5s (all pages)**
  - Measure with Web Vitals library
  - Test on slow 4G connection

- [ ] **FID <100ms (all interactions)**
  - Monitor First Input Delay
  - Check button clicks, form inputs

- [ ] **CLS <0.1 (no layout shifts)**
  - Review for image size specifications
  - Check font loading strategy

- [ ] **TTFB <600ms (all regions)**
  - Test from multiple geographic locations
  - Monitor server response time

### Assets
- [ ] **Images optimized (AVIF/WebP)**
  - All images use Next.js Image component
  - All images have `sizes` attribute
  - Blur placeholders added for LCP images

- [ ] **Bundle size <300KB JS**
  - Run: `npm run build && npm run analyze`
  - Identify and lazy-load heavy dependencies

- [ ] **Code splitting implemented**
  - Routes are separate chunks
  - Heavy components use `dynamic()`
  - No duplicate code across chunks

### Infrastructure
- [ ] **Redis caching enabled**
  - Redis instance running
  - Cache keys properly set
  - TTLs configured

- [ ] **Database indexes added**
  - Run: `npx prisma db push`
  - Verify indexes in database
  - Test query performance

- [ ] **CDN configured (Vercel/Cloudflare)**
  - Vercel Edge Functions deployed
  - Cache headers set on assets
  - Global distribution verified

### Code
- [ ] **HTTP caching headers set**
  - `Cache-Control` headers on all routes
  - ETag/Last-Modified for validation
  - Proper TTLs for each asset type

- [ ] **Fonts optimized (next/font)**
  - Using `next/font` for custom fonts
  - Font display strategy set (`swap` or `auto`)
  - Preload critical fonts

- [ ] **No render-blocking resources**
  - Scripts deferred or async
  - No large synchronous JavaScript
  - CSS properly split/loaded

- [ ] **Lazy loading below-the-fold images**
  - Images outside viewport use lazy loading
  - Check scroll depth analytics
  - Verify with DevTools lazy loading indicator

---

## Monitoring

Real User Monitoring (RUM) to track performance in production.

### Real User Monitoring (RUM) Setup

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { useReportWebVitals } from 'next/web-vitals';

export default function RootLayout({ children }: any) {
  // Custom Web Vitals reporting
  useReportWebVitals((metric) => {
    console.log(metric);

    // Send to analytics service
    if (metric.label === 'web-vital') {
      window.gtag?.event(metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.value),
        event_label: metric.id,
      });
    }
  });

  return (
    <html>
      <head>
        {/* Measure Core Web Vitals */}
        <script src="https://unpkg.com/web-vitals@3" />
      </head>
      <body>
        {children}
        {/* Vercel Speed Insights - Lightweight RUM */}
        <SpeedInsights />

        {/* Vercel Analytics - Page views + scroll depth */}
        <Analytics />
      </body>
    </html>
  );
}
```

### Manual Web Vitals Tracking

```typescript
// lib/web-vitals.ts
import {
  getCLS,
  getFID,
  getFCP,
  getLCP,
  getTTFB,
  Metric,
} from 'web-vitals';

export function reportWebVitals() {
  // Largest Contentful Paint
  getLCP((metric: Metric) => {
    console.log('LCP:', metric.value); // Should be <2.5s
    sendToAnalytics('lcp', metric.value);
  });

  // First Input Delay
  getFID((metric: Metric) => {
    console.log('FID:', metric.value); // Should be <100ms
    sendToAnalytics('fid', metric.value);
  });

  // Cumulative Layout Shift
  getCLS((metric: Metric) => {
    console.log('CLS:', metric.value); // Should be <0.1
    sendToAnalytics('cls', metric.value);
  });

  // First Contentful Paint
  getFCP((metric: Metric) => {
    console.log('FCP:', metric.value); // Should be <1.8s
    sendToAnalytics('fcp', metric.value);
  });

  // Time to First Byte
  getTTFB((metric: Metric) => {
    console.log('TTFB:', metric.value); // Should be <600ms
    sendToAnalytics('ttfb', metric.value);
  });
}

function sendToAnalytics(name: string, value: number) {
  // Send to Sentry, DataDog, or your analytics provider
  if (navigator.sendBeacon) {
    const data = JSON.stringify({ name, value });
    navigator.sendBeacon('/api/analytics/web-vitals', data);
  }
}
```

### Lighthouse CI in GitHub Actions

```yaml
# .github/workflows/lighthouse-ci.yml
name: Lighthouse CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  lhci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci

      - run: npm run build

      - uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.json'
```

### Lighthouse CI Configuration

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/dashboard",
        "http://localhost:3000/editor"
      ],
      "staticDistDir": "./out"
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1800 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Key Monitoring Services

| Service | Use Case | Free Tier |
|---------|----------|-----------|
| **Vercel Speed Insights** | Core Web Vitals | Yes (integrated) |
| **Google PageSpeed Insights** | Lighthouse scores | Yes (free) |
| **Sentry** | Error tracking | 5K errors/month |
| **DataDog** | APM + RUM | Limited free |
| **LogRocket** | Session replay | Limited free |
| **Better Uptime** | Status page | Limited free |

---

## Performance Optimization Commands

```bash
# Local testing
npm run test:lighthouse       # Run Lighthouse locally
npm run build && npm run analyze  # Analyze bundle size
npm run dev                   # Start dev server with profiling

# Production checks
npm run build                 # Production build
npm start                     # Test production build locally
npm run type-check           # Type safety check
npm run lint                 # Code quality

# Monitoring
npm run test:e2e             # End-to-end performance tests
npm run test:coverage        # Test coverage (quality metric)
```

---

## Quick Reference

### Performance Golden Rules

1. **Keep JavaScript small** (<300KB)
2. **Optimize images first** (40% of page size)
3. **Cache aggressively** (browser → CDN → Redis)
4. **Lazy load everything** (below-the-fold, heavy libs)
5. **Measure continuously** (Lighthouse, Web Vitals)

### Critical Metrics Priority

1. **LCP** (Largest element load) - MOST important
2. **FID** (Input responsiveness) - User experience
3. **CLS** (Visual stability) - Frustration prevention

### Performance Wins (Ranked by Impact)

| Optimization | Impact | Effort | Priority |
|--------------|--------|--------|----------|
| Image optimization | 40-60% | Low | 🔴 Critical |
| Code splitting | 20-30% | Medium | 🔴 Critical |
| Caching strategy | 30-50% | Medium | 🟠 High |
| Bundle analysis | 10-20% | Low | 🟠 High |
| Lazy loading | 10-25% | Medium | 🟡 Medium |
| Database indexes | 50-80% | Medium | 🟡 Medium |
| Font optimization | 5-15% | Low | 🟢 Low |

---

## Resources

- **Vercel Performance Guide:** https://vercel.com/docs/concepts/analytics/performance-analytics
- **Web Vitals:** https://web.dev/vitals/
- **Next.js Image Optimization:** https://nextjs.org/docs/basic-features/image-optimization
- **Lighthouse:** https://developers.google.com/web/tools/lighthouse
- **PageSpeed Insights:** https://pagespeed.web.dev
- **Chrome DevTools Performance:** https://developer.chrome.com/docs/devtools/performance/

---

**Last Updated:** November 4, 2025
**Document Version:** 1.0.0
**Status:** Production Ready
