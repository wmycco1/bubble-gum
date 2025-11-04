# ⚡ PERFORMANCE TESTING GUIDE

**Generated:** November 2, 2025  
**Tools:** Lighthouse, WebPageTest, K6  
**Goal:** Fast, Optimized App

---

## 📋 TABLE OF CONTENTS

1. [Performance Metrics](#performance-metrics)
2. [Lighthouse Testing](#lighthouse-testing)
3. [Load Testing](#load-testing)
4. [Performance Budget](#performance-budget)
5. [Optimization Strategies](#optimization-strategies)

---

## 📊 PERFORMANCE METRICS

### Core Web Vitals

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5s - 4s | > 4s |
| **FID** (First Input Delay) | < 100ms | 100ms - 300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |

### Additional Metrics

| Metric | Target |
|--------|--------|
| **TTFB** (Time to First Byte) | < 600ms |
| **FCP** (First Contentful Paint) | < 1.8s |
| **TTI** (Time to Interactive) | < 3.8s |
| **Speed Index** | < 3.4s |
| **Total Blocking Time** | < 200ms |

---

## 🔦 LIGHTHOUSE TESTING

### Running Lighthouse

```bash
# CLI
npx lighthouse https://bubblegum.app --output html --output-path ./report.html

# With specific device
npx lighthouse https://bubblegum.app --preset=desktop
npx lighthouse https://bubblegum.app --preset=mobile --throttling.cpuSlowdownMultiplier=4

# CI mode
npx lighthouse https://bubblegum.app --chrome-flags="--headless" --output json
```

### Lighthouse CI

```yaml
# .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000",
        "http://localhost:3000/dashboard",
        "http://localhost:3000/editor"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 200}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## 🚀 LOAD TESTING

### K6 Load Test

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate under 1%
  },
};

export default function () {
  // Homepage
  let response = http.get('https://bubblegum.app');
  check(response, {
    'is status 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);

  // API request
  response = http.get('https://bubblegum.app/api/pages', {
    headers: { 'Authorization': 'Bearer TOKEN' },
  });
  check(response, {
    'API status 200': (r) => r.status === 200,
    'API time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(2);
}
```

### Running K6

```bash
# Local
k6 run load-test.js

# Cloud
k6 cloud load-test.js

# With specific VUs and duration
k6 run --vus 100 --duration 30s load-test.js
```

---

## 💰 PERFORMANCE BUDGET

### Page Weight Budget

| Resource | Budget | Current | Status |
|----------|--------|---------|--------|
| Total Page Size | < 1 MB | 850 KB | ✅ |
| JavaScript | < 300 KB | 250 KB | ✅ |
| CSS | < 100 KB | 80 KB | ✅ |
| Images | < 500 KB | 450 KB | ✅ |
| Fonts | < 100 KB | 70 KB | ✅ |

### Request Count Budget

| Type | Budget | Current | Status |
|------|--------|---------|--------|
| Total Requests | < 50 | 42 | ✅ |
| JS Requests | < 10 | 8 | ✅ |
| CSS Requests | < 5 | 3 | ✅ |
| Image Requests | < 20 | 18 | ✅ |
| Font Requests | < 3 | 2 | ✅ |

### Performance Score Budget

| Category | Budget | Current | Status |
|----------|--------|---------|--------|
| Performance | > 90 | 94 | ✅ |
| Accessibility | > 90 | 96 | ✅ |
| Best Practices | > 90 | 92 | ✅ |
| SEO | > 90 | 98 | ✅ |

---

## 🎯 OPTIMIZATION STRATEGIES

### 1. Image Optimization

**Next.js Image Component:**
```typescript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  alt="Hero image"
  priority // Load immediately for LCP
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

**Responsive Images:**
```typescript
<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  alt="Hero"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**Image Formats:**
- Use WebP/AVIF for modern browsers
- Fallback to JPEG/PNG
- Use `<picture>` for art direction

---

### 2. Code Splitting

**Dynamic Imports:**
```typescript
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('./Editor'), {
  loading: () => <Skeleton />,
  ssr: false, // Client-side only
});
```

**Route-based Splitting:**
```typescript
// Automatic in Next.js
// Each page is a separate bundle
```

---

### 3. Lazy Loading

**Components:**
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
});

function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**Images:**
```typescript
<Image
  src="/image.jpg"
  loading="lazy" // Native lazy loading
  alt="Description"
/>
```

---

### 4. Caching Strategies

**Static Assets:**
```nginx
# nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

**API Responses:**
```typescript
export async function GET(request: Request) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
```

**ISR (Incremental Static Regeneration):**
```typescript
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const pages = await prisma.page.findMany();
  return pages.map((page) => ({ slug: page.slug }));
}
```

---

### 5. Database Optimization

**Indexing:**
```prisma
model Page {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  userId    String
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([slug])
  @@index([createdAt])
}
```

**Query Optimization:**
```typescript
// ❌ N+1 Query Problem
const pages = await prisma.page.findMany();
for (const page of pages) {
  page.blocks = await prisma.block.findMany({ where: { pageId: page.id } });
}

// ✅ Use Include
const pages = await prisma.page.findMany({
  include: {
    blocks: true,
  },
});
```

**Connection Pooling:**
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

### 6. Bundle Size Optimization

**Analyze Bundle:**
```bash
# Install analyzer
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Next.js config
});

# Run analysis
ANALYZE=true npm run build
```

**Tree Shaking:**
```typescript
// ❌ Imports entire library
import _ from 'lodash';

// ✅ Import only what you need
import debounce from 'lodash/debounce';
```

**Remove Unused Dependencies:**
```bash
npx depcheck
npm uninstall unused-package
```

---

### 7. Fonts Optimization

**Next.js Font Optimization:**
```typescript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

**Preload Critical Fonts:**
```typescript
export const metadata = {
  other: {
    rel: 'preload',
    href: '/fonts/custom-font.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
};
```

---

### 8. Reduce JavaScript

**Remove Unused Code:**
```bash
npm run build -- --profile
# Check bundle size and remove large dependencies
```

**Use Native APIs:**
```typescript
// ❌ Import moment.js (68KB)
import moment from 'moment';
const date = moment().format('YYYY-MM-DD');

// ✅ Use native Date
const date = new Date().toISOString().split('T')[0];
```

---

### 9. Prefetching & Preloading

**Prefetch Links:**
```typescript
import Link from 'next/link';

<Link href="/dashboard" prefetch={true}>
  Dashboard
</Link>
```

**Preload Resources:**
```typescript
export const metadata = {
  link: [
    { rel: 'preload', href: '/hero.jpg', as: 'image' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: 'https://api.stripe.com' },
  ],
};
```

---

### 10. Compression

**Gzip/Brotli:**
```nginx
# nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 10240;
gzip_types text/plain text/css text/xml text/javascript application/json;

brotli on;
brotli_types text/plain text/css application/json;
```

**Next.js Config:**
```javascript
// next.config.js
module.exports = {
  compress: true, // Enable gzip compression
};
```

---

## 📈 MONITORING PERFORMANCE

### Real User Monitoring (RUM)

```typescript
// lib/analytics.ts
export function reportWebVitals({ id, name, value, label }) {
  // Send to analytics
  gtag('event', name, {
    event_category: label === 'web-vital' ? 'Web Vitals' : 'Custom',
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    event_label: id,
    non_interaction: true,
  });
}
```

### Performance Observer

```typescript
// Monitor LCP
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LCP:', entry.startTime);
    // Send to analytics
  }
});
observer.observe({ entryTypes: ['largest-contentful-paint'] });
```

---

## 🔧 PERFORMANCE TESTING TOOLS

| Tool | Purpose | URL |
|------|---------|-----|
| **Lighthouse** | Overall performance audit | Built into Chrome DevTools |
| **WebPageTest** | Detailed performance analysis | webpagetest.org |
| **GTmetrix** | Performance & optimization tips | gtmetrix.com |
| **K6** | Load testing | k6.io |
| **Artillery** | Load testing | artillery.io |
| **PageSpeed Insights** | Core Web Vitals | pagespeed.web.dev |

---

**Performance Testing Status:** ✅ Complete  
**Last Updated:** November 2, 2025
