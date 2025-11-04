# 🌐 CDN CONFIGURATION - BUBBLE GUM

**Version:** 1.0.0  
**Last Updated:** November 2, 2025  
**Goal:** Global Edge Distribution, <100ms TTFB

---

## 📋 TABLE OF CONTENTS

1. [CDN Overview](#cdn-overview)
2. [Vercel Edge Network](#vercel-edge-network)
3. [Cloudflare CDN](#cloudflare-cdn)
4. [AWS CloudFront](#aws-cloudfront)
5. [Cache Configuration](#cache-configuration)
6. [Edge Functions](#edge-functions)
7. [Custom Domain Setup](#custom-domain-setup)
8. [SSL/TLS Configuration](#ssltls-configuration)
9. [Monitoring & Analytics](#monitoring--analytics)
10. [Best Practices](#best-practices)

---

## 🌍 CDN OVERVIEW

### Why Use CDN?

- **Faster Load Times:** Serve content from edge locations near users
- **Reduced Server Load:** Offload static content delivery
- **Better Availability:** Distributed architecture prevents single point of failure
- **DDoS Protection:** Built-in protection against attacks
- **Cost Effective:** Reduce bandwidth costs

### Edge Locations

```
User Request → Nearest Edge → Origin (if cache miss)
     ↓              ↓
   <100ms      Cached Content
```

### CDN Comparison

| Feature | Vercel | Cloudflare | CloudFront |
|---------|--------|------------|------------|
| Edge Locations | 300+ | 300+ | 450+ |
| Setup | Automatic | Manual | Manual |
| SSL | Auto | Auto | Manual |
| Purge API | ✅ | ✅ | ✅ |
| Edge Functions | ✅ | ✅ | ✅ |
| Cost | Included | Free tier | Pay-as-you-go |

---

## ⚡ VERCEL EDGE NETWORK

### Automatic Configuration

```typescript
// next.config.js
module.exports = {
  // Vercel automatically enables CDN for all deployments
  // No additional configuration needed!
  
  // Optional: Configure cache headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=7200',
          },
        ],
      },
    ];
  },
};
```

### Vercel Edge Config

```typescript
// lib/edge-config.ts
import { get, getAll } from '@vercel/edge-config';

export async function getFeatureFlags() {
  return await get('featureFlags');
}

export async function getAllConfig() {
  return await getAll();
}

// Use in middleware
export async function middleware(request: NextRequest) {
  const config = await getFeatureFlags();
  
  if (config.maintenanceMode) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  return NextResponse.next();
}
```

### Vercel Analytics

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

### Cache Purging

```bash
# Vercel CLI
vercel deploy --prod

# Purge entire cache
curl -X PURGE https://bubblegum.app/*

# Purge specific path
curl -X PURGE https://bubblegum.app/api/pages
```

---

## 🟧 CLOUDFLARE CDN

### Setup with Next.js

```bash
# Install Cloudflare
npm install -D @cloudflare/next-on-pages

# Deploy to Cloudflare Pages
npm run pages:build
npx wrangler pages publish .vercel/output/static
```

### Cloudflare Configuration

```javascript
// wrangler.toml
name = "bubblegum"
compatibility_date = "2024-01-01"

[env.production]
route = "bubblegum.app/*"
zone_name = "bubblegum.app"

[[env.production.kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"

[[env.production.r2_buckets]]
binding = "IMAGES"
bucket_name = "bubblegum-images"
```

### Page Rules

```typescript
// Cloudflare Page Rules (in dashboard)
{
  "url": "bubblegum.app/assets/*",
  "actions": {
    "cacheLevel": "aggressive",
    "edgeCacheTtl": 31536000, // 1 year
    "browserCacheTtl": 31536000
  }
}

{
  "url": "bubblegum.app/api/*",
  "actions": {
    "cacheLevel": "standard",
    "edgeCacheTtl": 3600,
    "browserCacheTtl": 0
  }
}
```

### Workers KV for Caching

```typescript
// workers/cache.ts
export async function handleRequest(request: Request, env: Env) {
  const cacheKey = new URL(request.url).pathname;

  // Try to get from KV
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'X-Cache': 'HIT',
      },
    });
  }

  // Fetch from origin
  const response = await fetch(request);
  const data = await response.text();

  // Store in KV
  await env.CACHE.put(cacheKey, data, {
    expirationTtl: 3600,
  });

  return new Response(data, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'X-Cache': 'MISS',
    },
  });
}
```

### Image Resizing

```typescript
// workers/image-resize.ts
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    const width = url.searchParams.get('w') || '800';
    const quality = url.searchParams.get('q') || '80';

    // Get original image
    const imageUrl = url.searchParams.get('url');
    if (!imageUrl) {
      return new Response('Missing url parameter', { status: 400 });
    }

    // Fetch and resize
    const response = await fetch(imageUrl);
    const image = await response.arrayBuffer();

    // Use Cloudflare Image Resizing
    return new Response(image, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CF-Resize': `width=${width},quality=${quality},format=webp`,
      },
    });
  },
};
```

### Cache Purging

```typescript
// lib/cloudflare-purge.ts
export async function purgeCloudflareCache(urls: string[]) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL!,
        'X-Auth-Key': process.env.CLOUDFLARE_API_KEY!,
      },
      body: JSON.stringify({ files: urls }),
    }
  );

  return await response.json();
}

// Usage
await purgeCloudflareCache([
  'https://bubblegum.app/api/pages',
  'https://bubblegum.app/assets/hero.jpg',
]);
```

---

## 🔶 AWS CLOUDFRONT

### CloudFront Distribution Setup

```typescript
// infrastructure/cloudfront.ts (AWS CDK)
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class CloudFrontStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // S3 bucket for static assets
    const bucket = new s3.Bucket(this, 'AssetsBucket', {
      bucketName: 'bubblegum-assets',
      publicReadAccess: false,
    });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      
      // Custom domain
      domainNames: ['bubblegum.app', 'www.bubblegum.app'],
      certificate: certificate,
      
      // Price class
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      
      // Enable logging
      enableLogging: true,
      logBucket: logBucket,
    });

    // Additional behaviors
    distribution.addBehavior('/api/*', new origins.HttpOrigin('api.bubblegum.app'), {
      cachePolicy: new cloudfront.CachePolicy(this, 'ApiCachePolicy', {
        cachePolicyName: 'ApiCachePolicy',
        defaultTtl: Duration.minutes(5),
        maxTtl: Duration.hours(1),
        minTtl: Duration.seconds(0),
      }),
    });
  }
}
```

### CloudFront Functions

```javascript
// cloudfront-functions/url-rewrite.js
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Remove .html extension
  if (uri.endsWith('.html')) {
    request.uri = uri.slice(0, -5);
  }

  // Add index.html for directory requests
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  }

  return request;
}
```

### Lambda@Edge for Advanced Logic

```typescript
// lambda-edge/optimize-images.ts
import { CloudFrontRequest, CloudFrontRequestEvent } from 'aws-lambda';
import sharp from 'sharp';

export async function handler(event: CloudFrontRequestEvent) {
  const request = event.Records[0].cf.request;
  const params = request.querystring;

  // Parse query parameters
  const width = parseInt(params.match(/w=(\d+)/)?.[1] || '800');
  const quality = parseInt(params.match(/q=(\d+)/)?.[1] || '80');

  // Fetch original image from S3
  const s3 = new S3();
  const imageData = await s3.getObject({
    Bucket: 'bubblegum-assets',
    Key: request.uri.substring(1),
  }).promise();

  // Resize and optimize
  const optimized = await sharp(imageData.Body as Buffer)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();

  return {
    status: '200',
    statusDescription: 'OK',
    body: optimized.toString('base64'),
    bodyEncoding: 'base64',
    headers: {
      'content-type': [{ value: 'image/webp' }],
      'cache-control': [{ value: 'public, max-age=31536000, immutable' }],
    },
  };
}
```

### Cache Invalidation

```typescript
// lib/cloudfront-invalidation.ts
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';

const client = new CloudFrontClient({ region: 'us-east-1' });

export async function invalidateCloudFront(paths: string[]) {
  const command = new CreateInvalidationCommand({
    DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID!,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: paths.length,
        Items: paths,
      },
    },
  });

  const response = await client.send(command);
  return response.Invalidation;
}

// Usage
await invalidateCloudFront([
  '/api/*',
  '/assets/hero.jpg',
]);
```

---

## 🎛️ CACHE CONFIGURATION

### Static Assets

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.{jpg,jpeg,png,gif,svg,ico,webp,avif}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.{woff,woff2,ttf,otf,eot}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### API Routes

```typescript
// app/api/pages/route.ts
export async function GET() {
  const pages = await prisma.page.findMany();

  return NextResponse.json(pages, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      'CDN-Cache-Control': 'max-age=3600',
      'Vercel-CDN-Cache-Control': 'max-age=3600',
    },
  });
}
```

### Dynamic Pages

```typescript
// app/pages/[slug]/page.tsx
export const revalidate = 3600; // ISR every hour

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
  });

  return {
    title: page?.title,
    description: page?.description,
  };
}
```

---

## 🚀 EDGE FUNCTIONS

### Vercel Edge Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge', // Run on edge
};

export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'US';
  const city = request.geo?.city || 'Unknown';

  const response = NextResponse.next();
  response.headers.set('X-User-Location', `${city}, ${country}`);

  return response;
}
```

### Cloudflare Workers

```typescript
// workers/api.ts
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    // Route to different origins based on path
    if (url.pathname.startsWith('/api')) {
      return fetch(new URL(url.pathname, 'https://api.bubblegum.app'));
    }

    if (url.pathname.startsWith('/assets')) {
      return fetch(new URL(url.pathname, env.ASSETS_URL));
    }

    return fetch(request);
  },
};
```

---

## 🌐 CUSTOM DOMAIN SETUP

### DNS Configuration

```bash
# A Record (IPv4)
bubblegum.app    A    76.76.21.21

# AAAA Record (IPv6)
bubblegum.app    AAAA    2606:4700::6810:...

# CNAME for www
www.bubblegum.app    CNAME    bubblegum.app

# CNAME for Vercel
bubblegum.app    CNAME    cname.vercel-dns.com
```

### Vercel Custom Domain

```bash
# Add domain in Vercel dashboard or CLI
vercel domains add bubblegum.app

# Verify
vercel domains ls
```

### Cloudflare Custom Domain

```typescript
// Cloudflare Pages configuration
{
  "projectName": "bubblegum",
  "production_branch": "main",
  "custom_domains": [
    "bubblegum.app",
    "www.bubblegum.app"
  ]
}
```

---

## 🔒 SSL/TLS CONFIGURATION

### Auto SSL (Vercel/Cloudflare)

```bash
# Automatic with Vercel - no configuration needed
# Automatic with Cloudflare - enable in dashboard
```

### Custom Certificate

```bash
# Upload to CloudFront (AWS CLI)
aws acm import-certificate \
  --certificate file://cert.pem \
  --certificate-chain file://chain.pem \
  --private-key file://key.pem \
  --region us-east-1
```

### HSTS Header

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};
```

---

## 📊 MONITORING & ANALYTICS

### Vercel Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### CloudFlare Analytics

```bash
# Via Cloudflare API
curl -X GET "https://api.cloudflare.com/client/v4/zones/{zone_id}/analytics/dashboard" \
  -H "X-Auth-Email: email@example.com" \
  -H "X-Auth-Key: api-key"
```

### Custom Monitoring

```typescript
// lib/cdn-monitoring.ts
export async function getCDNStats() {
  const stats = {
    cacheHitRatio: 0,
    bandwidth: 0,
    requests: 0,
  };

  // Fetch from your CDN provider's API
  // Vercel, Cloudflare, or CloudFront

  return stats;
}
```

---

## ✅ BEST PRACTICES

### 1. Set Long Cache TTLs for Static Assets

```typescript
// 1 year for immutable assets
'Cache-Control': 'public, max-age=31536000, immutable'
```

### 2. Use stale-while-revalidate

```typescript
// Serve stale content while fetching fresh
'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
```

### 3. Purge Cache on Deploy

```bash
# Vercel (automatic)
vercel deploy --prod

# Cloudflare
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "X-Auth-Key: {api_key}" \
  -d '{"purge_everything":true}'
```

### 4. Monitor Cache Hit Ratio

- Target: 85%+ hit ratio
- Track: Cache hits vs misses
- Optimize: Increase TTLs for high-traffic routes

### 5. Use Edge Functions for Personalization

```typescript
// Personalize at the edge without cache miss
export function middleware(request: NextRequest) {
  const country = request.geo?.country;
  
  // Different content based on location
  if (country === 'US') {
    return NextResponse.rewrite(new URL('/us', request.url));
  }
  
  return NextResponse.next();
}
```

---

## 📋 CDN CHECKLIST

- [ ] CDN configured (Vercel/Cloudflare/CloudFront)
- [ ] Custom domain setup
- [ ] SSL certificate active
- [ ] Cache headers configured
- [ ] Static assets cached (1 year)
- [ ] API responses cached (appropriate TTL)
- [ ] Edge functions deployed
- [ ] Cache purging strategy
- [ ] Monitoring enabled
- [ ] HSTS header set

---

**CDN Configuration Status:** ✅ Complete  
**Last Updated:** November 2, 2025  
**Target:** <100ms TTFB globally
