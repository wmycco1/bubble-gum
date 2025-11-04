# Bubble Gum - Quick Setup Guide

## Prerequisites

✅ **Installed:**
- Docker (version checked)
- Redis (running on localhost:6379)
- Node.js 20.x
- npm

## Quick Start (5 minutes)

### 1. Start PostgreSQL

```bash
# Start PostgreSQL container
docker-compose up -d

# Verify it's running
docker-compose ps

# Check logs
docker-compose logs postgres
```

### 2. Configure Environment

```bash
# .env.local already created with:
# ✅ DATABASE_URL (PostgreSQL from Docker)
# ✅ REDIS_URL (your local Redis)
# ⚠️ ANTHROPIC_API_KEY (replace [МОЙ_КЛЮЧ] with your actual key)

# Edit .env.local and replace:
nano .env.local
# Find: ANTHROPIC_API_KEY=sk-ant-api03-[МОЙ_КЛЮЧ]
# Replace with your real key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database with sample data
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

**Open:** http://localhost:3000

---

## Services Overview

| Service | Status | Port | URL |
|---------|--------|------|-----|
| **PostgreSQL** | Docker | 5432 | localhost:5432 |
| **Redis** | System | 6379 | localhost:6379 |
| **Next.js** | npm | 3000 | http://localhost:3000 |

---

## Useful Commands

### Docker

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f postgres

# Restart PostgreSQL
docker-compose restart postgres

# Remove all data (⚠️ destructive!)
docker-compose down -v
```

### Database

```bash
# View database in browser
npx prisma studio

# Create migration
npx prisma migrate dev --name migration_name

# Reset database (⚠️ deletes all data!)
npx prisma migrate reset

# Check connection
docker exec -it bubblegum-postgres psql -U bubblegum -d bubblegum -c "SELECT version();"
```

### Development

```bash
# Start dev server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Run tests
npm test
```

---

## Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check if container is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Verify connection
docker exec -it bubblegum-postgres psql -U bubblegum -d bubblegum -c "\l"

# Check DATABASE_URL in .env.local
cat .env.local | grep DATABASE_URL
```

### Redis Connection Issues

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Check REDIS_URL in .env.local
cat .env.local | grep REDIS_URL
```

### Prisma Issues

```bash
# Regenerate Prisma client
npx prisma generate

# Reset and recreate database
npx prisma migrate reset
npx prisma db push
```

---

## Environment Variables

### Required for MVP

✅ **Already configured:**
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection

⚠️ **Need to fill:**
- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key

### Optional (can fill later)

- Email service (Resend)
- Analytics (PostHog)
- Monitoring (Sentry)
- Other integrations

---

## Next Steps

1. **Fill in API keys** in `.env.local`
2. **Run database migrations**: `npx prisma db push`
3. **Start development**: `npm run dev`
4. **Read documentation**:
   - `CLAUDE.md` - Quick navigation
   - `docs/` - Detailed specs
   - `CLAUDE_FULL.md` - Full context

---

## Database Schema

Location: `prisma/schema.prisma`

**Tables (11 MVP):**
- users
- organizations
- organization_members
- projects
- pages
- components
- component_library
- assets
- versions
- integrations
- api_keys

**Full schema:** See `docs/DATABASE.md`

---

## Architecture

**Tech Stack:**
- Frontend: Next.js 14 + React 18 + TypeScript
- Backend: tRPC + Fastify
- Database: PostgreSQL 15 (Docker)
- Cache: Redis 7 (System)
- Auth: Clerk
- AI: Anthropic Claude Sonnet 4.5
- Storage: AWS S3
- Payments: Stripe

**Full architecture:** See `docs/TECH_STACK.md`

---

## Help & Documentation

- **Quick Start:** This file (SETUP.md)
- **Commands:** CLAUDE.md → Section "Commands"
- **Troubleshooting:** CLAUDE.md → Section "Troubleshooting"
- **Tech Stack:** docs/TECH_STACK.md
- **Database:** docs/DATABASE.md
- **API:** docs/API.md
- **Security:** docs/SECURITY.md

---

**Version:** 1.0.0
**Last Updated:** November 04, 2025
