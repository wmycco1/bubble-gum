# BUBBLE GUM PROJECT - DOCUMENTATION INDEX

**Версия:** 3.2.0 (Professional Level Rule Added)
**Дата создания:** November 03, 2025
**Последнее обновление:** November 04, 2025
**Статус:** ✅ Production Ready - 95% Complete | ⚠️ **Tech Stack Updated to Nov 2025**
**Назначение:** Индекс и навигация по документации проекта

> **📖 Полная документация:** Этот файл - компактный индекс. Детальная информация в `docs/` и `CLAUDE_FULL.md` (backup).

---

## ⚠️ КРИТИЧЕСКИЕ ПРАВИЛА ДЛЯ CLAUDE (ЧИТАТЬ ВСЕГДА)

### При выполнении КАЖДОЙ задачи:

1. **ВСЕГДА читай эту документацию полностью** перед началом работы
2. **ПРОВЕРЯЙ соответствие** каждого действия требованиям из CLAUDE.md
3. **СВЕРЯЙСЯ** с технологическим стеком перед установкой зависимостей
4. **НЕ ОТКЛОНЯЙСЯ** от архитектуры без явного согласия пользователя
5. **ПОСЛЕ каждого шага** спрашивай себя:
   - "Учёл ли я ВСЕ требования из CLAUDE.md?"
   - "Соответствует ли результат документации?"
   - "Что-то упустил?"
6. **ВСЕГДА проверяй актуальность версий перед использованием:**
   - Текущая дата: {сегодняшняя дата}
   - Мои знания: до января 2025
   - ЕСЛИ текущая дата > январь 2025:
     * Проверь актуальные версии через npm view
     * НЕ используй устаревшие версии из знаний
     * Используй web_search для проверки breaking changes
   - КРИТИЧНО для: Next.js, React, TypeScript, Prisma, tRPC, Clerk
   - Команда проверки: `npm view {package} version`
7. **ВСЕГДА профессиональный уровень (Senior/Lead/Architect):**
   - ПЕРЕД предложением решения → проверь существующие файлы
   - Если есть professional файл → используй/улучши его, НЕ предлагай упрощённый
   - Все решения: Enterprise-grade, production-ready, best practices 2025
   - Уровень эксперта во ВСЁМ:
     * Архитектура: паттерны, масштабируемость
     * Безопасность: OWASP, zero vulnerabilities
     * Производительность: Core Web Vitals, top 1%
     * SEO: современные стандарты
     * Дизайн: UI/UX, accessibility
   - Никогда не упрощай, когда можно сделать профессионально
   - Код ВСЕГДА: типизирован, с обработкой ошибок, с логированием, тестируемый
   - **Пример ошибки:**
     * ❌ Предлагать простой .gitignore, когда у пользователя уже есть professional
     * ❌ Использовать `any` в TypeScript вместо proper типов
     * ❌ Пропускать error handling "для простоты"
   - **Правильный подход:**
     * ✅ Проверить существующие файлы → использовать лучшее
     * ✅ Enterprise-grade решения с первого раза
     * ✅ Production-ready код ВСЕГДА
8. **СООБЩАЙ** если обнаружишь противоречия или упущения в документации
9. **ПРЕДЛАГАЙ** улучшения если видишь лучший способ
10. **ИСПОЛЬЗУЙ ОБА источника документации + ПРОВЕРЯЙ АКТУАЛЬНОСТЬ:**
   - **CLAUDE.md** — для архитектуры, стека, команд, контекста
   - **docs/** — для детальных спецификаций, примеров кода
   - **CLAUDE_FULL.md** — полный backup (если нужно)
   - **npm registry / web search** — для актуальных версий пакетов
   - При реализации функций ВСЕГДА проверяй оригинальную документацию
   - Пример: "Реализую AI генерацию" → читай @./full_documetations/docs/iterations/08-ai-components/

### Формат отчёта после каждого шага:
```
✅ Что сделано
📋 Проверено соответствие CLAUDE.md: [разделы]
⚠️ Обнаруженные отклонения (если есть)
➡️ Готов к следующему шагу
```

---

## 🔄 СТАНДАРТНЫЕ WORKFLOWS

### Workflow 1: Начало реализации с нуля

**Триггеры:** "начинаем реализацию" / "start implementation" / "реализуй проект с нуля"

**Процесс:**
1. Читаю @CLAUDE.md + релевантные @./docs/
2. Составляю ДЕТАЛЬНЫЙ план реализации
3. Показываю план пользователю
4. Жду одобрения: "go" (полуавто) / "auto" (автономно) / "изменить"
5. После одобрения - выполняю согласно режиму

**НЕ начинаю выполнение без одобрения плана!**

---

### Workflow 2: Реализация новой фичи

**Триггеры:** "Реализуй [фича]" / "Добавь [функцию]" / "Создай [компонент]"

**Процесс:**
1. Читаю CLAUDE.md для контекста
2. Ищу детали в @./docs/[релевантный файл]
3. Составляю план: Архитектура → Код → Тесты → Документация
4. Показываю план
5. Жду "go" / "auto" / "изменить"
6. Выполняю в выбранном режиме

---

### Workflow 3: Аудит кода

**Триггеры:** "check" / "проверь код" / "аудит"

**Процесс:**
1. Сканирую текущий код
2. Сравниваю с требованиями CLAUDE.md
3. Проверяю соответствие docs/
4. Отчёт: ✅ Соответствует / ⚠️ Отклонения / 🔴 Проблемы
5. Предлагаю исправления

---

### 🎚️ Режимы работы

| Режим | Команда | Поведение |
|-------|---------|-----------|
| **Интерактивный** | (по умолчанию) | Показываю план, спрашиваю при неясностях, отчитываюсь после каждого шага |
| **Полуавтоматический** | `go` | Выполняю план автоматически, спрашиваю ТОЛЬКО при критичных решениях |
| **Автономный** | `auto` | Выполняю весь план без остановок до конца, финальный отчёт |

---

### 💡 Быстрые команды

| Команда | Действие |
|---------|----------|
| `plan` | Составить план текущей задачи |
| `go` | Начать выполнение (полуавто) |
| `auto` | Автономный режим до конца |
| `check` | Проверить соответствие CLAUDE.md |

---

## 🎯 ОПИСАНИЕ ПРОЕКТА

### Что это за проект

**Bubble Gum** — это AI-первый no-code конструктор сайтов, который позволяет создавать production-ready веб-сайты за 30 минут без написания кода.

**Tagline:** "Global, Universal, Powerful!"

**Mission:** Демократизировать веб-разработку через интеллектуальную автоматизацию и простой пользовательский интерфейс.

### Бизнес-модель

**SaaS модель с тремя уровнями подписки:**

| План | Цена | Возможности |
|------|------|-------------|
| **Free Trial** | $0 (7 дней) | 1 сайт, watermark, subdomain only |
| **Starter** | $29/мес | 3 сайта, custom domain, 100 AI gen/день |
| **Pro** | $49/мес | 10 сайтов, unlimited AI, white-label |
| **Enterprise** | $99+/мес | Unlimited, dedicated support, SSO |

**Монетизация:** Подписки + AI токены (40% markup) + Add-ons

### Целевая аудитория

1. **Small Business Owners** (35%) - Retail shops, local services
2. **Freelancers & Consultants** (30%) - Designers, coaches
3. **Content Creators** (20%) - Bloggers, influencers
4. **Startups & Founders** (15%) - Early-stage companies

**География:** США → Глобально
**Возраст:** 13-70 лет

---

## 📚 WHERE TO FIND - НАВИГАЦИЯ ПО ДОКУМЕНТАЦИИ

> **Главное правило:** CLAUDE.md для навигации → docs/ для деталей → CLAUDE_FULL.md для полного контекста

| Тема | Файл | Размер | Что там |
|------|------|--------|---------|
| **Технологический стек** | [docs/TECH_STACK.md](./docs/TECH_STACK.md) | 8 KB | ⚠️ **ОБНОВЛЕНО (Nov 2025)**: Next.js 16, React 19, Prisma 6, tRPC 11, Clerk 6, Tailwind 4 + [Breaking Changes Guide](./MIGRATION_GUIDE.md) |
| **Актуальные версии** | [docs/TECH_STACK_ACTUAL_NOV_2025.md](./docs/TECH_STACK_ACTUAL_NOV_2025.md) | 17 KB | **NEW!** Полная таблица версий (Nov 2025), Breaking changes, Совместимость пакетов, Рекомендации по миграции |
| **База данных** | [docs/DATABASE.md](./docs/DATABASE.md) | 16 KB | 24 таблицы (11 MVP), Prisma schema, Field Reference, Indexes, Security, Multi-tenancy |
| **API** | [docs/API.md](./docs/API.md) | 24 KB | tRPC (13 роутеров, 80+ endpoints), REST (OpenAPI 3.0), 6 critical endpoints с примерами, CSV import, Webhooks, Rate limits |
| **Security** | [docs/SECURITY.md](./docs/SECURITY.md) | 36 KB | Authentication (Clerk), Input Validation (Zod), XSS Prevention, Security Headers, Rate Limiting, Encryption, OWASP Top 10, Checklist (28 пунктов) |
| **Performance** | [docs/PERFORMANCE.md](./docs/PERFORMANCE.md) | 28 KB | Core Web Vitals targets, Next.js config, Image optimization, Caching strategy, Database optimization, Bundle size, Monitoring, Checklist (14 пунктов) |
| **AI Strategy** | [docs/AI_STRATEGY.md](./docs/AI_STRATEGY.md) | 43 KB | API keys model (hybrid), Multi-model strategy, Reference image processing, URL inspiration, AI prompts, Cost management, Failover strategy |
| **Финансы** | [docs/FINANCIAL.md](./docs/FINANCIAL.md) | 27 KB | Pricing tiers, 5-year projections (ARR, CAC, LTV), Funding requirements ($2M Seed, $8M Series A), Cost structure, Team growth, Break-even analysis, Risks |
| **Social Media** | [docs/SOCIAL_MEDIA.md](./docs/SOCIAL_MEDIA.md) | 40 KB | OAuth 2.0 flows (Facebook, Instagram, Twitter, LinkedIn), Auto-publish workflow, Platform APIs, Token management, BullMQ queue, Error handling, UI components |
| **Полный backup** | [CLAUDE_FULL.md](./CLAUDE_FULL.md) | 96 KB | Оригинальная версия документации (v2.1.0) со всеми деталями |

**Итого детальной документации:** ~215 KB (8 файлов)

---

## 🏗️ АРХИТЕКТУРА (Краткий обзор)

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         USERS                                 │
│         (Web Browser, Mobile App, API Clients)               │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              CDN Layer (Vercel Edge + Cloudflare)            │
│  • Static Assets • Image Optimization • DDoS Protection     │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Application Layer (Next.js 16 + React 19)          │
│  • Page Builder (Drag & Drop + AI Chat)                     │
│  • Admin Panel (Dashboard, Analytics)                       │
│  • API Layer (tRPC 11 + REST + GraphQL)                     │
└────────────────────────┬─────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │   Redis     │  │Cloudflare R2│
│ Database    │  │   Cache     │  │   Storage   │
│ (Prisma)    │  │ (Upstash)   │  │  (S3-like)  │
└─────────────┘  └─────────────┘  └─────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         ▼
              ┌──────────────────┐
              │  External APIs   │
              │ • Clerk (Auth)   │
              │ • Anthropic (AI) │
              │ • Stripe (Pay)   │
              └──────────────────┘
```

**Детальная архитектура:** [docs/TECH_STACK.md](./docs/TECH_STACK.md)

---

### Ecosystem Components

**1. Main Builder Platform (Central):**
- Drag & Drop + AI Chat (hybrid UI)
- Global component library (50+)
- Admin dashboard
- REST API + GraphQL for n8n
- PWA support

**2. Client Sites (For each customer):**
- Subdomain → Custom domain
- TWO modes: Simple (AI chat) + Advanced (drag & drop)
- Admin panel (SEO, products, blog)

**3. n8n Automation Layer:**
- Form → API → site generation
- Auto-publish to social media
- Email/SMS campaigns

---

### Customer Journey

```
User fills form →
n8n captures data →
API call to Bubble Gum →
AI generates complete site (30-60 sec) →
User receives subdomain (7-day trial) →
Can edit via Simple/Advanced modes →
Subscribes via Stripe →
Connects custom domain →
Site goes live →
Optional: Auto-publish updates to social media
```

---

## 🚀 КОМАНДЫ ДЛЯ РАБОТЫ

### Installation

```bash
# Clone repository
git clone [repo-url]
cd bubble-gum

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Заполнить: DATABASE_URL, CLERK_*, ANTHROPIC_API_KEY, STRIPE_*, etc.

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
# Server: http://localhost:3000
```

---

### Development

```bash
npm run dev           # Dev server with hot reload
npm run type-check    # TypeScript checking
npm run lint          # ESLint
npm run lint:fix      # Auto-fix linting issues
npm run format        # Prettier formatting
```

---

### Database

```bash
npx prisma generate              # Generate Prisma client
npx prisma db push               # Push schema to DB (dev)
npx prisma migrate dev --name X  # Create migration (prod)
npx prisma studio                # View DB in browser
npx prisma db seed               # Seed database
npx prisma migrate reset         # ⚠️ Reset DB (deletes data!)
```

---

### Testing

```bash
npm test              # Run all tests
npm run test:unit     # Unit tests only
npm run test:e2e      # E2E tests (Playwright)
npm run test:coverage # Coverage report
npm run test:watch    # Watch mode
```

---

### Build & Deploy

```bash
npm run build         # Build for production
npm start             # Start production server
docker build -t bubblegum:latest .  # Docker build
vercel deploy --prod  # Deploy to Vercel
```

---

## 💻 РАЗРАБОТКА

### Project Structure

```
bubble-gum/
├── app/                    # Next.js 16 App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/               # API routes
│   └── [slug]/            # Dynamic page routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── blocks/           # Landing blocks
│   └── editor/           # Visual editor
├── lib/                  # Utilities
│   ├── db/              # Database client
│   ├── auth/            # Authentication
│   └── utils/           # Helpers
├── prisma/              # Database schema
│   └── schema.prisma    # Prisma schema
├── public/              # Static assets
├── tests/               # Test suites
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                # Documentation (NEW!)
│   ├── TECH_STACK.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── SECURITY.md
│   ├── PERFORMANCE.md
│   ├── AI_STRATEGY.md
│   ├── FINANCIAL.md
│   └── SOCIAL_MEDIA.md
├── full_documetations/  # Original iterations
├── CLAUDE.md            # This file (index)
└── CLAUDE_FULL.md       # Full backup (v2.1.0)
```

---

### Code Standards

**TypeScript:**
- ✅ Strict mode enabled
- ✅ Explicit types (избегать `any`)
- ✅ Function signatures с явными типами

**File Naming:**
- Components: PascalCase (`Button.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Types: PascalCase (`UserTypes.ts`)

**Git Workflow:**
```bash
git checkout -b feature/component-name
git commit -m "feat: add new component"  # Conventional commits
```

---

### Testing Strategy

**Testing Pyramid:**
- **Unit Tests (80%)** - Jest + React Testing Library
- **Integration Tests (15%)** - API, DB
- **E2E Tests (5%)** - Playwright

**Coverage Goals:** Overall 80%+, Critical paths 90%+

---

## 🗓️ ROADMAP (Краткий)

### MVP Timeline

| Phase | Weeks | Tasks | Story Points | Theme |
|-------|-------|-------|--------------|-------|
| **Phase 0** | 1-4 | 11 | 52 | Foundation (Auth, DB, API) |
| **Phase 1** | 5-14 | 15 | 116 | Core MVP (Canvas, Components, AI) |
| **Buffer** | 15-20 | N/A | N/A | Polish + Launch |

**Total:** 20 weeks (5 months)

---

### Key Milestones

| Week | Milestone | Success Criteria |
|------|-----------|------------------|
| **2** | Foundation | Auth + DB + API working |
| **4** | Phase 0 Done | Team can build features |
| **6** | Canvas MVP | Drag-drop functional |
| **8** | Components | 20 components available |
| **11** | AI Generation | AI creates working sites |
| **14** | Feature Complete | All MVP features done |
| **20** | 🚀 Launch | First 100 users |

---

### MVP Scope (Features)

**Core MVP (Phases 0-1, Months 1-6):**

✅ Form → AI site generation (n8n workflow)
✅ AI Chat interface (page/component generation)
✅ Reference image upload (AI extracts design)
✅ URL inspiration (donor site analysis)
✅ Drag & Drop builder
✅ Component library (100+)
✅ Properties panel (context-aware)
✅ Simple products (name, price, SKU, inventory)
✅ Shopping cart + Stripe checkout
✅ Blog (posts, categories, tags, rich text)
✅ SEO auto-optimization
✅ Custom domain connection (DNS + SSL)
✅ Subdomain provisioning
✅ REST API + GraphQL
✅ Stripe billing
✅ Mobile responsive (automatic)
✅ Performance optimization (Lighthouse 95+)
✅ Export code (Next.js/React)
✅ Version control
✅ PWA support

**Phase 2 (Months 7-10):**
⏭️ Advanced Mode, Configurable products, A/B testing, White-label, Team collaboration, Multi-language

---

## 🎯 ОСОБЕННОСТИ И BEST PRACTICES

### Уникальные решения проекта

1. **Hybrid AI Approach** - Users provide own keys (Free) OR use pooled account (Paid). Multi-model strategy (Claude, GPT-4, Gemini, Perplexity).

2. **Component System** - 50+ components в 7 категориях с TypeScript interfaces. Reference: [docs/TECH_STACK.md](./docs/TECH_STACK.md)

3. **Multi-Layer Caching** - Browser → CDN → Redis → Memory → Database. Details: [docs/PERFORMANCE.md](./docs/PERFORMANCE.md)

4. **Security-First** - OWASP Top 10, Clerk auth, Zod validation, AES-256 encryption. Checklist: [docs/SECURITY.md](./docs/SECURITY.md)

5. **Performance Optimized** - Lighthouse 95+, LCP <2.5s, Next.js Image, code splitting. Guide: [docs/PERFORMANCE.md](./docs/PERFORMANCE.md)

---

### Critical Dependencies (НЕ МЕНЯТЬ без обсуждения)

- **Next.js** - Framework choice
- **tRPC** - API layer
- **Prisma** - ORM
- **Clerk** - Authentication
- **Anthropic Claude** - AI provider

### Safe to Update

- UI libraries (shadcn/ui)
- Dev dependencies
- Testing tools

---

### Troubleshooting

**Database Issues:**
```bash
# Проверь DATABASE_URL в .env
# Убедись что PostgreSQL запущен
npx prisma generate && npx prisma db push
```

**Authentication Issues:**
```bash
# Проверь CLERK_* переменные в .env
# Убедись что Clerk app настроен
```

**AI Generation Issues:**
```bash
# Проверь ANTHROPIC_API_KEY
# Проверь rate limits
# Модель: claude-sonnet-4-5-20250929
```

---

## 📞 QUICK REFERENCE

### ⚠️ ВЕРСИИ ПАКЕТОВ ОБНОВЛЕНЫ (November 2025)

> **КРИТИЧНО:** Документация обновлена с версий января 2025 на ноябрь 2025. Произошло **8 MAJOR обновлений** с breaking changes!

| Пакет | Было (Jan 2025) | Стало (Nov 2025) | Breaking Changes |
|-------|-----------------|------------------|------------------|
| **Next.js** | 14.2+ | **16.0.1** | ✅ Middleware, Pages Router удален |
| **React** | 18.3+ | **19.2.0** | ✅ defaultProps удален, новые хуки |
| **Prisma** | 5.x | **6.18.0** | ✅ Новый формат migrations, Node 20+ |
| **tRPC** | 10.x | **11.7.1** | ✅ Новый API context, роутеры |
| **Clerk** | 5.x | **6.34.1** | ✅ Middleware для Next.js 16 |
| **Tailwind** | 3.4+ | **4.1.16** | ✅ Oxide engine, новый config |
| **Zustand** | 4.x | **5.0.8** | ⚠️ Новый API для middleware |
| **Zod** | 3.x | **4.1.12** | ⚠️ Изменен формат ошибок |

**Полная информация:**
- [docs/TECH_STACK_ACTUAL_NOV_2025.md](./docs/TECH_STACK_ACTUAL_NOV_2025.md) - Таблица версий + совместимость
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Step-by-step миграция с примерами кода

---

### Как начать работу?
1. Прочитай CLAUDE.md (этот файл)
2. ⚠️ **ВАЖНО:** Проверь актуальные версии в [docs/TECH_STACK_ACTUAL_NOV_2025.md](./docs/TECH_STACK_ACTUAL_NOV_2025.md)
3. Установи проект: `npm install` → `npx prisma db push` → `npm run dev`
4. Изучи [docs/TECH_STACK.md](./docs/TECH_STACK.md) для понимания архитектуры

### Где найти примеры кода?
- **API примеры:** [docs/API.md](./docs/API.md) - 6 critical endpoints с TypeScript
- **Security примеры:** [docs/SECURITY.md](./docs/SECURITY.md) - Authentication, Validation, Encryption
- **Performance примеры:** [docs/PERFORMANCE.md](./docs/PERFORMANCE.md) - Next.js config, Image optimization
- **AI промпты:** [docs/AI_STRATEGY.md](./docs/AI_STRATEGY.md) - Prompt templates, Model configuration

### Как добавить новую фичу?
1. Читай CLAUDE.md для контекста
2. Ищи детали в релевантном docs/ файле
3. Составляй план: Архитектура → Код → Тесты → Документация
4. Следуй Workflow 2 (см. выше)

### Где документация по безопасности?
[docs/SECURITY.md](./docs/SECURITY.md) - полный гайд с OWASP Top 10, checklists, примерами кода

### Как оптимизировать производительность?
[docs/PERFORMANCE.md](./docs/PERFORMANCE.md) - Core Web Vitals targets, caching strategy, checklist

### Где финансовая модель?
[docs/FINANCIAL.md](./docs/FINANCIAL.md) - 5-year projections, unit economics, funding requirements

---

## 📝 CHANGELOG

### Version 3.0.1 (November 04, 2025) - VERSION CHECK RULE

**🎯 Критичное обновление:**
- ✅ Добавлено правило #6: Проверка актуальности версий пакетов
- ✅ Обновлено правило #9 (бывшее #8): Добавлена проверка через npm registry
- ✅ Команда проверки: `npm view {package} version`
- ✅ Критично для: Next.js, React, TypeScript, Prisma, tRPC, Clerk

**Причина:** Защита от использования устаревших версий из знаний до января 2025

---

### Version 3.0.0 (November 04, 2025) - REORGANIZED

**🎯 Главные изменения:**
- ✅ Реорганизована структура документации
- ✅ CLAUDE.md сжат с 96 KB → ~30 KB (индекс + навигация)
- ✅ Создано 8 детальных файлов в `docs/` (~215 KB total):
  - TECH_STACK.md, DATABASE.md, API.md, SECURITY.md
  - PERFORMANCE.md, AI_STRATEGY.md, FINANCIAL.md, SOCIAL_MEDIA.md
- ✅ CLAUDE_FULL.md - backup оригинальной версии (v2.1.0)
- ✅ Добавлена секция "WHERE TO FIND" - навигация по документации
- ✅ Добавлена секция "QUICK REFERENCE" - быстрые ответы

**Цель:** Компактный индекс для быстрой навигации + детальная документация в отдельных файлах

---

### Version 2.1.0 (November 03, 2025) - 95% Complete

**✨ Критичные секции добавлены:**
- Social Media Integration Details (~290 lines)
- Database Schema - Field Reference (~330 lines)
- API - Critical Endpoints Examples (~270 lines)
- CSV Import Specification (~160 lines)
- Security Implementation (~290 lines)
- Performance Configuration (~300 lines)

**Completeness:** 85% → **95%**

---

### Version 2.0.0 (November 03, 2025) - 85% Complete

**✨ Major Enhancements:**
- AI Strategy Details (API Keys, Multi-Model, Cost Management)
- Enhanced Financial Model (Cost Structure, Team Growth, Break-Even Analysis)

---

## 🔗 USEFUL LINKS

- **Iterations (Original):** `/full_documetations/docs/iterations/`
- **Prisma Docs:** https://www.prisma.io/docs
- **tRPC Docs:** https://trpc.io/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Clerk Docs:** https://clerk.com/docs
- **Anthropic Claude Docs:** https://docs.anthropic.com/

---

## 📊 PROJECT STATUS

| Component | Status | Documentation |
|-----------|--------|---------------|
| Documentation | ✅ 100% | All iterations + reorganized structure |
| Database Schema | ✅ Complete | docs/DATABASE.md |
| API (tRPC + REST) | ✅ Complete | docs/API.md |
| Security | ✅ Complete | docs/SECURITY.md |
| Performance | ✅ Complete | docs/PERFORMANCE.md |
| AI Strategy | ✅ Complete | docs/AI_STRATEGY.md |
| Frontend Components | ⏳ To Implement | full_documetations/ |
| AI Integration | ⏳ To Implement | docs/AI_STRATEGY.md |
| E-commerce | ⏳ To Implement | docs/API.md |

---

**Last Updated:** November 04, 2025
**Documentation Version:** 3.0.1
**Maintained by:** Claude AI

---

*CLAUDE.md — компактный индекс проекта Bubble Gum. Для быстрой навигации используй секцию "WHERE TO FIND". Для детальных спецификаций и примеров кода обращайся к files в `docs/`. Для полного контекста см. `CLAUDE_FULL.md`.*
