# 🔒 Security Guide - Bubble Gum

Security best practices and guidelines.

---

## 📋 Security Checklist

- [ ] Environment variables secured
- [ ] Database connections encrypted
- [ ] Authentication implemented
- [ ] Authorization enforced
- [ ] Input validation enabled
- [ ] CSRF protection active
- [ ] XSS prevention configured
- [ ] SQL injection prevented
- [ ] Rate limiting enabled
- [ ] Security headers set
- [ ] HTTPS enforced
- [ ] Dependencies updated
- [ ] Security audits scheduled

---

## 🔐 Authentication & Authorization

### NextAuth.js Setup

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Protected Routes

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ['/dashboard/:path*', '/editor/:path*', '/api/protected/:path*'],
};
```

### Authorization Checks

```typescript
// lib/auth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}

// Usage in API route
export async function GET() {
  const session = await requireAuth();
  // Handle authenticated request
}
```

---

## 🛡️ Input Validation

### Zod Schema Validation

```typescript
import { z } from 'zod';

// Define schema
const pageSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  content: z.string().max(50000),
});

// Validate input
export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const validated = pageSchema.parse(body);
    // Use validated data
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400 }
    );
  }
}
```

---

## 🚫 XSS Prevention

### Sanitize User Input

```typescript
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href'],
  });
}

// Usage
const safeContent = sanitizeHTML(userInput);
```

### Content Security Policy

```typescript
// next.config.js
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
};
```

---

## 🔒 Security Headers

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

---

## 🚦 Rate Limiting

```typescript
// lib/rate-limit.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

export async function rateLimit(
  identifier: string,
  limit: number = 10,
  window: number = 60
): Promise<{ success: boolean; remaining: number }> {
  const key = `rate-limit:${identifier}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, window);
  }

  const success = current <= limit;
  const remaining = Math.max(0, limit - current);

  return { success, remaining };
}

// Usage in API route
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { success, remaining } = await rateLimit(ip, 10, 60);

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': remaining.toString(),
        },
      }
    );
  }

  // Handle request
}
```

---

## 🗄️ Database Security

### Prevent SQL Injection

```typescript
// ✅ Good - Using Prisma (parameterized queries)
const user = await prisma.user.findUnique({
  where: { email: userEmail },
});

// ❌ Bad - Raw SQL with user input
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userEmail}`;
```

### Encrypt Sensitive Data

```typescript
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

export function decrypt(encrypted: string): string {
  const parts = encrypted.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encryptedText = parts[2];
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

---

## 🔑 API Key Management

```typescript
// Validate API key
export async function validateApiKey(request: Request): Promise<boolean> {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return false;
  }
  
  // Hash and compare
  const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  const key = await prisma.apiKey.findUnique({
    where: { hashedKey },
  });
  
  return !!key && key.active;
}
```

---

## 🔐 Environment Variables

```env
# .env.local - NEVER commit this file!

# Strong secrets
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Database with SSL
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Encrypted connections
REDIS_URL="rediss://..."

# API keys (rotate regularly)
STRIPE_SECRET_KEY="sk_live_..."
AWS_ACCESS_KEY_ID="AKIA..."
```

---

## ✅ Security Best Practices

1. **Never commit secrets** - Use .env files
2. **Rotate credentials** - Regular password changes
3. **Use HTTPS** - Everywhere
4. **Validate input** - Always
5. **Sanitize output** - Prevent XSS
6. **Rate limit** - Prevent abuse
7. **Update dependencies** - Regular audits
8. **Monitor logs** - Detect anomalies
9. **Backup data** - Regular backups
10. **Security headers** - All endpoints

---

**Security Guide Complete! 🔒**
