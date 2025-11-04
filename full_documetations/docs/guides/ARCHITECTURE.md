# 🏗️ Bubble Gum - Detailed Architecture Documentation

**Version:** 1.0.0  
**Last Updated:** November 3, 2025  
**Status:** Production Architecture  
**Maintainer:** Architecture Team

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Core Components](#core-components)
4. [Data Flow](#data-flow)
5. [Security Architecture](#security-architecture)
6. [Scalability & Performance](#scalability--performance)
7. [Infrastructure](#infrastructure)
8. [Design Decisions](#design-decisions)
9. [Integration Points](#integration-points)
10. [Monitoring & Observability](#monitoring--observability)
11. [Disaster Recovery](#disaster-recovery)
12. [Future Architecture](#future-architecture)

---

## 🎯 System Overview

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         USERS                                 │
│         (Web Browser, Mobile App, API Clients)               │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ HTTPS
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                    CDN Layer (Vercel Edge)                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  • Static Assets Caching                               │  │
│  │  • Image Optimization                                  │  │
│  │  │  Edge Functions (Geolocation, A/B Testing)         │  │
│  │  • DDoS Protection                                     │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼─────────────────────────────────────┐
│              Application Layer (Next.js 14)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 Frontend (React 18)                   │   │
│  │  ┌──────────────┬──────────────┬──────────────┐     │   │
│  │  │ Page Builder │ Admin Panel  │  Public Pages │     │   │
│  │  │  (Editor UI) │ (Dashboard)  │  (Published)  │     │   │
│  │  └──────────────┴──────────────┴──────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Layer (tRPC + REST)                  │   │
│  │  ┌──────────────┬──────────────┬──────────────┐     │   │
│  │  │ Projects API │  Pages API   │  Assets API  │     │   │
│  │  │ Users API    │ Analytics API│ Payments API │     │   │
│  │  └──────────────┴──────────────┴──────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Business Logic Layer                       │   │
│  │  ┌──────────────┬──────────────┬──────────────┐     │   │
│  │  │ AI Generator │ Page Render  │  Payments    │     │   │
│  │  │ Auth Manager │ File Manager │  Analytics   │     │   │
│  │  └──────────────┴──────────────┴──────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬─────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │    Redis     │  │   AWS S3     │
│   Database   │  │    Cache     │  │   Storage    │
│              │  │              │  │              │
│ • Users      │  │ • Sessions   │  │ • Images     │
│ • Projects   │  │ • Page Cache │  │ • Videos     │
│ • Pages      │  │ • Rate Limit │  │ • Documents  │
│ • Analytics  │  │ • Temp Data  │  │ • Backups    │
└──────────────┘  └──────────────┘  └──────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  External APIs   │
              ├──────────────────┤
              │ • Clerk (Auth)   │
              │ • Anthropic (AI) │
              │ • Stripe (Pay)   │
              │ • Sentry (Mon)   │
              └──────────────────┘
```

---

## 🏛️ Architecture Layers

### 1. Presentation Layer

**Responsibility:** User interface and user experience

**Components:**
- **Page Builder Editor**
  - Drag-and-drop interface
  - Real-time preview
  - Component palette
  - Property inspector
  
- **Admin Dashboard**
  - Project management
  - Analytics overview
  - User settings
  - Billing interface

- **Public Pages**
  - Server-side rendered
  - Optimized for SEO
  - Fast page loads
  - Progressive enhancement

**Technologies:**
- React 18 (Server + Client Components)
- Tailwind CSS (Styling)
- shadcn/ui (Component library)
- Zustand (Client state)
- React Query (Server state)

**Design Patterns:**
- Atomic Design (components structure)
- Composition over inheritance
- Render props for flexibility
- Custom hooks for logic reuse

---

### 2. API Layer

**Responsibility:** Business logic exposure and data access

**Technologies:**
- **tRPC** (Primary API - type-safe)
- **REST API** (External integrations)
- **GraphQL** (Future consideration)

**API Structure:**

```
src/server/api/
├── routers/
│   ├── projects.ts      (Project CRUD)
│   ├── pages.ts         (Page operations)
│   ├── components.ts    (Component management)
│   ├── users.ts         (User management)
│   ├── analytics.ts     (Analytics data)
│   ├── ai.ts           (AI generation)
│   └── payments.ts      (Stripe integration)
├── middlewares/
│   ├── auth.ts         (Authentication)
│   ├── rateLimit.ts    (Rate limiting)
│   └── logging.ts      (Request logging)
└── root.ts             (tRPC router)
```

**Authentication Flow:**

```
Request → Clerk JWT Verification → 
User Context → Authorization Check → 
API Handler → Response
```

**Error Handling:**

```typescript
// Standardized error responses
{
  success: false,
  error: {
    code: 'PROJECT_NOT_FOUND',
    message: 'Project not found',
    details: { projectId: '123' }
  }
}
```

---

### 3. Business Logic Layer

**Responsibility:** Core application logic

**Key Services:**

#### AI Generation Service
```typescript
AIGenerationService {
  generatePage(prompt, businessType, style)
  generateComponent(type, content)
  optimizeContent(text)
  suggestImprovements(page)
}
```

**Implementation:**
- Anthropic Claude Sonnet 4.5
- Prompt templates in `/docs/iterations/08-ai-components/`
- Token optimization
- Rate limiting per user tier

#### Page Rendering Service
```typescript
PageRenderService {
  renderPage(pageData)
  compileComponents(componentList)
  optimizeAssets(page)
  generateHTML(page)
}
```

**Implementation:**
- SSR for initial load
- ISR for published pages
- Component-based rendering
- CSS-in-JS with Tailwind

#### File Management Service
```typescript
FileManagerService {
  uploadFile(file, metadata)
  optimizeImage(image, options)
  deleteFile(fileId)
  generateCDNUrl(file)
}
```

**Implementation:**
- AWS S3 for storage
- Image optimization (Sharp)
- CDN integration (CloudFront)
- Automatic backup

---

### 4. Data Layer

**Responsibility:** Data persistence and retrieval

#### Database Schema (Prisma)

**Key Models:**

```prisma
model User {
  id            String    @id @default(cuid())
  clerkId       String    @unique
  email         String    @unique
  organizations Organization[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Organization {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  plan        Plan      @default(FREE)
  projects    Project[]
  users       User[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Project {
  id             String    @id @default(cuid())
  name           String
  slug           String    @unique
  organizationId String
  organization   Organization @relation(...)
  pages          Page[]
  publishedAt    DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model Page {
  id          String    @id @default(cuid())
  name        String
  slug        String
  projectId   String
  project     Project   @relation(...)
  content     Json      // Page structure
  metadata    Json      // SEO, OG tags
  isPublished Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**Database Optimization:**
- Connection pooling (Prisma)
- Query optimization (indexes)
- Read replicas for analytics
- Soft deletes for recovery

#### Caching Strategy (Redis)

**Cache Layers:**

1. **Session Cache** (TTL: 24 hours)
   - User sessions
   - Auth tokens

2. **Page Cache** (TTL: 1 hour)
   - Published pages
   - Component library

3. **Query Cache** (TTL: 5 minutes)
   - Analytics data
   - Dashboard stats

4. **Rate Limit Cache** (TTL: 1 minute)
   - API rate limits
   - AI generation limits

**Cache Strategy:**

```typescript
// Cache-Aside Pattern
async function getProject(id: string) {
  const cached = await redis.get(`project:${id}`);
  if (cached) return JSON.parse(cached);
  
  const project = await prisma.project.findUnique({ where: { id } });
  await redis.setex(`project:${id}`, 3600, JSON.stringify(project));
  
  return project;
}
```

---

## 🔄 Data Flow

### Page Creation Flow

```
1. User Input (Editor)
   ↓
2. Client Validation (Zod)
   ↓
3. tRPC Mutation
   ↓
4. Server Validation
   ↓
5. Business Logic
   - Generate components
   - Optimize assets
   - Save to database
   ↓
6. Cache Update
   ↓
7. Response to Client
   ↓
8. UI Update (Optimistic)
```

### AI Generation Flow

```
1. User Prompt
   ↓
2. Rate Limit Check
   ↓
3. Prompt Engineering
   - Template selection
   - Context injection
   - Token optimization
   ↓
4. Anthropic API Call
   ↓
5. Response Processing
   - Parse JSON
   - Validate structure
   - Sanitize content
   ↓
6. Component Generation
   ↓
7. Save to Database
   ↓
8. Return to Editor
```

### Page Publishing Flow

```
1. Publish Request
   ↓
2. Validation
   - Check limits
   - Validate content
   - Verify domain
   ↓
3. Build Process
   - Compile components
   - Optimize assets
   - Generate HTML
   ↓
4. Deploy to Edge
   - Upload to CDN
   - Update DNS (if custom domain)
   - Invalidate cache
   ↓
5. Update Database
   - Set publishedAt
   - Create deployment record
   ↓
6. Notify User
```

---

## 🔒 Security Architecture

### Authentication & Authorization

**Authentication Provider:** Clerk

**Flow:**
```
1. User Login → Clerk
2. Clerk Issues JWT
3. JWT Sent with Requests
4. Server Verifies JWT
5. Extract User Context
6. Check Permissions
7. Allow/Deny
```

**Authorization Levels:**

| Role | Permissions |
|------|-------------|
| **Owner** | Full control |
| **Admin** | Manage projects, invite users |
| **Editor** | Edit content |
| **Viewer** | Read-only |

**Implementation:**

```typescript
// Middleware for tRPC
const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { userId: ctx.session.userId } });
});
```

### Data Security

**Encryption:**
- **At Rest:** PostgreSQL encrypted volumes
- **In Transit:** TLS 1.3 only
- **Secrets:** Environment variables (Vercel)

**Data Validation:**
- **Input:** Zod schemas everywhere
- **Output:** Type-safe responses (tRPC)
- **SQL Injection:** Prisma parameterized queries
- **XSS:** React automatic escaping + DOMPurify

**API Security:**
- **Rate Limiting:** Redis-based
- **CORS:** Whitelist origins
- **CSRF:** Next.js built-in protection
- **Headers:** Security headers (Helmet)

### File Upload Security

```typescript
// File validation
const validateUpload = (file: File) => {
  // 1. Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  // 2. Check file size
  if (file.size > MAX_SIZE) {
    throw new Error('File too large');
  }
  
  // 3. Scan for malware (VirusTotal API)
  await scanFile(file);
  
  // 4. Generate safe filename
  const safeFilename = sanitizeFilename(file.name);
  
  return safeFilename;
};
```

---

## ⚡ Scalability & Performance

### Horizontal Scaling

**Stateless Architecture:**
- No server-side sessions (JWT)
- All state in database/cache
- Serverless functions auto-scale

**Load Balancing:**
- Vercel Edge Network
- Automatic traffic distribution
- Geographic routing

**Database Scaling:**
- Connection pooling (PgBouncer)
- Read replicas for analytics
- Sharding strategy (future)

### Performance Optimization

**Frontend:**
- **Code Splitting:** Automatic (Next.js)
- **Image Optimization:** Next/Image + Sharp
- **Lazy Loading:** React.lazy + Suspense
- **Prefetching:** Link prefetch
- **Bundle Size:** Tree shaking, minimize

**Backend:**
- **Query Optimization:** N+1 prevention (Prisma)
- **Caching:** Multi-layer (Redis)
- **CDN:** CloudFront for assets
- **Compression:** Gzip/Brotli

**Database:**
- **Indexes:** On all foreign keys
- **Query Plan:** Analyzed regularly
- **Vacuum:** Auto-vacuum enabled
- **Monitoring:** Slow query log

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **LCP** | < 2.5s | TBD |
| **FID** | < 100ms | TBD |
| **CLS** | < 0.1 | TBD |
| **TTFB** | < 600ms | TBD |
| **Lighthouse** | 95+ | TBD |

---

## 🏗️ Infrastructure

### Deployment Architecture

```
GitHub Repository
    ↓
GitHub Actions (CI/CD)
    ↓
Build & Test
    ↓
Deploy to Vercel
    ↓
Vercel Edge Network
    ↓
Users (Global)
```

### Environment Strategy

| Environment | Purpose | Branch |
|-------------|---------|--------|
| **Development** | Local dev | feature/* |
| **Preview** | PR previews | PR branches |
| **Staging** | Pre-production | develop |
| **Production** | Live app | main |

### Infrastructure as Code

**Docker:**
```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
CMD ["npm", "start"]
```

**Kubernetes (Optional):**
- See `/infrastructure/kubernetes/kubernetes-manifests.yml`
- Horizontal Pod Autoscaler (HPA)
- Resource limits defined

---

## 🎨 Design Decisions

### Why Next.js 14?

**Pros:**
- ✅ Server Components (performance)
- ✅ App Router (modern routing)
- ✅ Image optimization built-in
- ✅ API routes (full-stack)
- ✅ Vercel integration

**Cons:**
- ⚠️ Learning curve
- ⚠️ Breaking changes

**Alternatives Considered:**
- Remix (less mature ecosystem)
- SvelteKit (smaller community)
- Astro (not ideal for dynamic apps)

### Why tRPC over REST/GraphQL?

**Pros:**
- ✅ Full type safety
- ✅ No codegen needed
- ✅ Smaller bundle
- ✅ Better DX

**Cons:**
- ⚠️ Only for TypeScript
- ⚠️ Less ecosystem

**Decision:** tRPC for internal API, REST for external

### Why Prisma?

**Pros:**
- ✅ Type-safe queries
- ✅ Great migrations
- ✅ Active development

**Cons:**
- ⚠️ Query builder limitations
- ⚠️ Bundle size

**Alternatives:** Drizzle (considered, less mature)

### Why Clerk over NextAuth?

**Pros:**
- ✅ Organizations built-in
- ✅ UI components
- ✅ Managed service

**Cons:**
- ⚠️ Vendor lock-in
- ⚠️ Cost at scale

**Decision:** Clerk for MVP, evaluate later

---

## 🔌 Integration Points

### Third-Party Services

| Service | Purpose | Criticality |
|---------|---------|-------------|
| **Clerk** | Authentication | Critical |
| **Anthropic** | AI Generation | High |
| **AWS S3** | File Storage | High |
| **Stripe** | Payments | High |
| **Vercel** | Hosting | Critical |
| **Sentry** | Error Tracking | Medium |
| **PostHog** | Analytics | Low |

### Webhook System

**Incoming Webhooks:**
- Clerk (user events)
- Stripe (payment events)

**Outgoing Webhooks:**
- Page published
- Build completed
- Payment received

**Implementation:**
```typescript
// Webhook handler with retry
async function handleWebhook(event: WebhookEvent) {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      await processEvent(event);
      return { success: true };
    } catch (error) {
      attempt++;
      await sleep(attempt * 1000);
    }
  }
  
  // Log failed webhook
  await logFailedWebhook(event);
}
```

---

## 📊 Monitoring & Observability

### Logging Strategy

**Levels:**
- **ERROR:** Production issues
- **WARN:** Potential problems
- **INFO:** Key events
- **DEBUG:** Development only

**Implementation:**
```typescript
import { logger } from '@/lib/logger';

logger.info('User logged in', {
  userId: user.id,
  timestamp: new Date(),
  ip: req.ip
});
```

### Metrics

**Application Metrics:**
- Request rate
- Error rate
- Response time
- API usage

**Business Metrics:**
- User signups
- Projects created
- Pages published
- Revenue (Stripe)

### Alerts

**Critical:**
- Database down
- API error rate > 5%
- Payment processing failure

**Warning:**
- Response time > 1s
- Error rate > 1%
- Disk usage > 80%

**Tools:**
- **Sentry:** Error tracking
- **Vercel Analytics:** Performance
- **PostHog:** Product analytics
- **Uptime Robot:** Availability

---

## 🔧 Disaster Recovery

### Backup Strategy

**Database:**
- Automated daily backups (Vercel)
- Point-in-time recovery (7 days)
- Manual snapshots before major changes

**Files (S3):**
- Versioning enabled
- Cross-region replication
- Lifecycle policies

**Code:**
- Git (GitHub)
- Multiple contributors
- Protected branches

### Incident Response

**Severity Levels:**

| Level | Response Time | Example |
|-------|--------------|---------|
| **P0** | Immediate | Site down |
| **P1** | < 1 hour | Payment fails |
| **P2** | < 4 hours | Feature broken |
| **P3** | < 24 hours | Minor bug |

**Runbooks:**
- See `/docs/guides/TROUBLESHOOTING.md`
- Automated rollback procedure
- Communication templates

---

## 🚀 Future Architecture

### Planned Improvements

**Short Term (3-6 months):**
- [ ] GraphQL gateway (for mobile app)
- [ ] Real-time collaboration (WebSockets)
- [ ] Background jobs (BullMQ)
- [ ] Multi-region deployment

**Long Term (6-12 months):**
- [ ] Microservices architecture
- [ ] Kubernetes migration
- [ ] Edge computing
- [ ] Machine learning models

### Migration Path

**From Monolith to Microservices:**

```
Current: All-in-one Next.js app

Phase 1: Extract services
- AI Service (separate deployment)
- Analytics Service
- Payment Service

Phase 2: API Gateway
- GraphQL Federation
- Service mesh

Phase 3: Event-Driven
- Message queue (RabbitMQ/Kafka)
- Event sourcing
```

---

## 📚 Related Documentation

- [Database Schema](../iterations/05-database/DATABASE_DOCUMENTATION.md)
- [API Documentation](../iterations/06-api/API_DOCUMENTATION.md)
- [Deployment Guide](../iterations/09-devops/DEPLOYMENT_GUIDE.md)
- [Security Guide](./SECURITY_GUIDE.md)
- [Performance Guide](../iterations/11-performance/PERFORMANCE_OPTIMIZATION_GUIDE.md)

---

## 🤝 Contributing to Architecture

To propose architecture changes:

1. Open an issue with `[Architecture]` prefix
2. Describe current problem
3. Propose solution with trade-offs
4. Get approval from tech lead
5. Update this document
6. Implement changes

---

**Last Updated:** November 3, 2025  
**Maintained by:** Architecture Team  
**Status:** Living Document  
**Version:** 1.0.0

---

*This architecture document is a living document and should be updated as the system evolves. All major architectural decisions should be documented here with rationale.*
