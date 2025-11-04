# 🚀 DATABASE MIGRATION GUIDE

**For:** Bubble Gum AI Page Builder  
**Database:** PostgreSQL 15+ with Prisma ORM  
**Generated:** November 1, 2025

---

## 📋 TABLE OF CONTENTS

1. [Initial Setup](#initial-setup)
2. [Running Migrations](#running-migrations)
3. [Seed Data](#seed-data)
4. [Rollback Strategy](#rollback-strategy)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 INITIAL SETUP

### Step 1: Install Dependencies

```bash
# Install Prisma CLI
pnpm add -D prisma

# Install Prisma Client
pnpm add @prisma/client

# Install PostgreSQL driver (if not using Prisma's bundled driver)
pnpm add pg
```

### Step 2: Initialize Prisma

```bash
# Initialize Prisma (creates prisma/ folder)
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Your schema file
- `.env` - Environment variables file

### Step 3: Configure Database URL

Add to `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/bubblegum?schema=public"

# Or for Railway/Production:
DATABASE_URL="postgresql://username:password@containers-us-west-123.railway.app:5432/railway?ssl=true"
```

**For Railway:**
1. Go to Railway.app
2. Create new PostgreSQL service
3. Copy `DATABASE_URL` from service variables
4. Paste into `.env`

### Step 4: Copy Schema

Replace `prisma/schema.prisma` with the provided `schema.prisma` file.

```bash
cp schema.prisma prisma/schema.prisma
```

---

## 🗄️ RUNNING MIGRATIONS

### Development (Local)

#### Create Migration

```bash
# Create migration from schema changes
npx prisma migrate dev --name init

# This will:
# 1. Create SQL migration file in prisma/migrations/
# 2. Apply migration to database
# 3. Generate Prisma Client
```

**Migration Naming:**
- `init` - Initial schema
- `add_blog_tables` - Adding blog functionality
- `add_ecommerce_products` - E-commerce feature
- `fix_user_email_index` - Bug fix

#### Apply Existing Migrations

```bash
# Apply all pending migrations
npx prisma migrate dev
```

#### Reset Database (⚠️ Destructive!)

```bash
# Drop database, recreate, and apply all migrations
npx prisma migrate reset

# Useful for development, but NEVER in production!
```

### Generate Prisma Client

```bash
# Generate TypeScript client (run after any schema changes)
npx prisma generate
```

This creates `node_modules/@prisma/client` with TypeScript types.

---

## 🌱 SEED DATA

### Step 1: Create Seed Script

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Component Library
  await prisma.componentLibrary.createMany({
    data: [
      {
        name: 'Button',
        displayName: 'Button',
        description: 'Primary button component',
        type: 'CONTENT',
        category: 'Forms',
        schema: {
          props: {
            text: { type: 'string', default: 'Click me' },
            variant: { type: 'select', options: ['primary', 'secondary'], default: 'primary' },
          },
        },
        tags: ['button', 'cta', 'interactive'],
        isPro: false,
      },
      {
        name: 'Hero',
        displayName: 'Hero Section',
        description: 'Large hero section with title and CTA',
        type: 'LAYOUT',
        category: 'Marketing',
        schema: {
          props: {
            title: { type: 'string', default: 'Welcome' },
            subtitle: { type: 'string', default: '' },
            bgColor: { type: 'color', default: '#ffffff' },
          },
        },
        tags: ['hero', 'landing', 'marketing'],
        isPro: false,
      },
      // Add 20 more components...
    ],
    skipDuplicates: true,
  });

  console.log('✅ Component library seeded');

  // Seed Test User (for development)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@bubblegum.app' },
    update: {},
    create: {
      clerkId: 'user_test_123',
      email: 'test@bubblegum.app',
      firstName: 'Test',
      lastName: 'User',
    },
  });

  console.log('✅ Test user created');

  // Seed Test Organization
  const testOrg = await prisma.organization.upsert({
    where: { slug: 'test-org' },
    update: {},
    create: {
      name: 'Test Organization',
      slug: 'test-org',
      ownerId: testUser.id,
      subscriptionTier: 'FREE',
      subscriptionStatus: 'ACTIVE',
    },
  });

  console.log('✅ Test organization created');

  // Seed Test Project
  const testProject = await prisma.project.upsert({
    where: { subdomain: 'test-site.bubblegum.app' },
    update: {},
    create: {
      name: 'Test Site',
      slug: 'test-site',
      subdomain: 'test-site.bubblegum.app',
      organizationId: testOrg.id,
      createdById: testUser.id,
      status: 'DRAFT',
    },
  });

  console.log('✅ Test project created');

  // Seed Homepage
  await prisma.page.create({
    data: {
      name: 'Homepage',
      slug: '/',
      projectId: testProject.id,
      isHomepage: true,
      isPublished: true,
      content: {
        components: [
          {
            id: 'hero_1',
            type: 'Hero',
            props: {
              title: 'Welcome to Bubble Gum',
              subtitle: 'Build stunning sites with AI',
            },
          },
        ],
      },
    },
  });

  console.log('✅ Homepage created');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Step 2: Configure package.json

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### Step 3: Run Seed

```bash
# Seed database
npx prisma db seed

# Or manually:
npx tsx prisma/seed.ts
```

---

## ⏮️ ROLLBACK STRATEGY

### Option 1: Revert Last Migration

```bash
# Undo last migration
npx prisma migrate resolve --rolled-back <migration_name>

# Then create new migration
npx prisma migrate dev --name revert_feature
```

### Option 2: Restore from Backup

```bash
# 1. Stop application
# 2. Restore database from backup
pg_restore -d bubblegum backup.dump

# 3. Verify schema
npx prisma migrate status

# 4. Apply any missing migrations
npx prisma migrate deploy
```

### Option 3: Manual SQL Rollback

If you need to manually revert:

```sql
-- Drop tables (reverse order of creation)
DROP TABLE IF EXISTS page_views;
DROP TABLE IF EXISTS form_submissions;
-- ... drop all tables

-- Or use migration file:
BEGIN;
-- Copy SQL from migration file (reverse operations)
COMMIT;
```

---

## 🚀 PRODUCTION DEPLOYMENT

### Pre-Deployment Checklist

- [ ] Backup production database
- [ ] Test migrations on staging environment
- [ ] Review migration SQL (check for destructive operations)
- [ ] Schedule maintenance window if needed
- [ ] Prepare rollback plan

### Deployment Steps

#### 1. Backup Database

```bash
# PostgreSQL backup
pg_dump -U username -h host -p 5432 bubblegum > backup_$(date +%Y%m%d_%H%M%S).sql

# Or use Railway CLI
railway db backup
```

#### 2. Apply Migrations

```bash
# Set production DATABASE_URL
export DATABASE_URL="postgresql://..."

# Apply migrations (does NOT recreate database)
npx prisma migrate deploy

# This applies all pending migrations
```

**Important:** `migrate deploy` is safe for production:
- ✅ Only applies pending migrations
- ✅ Does not drop/recreate database
- ✅ Idempotent (safe to run multiple times)

#### 3. Generate Client

```bash
# Generate Prisma Client for production
npx prisma generate
```

#### 4. Verify

```bash
# Check migration status
npx prisma migrate status

# Test database connection
npx prisma db execute --sql "SELECT 1"
```

### Zero-Downtime Migrations

For large migrations:

1. **Add new column** (non-breaking)
   ```sql
   ALTER TABLE users ADD COLUMN new_field TEXT;
   ```

2. **Deploy app code** (supports both old and new schema)

3. **Backfill data** (in background)
   ```sql
   UPDATE users SET new_field = 'default' WHERE new_field IS NULL;
   ```

4. **Make column required** (in next migration)
   ```sql
   ALTER TABLE users ALTER COLUMN new_field SET NOT NULL;
   ```

5. **Remove old code paths**

---

## 🐛 TROUBLESHOOTING

### Migration Failed

**Problem:** Migration failed mid-way.

**Solution:**
```bash
# Check status
npx prisma migrate status

# If migration is applied but client is out of sync:
npx prisma generate

# If migration failed:
# 1. Fix schema
# 2. Create new migration
npx prisma migrate dev --create-only
# 3. Manually edit SQL if needed
# 4. Apply
npx prisma migrate dev
```

### Schema Drift

**Problem:** Database schema doesn't match Prisma schema.

**Solution:**
```bash
# Check for drift
npx prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma

# Reset database (development only!)
npx prisma migrate reset
```

### Connection Errors

**Problem:** Can't connect to database.

**Check:**
1. Database is running
2. Credentials are correct in `.env`
3. Firewall allows connection
4. SSL is configured if required

```bash
# Test connection
psql $DATABASE_URL

# Or use Prisma Studio
npx prisma studio
```

### Missing Migrations

**Problem:** Migrations folder is missing.

**Solution:**
```bash
# Introspect existing database
npx prisma db pull

# Create baseline migration
npx prisma migrate dev --name baseline
```

### Performance Issues

**Problem:** Queries are slow.

**Check:**
1. Indexes are created
2. Large tables are paginated
3. N+1 queries avoided

```sql
-- Check missing indexes
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public';

-- Analyze slow queries
EXPLAIN ANALYZE SELECT * FROM projects WHERE organization_id = 'org_123';
```

---

## 📊 MIGRATION CHECKLIST

### Before Migration

- [ ] Review schema changes
- [ ] Check for breaking changes
- [ ] Test on local database
- [ ] Test on staging environment
- [ ] Backup production database
- [ ] Schedule maintenance window (if needed)

### During Migration

- [ ] Monitor application logs
- [ ] Watch database metrics (CPU, memory, connections)
- [ ] Be ready to rollback

### After Migration

- [ ] Verify all services are running
- [ ] Check error rates
- [ ] Monitor performance
- [ ] Update documentation
- [ ] Notify team

---

## 🔗 USEFUL COMMANDS

```bash
# Database operations
npx prisma migrate dev          # Create and apply migration
npx prisma migrate deploy       # Apply migrations (production)
npx prisma migrate reset        # Reset database (dev only)
npx prisma migrate status       # Check migration status
npx prisma generate             # Generate Prisma Client
npx prisma studio               # Open Prisma Studio (database GUI)
npx prisma db seed              # Run seed script
npx prisma db push              # Sync schema (prototyping only)
npx prisma db pull              # Introspect existing database

# Debugging
npx prisma validate             # Validate schema
npx prisma format               # Format schema file
npx prisma migrate diff         # Show schema diff
```

---

## 📚 ADDITIONAL RESOURCES

- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Railway Docs](https://docs.railway.app)

---

**Guide Status:** ✅ Complete  
**Last Updated:** November 1, 2025  
**Version:** 1.0.0

---

*This guide covers database setup, migrations, and deployment for Bubble Gum. Follow these steps carefully to ensure smooth database operations.*
