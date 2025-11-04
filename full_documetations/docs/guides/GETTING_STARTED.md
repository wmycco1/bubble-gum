# 🚀 Getting Started with Bubble Gum

Welcome to Bubble Gum! This guide will help you set up and start building your first landing page.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm, yarn, or pnpm** - Package manager
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **(Optional) Redis** - For caching

---

## 🔧 Step 1: Installation

### Clone the Repository

```bash
git clone https://github.com/wmycco1/bubble-gum.git
cd bubble-gum
```

### Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

---

## ⚙️ Step 2: Environment Setup

### Create Environment File

```bash
cp .env.example .env.local
```

### Configure Environment Variables

Edit `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bubblegum?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this"

# AWS S3 (Optional - for image uploads)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="bubble-gum-uploads"

# Redis (Optional - for caching)
REDIS_URL="redis://localhost:6379"

# Stripe (Optional - for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

---

## 🗄️ Step 3: Database Setup

### Run Migrations

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### Seed Database (Optional)

```bash
npm run db:seed
```

This creates:
- Demo user account
- Sample landing pages
- Example components

**Demo Credentials:**
- Email: `demo@bubblegum.app`
- Password: `demo123456`

---

## 🎉 Step 4: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the Bubble Gum homepage! 🎊

---

## 🎨 Step 5: Create Your First Page

### 1. Sign Up / Log In

Navigate to `/auth/signin` and:
- Use demo credentials, or
- Create a new account

### 2. Access Dashboard

After login, you'll see your dashboard at `/dashboard`

### 3. Create New Page

Click **"Create New Page"** button

Fill in:
- **Page Name:** My First Landing Page
- **Slug:** my-first-page
- **Template:** Choose "Blank" or any starter template

Click **"Create"**

### 4. Open Editor

Your page opens in the visual editor!

### 5. Add Components

**From the left sidebar:**
1. Click **"Add Block"**
2. Choose a component (Hero, Features, CTA, etc.)
3. Drag to canvas
4. Customize in properties panel

**Available Components:**
- Hero Section
- Features Grid
- Pricing Table
- Testimonials
- Call-to-Action
- Contact Form
- Footer
- Navigation
- And 22+ more!

### 6. Customize Styles

**Click on any component to:**
- Edit text content
- Change colors
- Adjust spacing
- Upload images
- Modify layout

### 7. Preview & Publish

- **Preview:** Click "Preview" to see responsive design
- **Save Draft:** Auto-saves every 30 seconds
- **Publish:** Click "Publish" to make it live

Your page is now available at:  
`https://your-domain.com/p/my-first-page`

---

## 🛠️ Common Tasks

### Run Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

### Build for Production

```bash
npm run build
npm start
```

### Database Management

```bash
# Open Prisma Studio
npx prisma studio

# Create migration
npx prisma migrate dev --name your-migration

# Reset database
npx prisma migrate reset
```

### Code Quality

```bash
# Lint
npm run lint

# Format with Prettier
npm run format

# Type check
npm run type-check
```

---

## 🎯 Next Steps

Now that you're set up, explore:

1. **[Component Library](../../docs/iterations/08-ai-components/COMPONENT_LIBRARY.md)** - Learn about all available components
2. **[API Documentation](../../docs/iterations/06-api/API_DOCUMENTATION.md)** - Integrate with APIs
3. **[Deployment Guide](../../docs/iterations/09-devops/DEPLOYMENT_GUIDE.md)** - Deploy to production
4. **[Performance Guide](../../docs/iterations/11-performance/PERFORMANCE_OPTIMIZATION_GUIDE.md)** - Optimize your pages

---

## 🐛 Troubleshooting

### Common Issues

**Problem:** Database connection failed  
**Solution:** Check DATABASE_URL in `.env.local`, ensure PostgreSQL is running

**Problem:** Port 3000 already in use  
**Solution:** Kill the process or change port:
```bash
PORT=3001 npm run dev
```

**Problem:** Prisma client not found  
**Solution:** Regenerate Prisma client:
```bash
npx prisma generate
```

**Problem:** Images not uploading  
**Solution:** Configure AWS S3 credentials in `.env.local`

**Need more help?** Check [Troubleshooting Guide](./TROUBLESHOOTING.md)

---

## 📚 Additional Resources

- [Architecture Overview](./ARCHITECTURE.md)
- [Testing Strategy](../../docs/iterations/10-testing/TESTING_STRATEGY.md)
- [Security Guide](./SECURITY_GUIDE.md)
- [Docker Setup](../../infrastructure/docker/DOCKER_SETUP.md)

---

## 💬 Get Help

- 📖 [Documentation](../../README.md)
- 💬 [Discord Community](https://discord.gg/bubblegum)
- 🐛 [Report Issues](https://github.com/wmycco1/bubble-gum/issues)
- 📧 [Email Support](mailto:support@bubblegum.app)

---

**Happy Building! 🍬**
