# 💾 CACHING STRATEGIES - BUBBLE GUM

**Version:** 1.0.0  
**Last Updated:** November 2, 2025  
**Goal:** Maximize Performance Through Intelligent Caching

---

## 📋 TABLE OF CONTENTS

1. [Caching Overview](#caching-overview)
2. [HTTP Caching](#http-caching)
3. [CDN Caching (Vercel/Cloudflare)](#cdn-caching)
4. [Redis Caching](#redis-caching)
5. [In-Memory Caching](#in-memory-caching)
6. [Database Query Caching](#database-query-caching)
7. [API Response Caching](#api-response-caching)
8. [Static Asset Caching](#static-asset-caching)
9. [Cache Invalidation](#cache-invalidation)
10. [Best Practices](#best-practices)

---

## 🌐 CACHING OVERVIEW

### Caching Layers

```
┌─────────────────────────────────────────────────┐
│ Browser Cache (Client-Side)                     │
├─────────────────────────────────────────────────┤
│ CDN Edge Cache (Vercel/Cloudflare)             │
├─────────────────────────────────────────────────┤
│ Redis Cache (Server-Side)                       │
├─────────────────────────────────────────────────┤
│ In-Memory Cache (Application)                   │
├─────────────────────────────────────────────────┤
│ Database                                         │
└─────────────────────────────────────────────────┘
```

### Cache Hit Ratio Goals

| Layer | Target Hit Ratio | TTL |
|-------|-----------------|-----|
| Browser Cache | 90%+ | 1 year (static), 1 hour (dynamic) |
| CDN Edge Cache | 85%+ | 1 hour - 1 day |
| Redis Cache | 80%+ | 5 minutes - 1 hour |
| In-Memory Cache | 75%+ | 1 minute - 5 minutes |

---

## 🌍 HTTP CACHING

### Cache-Control Headers

```typescript
// lib/cache-headers.ts
export const CacheHeaders = {
  // Static assets (immutable)
  static: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },

  // Images
  images: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },

  // API responses (short-lived)
  api: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  },

  // Pages (ISR)
  isr: {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
  },

  // Private data (no cache)
  private: {
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
  },

  // No cache
  noCache: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
};
```

### Using Cache Headers in API Routes

```typescript
// app/api/pages/route.ts
import { NextResponse } from 'next/server';
import { CacheHeaders } from '@/lib/cache-headers';

export async function GET(request: Request) {
  const pages = await prisma.page.findMany({
    where: { published: true },
    take: 10,
  });

  return NextResponse.json(pages, {
    headers: CacheHeaders.isr,
  });
}
```

### ETag Support

```typescript
// app/api/pages/[id]/route.ts
import { createHash } from 'crypto';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const page = await prisma.page.findUnique({
    where: { id: params.id },
  });

  if (!page) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Generate ETag
  const etag = createHash('md5')
    .update(JSON.stringify(page))
    .digest('hex');

  // Check If-None-Match header
  const ifNoneMatch = request.headers.get('if-none-match');
  if (ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: { 'ETag': etag },
    });
  }

  return NextResponse.json(page, {
    headers: {
      'ETag': etag,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
```

---

## 🚀 CDN CACHING

### Vercel Edge Caching

```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  return <article>{/* Content */}</article>;
}
```

### Edge Config (Vercel)

```typescript
// lib/edge-config.ts
import { get } from '@vercel/edge-config';

export async function getFeatureFlags() {
  try {
    const flags = await get('feature-flags');
    return flags || {};
  } catch (error) {
    console.error('Failed to get feature flags:', error);
    return {};
  }
}

// Usage in middleware
export async function middleware(request: NextRequest) {
  const flags = await getFeatureFlags();

  if (flags.maintenanceMode) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  return NextResponse.next();
}
```

### Cloudflare Caching

```typescript
// middleware.ts (for Cloudflare Workers)
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Set Cloudflare cache headers
  response.headers.set('CDN-Cache-Control', 'max-age=3600');
  response.headers.set('Cloudflare-CDN-Cache-Control', 'max-age=3600');

  return response;
}
```

---

## 🔴 REDIS CACHING

### Setup Redis Client

```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

// Connection check
export async function checkRedisConnection(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis connection failed:', error);
    return false;
  }
}
```

### Cache Wrapper Function

```typescript
// lib/cache.ts
import { redis } from './redis';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
}

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = 3600, tags = [] } = options;

  try {
    // Try to get from cache
    const cached = await redis.get<T>(key);
    if (cached !== null) {
      console.log(`[Cache HIT] ${key}`);
      return cached;
    }

    console.log(`[Cache MISS] ${key}`);

    // Fetch fresh data
    const data = await fetcher();

    // Store in cache
    if (ttl > 0) {
      await redis.setex(key, ttl, data);

      // Store tags for invalidation
      if (tags.length > 0) {
        const tagPromises = tags.map((tag) =>
          redis.sadd(`tag:${tag}`, key)
        );
        await Promise.all(tagPromises);
      }
    }

    return data;
  } catch (error) {
    console.error(`[Cache ERROR] ${key}:`, error);
    // Fallback to fetcher on cache error
    return await fetcher();
  }
}

// Usage
export async function getUser(userId: string) {
  return await getCached(
    `user:${userId}`,
    () => prisma.user.findUnique({ where: { id: userId } }),
    { ttl: 600, tags: ['users'] }
  );
}
```

### Cache Patterns

#### 1. Cache-Aside (Lazy Loading)

```typescript
export async function getPageBySlug(slug: string) {
  const cacheKey = `page:slug:${slug}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  // Fetch from database
  const page = await prisma.page.findUnique({
    where: { slug },
    include: { author: true, blocks: true },
  });

  // Store in cache
  if (page) {
    await redis.setex(cacheKey, 3600, page);
  }

  return page;
}
```

#### 2. Write-Through

```typescript
export async function updatePage(id: string, data: Partial<Page>) {
  // Update database
  const page = await prisma.page.update({
    where: { id },
    data,
  });

  // Update cache immediately
  await redis.setex(`page:${id}`, 3600, page);
  await redis.setex(`page:slug:${page.slug}`, 3600, page);

  return page;
}
```

#### 3. Write-Behind (Write-Back)

```typescript
// Queue write operations
export async function updatePageAsync(id: string, data: Partial<Page>) {
  // Update cache immediately
  const cached = await redis.get<Page>(`page:${id}`);
  if (cached) {
    const updated = { ...cached, ...data };
    await redis.setex(`page:${id}`, 3600, updated);
  }

  // Queue database update
  await redis.lpush('page:updates', JSON.stringify({ id, data }));

  return data;
}

// Background worker processes queue
async function processPageUpdates() {
  while (true) {
    const item = await redis.rpop('page:updates');
    if (!item) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      continue;
    }

    const { id, data } = JSON.parse(item);
    await prisma.page.update({ where: { id }, data });
  }
}
```

### Redis Data Structures

#### 1. Strings (Simple Values)

```typescript
// Set
await redis.set('key', 'value');
await redis.setex('key', 3600, 'value'); // With TTL

// Get
const value = await redis.get('key');

// Increment
await redis.incr('counter');
await redis.incrby('counter', 10);
```

#### 2. Hashes (Objects)

```typescript
// Store user object
await redis.hset('user:123', {
  name: 'John',
  email: 'john@example.com',
  age: 30,
});

// Get entire object
const user = await redis.hgetall('user:123');

// Get specific field
const email = await redis.hget('user:123', 'email');
```

#### 3. Lists (Queues)

```typescript
// Push to queue
await redis.lpush('tasks', JSON.stringify(task));

// Pop from queue
const task = await redis.rpop('tasks');

// Get queue length
const length = await redis.llen('tasks');
```

#### 4. Sets (Unique Values)

```typescript
// Add to set
await redis.sadd('tags:page:123', 'react', 'nextjs', 'typescript');

// Get all members
const tags = await redis.smembers('tags:page:123');

// Check membership
const exists = await redis.sismember('tags:page:123', 'react');
```

#### 5. Sorted Sets (Leaderboards)

```typescript
// Add scores
await redis.zadd('leaderboard', { score: 100, member: 'user1' });
await redis.zadd('leaderboard', { score: 200, member: 'user2' });

// Get top 10
const top10 = await redis.zrevrange('leaderboard', 0, 9);

// Get rank
const rank = await redis.zrank('leaderboard', 'user1');
```

---

## 🧠 IN-MEMORY CACHING

### Simple Memory Cache

```typescript
// lib/memory-cache.ts
interface CacheEntry<T> {
  data: T;
  expires: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check expiration
    if (entry.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T, ttl: number = 60000): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expires < now) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();

// Cleanup every minute
setInterval(() => memoryCache.cleanup(), 60000);
```

### LRU Cache

```typescript
// lib/lru-cache.ts
import LRU from 'lru-cache';

const lruCache = new LRU<string, any>({
  max: 500, // Maximum 500 items
  ttl: 1000 * 60 * 5, // 5 minutes
  updateAgeOnGet: true,
  updateAgeOnHas: false,
});

export async function getCachedLRU<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = lruCache.get(key);
  if (cached) return cached;

  const data = await fetcher();
  lruCache.set(key, data);
  
  return data;
}
```

### Memoization

```typescript
// lib/memoize.ts
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  ttl: number = 60000
): T {
  const cache = new Map<string, { result: any; expires: number }>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && cached.expires > Date.now()) {
      return cached.result;
    }

    const result = fn(...args);
    cache.set(key, {
      result,
      expires: Date.now() + ttl,
    });

    return result;
  }) as T;
}

// Usage
const getUser = memoize(
  async (id: string) => {
    return await prisma.user.findUnique({ where: { id } });
  },
  60000 // 1 minute
);
```

---

## 🗄️ DATABASE QUERY CACHING

### Prisma Query Caching

```typescript
// lib/prisma-cache.ts
import { prisma } from './prisma';
import { redis } from './redis';

export async function cachedQuery<T>(
  cacheKey: string,
  query: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  // Try Redis cache
  const cached = await redis.get<T>(cacheKey);
  if (cached) return cached;

  // Execute query
  const result = await query();

  // Cache result
  await redis.setex(cacheKey, ttl, result);

  return result;
}

// Usage
export async function getRecentPages() {
  return await cachedQuery(
    'pages:recent:10',
    () => prisma.page.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    }),
    300 // 5 minutes
  );
}
```

### Aggregate Query Caching

```typescript
export async function getPageStats(userId: string) {
  return await cachedQuery(
    `stats:user:${userId}`,
    async () => {
      const [totalPages, publishedPages, totalViews] = await Promise.all([
        prisma.page.count({ where: { userId } }),
        prisma.page.count({ where: { userId, published: true } }),
        prisma.page.aggregate({
          where: { userId },
          _sum: { views: true },
        }),
      ]);

      return {
        totalPages,
        publishedPages,
        totalViews: totalViews._sum.views || 0,
      };
    },
    600 // 10 minutes
  );
}
```

---

## 📡 API RESPONSE CACHING

### Next.js Route Handler Caching

```typescript
// app/api/pages/route.ts
import { unstable_cache } from 'next/cache';

const getPages = unstable_cache(
  async () => {
    return await prisma.page.findMany({
      where: { published: true },
      take: 20,
    });
  },
  ['pages-list'],
  {
    revalidate: 3600, // Revalidate every hour
    tags: ['pages'],
  }
);

export async function GET() {
  const pages = await getPages();
  return NextResponse.json(pages);
}
```

### Conditional Caching

```typescript
// app/api/user/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const useCache = searchParams.get('cache') !== 'false';

  let user;

  if (useCache) {
    user = await getCached(
      `user:${params.id}`,
      () => prisma.user.findUnique({ where: { id: params.id } }),
      { ttl: 300 }
    );
  } else {
    user = await prisma.user.findUnique({ where: { id: params.id } });
  }

  return NextResponse.json(user);
}
```

---

## 🖼️ STATIC ASSET CACHING

### Next.js Static Assets

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Cache static assets aggressively
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js|woff2)$/)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }

  // Cache fonts
  if (request.nextUrl.pathname.startsWith('/_next/static/media')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }

  return response;
}
```

### S3/CloudFront Caching

```typescript
// lib/s3-upload.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export async function uploadToS3(file: File, key: string) {
  const buffer = Buffer.from(await file.arrayBuffer());

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // Set cache headers
      CacheControl: 'public, max-age=31536000, immutable',
      // For CloudFront
      Metadata: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  );

  return `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`;
}
```

---

## ♻️ CACHE INVALIDATION

### Tag-Based Invalidation

```typescript
// lib/cache-invalidation.ts
export async function invalidateByTag(tag: string) {
  // Get all keys with this tag
  const keys = await redis.smembers(`tag:${tag}`);

  if (keys.length > 0) {
    // Delete all keys
    await redis.del(...keys);
    
    // Delete tag set
    await redis.del(`tag:${tag}`);
    
    console.log(`[Cache] Invalidated ${keys.length} keys with tag: ${tag}`);
  }
}

// Usage: After updating a page
export async function updatePage(id: string, data: Partial<Page>) {
  const page = await prisma.page.update({
    where: { id },
    data,
  });

  // Invalidate all page caches
  await invalidateByTag('pages');
  await invalidateByTag(`page:${id}`);

  return page;
}
```

### Time-Based Invalidation

```typescript
// Auto-expire after TTL
await redis.setex('key', 3600, value); // Expires after 1 hour

// Manual deletion after time
setTimeout(async () => {
  await redis.del('key');
}, 3600000);
```

### Next.js Cache Revalidation

```typescript
// app/actions/revalidate.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function revalidatePages() {
  // Revalidate specific path
  revalidatePath('/pages');
  
  // Revalidate by tag
  revalidateTag('pages');
}

// On-demand revalidation API
// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const { path, tag } = await request.json();

  if (path) {
    revalidatePath(path);
  }

  if (tag) {
    revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: true });
}
```

---

## ✅ BEST PRACTICES

### 1. Cache Key Naming Convention

```typescript
// Use consistent naming
const CACHE_KEYS = {
  user: (id: string) => `user:${id}`,
  userByEmail: (email: string) => `user:email:${email}`,
  page: (id: string) => `page:${id}`,
  pageBySlug: (slug: string) => `page:slug:${slug}`,
  recentPages: (limit: number) => `pages:recent:${limit}`,
  userStats: (userId: string) => `stats:user:${userId}`,
};
```

### 2. Cache Warm-Up

```typescript
// Warm up cache on server start
export async function warmUpCache() {
  console.log('[Cache] Warming up...');

  // Pre-cache frequently accessed data
  await Promise.all([
    getRecentPages(),
    getPopularPages(),
    getFeatureFlags(),
  ]);

  console.log('[Cache] Warm-up complete');
}
```

### 3. Cache Monitoring

```typescript
// Track cache performance
export async function getCacheStats() {
  const info = await redis.info('stats');
  
  return {
    hits: parseInt(info.match(/keyspace_hits:(\d+)/)?.[1] || '0'),
    misses: parseInt(info.match(/keyspace_misses:(\d+)/)?.[1] || '0'),
    hitRate: 0, // Calculate from hits/misses
  };
}
```

### 4. Graceful Degradation

```typescript
// Always have a fallback
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get<T>(key);
    if (cached) return cached;
  } catch (error) {
    console.error('[Cache] Redis error, falling back to fetcher:', error);
  }

  // Fallback to fresh data
  return await fetcher();
}
```

### 5. Cache Stampede Prevention

```typescript
// Prevent cache stampede with locking
export async function getCachedWithLock<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached) return cached;

  const lockKey = `lock:${key}`;
  const lock = await redis.set(lockKey, '1', {
    ex: 10, // Lock expires in 10 seconds
    nx: true, // Only set if not exists
  });

  if (!lock) {
    // Another process is fetching, wait and retry
    await new Promise(resolve => setTimeout(resolve, 100));
    return getCachedWithLock(key, fetcher, ttl);
  }

  try {
    const data = await fetcher();
    await redis.setex(key, ttl, data);
    return data;
  } finally {
    await redis.del(lockKey);
  }
}
```

---

## 📊 CACHE PERFORMANCE METRICS

### Monitoring Dashboard

```typescript
// app/api/admin/cache-stats/route.ts
export async function GET() {
  const stats = {
    redis: await getCacheStats(),
    memory: {
      usage: process.memoryUsage(),
    },
    cdn: {
      // Fetch from Vercel/Cloudflare analytics
    },
  };

  return NextResponse.json(stats);
}
```

---

**Caching Strategies Status:** ✅ Complete  
**Last Updated:** November 2, 2025  
**Cache Hit Ratio Target:** 85%+
