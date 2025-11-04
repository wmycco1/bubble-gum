# Bubble Gum API Documentation

**Version:** 1.0.0
**Last Updated:** November 03, 2025
**Status:** Production Ready

---

## Table of Contents

1. [tRPC API (Internal, Type-Safe)](#trpc-api-internal-type-safe)
2. [REST API (External, for n8n/Webhooks)](#rest-api-external-for-n8nwebhooks)
3. [Webhooks](#webhooks)
4. [Critical Endpoints Examples](#critical-endpoints-examples)
   - [AI Website Generation](#1-ai-website-generation-trpc)
   - [Page Publishing](#2-page-publishing-trpc)
   - [CSV Product Import](#3-csv-product-import-rest-api)
   - [Organization Members](#4-organization-members-trpc)
   - [Analytics Query](#5-analytics-query-rest-api)
   - [Webhook Subscription](#6-webhook-subscription-rest-api)
5. [Rate Limits by Tier](#rate-limits-by-tier)
6. [CSV Import Specification](#csv-import-specification)

---

## tRPC API (Internal, Type-Safe)

### Overview

**Location:** `/src/trpc/trpc-router.ts`

**Total Endpoints:** 80+
**Total Routers:** 13

### Core Routers

| Router | Endpoints | Purpose |
|--------|-----------|---------|
| **auth** | 2 | User authentication & profile |
| **organizations** | 7 | Team collaboration |
| **projects** | 6 | Website management |
| **pages** | 6 | Page CRUD |
| **components** | 4 | Component library |
| **assets** | 4 | File uploads |
| **analytics** | 6 | Internal analytics |
| **forms** | 4 | Form submissions |
| **ai** | 2 | AI generation |
| **versions** | 3 | Version history |
| **products** | 9 | E-commerce products |
| **orders** | 4 | E-commerce orders |
| **blog** | 13 | Blog management |

### Key Features

- **Type Safety:** End-to-end TypeScript
- **Batch Requests:** Multiple queries in one HTTP request
- **React Query Integration:** Automatic caching, refetching
- **Error Handling:** Typed errors with specific codes

### Authentication Flow

```typescript
1. User signs in via Clerk
2. Get session token: await getToken()
3. Send in header: Authorization: Bearer {token}
4. tRPC validates via middleware
5. User ID available in ctx.userId
```

---

## REST API (External, for n8n/Webhooks)

### Overview

**Location:** `/docs/iterations/07-sdk/openapi.yaml`

**Standard:** OpenAPI 3.0.3
**Documented Endpoints:** 50+

### Features

- Bearer token authentication
- Rate limiting by subscription tier
- Request/response schemas
- Error codes (UNAUTHORIZED, FORBIDDEN, NOT_FOUND)

---

## Webhooks

### Overview

**Total Event Types:** 20+

### Event Categories

- **Project events:** created, updated, published, deleted
- **Analytics events:** threshold_reached, form.submitted
- **E-commerce events:** order.created, order.paid, order.shipped
- **Blog events:** post_published, comment_posted
- **Organization events:** member_added, subscription_updated

### Security

- HMAC SHA-256 signatures
- Timestamp verification (5 min window)
- HTTPS required
- Idempotency with event IDs

---

## Critical Endpoints Examples

Наиболее важные endpoints для MVP с примерами кода.

### 1. AI Website Generation (tRPC)

**Endpoint:** `ai.generateWebsite`

**Purpose:** Create a complete website from text description

**Input TypeScript Interface:**
```typescript
interface GenerateWebsiteInput {
  prompt: string;              // "Create a coffee shop website"
  organizationId: string;      // Organization CUID
  referenceImageUrl?: string;  // Optional inspiration
  targetPages?: string[];      // ["home", "menu", "contact"]
}
```

**Output TypeScript Interface:**
```typescript
interface GenerateWebsiteOutput {
  projectId: string;
  pages: Array<{
    id: string;
    title: string;
    slug: string;
    content: {
      version: "1.0";
      components: Array<{
        id: string;
        type: "LAYOUT" | "CONTENT" | "FORM";
        componentId: string;
        props: Record<string, any>;
        styles: Record<string, any>;
        children: Array<any>;
      }>;
    };
  }>;
  assets: Array<{
    id: string;
    url: string;
    type: "IMAGE";
  }>;
  estimatedTokens: number;
}
```

**Example Request:**
```typescript
const result = await trpc.ai.generateWebsite.mutate({
  prompt: "Create a modern coffee shop website with menu and location",
  organizationId: "cm123abc",
  targetPages: ["home", "menu", "about", "contact"]
});

// Response example:
// {
//   projectId: "cm789xyz",
//   pages: [
//     {
//       id: "cm111aaa",
//       title: "Home",
//       slug: "/",
//       content: { version: "1.0", components: [...] }
//     },
//     {
//       id: "cm222bbb",
//       title: "Menu",
//       slug: "/menu",
//       content: { version: "1.0", components: [...] }
//     }
//   ],
//   assets: [
//     { id: "cm333ccc", url: "https://r2.../img.jpg", type: "IMAGE" }
//   ],
//   estimatedTokens: 5420
// }
```

---

### 2. Page Publishing (tRPC)

**Endpoint:** `pages.publish`

**Purpose:** Publish page and trigger auto-post to social media

**Input TypeScript Interface:**
```typescript
interface PublishPageInput {
  pageId: string;              // Page CUID
  socialAccounts?: string[];   // Optional: specific accounts
  scheduleAt?: Date;           // Optional: schedule for later
}
```

**Output TypeScript Interface:**
```typescript
interface PublishPageOutput {
  success: boolean;
  publishedAt: Date;
  url: string;                 // https://my-site.bubblegum.app/page-slug
  socialPosts?: Array<{
    platform: "FACEBOOK" | "INSTAGRAM" | "TWITTER" | "LINKEDIN";
    status: "QUEUED" | "POSTED" | "FAILED";
    postId?: string;
    error?: string;
  }>;
}
```

**Example Request:**
```typescript
const result = await trpc.pages.publish.mutate({
  pageId: "cm456def",
  socialAccounts: ["facebook_acc_1", "instagram_acc_1"]
});

// Response example:
// {
//   success: true,
//   publishedAt: "2025-11-03T12:30:00Z",
//   url: "https://coffee-shop.bubblegum.app/menu",
//   socialPosts: [
//     {
//       platform: "FACEBOOK",
//       status: "QUEUED",
//       postId: undefined
//     },
//     {
//       platform: "INSTAGRAM",
//       status: "QUEUED",
//       postId: undefined
//     }
//   ]
// }
```

---

### 3. CSV Product Import (REST API)

**Endpoint:** `POST /api/v1/products/import`

**Purpose:** Bulk import products for e-commerce

**Headers:**
```
Authorization: Bearer bg_live_1a2b3c4d...
Content-Type: multipart/form-data
```

**Request Body TypeScript Interface:**
```typescript
interface ProductImportRequest {
  file: File;                                    // CSV file
  organizationId: string;                        // Organization CUID
  projectId: string;                             // Project CUID
  options: {
    skipFirstRow?: boolean;                      // Default: true (headers)
    delimiter?: "," | ";" | "\t";                // Default: ","
    onConflict?: "skip" | "update" | "replace";  // Default: "skip"
  };
}
```

**Response TypeScript Interface:**
```typescript
interface ProductImportResponse {
  success: boolean;
  imported: number;
  skipped: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
  products: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
  }>;
}
```

**Example Request (cURL):**
```bash
curl -X POST https://api.bubblegum.app/api/v1/products/import \
  -H "Authorization: Bearer bg_live_1a2b3c4d..." \
  -F "file=@products.csv" \
  -F "organizationId=cm123abc" \
  -F "projectId=cm789xyz" \
  -F "options={\"skipFirstRow\":true,\"delimiter\":\",\",\"onConflict\":\"skip\"}"
```

**Example Response:**
```json
{
  "success": true,
  "imported": 142,
  "skipped": 3,
  "errors": [
    {
      "row": 5,
      "error": "Invalid price format"
    },
    {
      "row": 12,
      "error": "Missing SKU"
    }
  ],
  "products": [
    {
      "id": "cm789ghi",
      "name": "Red T-Shirt",
      "sku": "TSHIRT-RED-001",
      "price": 29.99
    },
    {
      "id": "cm790jkl",
      "name": "Blue Jeans",
      "sku": "JEANS-BLUE-001",
      "price": 59.99
    }
  ]
}
```

---

### 4. Organization Members (tRPC)

**Endpoint:** `organizations.inviteMember`

**Purpose:** Invite user to organization/team

**Input TypeScript Interface:**
```typescript
interface InviteMemberInput {
  organizationId: string;
  email: string;
  role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
}
```

**Output TypeScript Interface:**
```typescript
interface InviteMemberOutput {
  inviteId: string;
  email: string;
  inviteUrl: string;  // https://bubblegum.app/invite/abc123
  expiresAt: Date;    // 7 days from now
}
```

**Example Request:**
```typescript
const invite = await trpc.organizations.inviteMember.mutate({
  organizationId: "cm123abc",
  email: "designer@example.com",
  role: "EDITOR"
});

// Response example:
// {
//   inviteId: "inv_abc123",
//   email: "designer@example.com",
//   inviteUrl: "https://bubblegum.app/invite/inv_abc123",
//   expiresAt: "2025-11-10T12:00:00Z"
// }
//
// Email sent automatically with invite link
```

---

### 5. Analytics Query (REST API)

**Endpoint:** `GET /api/v1/analytics/page-views`

**Purpose:** Get page view statistics

**Query Parameters:**
```
projectId: string           (required)
startDate: ISO8601 date     (required)
endDate: ISO8601 date       (required)
groupBy: "day" | "hour" | "page"  (optional, default: "day")
```

**Example Request:**
```bash
curl -X GET \
  'https://api.bubblegum.app/api/v1/analytics/page-views?projectId=cm789xyz&startDate=2025-11-01&endDate=2025-11-03&groupBy=day' \
  -H "Authorization: Bearer bg_live_1a2b3c4d..."
```

**Response TypeScript Interface:**
```typescript
interface PageViewsResponse {
  total: number;
  data: Array<{
    date: string;          // ISO8601
    views: number;
    uniqueVisitors: number;
    pages: Array<{
      slug: string;
      views: number;
    }>;
  }>;
  topPages: Array<{
    slug: string;
    title: string;
    views: number;
  }>;
}
```

**Example Response:**
```json
{
  "total": 1523,
  "data": [
    {
      "date": "2025-11-01",
      "views": 342,
      "uniqueVisitors": 287,
      "pages": [
        {
          "slug": "/",
          "views": 180
        },
        {
          "slug": "/menu",
          "views": 95
        },
        {
          "slug": "/contact",
          "views": 67
        }
      ]
    },
    {
      "date": "2025-11-02",
      "views": 456,
      "uniqueVisitors": 389,
      "pages": [
        {
          "slug": "/",
          "views": 245
        },
        {
          "slug": "/menu",
          "views": 156
        },
        {
          "slug": "/products",
          "views": 55
        }
      ]
    }
  ],
  "topPages": [
    {
      "slug": "/",
      "title": "Home",
      "views": 890
    },
    {
      "slug": "/menu",
      "title": "Menu",
      "views": 345
    },
    {
      "slug": "/contact",
      "title": "Contact",
      "views": 288
    }
  ]
}
```

---

### 6. Webhook Subscription (REST API)

**Endpoint:** `POST /api/v1/webhooks`

**Purpose:** Subscribe to events for n8n/Zapier integration

**Request Body TypeScript Interface:**
```typescript
interface WebhookSubscriptionRequest {
  url: string;              // Webhook endpoint URL
  events: string[];         // Event types to subscribe to
  active: boolean;          // Enable/disable webhook
}
```

**Example Request:**
```json
{
  "url": "https://hooks.zapier.com/hooks/catch/123/abc456xyz/",
  "events": [
    "project.published",
    "order.created",
    "form.submitted"
  ],
  "active": true
}
```

**Response TypeScript Interface:**
```typescript
interface WebhookSubscriptionResponse {
  id: string;               // Webhook subscription ID
  url: string;
  events: string[];
  secret: string;           // For HMAC verification
  active: boolean;
  createdAt: string;        // ISO8601 timestamp
}
```

**Example Response:**
```json
{
  "id": "wh_abc123",
  "url": "https://hooks.zapier.com/hooks/catch/123/abc456xyz/",
  "events": [
    "project.published",
    "order.created",
    "form.submitted"
  ],
  "secret": "whsec_xyz789_for_hmac_verification",
  "active": true,
  "createdAt": "2025-11-03T10:00:00Z"
}
```

**Webhook Payload Example:**

When an event occurs, this payload is sent to your URL:

```json
{
  "id": "evt_abc123",
  "type": "project.published",
  "createdAt": "2025-11-03T10:05:00Z",
  "data": {
    "projectId": "cm123abc",
    "projectName": "Coffee Shop Website",
    "url": "https://coffee-shop.bubblegum.app",
    "publishedBy": "user_xyz"
  },
  "signature": "sha256=abcdef123456..."
}
```

**Webhook Verification (TypeScript):**

```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const providedSignature = signature.replace('sha256=', '');

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(providedSignature)
  );
}

// Usage in Express
app.post('/webhook', (req, res) => {
  const payload = JSON.stringify(req.body);
  const signature = req.headers['x-bubble-gum-signature'] as string;
  const secret = 'whsec_xyz789_for_hmac_verification';

  if (!verifyWebhookSignature(payload, signature, secret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process webhook safely
  const event = req.body;
  console.log(`Processing ${event.type}: ${event.data.projectId}`);

  res.json({ success: true });
});
```

---

## Rate Limits by Tier

### Requests and AI Generations

| Tier | tRPC Requests | REST API | Webhooks | AI Generations |
|------|--------------|----------|----------|----------------|
| **FREE** | 1,000/day | 100/day | 10 subscriptions | 10/day (own keys) |
| **STARTER** | 10,000/day | 1,000/day | 50 subscriptions | 100/day (pooled) |
| **PRO** | 100,000/day | 10,000/day | Unlimited | Unlimited (pooled) |
| **ENTERPRISE** | Unlimited | Unlimited | Unlimited | Unlimited (dedicated) |

### Retry Logic

- **Retry 1:** After 1 minute
- **Retry 2:** After 5 minutes
- **Retry 3:** After 15 minutes

### Handling Rate Limits

When you exceed rate limits, you'll receive a 429 (Too Many Requests) response:

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

Implement exponential backoff in your client:

```typescript
async function makeRequestWithRetry(
  fn: () => Promise<any>,
  maxRetries: number = 3
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 60000; // 1, 2, 4 minutes
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
```

---

## CSV Import Specification

Bulk import for Products and Pages (available in Pro tier and above).

### Products CSV Format

#### Required Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `name` | string | max 200 chars | Product name |
| `price` | decimal | e.g., 29.99 | Base price |
| `sku` | string | unique | Stock keeping unit |

#### Optional Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `description` | text | - | Product description |
| `category` | string | - | Product category |
| `tags` | string | comma-separated | e.g., "t-shirt,red,cotton" |
| `image_url` | URL | - | Main product image |
| `inventory_qty` | integer | - | Stock quantity |
| `is_featured` | boolean | - | Featured product flag |
| `variant_name` | string | - | e.g., "Size", "Color" |
| `variant_options` | string | pipe-separated | e.g., "S\|M\|L\|XL" |
| `variant_prices` | string | pipe-separated | e.g., "29.99\|29.99\|29.99\|34.99" |
| `variant_skus` | string | pipe-separated | e.g., "TSHIRT-S\|TSHIRT-M\|TSHIRT-L\|TSHIRT-XL" |

#### Example CSV (Products)

```csv
name,price,sku,description,category,tags,image_url,inventory_qty,variant_name,variant_options,variant_prices,variant_skus
"Red T-Shirt",29.99,TSHIRT-RED-001,"Comfortable cotton t-shirt",Clothing,"t-shirt,red,cotton",https://example.com/img.jpg,50,Size,"S|M|L|XL","29.99|29.99|29.99|34.99","TSHIRT-RED-S|TSHIRT-RED-M|TSHIRT-RED-L|TSHIRT-RED-XL"
"Blue Jeans",59.99,JEANS-BLUE-001,"Classic denim jeans",Clothing,"jeans,blue,denim",https://example.com/jeans.jpg,30,,,
"White Sneakers",89.99,SHOES-WHITE-001,"Premium leather sneakers",Footwear,"shoes,white,leather",https://example.com/shoes.jpg,25,Size,"7|8|9|10|11|12","89.99|89.99|89.99|89.99|89.99|89.99","SHOES-W-7|SHOES-W-8|SHOES-W-9|SHOES-W-10|SHOES-W-11|SHOES-W-12"
```

---

### Pages CSV Format

#### Required Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `title` | string | - | Page title |
| `slug` | string | URL-safe | e.g., "about-us" |

#### Optional Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `meta_title` | string | - | SEO meta title |
| `meta_description` | string | - | SEO meta description |
| `template` | string | Template ID | Template ID to use |
| `content` | HTML/JSON | - | For AI parsing |
| `published` | boolean | - | Default: false |

#### Example CSV (Pages)

```csv
title,slug,meta_title,meta_description,template,published
"About Us",about-us,"Learn About Our Company","Meet our team and story",about-template,true
"Contact",contact,"Contact Us","Get in touch with our team","contact-template",true
"Blog",blog,"Latest Articles","Read our latest blog posts","","false
"Services",services,"Our Services","Discover what we offer","services-template",true
"FAQ",faq,"Frequently Asked Questions","Common questions answered","","false
```

---

### Import Process (5 Steps)

#### Step 1: Upload

- **Method:** Drag & drop or file picker
- **Max file size:** 10MB (Pro), 5MB (Starter)
- **Supported formats:** `.csv`, `.xlsx`
- **Timeout:** 60 seconds

#### Step 2: Validation

The system performs these validation checks:

```typescript
interface ValidationChecks {
  checks: [
    "Required fields present",
    "Valid data types",
    "URL format validation",
    "Unique SKU check (for products)",
    "Price > 0 (for products)",
    "Variant arrays same length"
  ];
}
```

**Validation Rules:**
- All required fields must be present
- Data types must match field definitions
- URLs must be valid and reachable
- SKUs must be unique across the project
- Prices must be positive numbers
- Variant arrays (options, prices, SKUs) must have equal length

#### Step 3: Preview

- Shows first 10 rows of CSV
- Highlights errors in red
- User can review and decide to proceed or modify

#### Step 4: Import Settings

Users can configure import behavior:

```typescript
interface ImportOptions {
  skipFirstRow: boolean;                         // Default: true (headers)
  delimiter: "," | ";" | "\t";                   // Default: ","
  onConflict: "skip" | "update" | "replace";    // Default: "skip"
}
```

**Conflict Resolution:**
- `skip`: Skip rows with duplicate SKUs
- `update`: Update existing products with matching SKU
- `replace`: Replace entire product with new data

#### Step 5: Execution

- **Batch size:** 100 rows per batch
- **Progress tracking:** Real-time percentage bar
- **Background jobs:** Automatic for files >1000 rows
- **Estimated time:** ~10 seconds per 1000 rows

---

### Import Results

#### Success Summary

After import completion, you receive a detailed summary:

```json
{
  "success": true,
  "imported": 247,
  "updated": 12,
  "skipped": 3,
  "warnings": 15,
  "errors": [
    {
      "row": 5,
      "error": "Invalid price format"
    },
    {
      "row": 12,
      "error": "Duplicate SKU: TSHIRT-001"
    },
    {
      "row": 45,
      "error": "Image URL unreachable"
    }
  ],
  "downloadErrorReport": "/downloads/import-errors-2025-11-03.csv"
}
```

**Result Fields:**
- `imported`: Successfully imported new items
- `updated`: Existing items updated (when onConflict = "update")
- `skipped`: Items skipped due to errors
- `warnings`: Non-critical issues (e.g., image download failed, used placeholder)
- `errors`: Critical errors that prevented import
- `downloadErrorReport`: CSV with detailed error information

---

### Error Handling

| Error Type | Action | User Feedback |
|-----------|---------|---------------|
| Invalid CSV format | Reject upload | "Invalid file format. Please upload CSV or XLSX." |
| Missing required field | Skip row | "Row X: Missing required field 'name'" |
| Image download fails | Use placeholder | "Row X: Image failed, using placeholder" |
| Duplicate SKU | Skip/Update based on settings | "Row X: SKU already exists" |
| Invalid price | Skip row | "Row X: Price must be a positive number" |
| Invalid URL | Use placeholder | "Row X: Invalid image URL" |
| Database error | Rollback batch | "Database error. Please try again." |
| File size exceeded | Reject upload | "File too large. Max: 10MB (Pro), 5MB (Starter)" |

**Error Report CSV Example:**
```csv
row,field,value,error
5,price,"abc",Invalid price format
12,sku,TSHIRT-001,Duplicate SKU
45,image_url,https://invalid.example.com/img.jpg,Image URL unreachable
```

---

### Export Functionality

#### Export Options

```typescript
interface ExportOptions {
  formats: ["CSV", "XLSX"];
  includes: [
    "All products with variants",
    "All custom fields",
    "Image URLs",
    "Template for re-import"
  ];
}
```

#### Template Download

- **Location:** Admin Panel → Products → Download Template
- **Contents:** Empty CSV with headers + 1 example row
- **Purpose:** Helps users understand correct CSV format
- **Format:** Same as import format for seamless re-import

#### UI Locations

```
Product Import:
  Admin Panel → Products → Import CSV
  Admin Panel → Products → Export CSV
  Admin Panel → Products → Download Template

Page Import:
  Admin Panel → Pages → Import CSV
  Admin Panel → Pages → Export CSV
```

---

### Rate Limits for Import

| Tier | Max File Size | Max Rows | Concurrent Imports |
|------|--------------|----------|-------------------|
| **FREE** | - | - | Not available |
| **STARTER** | 5 MB | 1,000 | 1 |
| **PRO** | 10 MB | 10,000 | 3 |
| **ENTERPRISE** | 50 MB | 100,000 | Unlimited |

---

## Error Response Format

All API errors follow this standard format:

```typescript
interface ErrorResponse {
  error: string;                    // Error type
  message: string;                  // Human-readable message
  code: string;                     // Error code (e.g., "INVALID_INPUT")
  details?: Record<string, any>;    // Additional context
  timestamp: string;                // ISO8601 timestamp
}
```

**Example Error Response:**

```json
{
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired API key",
  "code": "INVALID_API_KEY",
  "timestamp": "2025-11-03T10:00:00Z"
}
```

---

## Authentication

### API Key Format

**Format:** `bg_live_1a2b3c4d5e6f...` (32 chars after prefix)

**Creation:**
1. Go to Settings → API Keys
2. Click "Create API Key"
3. Give it a name and select permissions
4. Copy the key (shown only once)

### Bearer Token Usage

```bash
curl -X GET https://api.bubblegum.app/api/v1/projects \
  -H "Authorization: Bearer bg_live_1a2b3c4d..."
```

### tRPC Authentication

For tRPC endpoints, authentication is handled automatically via Clerk session.

---

## Best Practices

### 1. Always Use Pagination for Large Results

```bash
GET /api/v1/products?limit=100&offset=0
GET /api/v1/products?limit=100&offset=100
```

### 2. Implement Exponential Backoff for Retries

```typescript
const delay = Math.pow(2, attempt - 1) * 60000; // 1, 2, 4 minutes
```

### 3. Cache Responses When Possible

```typescript
// Cache analytics data for 5 minutes
const cacheKey = `analytics:${projectId}:${startDate}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
```

### 4. Verify Webhook Signatures

Always verify webhook signatures using HMAC-SHA256 before processing.

### 5. Monitor Rate Limit Headers

```typescript
const remaining = response.headers['x-ratelimit-remaining'];
const resetTime = response.headers['x-ratelimit-reset'];

if (remaining < 10) {
  console.warn(`Only ${remaining} requests remaining`);
}
```

---

## Support & Documentation

- **API Reference:** https://api.bubblegum.app/docs
- **OpenAPI Spec:** https://api.bubblegum.app/openapi.json
- **n8n Integration:** https://docs.bubble-gum.app/n8n
- **Webhooks Guide:** https://docs.bubble-gum.app/webhooks

---

**Last Updated:** November 03, 2025
**Version:** 1.0.0
**Status:** Production Ready
