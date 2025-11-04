# 🏗️ Bubble Gum Architecture

## High-Level Architecture

Bubble Gum is built with a modern, scalable architecture:

```
┌─────────────────────────────────────────────┐
│           Frontend (Next.js 14)             │
│        React + TypeScript + Tailwind        │
└────────────────┬────────────────────────────┘
                 │
                 │ tRPC (Type-safe API)
                 │
┌────────────────▼────────────────────────────┐
│         Backend (Next.js API)               │
│      Business Logic + Authentication        │
└────────────────┬────────────────────────────┘
                 │
        ┌────────┼────────┐
        │        │        │
┌───────▼───┐  ┌─▼─────┐ ┌▼────────┐
│  Prisma   │  │ Clerk │ │   AI    │
│    ORM    │  │ Auth  │ │ Claude  │
└─────┬─────┘  └───────┘ └─────────┘
      │
┌─────▼──────────┐
│   PostgreSQL   │
└────────────────┘
```

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Backend:** tRPC, Prisma ORM
- **Database:** PostgreSQL
- **Auth:** Clerk
- **AI:** Anthropic Claude
- **Hosting:** Vercel
- **Storage:** AWS S3

## Core Features

1. **Visual Editor** - Drag & drop page builder
2. **AI Generation** - AI-powered content creation
3. **E-commerce** - Integrated shopping features
4. **Analytics** - Built-in analytics dashboard

## Documentation

For detailed architecture documentation, see:
- [Detailed Architecture](docs/guides/ARCHITECTURE.md)
- [Database Schema](src/prisma/schema.prisma)
- [API Documentation](docs/iterations/06-api/API_DOCUMENTATION.md)
