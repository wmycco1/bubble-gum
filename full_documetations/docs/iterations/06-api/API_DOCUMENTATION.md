# 📡 BUBBLE GUM - API DOCUMENTATION

**Generated:** November 1, 2025  
**Version:** 1.0.0  
**Framework:** tRPC v10+  
**Type Safety:** Full TypeScript support

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Routers](#api-routers)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Examples](#examples)

---

## 🌐 OVERVIEW

Bubble Gum API is built with **tRPC** (TypeScript Remote Procedure Call), providing end-to-end type safety between client and server.

### Base URL

```
Production: https://api.bubblegum.app/trpc
Development: http://localhost:3001/trpc
```

### Key Features

- ✅ **Type-safe** - Full TypeScript support
- ✅ **Auto-generated** - Client types from server schema
- ✅ **Batch requests** - Multiple queries in one request
- ✅ **Real-time** - WebSocket subscriptions (future)
- ✅ **Validated** - Zod schema validation

---

## 🔐 AUTHENTICATION

All protected endpoints require authentication via **Clerk**.

### Headers

```http
Authorization: Bearer <clerk_session_token>
```

### Getting Auth Token

```typescript
import { useAuth } from '@clerk/nextjs';

const { getToken } = useAuth();
const token = await getToken();
```

---

## 📚 API ROUTERS

### 1. Auth Router (`auth.*`)

User authentication and profile management.

#### `auth.me` - Get Current User

**Type:** `query`  
**Auth:** Required

```typescript
const user = await trpc.auth.me.query();
```

**Response:**
```typescript
{
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
  ownedOrganizations: Organization[];
  memberships: OrganizationMember[];
}
```

#### `auth.updateProfile` - Update User Profile

**Type:** `mutation`  
**Auth:** Required

```typescript
const user = await trpc.auth.updateProfile.mutate({
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://example.com/avatar.jpg',
});
```

---

### 2. Organizations Router (`organizations.*`)

Manage organizations and team members.

#### `organizations.list` - List All Organizations

**Type:** `query`  
**Auth:** Required

```typescript
const orgs = await trpc.organizations.list.query();
```

**Response:**
```typescript
{
  id: string;
  name: string;
  slug: string;
  description: string | null;
  subscriptionTier: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
  subscriptionStatus: 'ACTIVE' | 'CANCELED' | 'PAST_DUE';
  projectLimit: number;
  storageLimit: number;
  owner: User;
  members: OrganizationMember[];
  _count: {
    projects: number;
    members: number;
  };
}[]
```

#### `organizations.get` - Get Single Organization

**Type:** `query`  
**Auth:** Required

```typescript
const org = await trpc.organizations.get.query({
  organizationId: 'org_123',
});
```

#### `organizations.create` - Create New Organization

**Type:** `mutation`  
**Auth:** Required

```typescript
const org = await trpc.organizations.create.mutate({
  name: 'Acme Inc.',
  slug: 'acme-inc',
  description: 'Building the future',
});
```

**Input:**
```typescript
{
  name: string;        // 1-100 chars
  slug: string;        // 1-50 chars, lowercase, alphanumeric + hyphens
  description?: string;
}
```

#### `organizations.update` - Update Organization

**Type:** `mutation`  
**Auth:** Required (Owner only)

```typescript
const org = await trpc.organizations.update.mutate({
  organizationId: 'org_123',
  name: 'New Name',
  description: 'Updated description',
  logo: 'https://example.com/logo.png',
});
```

#### `organizations.delete` - Delete Organization

**Type:** `mutation`  
**Auth:** Required (Owner only)

```typescript
await trpc.organizations.delete.mutate({
  organizationId: 'org_123',
});
```

#### `organizations.inviteMember` - Invite Member

**Type:** `mutation`  
**Auth:** Required (Admin+)

```typescript
const member = await trpc.organizations.inviteMember.mutate({
  organizationId: 'org_123',
  email: 'user@example.com',
  role: 'EDITOR',
});
```

**Roles:**
- `OWNER` - Full control
- `ADMIN` - Manage projects and members
- `EDITOR` - Edit projects
- `VIEWER` - Read-only

#### `organizations.removeMember` - Remove Member

**Type:** `mutation`  
**Auth:** Required (Admin+)

```typescript
await trpc.organizations.removeMember.mutate({
  organizationId: 'org_123',
  userId: 'user_456',
});
```

---

### 3. Projects Router (`projects.*`)

Manage websites and projects.

#### `projects.list` - List All Projects

**Type:** `query`  
**Auth:** Required

```typescript
const projects = await trpc.projects.list.query({
  organizationId: 'org_123',
});
```

**Response:**
```typescript
{
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  customDomain: string | null;
  subdomain: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  _count: {
    pages: number;
    assets: number;
  };
}[]
```

#### `projects.get` - Get Single Project

**Type:** `query`  
**Auth:** Required

```typescript
const project = await trpc.projects.get.query({
  projectId: 'proj_123',
});
```

**Response includes:**
- Organization
- Creator
- All pages
- Integrations
- Counts (assets, versions)

#### `projects.create` - Create New Project

**Type:** `mutation`  
**Auth:** Required

```typescript
const project = await trpc.projects.create.mutate({
  organizationId: 'org_123',
  name: 'My Portfolio',
  slug: 'my-portfolio',
  description: 'Personal portfolio website',
  template: 'portfolio', // optional: blank, portfolio, ecommerce, blog
});
```

**Notes:**
- Creates homepage automatically
- Checks project limit based on subscription
- Generates subdomain: `{slug}.bubblegum.app`

#### `projects.update` - Update Project

**Type:** `mutation`  
**Auth:** Required

```typescript
const project = await trpc.projects.update.mutate({
  projectId: 'proj_123',
  name: 'Updated Name',
  customDomain: 'example.com',
  metaTitle: 'My Site',
  metaDescription: 'This is my site',
  favicon: 'https://example.com/favicon.ico',
});
```

#### `projects.delete` - Delete Project

**Type:** `mutation`  
**Auth:** Required

```typescript
await trpc.projects.delete.mutate({
  projectId: 'proj_123',
});
```

⚠️ **Warning:** Cascading delete - removes all pages, assets, versions!

#### `projects.publish` - Publish Project

**Type:** `mutation`  
**Auth:** Required

```typescript
const project = await trpc.projects.publish.mutate({
  projectId: 'proj_123',
});
```

**What happens:**
1. Creates version snapshot
2. Sets status to `PUBLISHED`
3. Updates `publishedAt` timestamp
4. Makes site live at subdomain/custom domain

---

### 4. Pages Router (`pages.*`)

Manage individual pages within projects.

#### `pages.list` - List All Pages

**Type:** `query`  
**Auth:** Required

```typescript
const pages = await trpc.pages.list.query({
  projectId: 'proj_123',
});
```

#### `pages.get` - Get Single Page

**Type:** `query`  
**Auth:** Required

```typescript
const page = await trpc.pages.get.query({
  pageId: 'page_123',
});
```

**Response:**
```typescript
{
  id: string;
  name: string;
  slug: string; // "/" for homepage, "/about", "/contact", etc.
  isHomepage: boolean;
  isPublished: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  content: {
    components: Component[];
  };
  mobileContent: object | null;
  tabletContent: object | null;
  createdAt: Date;
  updatedAt: Date;
  project: Project;
}
```

#### `pages.create` - Create New Page

**Type:** `mutation`  
**Auth:** Required

```typescript
const page = await trpc.pages.create.mutate({
  projectId: 'proj_123',
  name: 'About',
  slug: '/about',
  content: {
    components: [],
  },
});
```

#### `pages.update` - Update Page

**Type:** `mutation`  
**Auth:** Required

```typescript
const page = await trpc.pages.update.mutate({
  pageId: 'page_123',
  name: 'About Us',
  content: {
    components: [
      {
        id: 'hero_1',
        type: 'Hero',
        props: {
          title: 'About Us',
          subtitle: 'Learn more about our company',
        },
      },
    ],
  },
  metaTitle: 'About Us - My Site',
  metaDescription: 'Learn more about our company',
});
```

#### `pages.delete` - Delete Page

**Type:** `mutation`  
**Auth:** Required

```typescript
await trpc.pages.delete.mutate({
  pageId: 'page_123',
});
```

⚠️ **Note:** Cannot delete homepage!

#### `pages.duplicate` - Duplicate Page

**Type:** `mutation`  
**Auth:** Required

```typescript
const duplicate = await trpc.pages.duplicate.mutate({
  pageId: 'page_123',
});
```

Creates copy with " (Copy)" suffix.

---

### 5. Components Router (`components.*`)

Access component library and user templates.

#### `components.library` - Get Component Library

**Type:** `query`  
**Auth:** Public

```typescript
const library = await trpc.components.library.query();
```

**Response:**
```typescript
{
  id: string;
  name: string;           // Internal: "Button", "Hero"
  displayName: string;    // Human: "Call to Action Button"
  description: string | null;
  type: 'LAYOUT' | 'CONTENT' | 'FORM' | 'NAVIGATION' | 'ECOMMERCE' | 'BLOG';
  category: string;       // "Marketing", "Forms", etc.
  schema: object;         // Component structure
  thumbnail: string | null;
  tags: string[];
  isPro: boolean;         // Requires Pro subscription
}[]
```

#### `components.getLibraryComponent` - Get Single Component

**Type:** `query`  
**Auth:** Public

```typescript
const component = await trpc.components.getLibraryComponent.query({
  componentId: 'lib_hero_001',
});
```

#### `components.listTemplates` - List User Templates

**Type:** `query`  
**Auth:** Required

```typescript
const templates = await trpc.components.listTemplates.query({
  organizationId: 'org_123',
});
```

#### `components.saveTemplate` - Save Component as Template

**Type:** `mutation`  
**Auth:** Required

```typescript
const template = await trpc.components.saveTemplate.mutate({
  organizationId: 'org_123',
  name: 'My Custom Hero',
  type: 'LAYOUT',
  schema: {
    type: 'Hero',
    props: {
      title: 'Welcome',
      bgColor: '#1a1a1a',
    },
  },
  libraryComponentId: 'lib_hero_001', // optional: base component
});
```

---

### 6. Assets Router (`assets.*`)

Manage uploaded media files.

#### `assets.list` - List All Assets

**Type:** `query`  
**Auth:** Required

```typescript
const assets = await trpc.assets.list.query({
  organizationId: 'org_123',
  projectId: 'proj_123', // optional: filter by project
  type: 'IMAGE',         // optional: IMAGE, VIDEO, DOCUMENT, FONT, ICON
});
```

**Response:**
```typescript
{
  id: string;
  name: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'FONT' | 'ICON';
  url: string;
  key: string;
  size: number;         // bytes
  mimeType: string;
  width: number | null;
  height: number | null;
  uploadedBy: User;
  createdAt: Date;
}[]
```

#### `assets.getUploadUrl` - Get Upload URL

**Type:** `mutation`  
**Auth:** Required

```typescript
const { uploadUrl, assetUrl, key } = await trpc.assets.getUploadUrl.mutate({
  organizationId: 'org_123',
  fileName: 'hero-image.jpg',
  fileType: 'image/jpeg',
});

// Upload file to uploadUrl
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': fileType,
  },
});

// Confirm upload
await trpc.assets.confirmUpload.mutate({
  organizationId: 'org_123',
  name: 'Hero Image',
  type: 'IMAGE',
  url: assetUrl,
  key,
  size: file.size,
  mimeType: fileType,
  width: 1920,
  height: 1080,
});
```

#### `assets.delete` - Delete Asset

**Type:** `mutation`  
**Auth:** Required

```typescript
await trpc.assets.delete.mutate({
  assetId: 'asset_123',
});
```

---

### 7. Analytics Router (`analytics.*`)

**Phase 1 - MVP**

Internal analytics for your sites.

#### `analytics.getDashboardSummary` - Dashboard Overview

**Type:** `query`  
**Auth:** Required

```typescript
const summary = await trpc.analytics.getDashboardSummary.query({
  projectId: 'proj_123',
});
```

**Response:**
```typescript
{
  totalViews: number;       // Last 30 days
  uniqueVisitors: number;   // Last 30 days
  formSubmissions: number;  // Last 30 days
  viewsChange: number;      // % change vs previous 30 days
}
```

#### `analytics.getPageViews` - Get Page Views

**Type:** `query`  
**Auth:** Required

```typescript
const pageViews = await trpc.analytics.getPageViews.query({
  projectId: 'proj_123',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
  groupBy: 'day', // day, week, month
});
```

#### `analytics.getTopPages` - Most Viewed Pages

**Type:** `query`  
**Auth:** Required

```typescript
const topPages = await trpc.analytics.getTopPages.query({
  projectId: 'proj_123',
  limit: 10,
  period: '30d', // 7d, 30d, 90d
});
```

**Response:**
```typescript
{
  path: string;    // "/", "/about", etc.
  views: number;   // Total views
}[]
```

#### `analytics.getUniqueVisitors` - Unique Visitors

**Type:** `query`  
**Auth:** Required

```typescript
const visitors = await trpc.analytics.getUniqueVisitors.query({
  projectId: 'proj_123',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
});
```

#### `analytics.getTrafficSources` - Referrers

**Type:** `query`  
**Auth:** Required

```typescript
const sources = await trpc.analytics.getTrafficSources.query({
  projectId: 'proj_123',
  limit: 10,
});
```

**Response:**
```typescript
{
  referrer: string;  // "google.com", "Direct", etc.
  count: number;
}[]
```

#### `analytics.getGeography` - Visitor Locations

**Type:** `query`  
**Auth:** Required

```typescript
const geo = await trpc.analytics.getGeography.query({
  projectId: 'proj_123',
  limit: 10,
});
```

**Response:**
```typescript
{
  country: string;  // "US", "UK", etc.
  count: number;
}[]
```

---

### 8. Forms Router (`forms.*`)

**Phase 1 - MVP**

Manage form submissions.

#### `forms.listSubmissions` - List Submissions

**Type:** `query`  
**Auth:** Required

```typescript
const { submissions, total } = await trpc.forms.listSubmissions.query({
  projectId: 'proj_123',
  formId: 'form_contact', // optional: filter by form
  limit: 50,
  offset: 0,
});
```

**Response:**
```typescript
{
  submissions: {
    id: string;
    formId: string;
    data: object;      // Form field values
    userAgent: string | null;
    ipAddress: string | null;
    createdAt: Date;
  }[];
  total: number;
  limit: number;
  offset: number;
}
```

#### `forms.getSubmission` - Get Single Submission

**Type:** `query`  
**Auth:** Required

```typescript
const submission = await trpc.forms.getSubmission.query({
  submissionId: 'sub_123',
});
```

#### `forms.exportSubmissions` - Export as CSV

**Type:** `mutation`  
**Auth:** Required

```typescript
const { data, format } = await trpc.forms.exportSubmissions.mutate({
  projectId: 'proj_123',
  formId: 'form_contact', // optional
});
```

#### `forms.deleteSubmission` - Delete Submission

**Type:** `mutation`  
**Auth:** Required

```typescript
await trpc.forms.deleteSubmission.mutate({
  submissionId: 'sub_123',
});
```

---

### 9. AI Router (`ai.*`)

AI-powered features.

#### `ai.generateSite` - Generate Site from Prompt

**Type:** `mutation`  
**Auth:** Required

```typescript
const site = await trpc.ai.generateSite.mutate({
  organizationId: 'org_123',
  prompt: 'Create a modern portfolio for a photographer',
  businessType: 'portfolio',
  colorScheme: 'dark',
  numberOfPages: 3,
});
```

**Response:**
```typescript
{
  pages: {
    name: string;
    slug: string;
    content: object;
  }[];
}
```

#### `ai.chat` - AI Chat Assistant

**Type:** `mutation`  
**Auth:** Required

```typescript
const response = await trpc.ai.chat.mutate({
  projectId: 'proj_123',
  message: 'How can I make my hero section more engaging?',
  context: { /* optional context */ },
});
```

**Response:**
```typescript
{
  message: string;
  suggestions: string[];
}
```

---

### 10. Versions Router (`versions.*`)

Version history and restore.

#### `versions.list` - List Version History

**Type:** `query`  
**Auth:** Required

```typescript
const versions = await trpc.versions.list.query({
  projectId: 'proj_123',
  limit: 10,
});
```

**Response:**
```typescript
{
  id: string;
  snapshot: object;      // Full project state
  label: string | null;  // Optional label
  isAutoSave: boolean;
  createdBy: User;
  createdAt: Date;
}[]
```

#### `versions.get` - Get Single Version

**Type:** `query`  
**Auth:** Required

```typescript
const version = await trpc.versions.get.query({
  versionId: 'ver_123',
});
```

#### `versions.restore` - Restore Version

**Type:** `mutation`  
**Auth:** Required

```typescript
await trpc.versions.restore.mutate({
  versionId: 'ver_123',
});
```

---

### 11. Products Router (`products.*`)

**Phase 2 - E-commerce**

Manage products for e-commerce sites.

#### `products.list` - List Products

**Type:** `query`  
**Auth:** Required

```typescript
const { products, total } = await trpc.products.list.query({
  organizationId: 'org_123',
  isPublished: true,
  limit: 50,
  offset: 0,
});
```

#### `products.get` - Get Single Product

**Type:** `query`  
**Auth:** Required

```typescript
const product = await trpc.products.get.query({
  productId: 'prod_123',
});
```

**Response:**
```typescript
{
  id: string;
  name: string;
  description: string | null;
  slug: string;
  price: number;           // Cents: $29.99 = 2999
  compareAtPrice: number | null;
  sku: string | null;
  quantity: number;
  images: string[];
  isPublished: boolean;
  variants: ProductVariant[];
}
```

#### `products.create` - Create Product

**Type:** `mutation`  
**Auth:** Required

```typescript
const product = await trpc.products.create.mutate({
  organizationId: 'org_123',
  name: 'Awesome T-Shirt',
  description: 'Super comfy shirt',
  slug: 'awesome-tshirt',
  price: 2999, // $29.99
  compareAtPrice: 3999, // $39.99 (strikethrough price)
  sku: 'TSHIRT-001',
  quantity: 100,
  images: ['https://example.com/shirt.jpg'],
});
```

#### `products.update` - Update Product

**Type:** `mutation`  
**Auth:** Required

```typescript
const product = await trpc.products.update.mutate({
  productId: 'prod_123',
  name: 'Updated Name',
  price: 2499,
  isPublished: true,
});
```

#### `products.delete` - Delete Product

**Type:** `mutation`  
**Auth:** Required

```typescript
await trpc.products.delete.mutate({
  productId: 'prod_123',
});
```

#### `products.addVariant` - Add Product Variant

**Type:** `mutation`  
**Auth:** Required

```typescript
const variant = await trpc.products.addVariant.mutate({
  productId: 'prod_123',
  name: 'Medium / Red',
  sku: 'TSHIRT-001-M-RED',
  price: 2999,
  quantity: 50,
  options: {
    size: 'M',
    color: 'Red',
  },
});
```

#### `products.updateVariant` - Update Variant

**Type:** `mutation`  
**Auth:** Required

```typescript
const variant = await trpc.products.updateVariant.mutate({
  variantId: 'var_123',
  quantity: 25,
  price: 2499,
});
```

#### `products.deleteVariant` - Delete Variant

**Type:** `mutation`  
**Auth:** Required

```typescript
await trpc.products.deleteVariant.mutate({
  variantId: 'var_123',
});
```

---

### 12. Orders Router (`orders.*`)

**Phase 2 - E-commerce**

Manage customer orders.

#### `orders.list` - List Orders

**Type:** `query`  
**Auth:** Required

```typescript
const { orders, total } = await trpc.orders.list.query({
  organizationId: 'org_123',
  paymentStatus: 'paid', // optional: pending, paid, failed
  fulfillmentStatus: 'unfulfilled', // optional: unfulfilled, fulfilled, shipped
  limit: 50,
  offset: 0,
});
```

#### `orders.get` - Get Single Order

**Type:** `query`  
**Auth:** Required

```typescript
const order = await trpc.orders.get.query({
  orderId: 'order_123',
});
```

**Response:**
```typescript
{
  id: string;
  orderNumber: string;      // "ORDER-1001"
  customerEmail: string;
  customerName: string | null;
  subtotal: number;         // Cents
  tax: number;
  shipping: number;
  total: number;
  stripePaymentIntentId: string | null;
  paymentStatus: 'pending' | 'paid' | 'failed';
  fulfillmentStatus: 'unfulfilled' | 'fulfilled' | 'shipped';
  shippingAddress: object | null;
  items: OrderItem[];
  createdAt: Date;
}
```

#### `orders.updateStatus` - Update Order Status

**Type:** `mutation`  
**Auth:** Required

```typescript
const order = await trpc.orders.updateStatus.mutate({
  orderId: 'order_123',
  paymentStatus: 'paid',
  fulfillmentStatus: 'shipped',
});
```

#### `orders.getStats` - Get Order Statistics

**Type:** `query`  
**Auth:** Required

```typescript
const stats = await trpc.orders.getStats.query({
  organizationId: 'org_123',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
});
```

**Response:**
```typescript
{
  totalRevenue: number;       // Cents
  totalOrders: number;
  averageOrderValue: number;  // Cents
  paidOrders: number;
  conversionRate: number;     // Percentage
  startDate: Date;
  endDate: Date;
}
```

---

### 13. Blog Router (`blog.*`)

**Phase 3**

Manage blog posts, categories, and comments.

#### `blog.listPosts` - List Blog Posts

**Type:** `query`  
**Auth:** Required

```typescript
const { posts, total } = await trpc.blog.listPosts.query({
  organizationId: 'org_123',
  isPublished: true,
  limit: 20,
  offset: 0,
});
```

#### `blog.getPost` - Get Single Post

**Type:** `query`  
**Auth:** Required

```typescript
const post = await trpc.blog.getPost.query({
  postId: 'post_123',
});
```

**Response:**
```typescript
{
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;           // Markdown or HTML
  featuredImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  categories: BlogCategory[];
  tags: BlogTag[];
  comments: BlogComment[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### `blog.createPost` - Create Blog Post

**Type:** `mutation`  
**Auth:** Required

```typescript
const post = await trpc.blog.createPost.mutate({
  organizationId: 'org_123',
  title: 'My First Post',
  slug: 'my-first-post',
  excerpt: 'This is an excerpt',
  content: '# Hello World\n\nThis is my first post!',
  featuredImage: 'https://example.com/image.jpg',
  metaTitle: 'My First Post',
  metaDescription: 'This is my first blog post',
  categoryIds: ['cat_123'],
  tagIds: ['tag_456'],
});
```

#### `blog.updatePost` - Update Blog Post

**Type:** `mutation`  
**Auth:** Required

```typescript
const post = await trpc.blog.updatePost.mutate({
  postId: 'post_123',
  title: 'Updated Title',
  content: 'Updated content',
  isPublished: true,
});
```

#### `blog.deletePost` - Delete Blog Post

**Type:** `mutation`  
**Auth:** Required

```typescript
await trpc.blog.deletePost.mutate({
  postId: 'post_123',
});
```

#### `blog.listCategories` - List Categories

**Type:** `query`  
**Auth:** Required

```typescript
const categories = await trpc.blog.listCategories.query({
  organizationId: 'org_123',
});
```

#### `blog.createCategory` - Create Category

**Type:** `mutation`  
**Auth:** Required

```typescript
const category = await trpc.blog.createCategory.mutate({
  organizationId: 'org_123',
  name: 'Technology',
  slug: 'technology',
});
```

#### `blog.listTags` - List Tags

**Type:** `query`  
**Auth:** Required

```typescript
const tags = await trpc.blog.listTags.query({
  organizationId: 'org_123',
});
```

#### `blog.createTag` - Create Tag

**Type:** `mutation`  
**Auth:** Required

```typescript
const tag = await trpc.blog.createTag.mutate({
  organizationId: 'org_123',
  name: 'React',
  slug: 'react',
});
```

#### `blog.listComments` - List Comments

**Type:** `query`  
**Auth:** Required

```typescript
const comments = await trpc.blog.listComments.query({
  postId: 'post_123',
  isApproved: false, // optional: for moderation
});
```

#### `blog.approveComment` - Approve Comment

**Type:** `mutation`  
**Auth:** Required

```typescript
const comment = await trpc.blog.approveComment.mutate({
  commentId: 'comment_123',
});
```

#### `blog.deleteComment` - Delete Comment

**Type:** `mutation`  
**Auth:** Required

```typescript
await trpc.blog.deleteComment.mutate({
  commentId: 'comment_123',
});
```

---

## ❌ ERROR HANDLING

tRPC errors include:

### Error Codes

```typescript
'UNAUTHORIZED'      // 401 - Not authenticated
'FORBIDDEN'         // 403 - Not authorized
'NOT_FOUND'         // 404 - Resource not found
'CONFLICT'          // 409 - Duplicate/conflict
'BAD_REQUEST'       // 400 - Invalid input
'INTERNAL_SERVER_ERROR' // 500 - Server error
```

### Error Response

```typescript
{
  error: {
    message: string;
    code: string;
    data: {
      code: string;
      httpStatus: number;
      path: string;
    };
  };
}
```

### Handling Errors

```typescript
try {
  const project = await trpc.projects.create.mutate({ ... });
} catch (error) {
  if (error.data?.code === 'FORBIDDEN') {
    console.error('Project limit reached');
  }
}
```

---

## 🚦 RATE LIMITING

Rate limits by subscription tier:

| Tier | Requests/Hour | Burst |
|------|---------------|-------|
| FREE | 1,000 | 50 |
| STARTER | 5,000 | 100 |
| PRO | 20,000 | 500 |
| ENTERPRISE | Unlimited | Unlimited |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

---

## 📝 EXAMPLES

### Complete Client Setup

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { useAuth } from '@clerk/nextjs';
import type { AppRouter } from './server/trpc/router';

export function useTRPC() {
  const { getToken } = useAuth();

  const trpc = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'https://api.bubblegum.app/trpc',
        async headers() {
          const token = await getToken();
          return {
            authorization: token ? `Bearer ${token}` : '',
          };
        },
      }),
    ],
  });

  return trpc;
}
```

### React Hook

```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from './server/trpc/router';

export const trpc = createTRPCReact<AppRouter>();

// Usage in component
function MyProjects() {
  const { data: projects, isLoading } = trpc.projects.list.useQuery({
    organizationId: 'org_123',
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {projects?.map((project) => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}
```

### Mutation Example

```typescript
function CreateProject() {
  const createProject = trpc.projects.create.useMutation();

  const handleSubmit = async (data) => {
    try {
      const project = await createProject.mutateAsync({
        organizationId: 'org_123',
        name: data.name,
        slug: data.slug,
      });
      
      console.log('Created:', project);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## 🔗 RELATED DOCUMENTS

- **trpc-router.ts** - Full router implementation
- **schema.prisma** - Database schema
- **DATABASE_DOCUMENTATION.md** - Database docs

---

**API Documentation Status:** ✅ Complete  
**Last Updated:** November 1, 2025  
**Version:** 1.0.0

---

*This API documentation covers all endpoints for Bubble Gum MVP and future phases. All endpoints are type-safe and validated with Zod schemas.*