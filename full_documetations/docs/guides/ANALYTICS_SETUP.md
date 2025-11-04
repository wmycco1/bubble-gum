# 📊 Analytics Setup - Bubble Gum

Complete analytics integration guide.

---

## 🎯 Analytics Stack

- **Google Analytics 4** - User behavior
- **Vercel Analytics** - Core Web Vitals
- **PostHog** - Product analytics
- **Sentry** - Error tracking

---

## 📈 Google Analytics 4

### Setup

```bash
npm install @next/third-parties
```

### Configuration

```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

### Track Events

```typescript
import { event } from 'nextjs-google-analytics';

// Track custom event
event('button_click', {
  category: 'engagement',
  label: 'create_page',
});
```

---

## 📊 Vercel Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## 🔍 PostHog

```bash
npm install posthog-js
```

```typescript
// lib/posthog.ts
import posthog from 'posthog-js';

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: 'https://app.posthog.com',
});

// Track event
posthog.capture('page_created', {
  template: 'blank',
  blocks: 5,
});
```

---

## 🐛 Sentry Error Tracking

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

---

## 📊 Custom Metrics

```typescript
// lib/analytics.ts
export function trackPageView(url: string) {
  window.gtag('event', 'page_view', { page_path: url });
}

export function trackConversion(value: number) {
  window.gtag('event', 'conversion', { value });
}
```

---

## ✅ Events to Track

- Page views
- Sign ups
- Page creations
- Publishes
- Upgrades
- Errors
- Performance metrics

---

**Analytics Setup Complete! 📊**
