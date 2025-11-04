# 🐳 Docker Setup for Bubble Gum

Complete guide for containerizing and deploying Bubble Gum with Docker.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Production Build](#production-build)
4. [Docker Compose](#docker-compose)
5. [Multi-Stage Build](#multi-stage-build)
6. [Deployment](#deployment)

---

## 🔧 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

Install Docker: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

---

## 🚀 Development Setup

### Dockerfile (Development)

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
```

### Build & Run

```bash
# Build image
docker build -f Dockerfile.dev -t bubble-gum:dev .

# Run container
docker run -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  --env-file .env.local \
  bubble-gum:dev
```

---

## 🏗️ Production Build

### Dockerfile (Production)

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production && \
    npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Start Next.js
CMD ["node", "server.js"]
```

### Build Production Image

```bash
# Build
docker build -t bubble-gum:latest .

# Run
docker run -p 3000:3000 \
  --env-file .env.production \
  bubble-gum:latest
```

---

## 🔄 Docker Compose

### docker-compose.yml

```yaml
version: '3.8'

services:
  # Next.js Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/bubblegum
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - db
      - redis
    restart: unless-stopped

  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=bubblegum
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # Prisma Studio (optional)
  studio:
    image: node:18-alpine
    working_dir: /app
    command: npx prisma studio
    ports:
      - "5555:5555"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/bubblegum
    volumes:
      - ./prisma:/app/prisma
    depends_on:
      - db

volumes:
  postgres_data:
  redis_data:
```

### Development Compose

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/bubblegum
      - REDIS_URL=redis://redis:6379
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=bubblegum
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Run with Compose

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f app

# Rebuild
docker-compose up --build
```

---

## 🎯 Multi-Stage Build Optimization

### Optimized Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Dependencies stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Benefits:**
- Smaller final image (~200 MB vs ~1 GB)
- Faster builds (cached layers)
- More secure (production dependencies only)

---

## 📦 Docker Ignore

### .dockerignore

```
# Dependencies
node_modules
npm-debug.log

# Next.js
.next
out
.env*.local

# Testing
coverage
.nyc_output

# Misc
.DS_Store
*.log
.git
.gitignore
README.md
```

---

## 🚢 Deployment

### Deploy to Docker Hub

```bash
# Build
docker build -t yourusername/bubble-gum:latest .

# Login
docker login

# Push
docker push yourusername/bubble-gum:latest

# Pull on server
docker pull yourusername/bubble-gum:latest

# Run
docker run -d -p 3000:3000 \
  --name bubble-gum \
  --env-file .env.production \
  yourusername/bubble-gum:latest
```

### Deploy with Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml bubblegum

# List services
docker service ls

# View logs
docker service logs bubblegum_app

# Scale
docker service scale bubblegum_app=3

# Remove stack
docker stack rm bubblegum
```

### Deploy to AWS ECS

```bash
# Install AWS CLI
aws --version

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.us-east-1.amazonaws.com

# Build & tag
docker build -t bubble-gum .
docker tag bubble-gum:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/bubble-gum:latest

# Push
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/bubble-gum:latest

# Create ECS task definition and service (use AWS Console or CLI)
```

---

## 🛠️ Useful Commands

```bash
# List images
docker images

# List containers
docker ps -a

# Stop container
docker stop bubble-gum

# Remove container
docker rm bubble-gum

# Remove image
docker rmi bubble-gum:latest

# Clean up
docker system prune -a

# View logs
docker logs -f bubble-gum

# Execute command in container
docker exec -it bubble-gum sh

# Inspect container
docker inspect bubble-gum
```

---

## 🔍 Health Checks

### Add to Dockerfile

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node healthcheck.js
```

### healthcheck.js

```javascript
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/health',
  method: 'GET',
  timeout: 2000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', () => process.exit(1));
req.on('timeout', () => process.exit(1));
req.end();
```

---

## 📊 Monitoring

### Docker Stats

```bash
# Real-time stats
docker stats

# Specific container
docker stats bubble-gum
```

### Logs

```bash
# Follow logs
docker logs -f bubble-gum

# Last 100 lines
docker logs --tail 100 bubble-gum

# With timestamps
docker logs -t bubble-gum
```

---

## ✅ Best Practices

1. **Use multi-stage builds** - Smaller images
2. **Leverage layer caching** - Faster builds
3. **Use .dockerignore** - Reduce context size
4. **Run as non-root user** - Security
5. **Health checks** - Auto-restart on failure
6. **Environment variables** - Configuration
7. **Volumes for data** - Persistence
8. **Resource limits** - Prevent resource exhaustion

---

**Docker Setup Complete! 🐳**
