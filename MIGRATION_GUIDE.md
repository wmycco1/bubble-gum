# Bubble Gum - Migration Guide (November 2025)

**От:** January 2025 stack (Next.js 14, React 18, Prisma 5, etc.)
**К:** November 2025 stack (Next.js 16, React 19, Prisma 6, etc.)

**Статус:** 🔴 Критичная миграция требуется
**Сложность:** High
**Примерное время:** 8-16 часов

---

## 📊 Критичность обновлений

| Пакет | Критичность | Причина |
|-------|-------------|---------|
| Next.js 14→16 | 🔴 Высокая | Breaking changes в middleware, Pages Router удален |
| React 18→19 | 🔴 Высокая | defaultProps удален, изменен useEffect |
| Prisma 5→6 | 🟡 Средняя | Новый формат migrations, требует Node 20+ |
| tRPC 10→11 | 🟡 Средняя | Изменен API context и роутеры |
| Clerk 5→6 | 🟡 Средняя | Новый middleware API для Next.js 16 |
| Tailwind 3→4 | 🟢 Низкая | Новый config, но обратно совместим |

---

## 🚀 Быстрый старт (рекомендуемый порядок)

### Step 1: Подготовка

```bash
# 1. Создайте backup
git checkout -b migration-nov-2025
git commit -am "Before migration"

# 2. Обновите Node.js (если нужно)
node --version  # Должно быть >= 20.0.0

# 3. Очистите кеш
rm -rf node_modules package-lock.json .next
```

### Step 2: Обновите package.json

```bash
# Используйте подготовленный template
cp package.json package.json.backup
cp docs/package.json.template package.json
npm install
```

### Step 3: Миграция критичных пакетов

**3.1. Next.js + React (вместе!)**

```bash
npm install next@16.0.1 react@19.2.0 react-dom@19.2.0
```

**Изменения в коде:**

1. **Обновите `next.config.js`:**
```typescript
// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  // Turbopack теперь default, флаг не нужен
  experimental: {
    // Удалите appDir (больше не нужен)
    // Добавьте новые фичи
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default config
```

2. **Обновите middleware (если используется):**
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // ❌ Старый способ (Next.js 14)
  // return NextResponse.redirect(new URL('/login', request.url))

  // ✅ Новый способ (Next.js 16) - proxy-based
  const response = NextResponse.next()

  // Добавляйте headers вместо redirect
  response.headers.set('x-middleware-cache', 'no-cache')

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}
```

3. **Удалите defaultProps (React 19):**
```typescript
// ❌ Удалите
Button.defaultProps = { variant: 'primary' }

// ✅ Используйте default parameters
function Button({ variant = 'primary' }: Props) {
  return <button className={variant}>Click</button>
}
```

**3.2. Prisma 5 → 6**

```bash
npm install prisma@6.18.0 @prisma/client@6.18.0
```

**Изменения:**

1. **Обновите `package.json` engines:**
```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

2. **Пересоздайте migrations:**
```bash
# Бекап текущей схемы
cp prisma/schema.prisma prisma/schema.prisma.backup

# Пересоздайте миграции
npx prisma migrate dev

# Проверьте изменения
npx prisma migrate status
```

**3.3. tRPC 10 → 11**

```bash
npm install @trpc/server@11.7.1 @trpc/client@11.7.1 @trpc/react-query@11.7.1
```

**Изменения:**

1. **Обновите context API:**
```typescript
// lib/trpc.ts
// ❌ Старый способ (tRPC 10)
export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  return { req, res }
}

// ✅ Новый способ (tRPC 11)
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts
  return { req, res }
}
```

2. **Обновите router format:**
```typescript
// ❌ Старый формат
export const appRouter = router({
  user: userRouter,
})

// ✅ Новый формат (более строгие типы)
export const appRouter = createTRPCRouter({
  user: userRouter,
})
```

**3.4. Clerk 5 → 6**

```bash
npm install @clerk/nextjs@6.34.1
```

**Изменения:**

1. **Обновите middleware:**
```typescript
// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server'

// ❌ Старый способ (Clerk 5)
// export default withClerkMiddleware()

// ✅ Новый способ (Clerk 6)
export default clerkMiddleware({
  publicRoutes: ['/', '/pricing'],
})
```

2. **Обновите environment variables:**
```bash
# Переименуйте переменные
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (без изменений)
CLERK_SECRET_KEY (без изменений)

# Добавьте новые
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
CLERK_AFTER_SIGN_IN_URL=/dashboard
CLERK_AFTER_SIGN_UP_URL=/onboarding
```

**3.5. Tailwind CSS 3 → 4**

```bash
npm install tailwindcss@4.1.16
```

**Изменения:**

1. **Обновите конфигурацию:**
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      // Новый синтаксис для кастомных цветов
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          foreground: 'rgb(var(--color-primary-foreground) / <alpha-value>)',
        },
      },
    },
  },
} satisfies Config
```

2. **Обновите CSS variables:**
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Новый формат переменных */
    --color-primary: 59 130 246; /* RGB values без rgb() */
    --color-primary-foreground: 255 255 255;
  }
}
```

---

### Step 4: Обновите остальные пакеты

```bash
npm install typescript@5.9.3 \
  zustand@5.0.8 \
  zod@4.1.12 \
  @anthropic-ai/sdk@0.68.0 \
  @tanstack/react-query@5.90.6 \
  react-hook-form@7.66.0 \
  @dnd-kit/core@6.3.1
```

---

### Step 5: Тестирование

```bash
# 1. Проверьте типы
npm run type-check

# 2. Запустите линтер
npm run lint

# 3. Запустите dev server
npm run dev

# 4. Проверьте production build
npm run build
npm start

# 5. Запустите тесты
npm test
```

---

## 🐛 Частые проблемы и решения

### Problem 1: "Cannot find module 'next/server'"

**Причина:** Next.js 16 изменил exports

**Решение:**
```typescript
// ❌ Старый импорт
import { NextResponse } from 'next/server'

// ✅ Новый импорт
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
```

### Problem 2: "defaultProps is not supported"

**Причина:** React 19 удалил defaultProps для function components

**Решение:**
```typescript
// ✅ Используйте default parameters
function Component({ prop = 'default' }: Props) {
  return <div>{prop}</div>
}
```

### Problem 3: Prisma migrations fail

**Причина:** Prisma 6 требует Node.js 20+

**Решение:**
```bash
# Обновите Node.js
nvm install 20
nvm use 20

# Пересоздайте миграции
npx prisma migrate dev
```

### Problem 4: Clerk middleware не работает

**Причина:** Clerk 6 изменил API для Next.js 16

**Решение:**
```typescript
// Используйте новый clerkMiddleware()
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()
```

### Problem 5: Tailwind classes не применяются

**Причина:** Tailwind 4 изменил формат конфигурации

**Решение:**
```typescript
// Обновите tailwind.config.ts
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'], // Правильные пути
} satisfies Config
```

---

## 📋 Checklist миграции

### До миграции
- [ ] Создан backup (git branch)
- [ ] Node.js >= 20.0.0
- [ ] Прочитан TECH_STACK_ACTUAL_NOV_2025.md
- [ ] Команда готова к миграции

### Во время миграции
- [ ] Обновлен package.json
- [ ] Установлены новые пакеты
- [ ] Обновлен next.config.ts
- [ ] Обновлен middleware.ts (если есть)
- [ ] Удалены defaultProps
- [ ] Обновлен Prisma schema
- [ ] Пересозданы migrations
- [ ] Обновлен tRPC context
- [ ] Обновлен Clerk middleware
- [ ] Обновлен tailwind.config.ts
- [ ] Обновлены CSS variables

### После миграции
- [ ] `npm run type-check` проходит
- [ ] `npm run lint` проходит
- [ ] `npm run dev` работает
- [ ] `npm run build` проходит
- [ ] `npm test` проходит
- [ ] Вручную протестированы критичные flows
- [ ] Обновлена документация
- [ ] Команда уведомлена об изменениях

---

## 🔗 Дополнительные ресурсы

- **Актуальные версии:** [docs/TECH_STACK_ACTUAL_NOV_2025.md](./docs/TECH_STACK_ACTUAL_NOV_2025.md)
- **Package.json template:** [docs/package.json.template](./docs/package.json.template)
- **Next.js 16 Guide:** https://nextjs.org/docs/upgrade-guide/version-16
- **React 19 Guide:** https://react.dev/blog/2025/09/react-19
- **Prisma 6 Release:** https://github.com/prisma/prisma/releases/tag/6.0.0

---

**Последнее обновление:** November 04, 2025
**Статус:** ✅ Проверено
**Примерное время миграции:** 8-16 часов
