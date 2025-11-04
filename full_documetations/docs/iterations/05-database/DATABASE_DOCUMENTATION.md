# 📖 BUBBLE GUM - DATABASE DOCUMENTATION

**Generated:** November 1, 2025  
**Version:** 1.0.0  
**Database:** PostgreSQL 15+  
**ORM:** Prisma 5.x

---

## 📋 TABLE OF CONTENTS

1. [User & Authentication](#user--authentication)
2. [Organizations](#organizations)
3. [Projects & Pages](#projects--pages)
4. [Components](#components)
5. [Assets](#assets)
6. [Versions](#versions)
7. [Integrations & API Keys](#integrations--api-keys)
8. [E-Commerce](#e-commerce)
9. [Blog](#blog)
10. [Analytics & Forms](#analytics--forms)

---

## 👤 USER & AUTHENTICATION

### `users` Table

**Purpose:** Stores user accounts synced from Clerk authentication.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String (CUID) | ✅ | Primary key |
| `clerkId` | String | ✅ | Clerk user ID (unique) |
| `email` | String | ✅ | User email (unique) |
| `firstName` | String | ❌ | First name |
| `lastName` | String | ❌ | Last name |
| `avatar` | String | ❌ | Profile image URL |
| `createdAt` | DateTime | ✅ | Auto-generated |
| `updatedAt` | DateTime | ✅ | Auto-updated |

**Relationships:**
- Owns organizations → `Organization.ownerId`
- Member of organizations → `OrganizationMember.userId`
- Creates projects → `Project.createdById`
- Uploads assets → `Asset.uploadedById`
- Creates API keys → `APIKey.createdById`
- Creates versions → `Version.createdById`

**Indexes:**
```prisma
@@index([clerkId])
@@index([email])
```

**Constraints:**
- `clerkId` must be unique (synced from Clerk)
- `email` must be unique

**Sample Record:**
```json
{
  "id": "cl9x1w2y30000qwertyuiop",
  "clerkId": "user_2AbcDefGhiJkl",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://clerk.com/avatars/user_2AbcDefGhiJkl",
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-01T10:00:00Z"
}
```

**Usage Example:**
```typescript
// Create user (from Clerk webhook)
const user = await prisma.user.create({
  data: {
    clerkId: 'user_2AbcDefGhiJkl',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
  },
});

// Get user by email
const user = await prisma.user.findUnique({
  where: { email: 'john@example.com' },
  include: {
    ownedOrganizations: true,
    memberships: {
      include: {
        organization: true,
      },
    },
  },
});
```

---

## 🏢 ORGANIZATIONS

### `organizations` Table

**Purpose:** Multi-tenancy support for team collaboration.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String (CUID) | ✅ | Primary key |
| `name` | String | ✅ | Organization name |
| `slug` | String | ✅ | URL-friendly identifier (unique) |
| `description` | String | ❌ | Organization description |
| `logo` | String | ❌ | Logo image URL |
| `ownerId` | String | ✅ | Foreign key → `User.id` |
| `subscriptionTier` | Enum | ✅ | FREE/STARTER/PRO/ENTERPRISE |
| `subscriptionStatus` | Enum | ✅ | ACTIVE/CANCELED/PAST_DUE |
| `stripeCustomerId` | String | ❌ | Stripe customer ID (unique) |
| `projectLimit` | Int | ✅ | Max projects (default: 1) |
| `storageLimit` | Int | ✅ | Storage limit in MB (default: 100) |
| `createdAt` | DateTime | ✅ | Auto-generated |
| `updatedAt` | DateTime | ✅ | Auto-updated |

**Subscription Limits:**

| Tier | Projects | Storage | Price |
|------|----------|---------|-------|
| FREE | 1 | 100 MB | $0 |
| STARTER | 3 | 5 GB | $29/mo |
| PRO | 10 | 50 GB | $49/mo |
| ENTERPRISE | Unlimited | Unlimited | $99/mo |

**Relationships:**
- Owned by user → `User.id`
- Has members → `OrganizationMember.organizationId`
- Contains projects → `Project.organizationId`
- Stores assets → `Asset.organizationId`
- Has API keys → `APIKey.organizationId`

**Indexes:**
```prisma
@@index([slug])
@@index([ownerId])
```

**Constraints:**
- `slug` must be unique globally
- `stripeCustomerId` must be unique if set
- `projectLimit` based on `subscriptionTier`

**Sample Record:**
```json
{
  "id": "org_abc123xyz",
  "name": "Acme Inc.",
  "slug": "acme-inc",
  "description": "Building the future",
  "logo": "https://cdn.bubblegum.app/logos/acme.png",
  "ownerId": "cl9x1w2y30000qwertyuiop",
  "subscriptionTier": "PRO",
  "subscriptionStatus": "ACTIVE",
  "stripeCustomerId": "cus_AbcDefGhi123",
  "projectLimit": 10,
  "storageLimit": 51200,
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-01T10:00:00Z"
}
```

**Usage Example:**
```typescript
// Create organization
const org = await prisma.organization.create({
  data: {
    name: 'Acme Inc.',
    slug: 'acme-inc',
    ownerId: user.id,
    subscriptionTier: 'FREE',
  },
});

// Check project limit
const projectCount = await prisma.project.count({
  where: { organizationId: org.id },
});

if (projectCount >= org.projectLimit) {
  throw new Error('Project limit reached. Upgrade subscription.');
}
```

---

### `organization_members` Table

**Purpose:** Team collaboration and role-based access control.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String (CUID) | ✅ | Primary key |
| `organizationId` | String | ✅ | Foreign key → `Organization.id` |
| `userId` | String | ✅ | Foreign key → `User.id` |
| `role` | Enum | ✅ | OWNER/ADMIN/EDITOR/VIEWER |
| `createdAt` | DateTime | ✅ | Auto-generated |
| `updatedAt` | DateTime | ✅ | Auto-updated |

**Roles & Permissions:**

| Role | Create Projects | Edit Projects | Delete Projects | Invite Members |
|------|-----------------|---------------|-----------------|----------------|
| OWNER | ✅ | ✅ | ✅ | ✅ |
| ADMIN | ✅ | ✅ | ✅ | ✅ |
| EDITOR | ✅ | ✅ | ❌ | ❌ |
| VIEWER | ❌ | ❌ | ❌ | ❌ |

**Constraints:**
- User can only be member once per organization
- Unique constraint: `(organizationId, userId)`

**Sample Record:**
```json
{
  "id": "member_xyz789",
  "organizationId": "org_abc123xyz",
  "userId": "cl9x1w2y30000qwertyuiop",
  "role": "EDITOR",
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-01T10:00:00Z"
}
```

**Usage Example:**
```typescript
// Add member to organization
await prisma.organizationMember.create({
  data: {
    organizationId: org.id,
    userId: invitedUser.id,
    role: 'EDITOR',
  },
});

// Check user permissions
async function canEdit(userId: string, projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      organization: {
        include: {
          members: {
            where: { userId },
          },
        },
      },
    },
  });

  const member = project?.organization.members[0];
  return member && ['OWNER', 'ADMIN', 'EDITOR'].includes(member.role);
}
```

---

## 📁 PROJECTS & PAGES

### `projects` Table

**Purpose:** Individual websites created by users.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String (CUID) | ✅ | Primary key |
| `name` | String | ✅ | Project name |
| `description` | String | ❌ | Project description |
| `slug` | String | ✅ | URL-friendly identifier |
| `organizationId` | String | ✅ | Foreign key → `Organization.id` |
| `createdById` | String | ✅ | Foreign key → `User.id` |
| `status` | Enum | ✅ | DRAFT/PUBLISHED/ARCHIVED |
| `customDomain` | String | ❌ | Custom domain (unique) |
| `subdomain` | String | ✅ | Subdomain (unique) |
| `metaTitle` | String | ❌ | SEO title |
| `metaDescription` | String | ❌ | SEO description |
| `favicon` | String | ❌ | Favicon URL |
| `aiPrompt` | String | ❌ | AI generation prompt |
| `businessType` | String | ❌ | Business type hint |
| `publishedAt` | DateTime | ❌ | Publication timestamp |
| `publishedVersion` | String | ❌ | Published version ID |
| `createdAt` | DateTime | ✅ | Auto-generated |
| `updatedAt` | DateTime | ✅ | Auto-updated |

**Constraints:**
- `slug` unique within organization: `(organizationId, slug)`
- `customDomain` globally unique
- `subdomain` globally unique (e.g., "my-site.bubblegum.app")

**Sample Record:**
```json
{
  "id": "proj_abc123",
  "name": "My Portfolio",
  "description": "Personal portfolio website",
  "slug": "my-portfolio",
  "organizationId": "org_abc123xyz",
  "createdById": "cl9x1w2y30000qwertyuiop",
  "status": "PUBLISHED",
  "customDomain": "johndoe.com",
  "subdomain": "my-portfolio.bubblegum.app",
  "metaTitle": "John Doe - Portfolio",
  "metaDescription": "Full-stack developer portfolio",
  "favicon": "https://cdn.bubblegum.app/favicons/portfolio.png",
  "aiPrompt": "Create a modern portfolio for a developer",
  "businessType": "portfolio",
  "publishedAt": "2025-11-05T14:30:00Z",
  "publishedVersion": "ver_xyz789",
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-05T14:30:00Z"
}
```

**Usage Example:**
```typescript
// Create project
const project = await prisma.project.create({
  data: {
    name: 'My Portfolio',
    slug: 'my-portfolio',
    subdomain: 'my-portfolio.bubblegum.app',
    organizationId: org.id,
    createdById: user.id,
    status: 'DRAFT',
  },
});

// Publish project
await prisma.project.update({
  where: { id: project.id },
  data: {
    status: 'PUBLISHED',
    publishedAt: new Date(),
    publishedVersion: latestVersion.id,
  },
});
```

---

### `pages` Table

**Purpose:** Individual pages within a project.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String (CUID) | ✅ | Primary key |
| `name` | String | ✅ | Page name |
| `slug` | String | ✅ | URL path |
| `projectId` | String | ✅ | Foreign key → `Project.id` |
| `isHomepage` | Boolean | ✅ | Is this the homepage? |
| `isPublished` | Boolean | ✅ | Is page published? |
| `metaTitle` | String | ❌ | SEO title |
| `metaDescription` | String | ❌ | SEO description |
| `ogImage` | String | ❌ | Open Graph image |
| `content` | JSON | ✅ | Component tree |
| `mobileContent` | JSON | ❌ | Mobile-specific layout |
| `tabletContent` | JSON | ❌ | Tablet-specific layout |
| `createdAt` | DateTime | ✅ | Auto-generated |
| `updatedAt` | DateTime | ✅ | Auto-updated |

**Content JSON Structure:**
```json
{
  "components": [
    {
      "id": "comp_123",
      "type": "Hero",
      "props": {
        "title": "Welcome",
        "subtitle": "Build stunning sites",
        "ctaText": "Get Started",
        "bgColor": "#1a1a1a"
      },
      "children": []
    },
    {
      "id": "comp_456",
      "type": "Section",
      "props": {
        "padding": "large"
      },
      "children": [
        {
          "id": "comp_789",
          "type": "Text",
          "props": {
            "content": "Hello World"
          }
        }
      ]
    }
  ]
}
```

**Constraints:**
- `slug` unique within project: `(projectId, slug)`
- Only one `isHomepage` per project

**Sample Record:**
```json
{
  "id": "page_abc123",
  "name": "Homepage",
  "slug": "/",
  "projectId": "proj_abc123",
  "isHomepage": true,
  "isPublished": true,
  "metaTitle": "Welcome to My Site",
  "metaDescription": "This is my amazing website",
  "ogImage": "https://cdn.bubblegum.app/og/homepage.png",
  "content": { "components": [...] },
  "mobileContent": null,
  "tabletContent": null,
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-01T12:00:00Z"
}
```

**Usage Example:**
```typescript
// Create homepage
const homepage = await prisma.page.create({
  data: {
    name: 'Homepage',
    slug: '/',
    projectId: project.id,
    isHomepage: true,
    content: {
      components: [
        {
          id: 'hero_1',
          type: 'Hero',
          props: {
            title: 'Welcome',
            subtitle: 'Build stunning sites',
          },
        },
      ],
    },
  },
});

// Get all pages for a project
const pages = await prisma.page.findMany({
  where: { projectId: project.id },
  orderBy: { slug: 'asc' },
});
```

---

## 🧩 COMPONENTS

### `components` Table

**Purpose:** User-created component instances and templates.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String (CUID) | ✅ | Primary key |
| `name` | String | ✅ | Component name |
| `type` | Enum | ✅ | Component type |
| `schema` | JSON | ✅ | Component structure |
| `isTemplate` | Boolean | ✅ | Reusable template? |
| `libraryComponentId` | String | ❌ | Based on library component |
| `organizationId` | String | ❌ | If template, belongs to org |
| `createdAt` | DateTime | ✅ | Auto-generated |
| `updatedAt` | DateTime | ✅ | Auto-updated |

**Component Types:**
- `LAYOUT` - Container, Section, Grid, Column
- `CONTENT` - Text, Heading, Image, Video
- `FORM` - Input, Textarea, Button, Checkbox
- `NAVIGATION` - Link, Menu, Breadcrumb
- `ECOMMERCE` - Product, Cart, Checkout
- `BLOG` - BlogPost, BlogList, Category
- `CUSTOM` - User-created

**Schema Structure:**
```json
{
  "type": "Hero",
  "props": {
    "title": { "type": "string", "default": "Welcome" },
    "subtitle": { "type": "string", "default": "" },
    "bgColor": { "type": "color", "default": "#ffffff" }
  },
  "children": { "accept": ["Button", "Text"] }
}
```

**Usage Example:**
```typescript
// Create reusable template
const template = await prisma.component.create({
  data: {
    name: 'My Custom Hero',
    type: 'LAYOUT',
    isTemplate: true,
    organizationId: org.id,
    schema: {
      type: 'Hero',
      props: {
        title: 'Welcome',
        bgColor: '#1a1a1a',
      },
    },
  },
});
```

---

### `component_library` Table

**Purpose:** Pre-built components available to all users.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String (CUID) | ✅ | Primary key |
| `name` | String | ✅ | Internal name (unique) |
| `displayName` | String | ✅ | Human-readable name |
| `description` | String | ❌ | Component description |
| `type` | Enum | ✅ | Component type |
| `category` | String | ✅ | Category for grouping |
| `schema` | JSON | ✅ | Default structure |
| `thumbnail` | String | ❌ | Preview image URL |
| `tags` | String[] | ✅ | Search tags |
| `isPro` | Boolean | ✅ | Requires Pro tier? |
| `createdAt` | DateTime | ✅ | Auto-generated |
| `updatedAt` | DateTime | ✅ | Auto-updated |

**Categories:**
- Layout
- Content
- Forms
- Navigation
- E-commerce
- Blog
- Marketing

**Sample Record:**
```json
{
  "id": "lib_hero_001",
  "name": "Hero",
  "displayName": "Hero Section",
  "description": "Large hero section with title, subtitle, and CTA",
  "type": "LAYOUT",
  "category": "Marketing",
  "schema": {...},
  "thumbnail": "https://cdn.bubblegum.app/thumbnails/hero.png",
  "tags": ["hero", "landing", "cta", "responsive"],
  "isPro": false,
  "createdAt": "2025-10-01T00:00:00Z",
  "updatedAt": "2025-10-01T00:00:00Z"
}
```

---

## 🖼️ ASSETS

### `assets` Table

**Purpose:** Uploaded media files (images, videos, documents).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String (CUID) | ✅ | Primary key |
| `name` | String | ✅ | File name |
| `type` | Enum | ✅ | IMAGE/VIDEO/DOCUMENT/FONT/ICON |
| `url` | String | ✅ | Cloudflare R2 URL |
| `key` | String | ✅ | Storage key (unique) |
| `size` | Int | ✅ | File size in bytes |
| `mimeType` | String | ✅ | MIME type |
| `width` | Int | ❌ | Image width (if image) |
| `height` | Int | ❌ | Image height (if image) |
| `projectId` | String | ❌ | Associated project |
| `organizationId` | String | ✅ | Belongs to organization |
| `uploadedById` | String | ✅ | Uploaded by user |
| `createdAt` | DateTime | ✅ | Auto-generated |
| `updatedAt` | DateTime | ✅ | Auto-updated |

**Storage Structure:**
```
/organizations/{orgId}/assets/{year}/{month}/{filename}
```

**Sample Record:**
```json
{
  "id": "asset_img123",
  "name": "hero-background.jpg",
  "type": "IMAGE",
  "url": "https://cdn.bubblegum.app/assets/org_abc123/2025/11/hero-bg.jpg",
  "key": "org_abc123/2025/11/hero-background.jpg",
  "size": 2048000,
  "mimeType": "image/jpeg",
  "width": 1920,
  "height": 1080,
  "projectId": "proj_abc123",
  "organizationId": "org_abc123xyz",
  "uploadedById": "cl9x1w2y30000qwertyuiop",
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-01T10:00:00Z"
}
```

**Usage Example:**
```typescript
// Upload asset
const asset = await prisma.asset.create({
  data: {
    name: file.name,
    type: 'IMAGE',
    url: uploadedUrl,
    key: storageKey,
    size: file.size,
    mimeType: file.type,
    width: metadata.width,
    height: metadata.height,
    organizationId: org.id,
    uploadedById: user.id,
  },
});

// Check storage limit
const totalStorage = await prisma.asset.aggregate({
  where: { organizationId: org.id },
  _sum: { size: true },
});

const usedMB = (totalStorage._sum.size || 0) / (1024 * 1024);
if (usedMB > org.storageLimit) {
  throw new Error('Storage limit exceeded');
}
```

---

## 🕰️ VERSIONS

### `versions` Table

**Purpose:** Version history for projects (auto-save + manual saves).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String (CUID) | ✅ | Primary key |
| `projectId` | String | ✅ | Foreign key → `Project.id` |
| `snapshot` | JSON | ✅ | Full project state |
| `label` | String | ❌ | Optional user label |
| `isAutoSave` | Boolean | ✅ | Auto-save or manual? |
| `createdById` | String | ✅ | Created by user |
| `createdAt` | DateTime | ✅ | Auto-generated |

**Snapshot Structure:**
```json
{
  "project": {
    "name": "My Portfolio",
    "settings": {...}
  },
  "pages": [
    {
      "id": "page_123",
      "slug": "/",
      "content": {...}
    }
  ]
}
```

**Retention Policy:**
- Keep last 50 auto-saves
- Keep all manual saves with labels
- Archive versions older than 90 days

**Usage Example:**
```typescript
// Create version (auto-save)
const version = await prisma.version.create({
  data: {
    projectId: project.id,
    snapshot: {
      project: project,
      pages: pages,
    },
    isAutoSave: true,
    createdById: user.id,
  },
});

// Restore version
const version = await prisma.version.findUnique({
  where: { id: versionId },
});

// Apply snapshot to project
await prisma.project.update({
  where: { id: project.id },
  data: version.snapshot.project,
});
```

---

## 🔌 INTEGRATIONS & API KEYS

### `integrations` Table

**Purpose:** Third-party service integrations.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String (CUID) | ✅ | Primary key |
| `projectId` | String | ✅ | Foreign key → `Project.id` |
| `type` | Enum | ✅ | Integration type |
| `config` | JSON | ✅ | Configuration (encrypted) |
| `isActive` | Boolean | ✅ | Is integration active? |
| `createdAt` | DateTime | ✅ | Auto-generated |
| `updatedAt` | DateTime | ✅ | Auto-updated |

**Integration Types:**
- `STRIPE` - Payment processing
- `GOOGLE_ANALYTICS` - Web analytics
- `FACEBOOK_PIXEL` - Ad tracking
- `MAILCHIMP` - Email marketing
- `ZAPIER` - Automation
- `N8N` - Workflow automation
- `CUSTOM_WEBHOOK` - Custom webhooks

**Config Structure (Stripe Example):**
```json
{
  "publishableKey": "pk_test_...",
  "secretKey": "sk_test_..." // ENCRYPTED!
}
```

**Usage Example:**
```typescript
// Add Stripe integration
const integration = await prisma.integration.create({
  data: {
    projectId: project.id,
    type: 'STRIPE',
    config: {
      publishableKey: 'pk_test_...',
      secretKey: encrypt('sk_test_...'),
    },
    isActive: true,
  },
});
```

---

### `api_keys` Table

**Purpose:** API keys for programmatic access (n8n integration).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String (CUID) | ✅ | Primary key |
| `name` | String | ✅ | User-defined name |
| `key` | String | ✅ | Hashed API key (unique) |
| `organizationId` | String | ✅ | Belongs to organization |
| `createdById` | String | ✅ | Created by user |
| `lastUsedAt` | DateTime | ❌ | Last usage timestamp |
| `usageCount` | Int | ✅ | Total API calls |
| `canRead` | Boolean | ✅ | Read permission |
| `canWrite` | Boolean | ✅ | Write permission |
| `canDelete` | Boolean | ✅ | Delete permission |
| `expiresAt` | DateTime | ❌ | Expiration date |
| `createdAt` | DateTime | ✅ | Auto-generated |
| `updatedAt` | DateTime | ✅ | Auto-updated |

**Usage Example:**
```typescript
// Create API key
const apiKey = generateSecureKey(); // e.g., "bg_live_abc123xyz..."
const hashedKey = await hash(apiKey);

await prisma.aPIKey.create({
  data: {
    name: 'n8n Workflow',
    key: hashedKey,
    organizationId: org.id,
    createdById: user.id,
    canRead: true,
    canWrite: true,
    canDelete: false,
  },
});

// Return unhashed key to user (only once!)
return apiKey;

// Authenticate API request
const hashedInput = await hash(requestApiKey);
const apiKey = await prisma.aPIKey.findUnique({
  where: { key: hashedInput },
});

if (!apiKey || (apiKey.expiresAt && apiKey.expiresAt < new Date())) {
  throw new Error('Invalid or expired API key');
}

// Update usage
await prisma.aPIKey.update({
  where: { id: apiKey.id },
  data: {
    lastUsedAt: new Date(),
    usageCount: { increment: 1 },
  },
});
```

---

## 🛒 E-COMMERCE

*(Phase 2 - Refer to schema.prisma for full details)*

### Key Tables:
- `products` - Products for sale
- `product_variants` - Size/color variants
- `orders` - Customer orders
- `order_items` - Line items

---

## 📝 BLOG

*(Phase 3 - Refer to schema.prisma for full details)*

### Key Tables:
- `blog_posts` - Blog articles
- `blog_categories` - Post categories
- `blog_tags` - Post tags
- `blog_comments` - User comments

---

## 📊 ANALYTICS & FORMS

*(Phase 4 - Refer to schema.prisma for full details)*

### Key Tables:
- `form_submissions` - Form responses
- `page_views` - Analytics data

---

## 🔒 SECURITY BEST PRACTICES

### 1. Always Encrypt Sensitive Data
```typescript
import { encrypt, decrypt } from './crypto';

// Encrypt before saving
const encrypted = encrypt(sensitiveData);
await prisma.integration.create({
  data: { config: encrypted },
});

// Decrypt when reading
const config = decrypt(integration.config);
```

### 2. Hash API Keys
```typescript
import bcrypt from 'bcrypt';

// Hash before saving
const hashedKey = await bcrypt.hash(apiKey, 10);

// Verify
const isValid = await bcrypt.compare(inputKey, storedHashedKey);
```

### 3. Implement Row-Level Security
```sql
-- PostgreSQL RLS example
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY project_access ON projects
  USING (organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = current_user_id()
  ));
```

### 4. Sanitize JSON Inputs
```typescript
import { sanitize } from './sanitizer';

// Sanitize user-provided JSON
const safeContent = sanitize(userProvidedContent);
await prisma.page.update({
  where: { id: pageId },
  data: { content: safeContent },
});
```

---

**Documentation Status:** ✅ Complete  
**Last Updated:** November 1, 2025  
**Version:** 1.0.0

---

*This documentation covers all tables in the Bubble Gum database. Refer to schema.prisma for the authoritative schema definition.*