# 🔧 Troubleshooting Guide

Common issues and solutions for Bubble Gum.

---

## 📋 Table of Contents

1. [Installation Issues](#installation-issues)
2. [Database Problems](#database-problems)
3. [Authentication Errors](#authentication-errors)
4. [Build & Deploy Issues](#build--deploy-issues)
5. [Performance Issues](#performance-issues)
6. [Editor Problems](#editor-problems)

---

## 🔨 Installation Issues

### Node Version Mismatch

**Problem:** `Error: The engine "node" is incompatible`

**Solution:**
```bash
# Check your Node version
node -v

# Should be 18.17.0 or higher
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install correct Node version
nvm install 18
nvm use 18
```

### Dependency Installation Fails

**Problem:** `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still failing, try:
npm install --legacy-peer-deps
```

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 npm run dev
```

---

## 🗄️ Database Problems

### Cannot Connect to Database

**Problem:** `Error: Can't reach database server`

**Solution:**

1. **Check PostgreSQL is running:**
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Start if not running
brew services start postgresql  # macOS
sudo systemctl start postgresql # Linux
```

2. **Verify DATABASE_URL:**
```env
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/bubblegum"
```

3. **Test connection:**
```bash
psql -U user -d bubblegum
```

### Prisma Client Not Found

**Problem:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
# Generate Prisma Client
npx prisma generate

# If still failing, reinstall
npm install @prisma/client
npx prisma generate
```

### Migration Errors

**Problem:** `Migration failed`

**Solution:**
```bash
# Reset database (CAUTION: Deletes all data)
npx prisma migrate reset

# Or create new migration
npx prisma migrate dev --name fix_migration

# Force push schema (development only)
npx prisma db push --force-reset
```

### Database Locked

**Problem:** `database is locked`

**Solution:**
```bash
# Kill all connections
# PostgreSQL
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE datname = 'bubblegum' AND pid <> pg_backend_pid();

# Restart database
brew services restart postgresql
```

---

## 🔐 Authentication Errors

### NextAuth Session Error

**Problem:** `[next-auth][error][NO_SECRET]`

**Solution:**
```bash
# Generate secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET="your-generated-secret"
```

### OAuth Provider Not Working

**Problem:** OAuth login fails

**Solution:**

1. **Check credentials:**
```env
# .env.local
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

2. **Verify callback URL:**
- Should be: `http://localhost:3000/api/auth/callback/google`
- Update in Google Console

3. **Clear cookies:**
- Open DevTools
- Application → Cookies → Clear all

### Session Not Persisting

**Problem:** User logged out on refresh

**Solution:**
```typescript
// Check session configuration
// app/api/auth/[...nextauth]/route.ts
export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // ...
};
```

---

## 🚢 Build & Deploy Issues

### Build Fails

**Problem:** `Type error` or `Module not found`

**Solution:**
```bash
# Type check
npm run type-check

# Fix type errors in reported files

# Clean build cache
rm -rf .next
npm run build
```

### Environment Variables Not Working

**Problem:** `process.env.XXX is undefined`

**Solution:**

1. **Server-side variables:** Can use any name
2. **Client-side variables:** Must start with `NEXT_PUBLIC_`

```env
# ✅ Correct
NEXT_PUBLIC_API_URL="https://api.example.com"

# ❌ Wrong - won't work on client
API_URL="https://api.example.com"
```

3. **Restart dev server after changing .env**

### Vercel Deployment Fails

**Problem:** Deployment error on Vercel

**Solution:**

1. **Check build logs** in Vercel dashboard

2. **Verify environment variables:**
- Go to Project Settings → Environment Variables
- Add all required variables

3. **Check Node version:**
```json
// package.json
{
  "engines": {
    "node": ">=18.17.0"
  }
}
```

4. **Redeploy:**
```bash
vercel --prod
```

---

## ⚡ Performance Issues

### Slow Page Load

**Problem:** Pages loading slowly

**Solution:**

1. **Run Lighthouse audit:**
```bash
npm run test:lighthouse
```

2. **Check bundle size:**
```bash
npm run analyze
```

3. **Optimize images:**
- Use Next.js Image component
- Convert to WebP/AVIF
- Compress images

4. **Enable caching:**
```typescript
// Check cache headers
export const revalidate = 3600; // 1 hour
```

### High Memory Usage

**Problem:** `JavaScript heap out of memory`

**Solution:**
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Or in package.json
"scripts": {
  "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
}
```

### API Routes Slow

**Problem:** API endpoints timeout

**Solution:**

1. **Add database indexes:**
```prisma
@@index([userId])
@@index([createdAt])
```

2. **Enable caching:**
```typescript
// Use Redis cache
const cached = await redis.get(key);
if (cached) return cached;
```

3. **Optimize queries:**
```typescript
// ❌ Bad - N+1 query
const pages = await prisma.page.findMany();
for (const page of pages) {
  page.author = await prisma.user.findUnique(...);
}

// ✅ Good - Single query
const pages = await prisma.page.findMany({
  include: { author: true }
});
```

---

## 🎨 Editor Problems

### Editor Not Loading

**Problem:** Visual editor stuck loading

**Solution:**

1. **Clear browser cache:**
- Press Ctrl+Shift+Del
- Clear cache and cookies
- Reload page

2. **Check console for errors:**
- Open DevTools (F12)
- Check Console tab
- Look for JavaScript errors

3. **Disable browser extensions:**
- Ad blockers may interfere
- Try incognito mode

### Can't Save Changes

**Problem:** Changes not saving

**Solution:**

1. **Check network tab:**
- DevTools → Network
- Look for failed API calls
- Check error messages

2. **Verify authentication:**
```typescript
// Check if user is logged in
const session = await getServerSession();
if (!session) {
  // Redirect to login
}
```

3. **Check database connection:**
```bash
npx prisma studio
# Verify database is accessible
```

### Drag & Drop Not Working

**Problem:** Can't drag components

**Solution:**

1. **Browser compatibility:**
- Ensure using modern browser (Chrome, Firefox, Safari)
- Update to latest version

2. **Check JavaScript:**
- Ensure JavaScript is enabled
- No script blockers active

3. **Clear component cache:**
```typescript
// Force re-render
window.location.reload();
```

---

## 📊 Common Error Messages

### `ECONNREFUSED`
**Cause:** Service not running  
**Fix:** Start database/Redis

### `Cannot read properties of undefined`
**Cause:** Missing data/null check  
**Fix:** Add optional chaining (`?.`)

### `Module not found`
**Cause:** Missing dependency  
**Fix:** `npm install <package>`

### `Hydration failed`
**Cause:** Server/client mismatch  
**Fix:** Ensure same HTML on server/client

---

## 🆘 Still Having Issues?

### Get Help

1. **Search existing issues:**
   [GitHub Issues](https://github.com/yourusername/bubble-gum/issues)

2. **Join Discord:**
   [Discord Community](https://discord.gg/bubblegum)

3. **Email support:**
   support@bubblegum.app

4. **Create new issue:**
   Include:
   - Error message
   - Steps to reproduce
   - Environment (OS, Node version)
   - Screenshots

---

**Happy Building! 🍬**
