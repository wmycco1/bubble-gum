# Security Implementation Guide

**Project:** Bubble Gum
**Version:** 1.0
**Last Updated:** November 3, 2025
**Status:** Production Ready

This document provides comprehensive security implementation guidelines for Bubble Gum, covering authentication, validation, encryption, and compliance.

---

## Table of Contents

1. [Authentication (Clerk)](#authentication-clerk)
2. [Protected tRPC Procedures](#protected-trpc-procedures)
3. [Input Validation (Zod)](#input-validation-zod)
4. [XSS Prevention](#xss-prevention)
5. [Security Headers](#security-headers)
6. [Rate Limiting](#rate-limiting)
7. [Data Encryption](#data-encryption)
8. [SQL Injection Prevention](#sql-injection-prevention)
9. [API Key Security](#api-key-security)
10. [OWASP Top 10 Compliance](#owasp-top-10-compliance)
11. [Security Checklist](#security-checklist-pre-deploy)

---

## Authentication (Clerk)

### Setup with TypeScript

Clerk handles OAuth authentication (Google, GitHub) and provides JWT tokens for API security.

#### Middleware Configuration

```typescript
// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/pricing", "/blog(.*)"],
  ignoredRoutes: ["/api/webhook"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

**Configuration Explanation:**
- `publicRoutes`: Pages accessible without authentication
- `ignoredRoutes`: Routes that don't require auth middleware (webhooks, health checks)
- `matcher`: Regex pattern to apply middleware to specific routes

#### Environment Variables

```bash
# .env.local
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

#### Sign In & Sign Up Pages

```typescript
// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <SignIn />;
}

// app/(auth)/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return <SignUp />;
}
```

#### User Profile Access

```typescript
// components/UserMenu.tsx
import { UserButton } from "@clerk/nextjs";

export function UserMenu() {
  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: "w-10 h-10",
        },
      }}
    />
  );
}
```

#### Get Current User

```typescript
// lib/auth.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  const { userId } = auth();
  if (!userId) return null;

  return await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
}

// Usage in Server Component
import { getCurrentUser } from "@/lib/auth";

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return <div>Welcome, {user.name}</div>;
}
```

---

## Protected tRPC Procedures

### Middleware Setup

Create a protected procedure that requires authentication:

```typescript
// src/trpc/trpc.ts
import { TRPCError, initTRPC } from "@trpc/server";
import { getAuth } from "@clerk/nextjs/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

export async function createTRPCContext(opts: CreateNextContextOptions) {
  const { req } = opts;
  const { userId } = getAuth(req);

  return {
    userId,
    req,
  };
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure - requires authenticated user
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Must be logged in to access this resource",
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId, // Guaranteed to be non-null
    },
  });
});

/**
 * Admin procedure - requires admin role
 */
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = await prisma.user.findUnique({
    where: { clerkUserId: ctx.userId! },
    include: { organizations: true },
  });

  const isAdmin = user?.organizations.some((org) => org.role === "ADMIN");

  if (!isAdmin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }

  return next({ ctx });
});
```

### Using Protected Procedures

```typescript
// src/trpc/routers/projects.ts
import { router, protectedProcedure } from "@/trpc/trpc";
import { z } from "zod";

export const projectsRouter = router({
  list: protectedProcedure
    .input(z.object({ organizationId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      // ctx.userId is guaranteed to exist
      return await prisma.project.findMany({
        where: { organizationId: input.organizationId },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        organizationId: z.string().cuid(),
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.project.create({
        data: {
          ...input,
          createdBy: ctx.userId!,
        },
      });
    }),
});
```

---

## Input Validation (Zod)

### Schema Definition

All API endpoints MUST validate input using Zod schemas:

```typescript
// lib/schemas/page.ts
import { z } from "zod";

export const createPageSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .min(1)
    .max(100),
  content: z
    .string()
    .max(50000, "Content is too large")
    .optional()
    .default(""),
  projectId: z.string().cuid("Invalid project ID"),
  seoTitle: z
    .string()
    .max(60, "SEO title must be 60 characters or less")
    .optional(),
  seoDescription: z
    .string()
    .max(160, "SEO description must be 160 characters or less")
    .optional(),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;
```

### Using Schemas in tRPC

```typescript
// src/trpc/routers/pages.ts
export const pagesRouter = router({
  create: protectedProcedure
    .input(createPageSchema)
    .mutation(async ({ input, ctx }) => {
      // Input is validated by Zod, safe to use
      const existingPage = await prisma.page.findUnique({
        where: {
          projectId_slug: {
            projectId: input.projectId,
            slug: input.slug,
          },
        },
      });

      if (existingPage) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A page with this slug already exists",
        });
      }

      return await prisma.page.create({
        data: {
          ...input,
          isPublished: false,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        pageId: z.string().cuid(),
        ...createPageSchema.partial(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { pageId, ...updateData } = input;

      return await prisma.page.update({
        where: { id: pageId },
        data: updateData,
      });
    }),
});
```

### Complex Validation Example

```typescript
// lib/schemas/product.ts
export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  price: z
    .number()
    .positive("Price must be greater than 0")
    .max(999999.99),
  sku: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
  category: z.string().max(100).optional(),
  tags: z
    .array(z.string().max(50))
    .max(10, "Maximum 10 tags allowed")
    .optional()
    .default([]),
  variants: z
    .array(
      z.object({
        name: z.string().min(1),
        options: z.array(z.string().min(1)),
        prices: z.array(z.number().positive()).optional(),
      })
    )
    .optional(),
  inventory: z
    .object({
      quantity: z.number().nonnegative(),
      trackInventory: z.boolean().default(true),
    })
    .optional(),
});
```

### Async Validation

```typescript
// For database-level validation (e.g., unique constraints)
export const createProjectSchema = z.object({
  organizationId: z.string().cuid(),
  name: z.string().min(1).max(100),
  subdomain: z.string().regex(/^[a-z0-9-]+$/),
}).refine(async (data) => {
  const existing = await prisma.project.findUnique({
    where: { subdomain: data.subdomain },
  });
  return !existing;
}, {
  message: "Subdomain is already taken",
  path: ["subdomain"],
});
```

---

## XSS Prevention

### DOMPurify Setup

Sanitize all user-generated HTML content:

```typescript
// lib/sanitize.ts
import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "b",
      "i",
      "em",
      "strong",
      "a",
      "p",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "br",
      "img",
      "blockquote",
      "code",
      "pre",
    ],
    ALLOWED_ATTR: ["href", "class", "alt", "src", "target"],
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|news|data):|[^a-z]|[a-z+.\-]*(?:[^a-z+.\-:]|$))/i,
  });
}

/**
 * Sanitize user input for rich text editors
 */
export function sanitizeRichText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "b",
      "i",
      "em",
      "strong",
      "a",
      "p",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "br",
      "span",
      "div",
    ],
    ALLOWED_ATTR: ["href", "class", "style"],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Allow minimal HTML for marketing content
 */
export function sanitizeMarketing(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["a", "br", "p", "strong", "em", "u"],
    ALLOWED_ATTR: ["href"],
    KEEP_CONTENT: true,
  });
}
```

### Usage in API Routes

```typescript
// app/api/pages/route.ts
import { sanitizeHTML } from "@/lib/sanitize";

export async function POST(request: Request) {
  const body = await request.json();

  // Sanitize content before saving
  const sanitizedContent = sanitizeHTML(body.content);

  const page = await prisma.page.create({
    data: {
      title: body.title,
      content: sanitizedContent, // Safe to store
      projectId: body.projectId,
    },
  });

  return Response.json(page);
}
```

### Content Security Policy (CSP)

Configure CSP headers to prevent inline script execution:

```typescript
// next.config.js
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.com https://cdn.clerk.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https: https://r2.cloudflarestorage.com;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://api.clerk.com https://*.clerk.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
  block-all-mixed-content;
`;

module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};
```

### React Component Protection

```typescript
// components/RichTextEditor.tsx
import { useCallback } from "react";
import DOMPurify from "isomorphic-dompurify";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const handleChange = useCallback(
    (newValue: string) => {
      // Always sanitize on change
      const sanitized = DOMPurify.sanitize(newValue);
      onChange(sanitized);
    },
    [onChange]
  );

  return (
    <textarea
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      className="w-full p-2 border rounded"
      rows={10}
    />
  );
}

// Preview with dangerouslySetInnerHTML (only after sanitization)
export function HtmlPreview({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html);

  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
```

---

## Security Headers

### All Production Headers

Configure these 7 critical security headers in your Next.js application:

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
```

### Header Descriptions

| Header | Value | Purpose |
|--------|-------|---------|
| **X-DNS-Prefetch-Control** | `on` | Enable DNS prefetching for performance |
| **Strict-Transport-Security** | `max-age=31536000; includeSubDomains; preload` | Force HTTPS for 1 year, include subdomains |
| **X-Frame-Options** | `SAMEORIGIN` | Prevent clickjacking (allow same-origin frames only) |
| **X-Content-Type-Options** | `nosniff` | Prevent MIME type sniffing |
| **X-XSS-Protection** | `1; mode=block` | Legacy XSS protection for older browsers |
| **Referrer-Policy** | `origin-when-cross-origin` | Send referrer for same-origin, origin-only for cross-origin |
| **Permissions-Policy** | `camera=(), microphone=(), geolocation=()` | Disable access to camera, microphone, geolocation |

---

## Rate Limiting

### Redis-Based Rate Limiting

Implement rate limiting using Upstash Redis:

```typescript
// lib/rate-limit.ts
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt?: Date;
}

/**
 * Rate limit by identifier (IP, user ID, API key, etc.)
 *
 * @param identifier - Unique identifier for rate limiting
 * @param limit - Max requests allowed
 * @param window - Time window in seconds
 */
export async function rateLimit(
  identifier: string,
  limit: number = 10,
  window: number = 60
): Promise<RateLimitResult> {
  const key = `rate-limit:${identifier}`;
  const current = await redis.incr(key);

  if (current === 1) {
    // Set expiration on first request
    await redis.expire(key, window);
  }

  const success = current <= limit;
  const remaining = Math.max(0, limit - current);

  // Get reset time
  const ttl = await redis.ttl(key);
  const resetAt = new Date(Date.now() + ttl * 1000);

  return {
    success,
    remaining,
    resetAt,
  };
}

/**
 * Tier-based rate limiting
 */
export async function tierRateLimit(
  userId: string,
  tier: "FREE" | "STARTER" | "PRO" | "ENTERPRISE"
): Promise<RateLimitResult> {
  const limits: Record<string, { requests: number; window: number }> = {
    FREE: { requests: 10, window: 60 },
    STARTER: { requests: 100, window: 60 },
    PRO: { requests: 1000, window: 60 },
    ENTERPRISE: { requests: 10000, window: 60 },
  };

  const config = limits[tier];
  return rateLimit(`tier:${userId}`, config.requests, config.window);
}
```

### Usage in API Routes

```typescript
// app/api/pages/route.ts
import { rateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Get client IP
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Check rate limit: 10 requests per minute
  const { success, remaining, resetAt } = await rateLimit(ip, 10, 60);

  if (!success) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Try again later.",
        retryAfter: resetAt,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": resetAt?.toISOString() || "",
          "Retry-After": Math.ceil((resetAt?.getTime() || 0) / 1000).toString(),
        },
      }
    );
  }

  // Process request
  const page = await createPage(await request.json());

  return NextResponse.json(page, {
    headers: {
      "X-RateLimit-Limit": "10",
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": resetAt?.toISOString() || "",
    },
  });
}
```

### Rate Limiting by Tier

```typescript
// middleware.ts
import { tierRateLimit } from "@/lib/rate-limit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  const { userId } = auth();

  // Only apply to authenticated API requests
  if (userId && request.nextUrl.pathname.startsWith("/api/trpc")) {
    const user = await getUser(userId);
    const { success } = await tierRateLimit(userId, user.subscriptionTier);

    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}
```

---

## Data Encryption

### AES-256-GCM Encryption

Encrypt sensitive data before storing in the database:

```typescript
// lib/encryption.ts
import crypto from "crypto";

const algorithm = "aes-256-gcm";

/**
 * Get encryption key from environment
 * Must be 32 bytes (256 bits) in hex format
 *
 * Generate: node -e "console.log(crypto.randomBytes(32).toString('hex'))"
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }

  if (key.length !== 64) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex chars)");
  }

  return Buffer.from(key, "hex");
}

/**
 * Encrypt sensitive text
 *
 * Returns: "iv:authTag:encryptedText" (all hex-encoded)
 */
export function encrypt(text: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encrypted
  return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt previously encrypted text
 */
export function decrypt(encrypted: string): string {
  const key = getEncryptionKey();
  const [ivHex, authTagHex, encryptedText] = encrypted.split(":");

  if (!ivHex || !authTagHex || !encryptedText) {
    throw new Error("Invalid encrypted text format");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Encrypt object to JSON
 */
export function encryptObject<T extends Record<string, any>>(obj: T): string {
  return encrypt(JSON.stringify(obj));
}

/**
 * Decrypt object from JSON
 */
export function decryptObject<T = any>(encrypted: string): T {
  return JSON.parse(decrypt(encrypted));
}
```

### Usage Examples

```typescript
// Encrypt API keys before storing
import { encrypt, decrypt } from "@/lib/encryption";

// Store encrypted
const encryptedKey = encrypt(apiKey);
await prisma.apiKey.create({
  data: {
    name: "My API Key",
    keyHash: encryptedKey,
    prefix: apiKey.substring(0, 12),
  },
});

// Retrieve and decrypt
const stored = await prisma.apiKey.findUnique({
  where: { id: keyId },
});
const decryptedKey = decrypt(stored.keyHash);

// Encrypt integration config
const config = {
  publicKey: "pk_live_xxx",
  secretKey: "sk_live_yyy",
};
const encryptedConfig = encryptObject(config);

// Store in DB
await prisma.integration.create({
  data: {
    type: "STRIPE",
    config: encryptedConfig,
  },
});

// Retrieve and decrypt
const integration = await prisma.integration.findUnique({
  where: { id: integrationId },
});
const decryptedConfig = decryptObject(integration.config);
```

### Environment Setup

```bash
# Generate encryption key (run once)
node -e "console.log(crypto.randomBytes(32).toString('hex'))"

# Add to .env.local
ENCRYPTION_KEY=your_generated_key_here

# Verify key is 64 characters (32 bytes in hex)
```

---

## SQL Injection Prevention

### Always Use Prisma

Prisma automatically parameterizes queries, preventing SQL injection:

```typescript
// ✅ GOOD - Parameterized query
const user = await prisma.user.findUnique({
  where: { email: userEmail },
});

// ✅ GOOD - Parameterized array query
const users = await prisma.user.findMany({
  where: {
    email: { in: userEmails },
  },
});

// ✅ GOOD - Complex parameterized query
const projects = await prisma.project.findMany({
  where: {
    AND: [
      { organizationId: orgId },
      {
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } },
        ],
      },
      { status: "PUBLISHED" },
    ],
  },
});

// ❌ BAD - Raw SQL with user input (NEVER DO THIS!)
// This would be vulnerable to SQL injection
// await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userEmail}`;

// ❌ BAD - String concatenation
// const users = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
```

### If Raw SQL is Absolutely Necessary

Only use `$queryRaw` with proper parameterization:

```typescript
// ⚠️ ONLY use if absolutely necessary
const users = await prisma.$queryRaw`
  SELECT * FROM "User" WHERE email = ${email} AND status = ${status}
`;

// This is safe because Prisma parameterizes the variables
// The template literals create prepared statements
```

---

## API Key Security

### Generate and Hash API Keys

```typescript
// lib/api-key.ts
import crypto from "crypto";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;
const API_KEY_PREFIX = "bg_live_";

/**
 * Generate a new API key
 * Format: bg_live_[32 random chars]
 */
export function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(16).toString("hex");
  return `${API_KEY_PREFIX}${randomBytes}`;
}

/**
 * Hash API key for database storage
 */
export async function hashApiKey(apiKey: string): Promise<string> {
  return bcrypt.hash(apiKey, SALT_ROUNDS);
}

/**
 * Verify provided key against stored hash
 */
export async function verifyApiKey(
  providedKey: string,
  storedHash: string
): Promise<boolean> {
  return bcrypt.compare(providedKey, storedHash);
}

/**
 * Get display prefix from full key
 * Only show first 12 characters in UI
 */
export function getKeyPrefix(apiKey: string): string {
  return apiKey.substring(0, API_KEY_PREFIX.length + 8); // "bg_live_" + 8 chars
}
```

### Create API Key Endpoint

```typescript
// app/api/api-keys/route.ts
import {
  generateApiKey,
  hashApiKey,
  getKeyPrefix,
} from "@/lib/api-key";

export async function POST(request: Request) {
  const body = await request.json();
  const { organizationId, name } = body;

  // Generate new key
  const apiKey = generateApiKey();
  const keyHash = await hashApiKey(apiKey);
  const prefix = getKeyPrefix(apiKey);

  // Store hash in database (never store full key)
  const stored = await prisma.apiKey.create({
    data: {
      name,
      organizationId,
      keyHash,
      prefix,
      createdBy: userId,
    },
  });

  // Return full key ONLY on creation (user must save it)
  return Response.json({
    id: stored.id,
    name: stored.name,
    apiKey, // Only returned once, user must save
    prefix: stored.prefix,
    message: "Save your API key securely. You won't see it again.",
  });
}
```

### API Key Validation Middleware

```typescript
// middleware/api-key-auth.ts
import { verifyApiKey } from "@/lib/api-key";

export async function validateApiKey(request: Request): Promise<string | null> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const providedKey = authHeader.substring(7); // Remove "Bearer "

  // Find key by prefix
  const prefix = providedKey.substring(0, 12); // "bg_live_" + 8 chars
  const stored = await prisma.apiKey.findFirst({
    where: { prefix },
  });

  if (!stored) {
    return null;
  }

  // Verify hash
  const isValid = await verifyApiKey(providedKey, stored.keyHash);

  if (!isValid) {
    return null;
  }

  // Update last used timestamp
  await prisma.apiKey.update({
    where: { id: stored.id },
    data: { lastUsedAt: new Date() },
  });

  return stored.organizationId;
}
```

### API Key Revocation

```typescript
// Revoke API key
export async function revokeApiKey(keyId: string) {
  return await prisma.apiKey.update({
    where: { id: keyId },
    data: { revokedAt: new Date() },
  });
}

// Check if key is revoked
export async function isKeyRevoked(keyId: string): Promise<boolean> {
  const key = await prisma.apiKey.findUnique({
    where: { id: keyId },
    select: { revokedAt: true },
  });

  return key?.revokedAt !== null;
}
```

---

## OWASP Top 10 Compliance

### Vulnerability Assessment Matrix

| # | Vulnerability | Mitigation Strategy | Implementation | Status |
|---|----------------|--------------------|-----------------|--------|
| **A01** | **Broken Access Control** | Clerk authentication + role-based checks on all protected routes | `protectedProcedure` middleware + database role checks | ✅ |
| **A02** | **Cryptographic Failures** | AES-256-GCM encryption at rest + TLS 1.3 in transit | `encrypt()` / `decrypt()` functions + HTTPS enforced | ✅ |
| **A03** | **Injection** | Parameterized queries (Prisma ORM only) | Never use string concatenation in SQL | ✅ |
| **A04** | **Insecure Design** | Security-first architecture, threat modeling | Design review checklist, security by default | ✅ |
| **A05** | **Security Misconfiguration** | Security headers + CSP + CORS + environment secrets | `next.config.js` headers + middleware validation | ✅ |
| **A06** | **Vulnerable Components** | Regular npm audits + dependency updates | `npm audit` in CI/CD, Snyk scanning | ✅ |
| **A07** | **Authentication Failures** | Clerk OAuth + JWT tokens + 2FA optional | OAuth provider + token validation middleware | ✅ |
| **A08** | **Data Integrity Failures** | Input validation with Zod on all endpoints | Schema validation before database operations | ✅ |
| **A09** | **Logging & Monitoring Failures** | Sentry error tracking + audit logs | Error tracking + request logging for sensitive operations | ✅ |
| **A10** | **SSRF** | URL validation + allowlist for external requests | Validate URLs before making requests to external services | ✅ |

### Implementation Checklist by Vulnerability

**A01 - Broken Access Control**
```typescript
// Verify user has permission
const org = await prisma.organization.findUnique({
  where: { id: organizationId },
  include: { members: { where: { userId: ctx.userId } } },
});

if (!org || org.members.length === 0) {
  throw new TRPCError({ code: "FORBIDDEN" });
}
```

**A02 - Cryptographic Failures**
```typescript
// All sensitive data encrypted
const encrypted = encrypt(sensitiveData);
const decrypted = decrypt(encrypted);
```

**A03 - Injection**
```typescript
// Always use Prisma (parameterized)
const user = await prisma.user.findUnique({
  where: { email: userEmail }, // Parameterized
});
```

**A04 - Insecure Design**
```typescript
// Default deny: explicit allow with checks
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx });
});
```

**A05 - Security Misconfiguration**
```typescript
// All security headers configured
"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
```

**A06 - Vulnerable Components**
```bash
# Run regularly
npm audit
npm update
```

**A07 - Authentication Failures**
```typescript
// OAuth via Clerk, JWT validation, optional 2FA
const { userId } = getAuth(request);
```

**A08 - Data Integrity Failures**
```typescript
// Zod validation on all inputs
.input(createPageSchema)
.mutation(({ input }) => { /* input is safe */ })
```

**A09 - Logging Failures**
```typescript
// Sentry + audit logs
Sentry.captureException(error);
await logAuditTrail(userId, action, resource);
```

**A10 - SSRF**
```typescript
// Validate external URLs
const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return ["https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};
```

---

## Security Checklist (Pre-Deploy)

### Environment & Configuration

- [ ] **Environment Variables**: All secrets in `.env.local`, not committed to git
  ```bash
  # Verify
  git status | grep .env
  # Should show: .env.local (in .gitignore)
  ```

- [ ] **Database Connections**: PostgreSQL connection uses SSL/TLS
  ```
  DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
  ```

- [ ] **Encryption Key**: Generated and configured
  ```bash
  # Check .env.local
  echo $ENCRYPTION_KEY  # Must be 64 hex chars
  ```

### Authentication & Authorization

- [ ] **Clerk Setup**: All authentication environment variables configured
  ```bash
  test -n "$CLERK_PUBLISHABLE_KEY" && echo "✅ Clerk configured"
  ```

- [ ] **Protected Routes**: All sensitive routes require authentication
  ```typescript
  // Verify authMiddleware in middleware.ts
  export default authMiddleware({ publicRoutes: [...] });
  ```

- [ ] **Authorization Checks**: Role-based access control on protected procedures
  ```typescript
  // Every protectedProcedure checks permissions
  const user = await checkUserPermissions(ctx.userId, resource);
  ```

### Input Validation

- [ ] **Zod Schemas**: All API endpoints have input validation
  ```bash
  grep -r "\.input(" src/trpc/ | wc -l  # Should be > 0
  ```

- [ ] **Schema Testing**: Complex schemas have test cases
  ```bash
  ls tests/schemas/  # Should exist
  ```

### Security Headers & Protection

- [ ] **CSRF Protection**: Enabled (Next.js built-in)
  ```typescript
  // No special config needed, next.js/clerk handles it
  ```

- [ ] **XSS Prevention**: DOMPurify used for user HTML
  ```bash
  grep -r "DOMPurify" src/ | wc -l  # Should be > 0
  ```

- [ ] **Security Headers**: All 7 headers configured in next.config.js
  ```bash
  grep -A 20 "headers()" next.config.js | grep key | wc -l
  # Should show 7 headers
  ```

### Data Protection

- [ ] **SQL Injection Prevention**: Only Prisma used (no raw SQL with user input)
  ```bash
  grep -r "\$queryRaw" src/ | grep -v "parameterized"  # Should be empty
  ```

- [ ] **Sensitive Data Encrypted**: API keys, integration configs encrypted
  ```typescript
  // Verify in DB schema
  model ApiKey {
    keyHash String // Encrypted
  }
  ```

- [ ] **Secrets Management**: API keys hashed with bcrypt
  ```bash
  grep -r "bcrypt" src/ | grep -c "compare"  # Should be > 0
  ```

### Rate Limiting & Performance

- [ ] **Rate Limiting**: Enabled on public endpoints
  ```bash
  grep -r "rateLimit" app/api/ | wc -l  # Should be > 0
  ```

- [ ] **Rate Limit Headers**: Endpoints return X-RateLimit-* headers
  ```typescript
  // Check response headers configuration
  headers: {
    "X-RateLimit-Limit": "...",
    "X-RateLimit-Remaining": "...",
  }
  ```

### Dependencies & Vulnerabilities

- [ ] **NPM Audit**: No critical vulnerabilities
  ```bash
  npm audit --audit-level=moderate
  # Exit code 0 = pass, non-zero = fail
  ```

- [ ] **Dependencies Updated**: Recent versions of security-critical packages
  ```bash
  npm list bcryptjs clerk nextjs zod
  # Verify versions are recent
  ```

### HTTPS & TLS

- [ ] **HTTPS Enforced**: Vercel automatic, custom domains have SSL
  ```typescript
  // In next.config.js (Vercel automatic)
  // For custom domains: Let's Encrypt auto-renews
  ```

- [ ] **HSTS Preload**: Header configured for max security
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  ```

### Monitoring & Logging

- [ ] **Error Tracking**: Sentry configured
  ```bash
  grep -r "Sentry.init" src/ | wc -l  # Should be > 0
  ```

- [ ] **Audit Logging**: Sensitive operations logged
  ```typescript
  // Check for audit log function usage
  await logAuditTrail(userId, action, resource);
  ```

### Testing

- [ ] **Security Tests**: Authorization tests exist
  ```bash
  ls tests/*auth* tests/*security*  # Should exist
  npm test -- --testMatch="**/*auth*"
  ```

- [ ] **Input Validation Tests**: Schema tests pass
  ```bash
  npm test -- --testMatch="**/*schema*"
  # Exit code 0 = all pass
  ```

### API Keys & Integrations

- [ ] **API Keys Secured**: Keys hashed, not stored in plaintext
  ```sql
  -- Verify in database
  SELECT keyHash, prefix FROM api_keys LIMIT 1;
  -- keyHash should be bcrypt hash, not plain key
  ```

- [ ] **Integration Secrets Encrypted**: All integration configs encrypted
  ```sql
  SELECT config FROM integrations LIMIT 1;
  -- config should be encrypted (iv:authTag:encrypted format)
  ```

### CORS Configuration

- [ ] **CORS Configured**: Only allowed origins can access API
  ```typescript
  // In API routes or middleware
  const allowedOrigins = ["https://yourdomain.com"];
  if (!allowedOrigins.includes(origin)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  ```

### Error Messages

- [ ] **No Sensitive Info Leaked**: Error messages don't expose internals
  ```typescript
  // ✅ Good
  throw new Error("Invalid credentials");

  // ❌ Bad
  throw new Error("User not found in database with email x@y.com");
  ```

---

## Pre-Deployment Command Checklist

```bash
# Run all security checks
npm run lint
npm run type-check
npm audit
npm test

# Verify environment variables
test -n "$CLERK_PUBLISHABLE_KEY" && echo "✅ Clerk key set"
test -n "$ENCRYPTION_KEY" && echo "✅ Encryption key set"
test -n "$DATABASE_URL" && echo "✅ Database URL set"

# Test Clerk auth
npm run dev &  # Start dev server
# Visit http://localhost:3000/sign-in and test OAuth flow

# Build for production
npm run build
# Exit code 0 = pass, non-zero = fail

# Final check
npm run type-check
npm audit --audit-level=moderate
```

---

## Security Best Practices Summary

1. **Always authenticate** - Use Clerk on protected routes
2. **Always validate** - Use Zod schemas on all inputs
3. **Always encrypt** - Sensitive data uses AES-256-GCM
4. **Always parameterize** - Use Prisma only, never raw SQL with user input
5. **Always sanitize** - Use DOMPurify for user-generated HTML
6. **Always rate limit** - Protect public endpoints from abuse
7. **Always test** - Security tests as part of test suite
8. **Always audit** - Run `npm audit` before deploying
9. **Always monitor** - Sentry tracks errors in production
10. **Always log** - Audit trails for sensitive operations

---

## Resources

- **Clerk Documentation**: https://clerk.com/docs
- **Zod Documentation**: https://zod.dev
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Next.js Security**: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
- **Prisma Security**: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#queryraw

---

**Last Updated:** November 3, 2025
**Version:** 1.0
**Status:** Production Ready
