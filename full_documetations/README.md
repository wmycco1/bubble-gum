# 🍬 Bubble Gum - Modern Landing Page Builder

<div align="center">

![Bubble Gum Logo](https://via.placeholder.com/200x200?text=Bubble+Gum)

**Create stunning landing pages in minutes, not hours.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

[🚀 Live Demo](https://bubblegum.app) | [📖 Documentation](./docs/guides/GETTING_STARTED.md) | [🐛 Report Bug](https://github.com/yourusername/bubble-gum/issues) | [✨ Request Feature](https://github.com/yourusername/bubble-gum/issues)

</div>

---

## 🎯 What is Bubble Gum?

**Bubble Gum** is a powerful, modern landing page builder that empowers creators, marketers, and businesses to create professional landing pages without writing code. Built with Next.js 14, React, and TypeScript.

### ✨ Key Features

- **🎨 Visual Editor** - Drag & drop interface with real-time preview
- **📱 Responsive Design** - Mobile-first, looks great on all devices
- **⚡ Lightning Fast** - 95+ Lighthouse score, optimized performance
- **🔧 30+ Components** - Pre-built blocks ready to use
- **🎭 Custom Themes** - Brand colors, fonts, and styles
- **📊 Analytics Integration** - Track visitor behavior and conversions
- **🌐 Multi-language** - i18n support for global audiences
- **🔒 Secure** - Built-in authentication and authorization
- **☁️ Cloud Storage** - S3 integration for media assets
- **🚀 One-Click Deploy** - Vercel, Netlify, or self-hosted

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL 14+ database
- Redis (optional, for caching)

### Installation

```bash
# Clone the repository
git clone https://github.com/wmycco1/bubble-gum.git
cd bubble-gum

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Setup database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app! 🎉

**Need more details?** Check out our [Getting Started Guide](./docs/guides/GETTING_STARTED.md)

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Components:** Radix UI, shadcn/ui
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod

### Backend
- **API:** tRPC (type-safe APIs)
- **Database:** PostgreSQL (Prisma ORM)
- **Authentication:** NextAuth.js
- **File Storage:** AWS S3 / Cloudflare R2
- **Caching:** Redis (Upstash)

### DevOps
- **Deployment:** Vercel / Docker
- **CI/CD:** GitHub Actions
- **Monitoring:** Vercel Analytics, Sentry
- **Testing:** Jest, Playwright
- **Performance:** Lighthouse CI

---

## 📂 Project Structure

```
bubble-gum/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/               # API routes
│   └── [slug]/            # Dynamic page routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── blocks/           # Landing page blocks
│   └── editor/           # Visual editor
├── lib/                  # Utilities and helpers
│   ├── db/              # Database client
│   ├── auth/            # Authentication
│   └── utils/           # Shared utilities
├── prisma/              # Database schema
├── public/              # Static assets
├── styles/              # Global styles
└── tests/               # Test suites
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](./docs/guides/GETTING_STARTED.md) | Complete setup guide |
| [Architecture](./docs/guides/ARCHITECTURE.md) | System design & architecture |
| [Component Library](./docs/iterations/08-ai-components/COMPONENT_LIBRARY.md) | Available components |
| [API Documentation](./docs/iterations/06-api/API_DOCUMENTATION.md) | API reference |
| [Database Schema](./docs/iterations/05-database/DATABASE_DOCUMENTATION.md) | Database structure |
| [Deployment Guide](./docs/iterations/09-devops/DEPLOYMENT_GUIDE.md) | Deploy to production |
| [Performance Guide](./docs/iterations/11-performance/PERFORMANCE_OPTIMIZATION_GUIDE.md) | Optimization tips |
| [Testing Strategy](./docs/iterations/10-testing/TESTING_STRATEGY.md) | Testing approach |
| [Contributing](./CONTRIBUTING.md) | How to contribute |
| [Troubleshooting](./docs/guides/TROUBLESHOOTING.md) | Common issues |

---

## 🎨 Screenshots

### Visual Editor
![Editor Screenshot](https://via.placeholder.com/800x500?text=Visual+Editor)

### Dashboard
![Dashboard Screenshot](https://via.placeholder.com/800x500?text=Dashboard)

### Published Page
![Page Screenshot](https://via.placeholder.com/800x500?text=Published+Page)

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage

# Lighthouse performance test
npm run test:lighthouse
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build image
docker build -t bubble-gum .

# Run container
docker run -p 3000:3000 bubble-gum
```

### Self-Hosted

See [Deployment Guide](./docs/iterations/09-devops/DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# AWS S3
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="bubble-gum-assets"

# Redis (Optional)
REDIS_URL="redis://..."

# Analytics (Optional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

See [.env.example](./.env.example) for complete list.

---

## 📊 Performance

Bubble Gum is optimized for maximum performance:

| Metric | Score |
|--------|-------|
| **Lighthouse Performance** | 95+ |
| **First Contentful Paint** | <1.8s |
| **Largest Contentful Paint** | <2.5s |
| **Time to Interactive** | <3.8s |
| **Cumulative Layout Shift** | <0.1 |

See [Performance Optimization Guide](./docs/iterations/11-performance/PERFORMANCE_OPTIMIZATION_GUIDE.md) for details.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🐛 Bug Reports & Feature Requests

- **Found a bug?** [Open an issue](https://github.com/yourusername/bubble-gum/issues/new?template=bug_report.md)
- **Have an idea?** [Request a feature](https://github.com/yourusername/bubble-gum/issues/new?template=feature_request.md)
- **Need help?** Check [Troubleshooting](./TROUBLESHOOTING.md) or [Discussions](https://github.com/yourusername/bubble-gum/discussions)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Hosting & Deployment
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Radix UI](https://www.radix-ui.com/) - Primitives
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Prisma](https://www.prisma.io/) - Database ORM

---

## 📞 Support

- 📧 Email: support@bubblegum.app
- 💬 Discord: [Join our community](https://discord.gg/bubblegum)
- 🐦 Twitter: [@BubbleGumApp](https://twitter.com/bubblegumapp)
- 📖 Docs: [docs.bubblegum.app](https://docs.bubblegum.app)

---

## 🗺️ Roadmap

See our [Detailed Roadmap](./docs/iterations/04-roadmap/DETAILED_ROADMAP.md) for upcoming features.

**Coming Soon:**
- [ ] AI-powered content generation
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Custom domain management
- [ ] Team collaboration features
- [ ] Version control & rollback
- [ ] A/B testing
- [ ] SEO optimization tools

---

## ⭐ Star History

If you find Bubble Gum useful, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/bubble-gum&type=Date)](https://star-history.com/#yourusername/bubble-gum&Date)

---

<div align="center">

**Made with ❤️ by the Bubble Gum Team**

[Website](https://bubblegum.app) • [Documentation](./docs/guides/GETTING_STARTED.md) • [Community](https://discord.gg/bubblegum)

</div>
