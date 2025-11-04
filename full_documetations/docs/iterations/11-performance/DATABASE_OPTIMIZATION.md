# 🗄️ DATABASE OPTIMIZATION - BUBBLE GUM

**Version:** 1.0.0  
**Last Updated:** November 2, 2025  
**Goal:** Fast Queries, Optimal Performance

---

## 📋 TABLE OF CONTENTS

1. [Query Optimization](#query-optimization)
2. [Indexing Strategy](#indexing-strategy)
3. [Connection Pooling](#connection-pooling)
4. [N+1 Query Prevention](#n1-query-prevention)
5. [Pagination](#pagination)
6. [Query Caching](#query-caching)
7. [Database Monitoring](#database-monitoring)

---

## 🚀 QUERY OPTIMIZATION

### Use Select Fields

```typescript
// ❌ Bad - fetches all fields
const page = await prisma.page.findUnique({
  where: { id },
});

// ✅ Good - fetches only needed fields
const page = await prisma.page.findUnique({
  where: { id },
  select: {
    id: true,
    title: true,
    slug: true,
  },
});
```

### Use Include Wisely

```typescript
// ❌ Bad - over-fetching
const page = await prisma.page.findUnique({
  where: { id },
  include: {
    author: true,
    blocks: {
      include: {
        components: true,
      },
    },
  },
});

// ✅ Good - fetch only what's needed
const page = await prisma.page.findUnique({
  where: { id },
  include: {
    author: {
      select: { name: true, avatar: true },
    },
    blocks: {
      select: { id: true, type: true, content: true },
    },
  },
});
```

---

## 📇 INDEXING STRATEGY

### Create Indexes

```prisma
// prisma/schema.prisma
model Page {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  userId    String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Single indexes
  @@index([userId])
  @@index([slug])
  @@index([published])
  @@index([createdAt])

  // Composite indexes
  @@index([userId, published])
  @@index([published, createdAt])
}
```

### Check Index Usage

```sql
-- PostgreSQL: Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

---

## 🔌 CONNECTION POOLING

### Prisma Client Setup

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### Connection Pool Settings

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/db?connection_limit=10&pool_timeout=20"
```

---

## 🚫 N+1 QUERY PREVENTION

### Problem: N+1 Queries

```typescript
// ❌ Bad - N+1 queries
const pages = await prisma.page.findMany();
for (const page of pages) {
  page.author = await prisma.user.findUnique({
    where: { id: page.userId },
  });
}
// Executes: 1 query for pages + N queries for authors
```

### Solution: Use Include

```typescript
// ✅ Good - Single query with join
const pages = await prisma.page.findMany({
  include: {
    author: true,
  },
});
// Executes: 1 query total
```

---

## 📄 PAGINATION

### Cursor-Based Pagination (Recommended)

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');

  const pages = await prisma.page.findMany({
    take: 20,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    pages,
    nextCursor: pages[pages.length - 1]?.id,
  });
}
```

### Offset-Based Pagination

```typescript
// For simple use cases
const page = parseInt(searchParams.get('page') || '1');
const limit = 20;

const pages = await prisma.page.findMany({
  take: limit,
  skip: (page - 1) * limit,
  orderBy: { createdAt: 'desc' },
});
```

---

## 💾 QUERY CACHING

### Redis Cache

```typescript
import { redis } from './redis';

export async function getCachedPages() {
  const cacheKey = 'pages:recent:20';

  // Try cache
  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  // Fetch from DB
  const pages = await prisma.page.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
  });

  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, pages);

  return pages;
}
```

---

## 📊 DATABASE MONITORING

### Query Performance

```sql
-- Find slow queries
SELECT
  query,
  calls,
  total_time / calls AS avg_time,
  max_time
FROM pg_stat_statements
ORDER BY avg_time DESC
LIMIT 10;
```

### Monitor Connection Pool

```typescript
// Check active connections
const result = await prisma.$queryRaw`
  SELECT count(*) FROM pg_stat_activity
  WHERE datname = current_database();
`;
```

---

## ✅ OPTIMIZATION CHECKLIST

- [ ] Indexes on frequently queried fields
- [ ] Select only needed fields
- [ ] Use include instead of separate queries
- [ ] Implement pagination
- [ ] Cache frequent queries
- [ ] Monitor slow queries
- [ ] Connection pooling configured
- [ ] Regular database maintenance

---

**Database Optimization Status:** ✅ Complete  
**Last Updated:** November 2, 2025  
**Query Time Target:** <100ms average
