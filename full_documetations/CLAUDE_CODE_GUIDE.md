# 🤖 CLAUDE CODE GUIDE - Bubble Gum Project

## 📋 PROJECT OVERVIEW

**Project Name:** Bubble Gum  
**Description:** AI-Powered No-Code Website Builder  
**Tech Stack:** Next.js 14, TypeScript, tRPC, Prisma, Clerk, Anthropic Claude  
**Documentation Version:** 1.0  
**Last Updated:** November 03, 2025

---

## 🗂️ PROJECT STRUCTURE

```
bubble-gum/
├── docs/                              # Вся документация
│   ├── iterations/                    # 11 итераций разработки
│   │   ├── 01-handoff/               # Начальная спецификация
│   │   ├── 02-executive-summary/      # Бизнес-план
│   │   ├── 03-financial-model/        # Финансовая модель
│   │   ├── 04-roadmap/               # Дорожная карта
│   │   ├── 05-database/              # База данных (Prisma)
│   │   ├── 06-api/                   # API (tRPC)
│   │   ├── 07-sdk/                   # SDK и вебхуки
│   │   ├── 08-ai-components/          # AI промпты и компоненты
│   │   ├── 09-devops/                # DevOps и деплой
│   │   ├── 10-testing/               # Стратегия тестирования
│   │   └── 11-performance/            # Оптимизация производительности
│   └── guides/                        # Руководства
│
├── src/                               # Исходный код
│   ├── prisma/                       # Prisma схема БД
│   └── trpc/                         # tRPC роутер
│
├── tests/                            # Тесты
│   ├── jest.config.js               # Jest конфигурация
│   ├── jest.setup.js                # Jest setup
│   └── playwright.config.ts          # Playwright конфигурация
│
├── infrastructure/                    # Инфраструктура
│   ├── docker/                       # Docker конфигурация
│   ├── kubernetes/                    # Kubernetes манифесты
│   └── next.config.optimized.js      # Оптимизированный Next.js config
│
├── .github/workflows/                 # CI/CD
│   └── ci-cd.yml                     # GitHub Actions workflow
│
├── tools/                            # Инструменты
│   └── TRELLO_BOARD_V3_FULL.json     # Trello board с задачами
│
├── .env.example                       # Пример environment variables
├── README.md                          # Главный README
├── ARCHITECTURE.md                    # Архитектура проекта
└── CONTRIBUTING.md                    # Гид для контрибьюторов
```

---

## 🚀 GETTING STARTED

### Prerequisites

- **Node.js:** 18+ (рекомендуется 20.x)
- **PostgreSQL:** 14+
- **Redis:** 7+ (для кэширования)
- **npm:** 9+

### Installation

```bash
# 1. Clone repository
git clone [repo-url]
cd bubble-gum

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Заполнить необходимые переменные (см. ниже)

# 4. Setup database
npx prisma generate
npx prisma db push

# 5. (Optional) Seed database
npx prisma db seed

# 6. Run development server
npm run dev
```

Сервер запустится на `http://localhost:3000`

---

## 🔑 ENVIRONMENT VARIABLES

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bubblegum"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Anthropic AI
ANTHROPIC_API_KEY="sk-ant-..."

# AWS (для production)
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="bubblegum-assets"

# Stripe (для payments)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Redis (для кэширования)
REDIS_URL="redis://localhost:6379"
```

### Optional Variables

```bash
# Development
NODE_ENV="development"
LOG_LEVEL="debug"

# Monitoring
SENTRY_DSN="..."
POSTHOG_API_KEY="..."

# CDN
NEXT_PUBLIC_CDN_URL="https://cdn.bubblegum.app"
```

---

## 📚 KEY DOCUMENTATION

### Start Here
1. **README.md** - Обзор проекта
2. **ARCHITECTURE.md** - Архитектура системы
3. **docs/iterations/01-handoff/** - Полная начальная спецификация

### Development
4. **src/prisma/schema.prisma** - Схема базы данных
5. **src/trpc/trpc-router.ts** - API endpoints
6. **docs/iterations/08-ai-components/** - AI промпты и компоненты

### Operations
7. **docs/iterations/09-devops/DEPLOYMENT_GUIDE.md** - Деплой инструкции
8. **docs/iterations/10-testing/TESTING_STRATEGY.md** - Стратегия тестирования
9. **docs/iterations/11-performance/** - Оптимизация

---

## 🎯 COMMON TASKS

### Development

```bash
# Run dev server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
```

### Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to DB (development)
npx prisma db push

# Create migration (production)
npx prisma migrate dev --name migration_name

# View database in Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed

# Reset database (⚠️ deletes all data!)
npx prisma migrate reset
```

### Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Build Docker image
docker build -t bubblegum:latest .

# Run with Docker Compose
docker-compose up -d

# Deploy to Vercel
vercel deploy --prod
```

---

## 🏗️ ARCHITECTURE OVERVIEW

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components

**Backend:**
- tRPC (type-safe API)
- Prisma ORM
- PostgreSQL database

**Authentication:**
- Clerk (Auth provider)

**AI:**
- Anthropic Claude Sonnet 4.5

**Infrastructure:**
- Vercel (hosting)
- AWS S3 (file storage)
- Redis (caching)

### Key Components

1. **Page Builder**
   - Drag-and-drop interface
   - Real-time preview
   - Component library

2. **AI Generator**
   - Site generation from prompts
   - Content suggestions
   - Image optimization

3. **E-commerce**
   - Product management
   - Stripe integration
   - Order processing

4. **Analytics**
   - Page views tracking
   - Form submissions
   - Traffic sources

---

## 🔧 CODE STANDARDS

### TypeScript

- **Use explicit types** - Избегать `any`
- **Strict mode enabled** - tsconfig.json
- **Function signatures** - Явные параметры и возвращаемые типы

```typescript
// ✅ Good
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// ❌ Bad
function calculateTotal(price, quantity) {
  return price * quantity;
}
```

### File Naming

- **React Components:** PascalCase (`Button.tsx`)
- **Utilities:** camelCase (`formatDate.ts`)
- **Types:** PascalCase (`UserTypes.ts`)
- **Constants:** UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

### Code Organization

```typescript
// Component structure
import statements
type definitions
component definition
helper functions
export
```

### Git Workflow

```bash
# Feature branch
git checkout -b feature/component-name

# Commit messages (conventional commits)
git commit -m "feat: add new component"
git commit -m "fix: resolve bug in api"
git commit -m "docs: update readme"

# Pull request
git push origin feature/component-name
# Create PR on GitHub
```

---

## ⚠️ CRITICAL DEPENDENCIES

### DO NOT CHANGE without discussion:

- **Next.js** - Framework choice
- **tRPC** - API layer
- **Prisma** - ORM
- **Clerk** - Authentication
- **Anthropic Claude** - AI provider

### Safe to Update:

- UI libraries (shadcn/ui)
- Dev dependencies
- Testing tools

---

## 🚫 DO NOT MODIFY

These files are reference implementations:

- `src/prisma/schema.prisma` - Модифицировать через migrations only
- `docs/iterations/**/*_COMPLETE.md` - История проекта, не изменять
- `CHANGELOG.md` - Только добавлять новые записи

---

## ✅ SAFE TO MODIFY

These are starting points, customize as needed:

- `src/**/*.tsx` - React components
- `src/trpc/**/*.ts` - tRPC routes (следовать паттернам)
- `tests/**/*.test.ts` - Tests
- Styling and UI components

---

## 🐛 TROUBLESHOOTING

### Database Issues

```bash
# Connection error
# → Проверь DATABASE_URL в .env
# → Убедись что PostgreSQL запущен

# Schema mismatch
npx prisma generate
npx prisma db push
```

### Authentication Issues

```bash
# Clerk errors
# → Проверь CLERK_* переменные в .env
# → Убедись что Clerk app настроен правильно
```

### AI Generation Issues

```bash
# Anthropic API errors
# → Проверь ANTHROPIC_API_KEY
# → Проверь rate limits
# → Убедись что модель claude-sonnet-4-5-20250929 доступен
```

---

## 📊 PROJECT STATUS

| Component | Status | Documentation |
|-----------|--------|---------------|
| Documentation | ✅ 100% | All iterations complete |
| Database Schema | ✅ Complete | docs/iterations/05-database/ |
| API (tRPC) | ✅ Complete | docs/iterations/06-api/ |
| Testing Strategy | ✅ Complete | docs/iterations/10-testing/ |
| DevOps Setup | ✅ Complete | docs/iterations/09-devops/ |
| Frontend Components | ⏳ To Implement | docs/iterations/08-ai-components/ |
| AI Integration | ⏳ To Implement | docs/iterations/08-ai-components/ |
| E-commerce | ⏳ To Implement | docs/iterations/06-api/ |

---

## 🎓 BEST PRACTICES

### 1. Always Read Documentation First
Before implementing a feature, check relevant iteration docs:
- Database changes? → Read iteration 05
- API changes? → Read iteration 06
- Testing? → Read iteration 10

### 2. Follow Existing Patterns
Look at similar implementations in the codebase before creating new patterns.

### 3. Test Everything
- Unit tests for business logic
- E2E tests for critical flows
- Performance tests for heavy operations

### 4. Document Your Changes
- Update relevant docs if adding major features
- Add JSDoc comments to public APIs
- Update CHANGELOG.md

### 5. Security First
- Validate all inputs
- Use Prisma parameterized queries (no SQL injection)
- Sanitize user content
- Rate limit API endpoints

---

## 🔗 USEFUL LINKS

- **Main Documentation:** `/docs/`
- **Iterations Overview:** `/docs/iterations/`
- **Prisma Docs:** https://www.prisma.io/docs
- **tRPC Docs:** https://trpc.io/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Clerk Docs:** https://clerk.com/docs

---

## 📞 SUPPORT

If you have questions:
1. Check relevant iteration documentation
2. Review TROUBLESHOOTING.md
3. Check existing code for similar implementations
4. Ask in team chat

---

**Last Updated:** November 03, 2025  
**Documentation Version:** 1.0  
**Status:** ✅ Ready for Development

---

*This guide is specifically designed to help Claude Code understand and work with the Bubble Gum project efficiently. All architecture decisions and patterns documented here should be followed for consistency.*
