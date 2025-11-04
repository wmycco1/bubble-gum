# Bubble Gum Database Documentation

## Overview

- **СУБД:** PostgreSQL 15+
- **ORM:** Prisma 5.x
- **Всего таблиц:** 24
- **Всего enum:** 10
- **Локация схемы:** `/src/prisma/schema.prisma`

---

## Core Tables (Phase 0-1, MVP)

| Таблица | Назначение | Связи |
|---------|-----------|-------|
| `users` | Authentication | → Organizations, Projects, Assets |
| `organizations` | Multi-tenancy | → Members, Projects |
| `organization_members` | Team collaboration | User ↔ Organization |
| `projects` | Websites | → Pages, Assets, Versions |
| `pages` | Individual pages | ← Project |
| `components` | User templates | ← ComponentLibrary |
| `component_library` | Pre-built components | → Components |
| `assets` | Media files | ← Project, Organization |
| `versions` | Version history | ← Project |
| `integrations` | Third-party services | ← Project |
| `api_keys` | API access | ← Organization |

**Всего: 11 таблиц для MVP**

---

## E-commerce Tables (Phase 2)

- `products` - Product catalog
- `product_variants` - Product variations (size, color)
- `orders` - Customer orders
- `order_items` - Order line items

**Всего: 4 таблицы**

---

## Blog Tables (Phase 3)

- `blog_posts` - Blog content
- `blog_categories` - Post categories
- `blog_tags` - Post tags
- `blog_comments` - User comments

**Всего: 4 таблицы**

---

## Analytics Tables (Phase 4)

- `form_submissions` - Contact form data
- `page_views` - Analytics tracking

**Всего: 2 таблицы**

---

## Utility Tables (Phase 5)

- `integrations` - Third-party connections
- `api_keys` - External API access
- `usage_logs` - Usage tracking

**Всего: 3 таблицы**

---

## Core Tables - Field Reference

Ключевые поля для 11 основных MVP таблиц:

### 1. `users` (Synced from Clerk)

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | String | `@id @default(cuid())` | Primary key |
| `clerkUserId` | String | `@unique` | Clerk user ID |
| `email` | String | `@unique` | User email |
| `name` | String? | Optional | Display name |
| `avatarUrl` | String? | Optional | Profile image |
| `createdAt` | DateTime | `@default(now())` | Account creation |
| `updatedAt` | DateTime | `@updatedAt` | Last update |
| `organizations` | OrganizationMember[] | Relation | Org memberships |

**Indexes:** `@@index([clerkUserId])`, `@@index([email])`

---

### 2. `organizations`

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | String | `@id @default(cuid())` | Primary key |
| `name` | String | Required | Org name |
| `slug` | String | `@unique` | URL-safe identifier |
| `logoUrl` | String? | Optional | Org logo |
| `subscriptionTier` | SubscriptionTier | `@default(FREE)` | Pricing plan |
| `subscriptionStatus` | SubscriptionStatus | `@default(ACTIVE)` | Payment status |
| `stripeCustomerId` | String? | `@unique` | Stripe customer ID |
| `stripeSubscriptionId` | String? | `@unique` | Stripe subscription ID |
| `currentPeriodEnd` | DateTime? | Optional | Subscription renewal date |
| `createdAt` | DateTime | `@default(now())` | Org creation |
| `updatedAt` | DateTime | `@updatedAt` | Last update |
| `members` | OrganizationMember[] | Relation | Team members |
| `projects` | Project[] | Relation | Websites |

**Indexes:** `@@index([slug])`, `@@index([stripeCustomerId])`

**Limits by Tier:**
- FREE: 1 project, 10 pages, 100 components, 100MB storage
- STARTER: 5 projects, 100 pages, 1000 components, 5GB storage
- PRO: Unlimited projects, unlimited pages, unlimited components, 50GB storage
- ENTERPRISE: Custom limits

---

### 3. `organization_members`

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | String | `@id @default(cuid())` | Primary key |
| `organizationId` | String | Required | Foreign key |
| `userId` | String | Required | Foreign key |
| `role` | Role | `@default(VIEWER)` | Access level |
| `invitedBy` | String? | Optional | Inviter user ID |
| `invitedAt` | DateTime | `@default(now())` | Invitation date |
| `acceptedAt` | DateTime? | Optional | Acceptance date |
| `createdAt` | DateTime | `@default(now())` | Membership creation |

**Unique Constraint:** `@@unique([organizationId, userId])`

**Indexes:** `@@index([userId])`, `@@index([organizationId])`

**Role Permissions:**
- `OWNER`: Full control (delete org, manage billing)
- `ADMIN`: Manage members, settings
- `EDITOR`: Edit projects, pages, components
- `VIEWER`: Read-only access

---

### 4. `projects`

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | String | `@id @default(cuid())` | Primary key |
| `name` | String | Required | Project name |
| `description` | String? | Optional | Project description |
| `organizationId` | String | Required | Foreign key |
| `status` | ProjectStatus | `@default(DRAFT)` | Publish status |
| `subdomain` | String | `@unique` | bubblegum.app subdomain |
| `customDomain` | String? | `@unique` | Custom domain (e.g., example.com) |
| `seoTitle` | String? | Optional | SEO meta title |
| `seoDescription` | String? | Optional | SEO meta description |
| `faviconUrl` | String? | Optional | Favicon URL |
| `ogImageUrl` | String? | Optional | Open Graph image |
| `googleAnalyticsId` | String? | Optional | GA tracking ID |
| `facebookPixelId` | String? | Optional | FB Pixel ID |
| `createdAt` | DateTime | `@default(now())` | Project creation |
| `updatedAt` | DateTime | `@updatedAt` | Last update |
| `publishedAt` | DateTime? | Optional | First publish date |
| `pages` | Page[] | Relation | Website pages |
| `versions` | Version[] | Relation | Version history |
| `assets` | Asset[] | Relation | Project assets |

**Indexes:** `@@index([organizationId])`, `@@index([subdomain])`, `@@index([customDomain])`

**Subdomain Format:** `{slug}.bubblegum.app` (e.g., `my-shop.bubblegum.app`)

---

### 5. `pages`

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | String | `@id @default(cuid())` | Primary key |
| `title` | String | Required | Page title |
| `slug` | String | Required | URL path (e.g., `/about`) |
| `projectId` | String | Required | Foreign key |
| `isHomepage` | Boolean | `@default(false)` | Is homepage (/) |
| `content` | Json | Required | Page structure (components tree) |
| `seoTitle` | String? | Optional | SEO meta title |
| `seoDescription` | String? | Optional | SEO meta description |
| `ogImageUrl` | String? | Optional | Open Graph image |
| `order` | Int | `@default(0)` | Navigation order |
| `isPublished` | Boolean | `@default(false)` | Visibility status |
| `publishedAt` | DateTime? | Optional | Publish date |
| `createdAt` | DateTime | `@default(now())` | Page creation |
| `updatedAt` | DateTime | `@updatedAt` | Last update |
| `components` | Component[] | Relation | Page components |
| `socialAccounts` | SocialAccount[] | Relation | Auto-publish targets |

**Indexes:** `@@index([projectId])`, `@@index([slug])`

**Unique Constraint:** `@@unique([projectId, slug])`

**Content Structure (JSON):**

```json
{
  "version": "1.0",
  "components": [
    {
      "id": "cuid123",
      "type": "LAYOUT",
      "componentId": "cuid456",
      "props": { "backgroundColor": "#fff" },
      "children": [...]
    }
  ]
}
```

---

### 6. `components`

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | String | `@id @default(cuid())` | Primary key |
| `name` | String | Required | Component name |
| `type` | ComponentType | Required | Component category |
| `pageId` | String? | Optional | Foreign key (if page-specific) |
| `organizationId` | String? | Optional | Foreign key (if org library) |
| `isGlobal` | Boolean | `@default(false)` | Is in global library |
| `props` | Json | Required | Component properties |
| `styles` | Json | Required | CSS styles |
| `version` | Int | `@default(1)` | Component version |
| `thumbnailUrl` | String? | Optional | Preview image |
| `createdAt` | DateTime | `@default(now())` | Component creation |
| `updatedAt` | DateTime | `@updatedAt` | Last update |

**Indexes:** `@@index([pageId])`, `@@index([organizationId])`, `@@index([type])`

**Props Example (Button):**

```json
{
  "text": "Click Me",
  "variant": "primary",
  "size": "md",
  "icon": "arrow-right",
  "href": "/contact"
}
```

**Styles Example:**

```json
{
  "backgroundColor": "#3b82f6",
  "color": "#ffffff",
  "padding": "12px 24px",
  "borderRadius": "8px",
  "fontSize": "16px"
}
```

---

### 7. `component_library`

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | String | `@id @default(cuid())` | Primary key |
| `name` | String | Required | Component name |
| `type` | ComponentType | Required | Component category |
| `isBuiltIn` | Boolean | `@default(true)` | Official vs custom |
| `category` | String | Required | Library section |
| `description` | String? | Optional | Component description |
| `props` | Json | Required | Default props schema |
| `styles` | Json | Required | Default styles |
| `thumbnailUrl` | String | Required | Preview image |
| `usageCount` | Int | `@default(0)` | Popularity metric |
| `createdAt` | DateTime | `@default(now())` | Component creation |
| `updatedAt` | DateTime | `@updatedAt` | Last update |

**Indexes:** `@@index([type])`, `@@index([category])`, `@@index([isBuiltIn])`

**Categories:**
- `Layout`: Header, Footer, Section, Grid, Container
- `Content`: Heading, Text, Image, Video, Divider
- `Form`: Input, Textarea, Button, Checkbox, Select
- `Navigation`: Navbar, Sidebar, Breadcrumb, Pagination
- `Ecommerce`: ProductCard, Cart, Checkout, PricingTable
- `Blog`: PostCard, PostList, PostDetail, Categories
- `Custom`: User-created components

---

### 8. `assets`

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | String | `@id @default(cuid())` | Primary key |
| `name` | String | Required | Original filename |
| `type` | AssetType | Required | File category |
| `url` | String | Required | Cloudflare R2 URL |
| `mimeType` | String | Required | MIME type |
| `size` | Int | Required | File size (bytes) |
| `width` | Int? | Optional | Image width (px) |
| `height` | Int? | Optional | Image height (px) |
| `organizationId` | String | Required | Foreign key |
| `projectId` | String? | Optional | Foreign key (project-specific) |
| `uploadedBy` | String | Required | User ID |
| `createdAt` | DateTime | `@default(now())` | Upload date |

**Indexes:** `@@index([organizationId])`, `@@index([projectId])`, `@@index([type])`

**Storage Limits:**
- FREE: 100MB total
- STARTER: 5GB total
- PRO: 50GB total
- ENTERPRISE: Custom

**Supported Formats:**
- Images: `.jpg`, `.png`, `.webp`, `.svg`, `.gif`
- Videos: `.mp4`, `.webm`
- Documents: `.pdf`, `.docx`
- Fonts: `.woff`, `.woff2`, `.ttf`
- Icons: `.svg`

---

### 9. `versions`

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | String | `@id @default(cuid())` | Primary key |
| `projectId` | String | Required | Foreign key |
| `versionNumber` | Int | Required | Sequential version |
| `snapshot` | Json | Required | Full project state |
| `createdBy` | String | Required | User ID |
| `createdAt` | DateTime | `@default(now())` | Version creation |
| `description` | String? | Optional | Version notes |

**Indexes:** `@@index([projectId])`, `@@index([createdAt])`

**Unique Constraint:** `@@unique([projectId, versionNumber])`

**Snapshot Structure:**

```json
{
  "project": { "name": "My Shop", "status": "PUBLISHED" },
  "pages": [{ "title": "Home", "slug": "/", "content": {...} }],
  "components": [...],
  "assets": [...]
}
```

**Auto-versioning Triggers:**
- Every publish
- Manual save point
- Before destructive edits

---

### 10. `integrations`

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | String | `@id @default(cuid())` | Primary key |
| `organizationId` | String | Required | Foreign key |
| `type` | IntegrationType | Required | Integration type |
| `name` | String | Required | Display name |
| `config` | Json | Required | Integration settings (encrypted) |
| `isActive` | Boolean | `@default(true)` | Enabled status |
| `createdAt` | DateTime | `@default(now())` | Integration creation |
| `updatedAt` | DateTime | `@updatedAt` | Last update |

**Indexes:** `@@index([organizationId])`, `@@index([type])`

**Supported Integrations:**
- `STRIPE`: Payment processing
- `GOOGLE_ANALYTICS`: Traffic analytics
- `FACEBOOK_PIXEL`: Ad tracking
- `MAILCHIMP`: Email marketing
- `ZAPIER`: Workflow automation
- `N8N`: Self-hosted automation
- `CUSTOM_WEBHOOK`: Custom HTTP endpoints

**Config Example (Stripe):**

```json
{
  "publicKey": "pk_live_...",
  "secretKey": "sk_live_..." // Encrypted
}
```

---

### 11. `api_keys`

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | String | `@id @default(cuid())` | Primary key |
| `name` | String | Required | Key name/label |
| `organizationId` | String | Required | Foreign key |
| `keyHash` | String | `@unique` | bcrypt hash of key |
| `prefix` | String | `@unique` | Key prefix (e.g., `bg_live_`) |
| `permissions` | String[] | Required | Allowed actions |
| `expiresAt` | DateTime? | Optional | Expiration date |
| `lastUsedAt` | DateTime? | Optional | Last API call |
| `createdBy` | String | Required | User ID |
| `createdAt` | DateTime | `@default(now())` | Key creation |
| `revokedAt` | DateTime? | Optional | Revocation date |

**Indexes:** `@@index([organizationId])`, `@@index([keyHash])`, `@@index([prefix])`

**Key Format:** `bg_live_1a2b3c4d5e6f...` (32 chars after prefix)

**Permissions:**
- `read:projects`: List/read projects
- `write:projects`: Create/update projects
- `read:pages`: List/read pages
- `write:pages`: Create/update pages
- `delete:pages`: Delete pages
- `read:analytics`: Access analytics data

**Security:**
- Keys are hashed with bcrypt before storage
- Only prefix shown in UI (e.g., `bg_live_1a2b...`)
- Revoked keys remain in DB for audit trail

---

## Key Enums

```prisma
enum Role { OWNER, ADMIN, EDITOR, VIEWER }
enum SubscriptionTier { FREE, STARTER, PRO, ENTERPRISE }
enum SubscriptionStatus { ACTIVE, CANCELED, PAST_DUE, TRIALING }
enum ProjectStatus { DRAFT, PUBLISHED, ARCHIVED }
enum ComponentType { LAYOUT, CONTENT, FORM, NAVIGATION, ECOMMERCE, BLOG, CUSTOM }
enum AssetType { IMAGE, VIDEO, DOCUMENT, FONT, ICON }
enum IntegrationType { STRIPE, GOOGLE_ANALYTICS, FACEBOOK_PIXEL, MAILCHIMP, ZAPIER, N8N, CUSTOM_WEBHOOK }
```

---

## Multi-Tenancy Architecture

```
User (1) → Organizations (N)
Organization (1) → Projects (N)
Organization (1) → Members (N) → Users (N)
```

**Benefit:** Users can belong to multiple organizations with different roles.

---

## Indexes Strategy

**Primary Keys:** All tables use `CUID` (Collision-resistant Unique Identifier)

**Unique Constraints:**
- `users.email` - Prevent duplicate accounts
- `organizations.slug` - Unique organization URLs
- `projects.customDomain` - Unique custom domains
- `projects.subdomain` - Unique Bubble Gum subdomains
- `(organizationId, userId)` - Unique membership

**Performance Indexes:**
- Foreign keys (automatic)
- `versions.createdAt` - Time-based queries
- `page_views.timestamp` - Analytics queries
- `assets.organizationId` - Storage limit checks

---

## Security Features

**Authentication:**
- Users synced from Clerk (no manual auth)
- Clerk handles OAuth (Google, GitHub)

**Authorization:**
- Role-based access control (OWNER, ADMIN, EDITOR, VIEWER)
- Organization-scoped data (multi-tenancy)
- API key permissions (read, write, delete)

**Data Protection:**
- Encrypted fields: Integration configs, API keys
- Hashed API keys: bcrypt before storage
- Row-level security: PostgreSQL RLS (recommended)

---

**Last Updated:** November 4, 2025
**Source:** CLAUDE.md - Bubble Gum Project Documentation
