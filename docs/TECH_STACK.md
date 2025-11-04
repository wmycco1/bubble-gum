# Технологический Стек Bubble Gum

**Версия:** 3.0.0
**Последнее обновление:** November 04, 2025

> ⚠️ **ВАЖНО:** Версии обновлены на ноябрь 2025. Для полной информации о breaking changes см. [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md) и [TECH_STACK_ACTUAL_NOV_2025.md](./TECH_STACK_ACTUAL_NOV_2025.md)

---

## Frontend

```yaml
Framework: Next.js 16 (App Router, Turbopack stable)
Language: TypeScript (strict mode)
Build Tool: Turbopack (default in Next.js 16)
State Management:
  - Zustand 5 (canvas/builder state)
  - React Query 5 (server state, caching)
Styling: Tailwind CSS 4 + CSS Modules
Drag & Drop: dnd-kit (accessibility-first)
UI Library: Radix UI + shadcn/ui
Forms: React Hook Form + Zod 4 (validation)
Rich Text: TipTap (extensible editor)
Charts: Recharts (analytics dashboard)
Icons: Lucide React
```

**Версии (November 2025):**
- Next.js: **16.0.1** (октябрь 2025)
- React: **19.2.0** (сентябрь 2025)
- TypeScript: **5.9.3** (октябрь 2025)
- Tailwind CSS: **4.1.16** (сентябрь 2025)

**Breaking Changes:**
- Next.js 16: Proxy-based middleware, Pages Router удален
- React 19: defaultProps удален, новые хуки (use, useFormState)
- Tailwind 4: Новый Oxide движок, изменен формат конфигурации
- Zod 4: Изменен формат ошибок

---

## Backend

```yaml
Framework: Fastify + tRPC 11 (type-safe API)
Database: PostgreSQL 15+
ORM: Prisma 6.x (with full-text search, native driver)
Cache:
  - Redis (Upstash) - session, rate limiting
  - LocalStorage - browser cache (draft states)
Queue: BullMQ + Redis (async jobs)
Auth: Clerk 6 (social + email auth)
Storage: Cloudflare R2 (S3-compatible)
AI:
  - Primary: Anthropic Claude Sonnet 4.5 (SDK 0.68.0)
  - Optional: OpenAI GPT-4, Google Gemini, Perplexity
Search: Algolia / Typesense (site search)
```

**Версии (November 2025):**
- Node.js: **20.x** (required by Prisma 6)
- PostgreSQL: **15+**
- Redis: **7+**
- Prisma: **6.18.0** (октябрь 2025)
- tRPC: **11.7.1** (сентябрь 2025)
- Clerk: **6.34.1** (октябрь 2025)
- Anthropic SDK: **0.68.0** (ноябрь 2025)

**Breaking Changes:**
- Prisma 6: Новый формат migrations, требует Node.js 20+
- tRPC 11: Новый API context, изменен формат роутеров
- Clerk 6: Обновлен middleware для Next.js 16

---

## Site Renderer

```yaml
Framework: Next.js 16+ (App Router, Turbopack stable)
Deployment: Vercel (primary) / Netlify / Cloudflare Pages
ISR: Incremental Static Regeneration (10s revalidate)
PPR: Partial Prerendering (stable in Next.js 16)
```

---

## API

```yaml
GraphQL: Apollo Server (internal, for builder UI)
REST: Fastify routes (external, for n8n/webhooks)
Documentation: OpenAPI 3.0 (Swagger UI)
Webhooks: Outgoing webhooks for integrations
```

---

## Infrastructure

```yaml
Hosting:
  - Backend: Railway
  - Frontend: Vercel
CDN: Cloudflare (global edge network)
DNS: Cloudflare (subdomain provisioning)
SSL: Let's Encrypt (auto-renewal)
Monitoring:
  - Sentry (error tracking)
  - Grafana + Prometheus (metrics)
  - Better Uptime (status page)
  - PostHog (product analytics)
CI/CD: GitHub Actions
Secrets: HashiCorp Vault / Doppler
Docker: Multi-stage builds
Kubernetes: Optional for scale
```

---

## Social Media Integrations

```yaml
- Facebook Graph API (OAuth + posting)
- Instagram Graph API (via Facebook)
- Twitter/X API v2 (OAuth 2.0)
- LinkedIn API (OAuth + posting)
```

---

## Architecture Overview

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
│  • Static Assets Caching                                      │
│  • Image Optimization                                         │
│  • Edge Functions (Geolocation, A/B Testing)                 │
│  • DDoS Protection                                            │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│              Application Layer (Next.js 16)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 Frontend (React 19)                   │   │
│  │  • Page Builder (Editor UI)                          │   │
│  │  • Admin Panel (Dashboard)                           │   │
│  │  • Public Pages (Published)                          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Layer (tRPC + REST)                  │   │
│  │  • Projects API, Pages API, Assets API              │   │
│  │  • Users API, Analytics API, Payments API           │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Business Logic Layer                       │   │
│  │  • AI Generator, Page Render, Payments              │   │
│  │  • Auth Manager, File Manager, Analytics            │   │
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

## Ecosystem Components

### 1. Main Builder Platform (Central)
- Web application for creating sites
- UI: Drag & Drop + AI Chat (hybrid)
- Global component library (50+)
- Admin dashboard for all projects
- REST API + GraphQL for n8n
- PWA support (offline editing capability)

### 2. Client Sites (For each customer)
- Unique site (subdomain → custom domain)
- Embedded page builder with TWO modes:
  * Simple Mode (default): AI chat + templates
  * Advanced Mode (optional): Simplified drag & drop
- Admin panel (SEO, products, blog, CRM)
- PWA support for end-users

### 3. n8n Automation Layer
- Form submission → API → site generation
- Import/export workflows
- Auto-publishing to social media
- Email/SMS campaigns
- Bulk operations (mass site generation)

---

## Data Flow

### Page Creation Flow
1. User Input (Editor)
2. Client Validation (Zod)
3. tRPC Mutation
4. Server Validation
5. Business Logic (Generate components, optimize assets, save to database)
6. Cache Update
7. Response to Client
8. UI Update (Optimistic)

### AI Generation Flow
1. User Prompt
2. Rate Limit Check
3. Prompt Engineering (Template selection, context injection, token optimization)
4. Anthropic API Call
5. Response Processing (Parse JSON, validate structure, sanitize content)
6. Component Generation
7. Save to Database
8. Return to Editor

---

## Critical Dependencies

### DO NOT CHANGE без обсуждения
- **Next.js** - Framework choice
- **tRPC** - API layer
- **Prisma** - ORM
- **Clerk** - Authentication
- **Anthropic Claude** - AI provider

### Safe to Update
- UI libraries (shadcn/ui)
- Dev dependencies
- Testing tools

---

## Development Setup

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# AI (Anthropic)
ANTHROPIC_API_KEY="sk-ant-..."

# Storage (Cloudflare R2)
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."

# Cache (Redis/Upstash)
UPSTASH_REDIS_URL="..."
UPSTASH_REDIS_TOKEN="..."

# Payments (Stripe)
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."

# Monitoring (Sentry)
SENTRY_DSN="..."

# Encryption
ENCRYPTION_KEY="..." # 32-byte hex string
```

---

## Related Documentation
- Database Schema: [docs/DATABASE.md](./DATABASE.md)
- API Documentation: [docs/API.md](./API.md)
- Security Guide: [docs/SECURITY.md](./SECURITY.md)
- Performance Guide: [docs/PERFORMANCE.md](./PERFORMANCE.md)
