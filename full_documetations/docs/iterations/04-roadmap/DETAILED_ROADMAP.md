# 🗓️ BUBBLE GUM - DETAILED ROADMAP (20 WEEKS)

**Planning Period:** Week 1 - Week 20 (5 months)  
**Scope:** MVP Development (Phases 0-1)  
**Target Launch:** End of Week 20  
**Generated:** November 1, 2025

---

## 📋 TABLE OF CONTENTS

1. [Executive Overview](#executive-overview)
2. [Timeline Visualization](#timeline-visualization)
3. [Week-by-Week Breakdown](#week-by-week-breakdown)
4. [Sprint Planning](#sprint-planning)
5. [Dependencies Map](#dependencies-map)
6. [Milestones & Gates](#milestones--gates)
7. [Team Allocation](#team-allocation)
8. [Risk Assessment](#risk-assessment)
9. [Critical Path Analysis](#critical-path-analysis)
10. [Success Metrics](#success-metrics)

---

## 📊 EXECUTIVE OVERVIEW

### The 20-Week Journey

**Start Date:** Week 1 (Month 1)  
**End Date:** Week 20 (Month 5)  
**Total Sprints:** 10 (2-week iterations)  
**Total Tasks:** 52 cards from Trello Board  
**Total Story Points:** 343 SP  
**Team Size:** 11 people (Year 1)

### Phases Covered

| Phase | Weeks | Sprints | Tasks | Story Points | Status |
|-------|-------|---------|-------|--------------|--------|
| **Phase 0: Foundation** | 1-4 | 1-2 | 11 | 52 SP | Foundation |
| **Phase 1: Core MVP** | 5-20 | 3-10 | 15 | 118 SP | MVP Features |
| **Phase 2-5: Backlog** | 21+ | 11+ | 26 | 173 SP | Post-MVP |

### Key Milestones

- ✅ **Week 2:** Database + Auth working
- ✅ **Week 4:** Frontend foundation ready
- ✅ **Week 8:** Canvas with drag-drop functional
- ✅ **Week 12:** 20 components + properties panel
- ✅ **Week 16:** AI page generation working
- 🚀 **Week 20:** MVP Launch Ready

---

## 📅 TIMELINE VISUALIZATION

```
PHASE 0: FOUNDATION (Weeks 1-4)
├── Sprint 1 (W1-W2): Project Setup + Database + Auth
│   ├── W1: Project init, Database, Auth setup
│   └── W2: Frontend, API, State management
├── Sprint 2 (W3-W4): Infrastructure + AI + Components
│   ├── W3: Storage, Cache, AI integration
│   └── W4: Component library foundation

PHASE 1: CORE MVP (Weeks 5-20)
├── Sprint 3 (W5-W6): Dashboard + Canvas Foundation
│   ├── W5: Dashboard UI, Create Project
│   └── W6: Canvas drag-drop system
├── Sprint 4 (W7-W8): Component System
│   ├── W7: Component rendering, Properties panel
│   └── W8: First 20 components
├── Sprint 5 (W9-W10): Undo/Redo + Auto-save + AI Chat
│   ├── W9: Undo/redo, Auto-save, Page management
│   └── W10: AI chat interface
├── Sprint 6 (W11-W12): AI Generation + Responsive
│   ├── W11: AI page generation (MVP)
│   └── W12: Responsive controls, Image library
├── Sprint 7 (W13-W14): Polish + Preview + SEO
│   ├── W13: Site preview mode
│   └── W14: Basic SEO settings
├── Sprint 8-10 (W15-W20): Reserved for delays + polish
    └── Buffer for critical path delays
```

---

## 🗓️ WEEK-BY-WEEK BREAKDOWN

### **SPRINT 1: Foundation (Weeks 1-2)**

---

#### **WEEK 1: Project Initialization + Core Infrastructure**

**Theme:** Get the technical foundation running  
**Focus:** Repository, Database, Authentication  
**Team:** Full team (11 people)  
**Story Points:** 18 SP

**Tasks:**

1. **P0.1: Project Initialization & Setup [3 SP]**
   - **Assignee:** CTO + DevOps Engineer
   - **Duration:** 2-3 days
   - **Deliverables:**
     - GitHub repository with monorepo structure
     - TypeScript configured (strict mode)
     - ESLint + Prettier + Husky
     - Basic CI/CD pipeline (GitHub Actions)
   - **Blockers:** None (first task)
   - **Success Criteria:** Team can clone repo and run locally

2. **P0.2: Database Setup (PostgreSQL + Prisma) [5 SP]**
   - **Assignee:** Backend Developer
   - **Duration:** 3-4 days
   - **Dependencies:** P0.1 (project initialized)
   - **Deliverables:**
     - PostgreSQL on Railway
     - Prisma schema (Users, Organizations, Projects)
     - Initial migration + seed data
     - Database connection tested
   - **Blockers:** Railway account setup
   - **Success Criteria:** Can query database from API

3. **P0.3: Authentication System (Clerk) [5 SP]**
   - **Assignee:** Full-stack Developer
   - **Duration:** 3-4 days
   - **Dependencies:** P0.2 (database ready)
   - **Deliverables:**
     - Clerk integration (email + OAuth)
     - Sign up / Sign in flows
     - Protected routes
     - User sync to PostgreSQL via webhook
   - **Blockers:** Clerk account approval
   - **Success Criteria:** User can sign up and access dashboard

**End-of-Week 1 Checkpoint:**
- ✅ Repository running for all team members
- ✅ Database accessible with test data
- ✅ Authentication working (can create accounts)

---

#### **WEEK 2: Frontend + API + State Management**

**Theme:** Build the application skeleton  
**Focus:** React app, API layer, State management  
**Team:** Frontend team (4 people), Backend team (3 people)  
**Story Points:** 13 SP

**Tasks:**

4. **P0.4: Frontend Foundation (React + Vite + Tailwind) [5 SP]**
   - **Assignee:** Frontend Developers (2 people)
   - **Duration:** 3-4 days
   - **Dependencies:** P0.1 (monorepo ready)
   - **Deliverables:**
     - Vite + React 18 running
     - Tailwind CSS configured
     - React Router with basic routes
     - Layout components (Header, Sidebar)
     - shadcn/ui installed
   - **Blockers:** None
   - **Success Criteria:** Can navigate between pages with styled layout

5. **P0.5: API Layer Setup (Fastify + tRPC) [5 SP]**
   - **Assignee:** Backend Developer
   - **Duration:** 3-4 days
   - **Dependencies:** P0.2 (database), P0.4 (frontend)
   - **Deliverables:**
     - Fastify server running
     - tRPC router configured
     - Health check endpoint
     - Basic CRUD for users
     - Frontend can call API with type safety
   - **Blockers:** None
   - **Success Criteria:** Frontend fetches user data from API

6. **P0.6: State Management (Zustand + React Query) [3 SP]**
   - **Assignee:** Frontend Developer
   - **Duration:** 2 days
   - **Dependencies:** P0.4 (frontend), P0.5 (API)
   - **Deliverables:**
     - Zustand store configured
     - React Query for API calls
     - User state management
     - Loading/error states
   - **Blockers:** None
   - **Success Criteria:** Can fetch, cache, and update user data

**End-of-Week 2 Checkpoint:**
- ✅ Frontend app running with navigation
- ✅ API serving data with type safety
- ✅ State management working
- 🎯 **MILESTONE:** Foundation Complete (Phase 0 - 30%)

---

### **SPRINT 2: Infrastructure + AI (Weeks 3-4)**

---

#### **WEEK 3: Storage + Cache + AI Provider**

**Theme:** Set up external services  
**Focus:** File storage, caching, AI integration  
**Team:** Backend team (3 people), AI Engineer  
**Story Points:** 13 SP

**Tasks:**

7. **P0.7: Storage Setup (Cloudflare R2) [5 SP]**
   - **Assignee:** Backend Developer + DevOps
   - **Duration:** 3 days
   - **Dependencies:** P0.5 (API ready)
   - **Deliverables:**
     - Cloudflare R2 bucket configured
     - Upload endpoint (/api/upload)
     - Signed URLs for secure access
     - Image optimization (resize, WebP)
   - **Blockers:** Cloudflare account setup
   - **Success Criteria:** Can upload image and get back URL

8. **P0.8: Cache Layer (Redis/Upstash) [3 SP]**
   - **Assignee:** Backend Developer
   - **Duration:** 2 days
   - **Dependencies:** P0.5 (API ready)
   - **Deliverables:**
     - Upstash Redis instance
     - Cache wrapper functions
     - Session storage
     - Rate limiting (basic)
   - **Blockers:** None
   - **Success Criteria:** API responses cached properly

9. **P0.9: AI Provider Integration (Claude) [5 SP]**
   - **Assignee:** AI/ML Engineer
   - **Duration:** 3-4 days
   - **Dependencies:** P0.5 (API ready)
   - **Deliverables:**
     - Anthropic API key configured
     - AI service wrapper (TypeScript)
     - Basic prompt templates
     - Error handling + retries
     - Cost tracking
   - **Blockers:** Anthropic API access
   - **Success Criteria:** Can send prompt and get response

**End-of-Week 3 Checkpoint:**
- ✅ Files can be uploaded to R2
- ✅ Caching working (faster responses)
- ✅ AI API responding to prompts

---

#### **WEEK 4: Component Library Foundation**

**Theme:** UI component library  
**Focus:** shadcn/ui components, design system  
**Team:** Frontend team (4 people), Designer  
**Story Points:** 8 SP

**Tasks:**

10. **P0.10: Component Library Foundation [8 SP]**
    - **Assignee:** Frontend Developers (2 people) + Designer
    - **Duration:** 4-5 days
    - **Dependencies:** P0.4 (frontend ready)
    - **Deliverables:**
      - shadcn/ui components installed
      - Button, Input, Card, Dialog, Dropdown
      - Toast, Tooltip, Badge, Avatar
      - Select, Checkbox, Switch, Tabs
      - Theme configured (Bubble Gum colors)
      - Component documentation (Storybook optional)
    - **Blockers:** None
    - **Success Criteria:** All components render correctly

**End-of-Week 4 Checkpoint:**
- ✅ UI component library ready
- ✅ Design system documented
- 🎯 **MILESTONE:** Phase 0 Complete (Foundation 100%)

---

### **SPRINT 3: Dashboard + Canvas (Weeks 5-6)**

---

#### **WEEK 5: Dashboard UI + Create Project Flow**

**Theme:** User can create projects  
**Focus:** Dashboard, Project CRUD  
**Team:** Full-stack team (5 people)  
**Story Points:** 10 SP

**Tasks:**

11. **P1.1: Dashboard UI (Projects List) [5 SP]**
    - **Assignee:** Frontend Developers (2 people)
    - **Duration:** 3 days
    - **Dependencies:** P0.10 (component library)
    - **Deliverables:**
      - Dashboard page (/dashboard)
      - ProjectCard component
      - Grid and list views
      - Search and filter
      - "Create Project" button
    - **Blockers:** None
    - **Success Criteria:** User sees list of projects

12. **P1.2: Create Project Flow [5 SP]**
    - **Assignee:** Full-stack Developer
    - **Duration:** 3 days
    - **Dependencies:** P1.1 (dashboard ready)
    - **Deliverables:**
      - CreateProjectModal component
      - Form (name, description, template)
      - Template cards (Blank, E-commerce, Blog)
      - API endpoint (POST /api/projects)
      - Redirects to canvas after creation
    - **Blockers:** None
    - **Success Criteria:** Can create project and open canvas

**End-of-Week 5 Checkpoint:**
- ✅ Dashboard showing projects
- ✅ Can create new project

---

#### **WEEK 6: Canvas Foundation (Drag & Drop)**

**Theme:** Core canvas functionality  
**Focus:** Drag-drop, component tree  
**Team:** Frontend team (4 people)  
**Story Points:** 13 SP

**Tasks:**

13. **P1.3: Canvas Foundation (Drag & Drop) [13 SP]** ⚠️ LARGE TASK
    - **Assignee:** Senior Frontend Developer (lead) + 2 Frontend Devs
    - **Duration:** 5-6 days (full week)
    - **Dependencies:** P1.2 (project created)
    - **Deliverables:**
      - Canvas page (/project/:id/canvas)
      - Component palette (left sidebar)
      - Drag-and-drop with react-dnd
      - Drop zone highlighting
      - Component selection (click)
      - Component tree visualization
      - Move, resize, delete components
    - **Blockers:** None (but complex!)
    - **Success Criteria:** Can drag Button from palette and drop on canvas

**End-of-Week 6 Checkpoint:**
- ✅ Canvas with drag-drop working
- 🎯 **MILESTONE:** Canvas MVP (Phase 1 - 20%)

---

### **SPRINT 4: Component System (Weeks 7-8)**

---

#### **WEEK 7: Rendering System + Properties Panel**

**Theme:** Component architecture  
**Focus:** Render engine, props editing  
**Team:** Frontend team (4 people)  
**Story Points:** 16 SP

**Tasks:**

14. **P1.4: Component Rendering System [8 SP]**
    - **Assignee:** Senior Frontend Developer
    - **Duration:** 4 days
    - **Dependencies:** P1.3 (canvas ready)
    - **Deliverables:**
      - Component schema (JSON structure)
      - Component registry (type → React component)
      - Recursive renderer
      - Basic components (Button, Text, Image, Container)
      - Props mapping
      - Support for nested children
    - **Blockers:** None
    - **Success Criteria:** Components render from JSON schema

15. **P1.5: Properties Panel [8 SP]**
    - **Assignee:** Frontend Developer
    - **Duration:** 4 days
    - **Dependencies:** P1.4 (rendering working)
    - **Deliverables:**
      - PropertiesPanel component (right sidebar)
      - Shows when component selected
      - Text, color, number, select inputs
      - Real-time updates (debounced)
      - Layout controls (margin, padding)
      - Typography, border, shadow controls
    - **Blockers:** None
    - **Success Criteria:** Can edit component props and see changes

**End-of-Week 7 Checkpoint:**
- ✅ Components render from data
- ✅ Properties panel edits components

---

#### **WEEK 8: First 20 Components**

**Theme:** Build component library  
**Focus:** Essential UI components  
**Team:** Full frontend team (4 people) + Designer  
**Story Points:** 13 SP

**Tasks:**

16. **P1.6: Component Library (First 20 Components) [13 SP]** ⚠️ LARGE TASK
    - **Assignee:** All Frontend Developers (parallel work)
    - **Duration:** 5 days
    - **Dependencies:** P1.4 (renderer ready)
    - **Deliverables:**
      - Button, Heading, Text, Image
      - Container, Section, Hero, CTA
      - Card, Grid, Column, Spacer
      - Divider, Icon, Link
      - Form, Input, Textarea, Checkbox, Submit Button
      - Each with configurable props
      - Responsive behavior
      - Accessibility tested
    - **Blockers:** None (but time-intensive)
    - **Success Criteria:** All 20 components work on canvas

**End-of-Week 8 Checkpoint:**
- ✅ 20 components available in palette
- 🎯 **MILESTONE:** Component Library (Phase 1 - 40%)

---

### **SPRINT 5: Undo/Redo + Auto-Save + AI (Weeks 9-10)**

---

#### **WEEK 9: Undo/Redo + Auto-Save + Page Management**

**Theme:** User experience improvements  
**Focus:** History, persistence, multi-page  
**Team:** Frontend team (3 people)  
**Story Points:** 15 SP

**Tasks:**

17. **P1.7: Undo/Redo System [5 SP]**
    - **Assignee:** Frontend Developer
    - **Duration:** 2-3 days
    - **Dependencies:** P1.4 (rendering system)
    - **Deliverables:**
      - History in Zustand store
      - Undo/redo actions
      - Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
      - Undo/redo buttons in toolbar
      - History limit (50 steps)
    - **Blockers:** None
    - **Success Criteria:** Can undo/redo all canvas operations

18. **P1.8: Auto-Save & Version History [5 SP]**
    - **Assignee:** Full-stack Developer
    - **Duration:** 3 days
    - **Dependencies:** P1.7 (undo/redo)
    - **Deliverables:**
      - Auto-save every 10 seconds
      - Debounced save to avoid excessive writes
      - Version history table in database
      - "Last saved" indicator
      - Manual save button
    - **Blockers:** None
    - **Success Criteria:** Changes auto-save, can restore versions

19. **P1.10: Page Management [5 SP]**
    - **Assignee:** Full-stack Developer
    - **Duration:** 3 days
    - **Dependencies:** P1.2 (project structure)
    - **Deliverables:**
      - Pages sidebar (left)
      - Add, delete, rename pages
      - Page navigation
      - Duplicate page
      - Homepage (default page)
    - **Blockers:** None
    - **Success Criteria:** Can create multi-page sites

**End-of-Week 9 Checkpoint:**
- ✅ Undo/redo working
- ✅ Auto-save active
- ✅ Multi-page support

---

#### **WEEK 10: AI Chat Interface**

**Theme:** AI assistant  
**Focus:** Chat UI, prompt handling  
**Team:** Frontend Dev + AI Engineer  
**Story Points:** 8 SP

**Tasks:**

20. **P1.9: AI Chat Interface (Basic) [8 SP]**
    - **Assignee:** Frontend Developer + AI Engineer
    - **Duration:** 4 days
    - **Dependencies:** P0.9 (AI provider integrated)
    - **Deliverables:**
      - Chat sidebar (right, collapsible)
      - Message input + history
      - Streaming responses (SSE)
      - Basic prompts: "Add a hero section", "Change color"
      - Loading states
      - Error handling
    - **Blockers:** None
    - **Success Criteria:** User can chat with AI and get responses

**End-of-Week 10 Checkpoint:**
- ✅ AI chat responding to commands
- 🎯 **MILESTONE:** AI Integration (Phase 1 - 60%)

---

### **SPRINT 6: AI Generation + Responsive (Weeks 11-12)**

---

#### **WEEK 11: AI Page Generation (MVP)**

**Theme:** Full AI-powered site generation  
**Focus:** Form → JSON → Components  
**Team:** AI Engineer + Full-stack Dev  
**Story Points:** 13 SP

**Tasks:**

21. **P1.11: AI Page Generation (Form → Full Site) [13 SP]** ⚠️ LARGE TASK
    - **Assignee:** AI/ML Engineer (lead) + Full-stack Developer
    - **Duration:** 5-6 days
    - **Dependencies:** P1.6 (components), P0.9 (AI provider)
    - **Deliverables:**
      - Generate form (business type, colors, description)
      - Prompt engineering (structured output)
      - AI generates JSON schema
      - Converts JSON to component tree
      - Populates canvas with generated site
      - Multiple page generation
      - "Regenerate" button
    - **Blockers:** AI reliability (hallucinations)
    - **Success Criteria:** User fills form, AI creates full site

**End-of-Week 11 Checkpoint:**
- ✅ AI generates working sites from prompts
- 🎯 **MILESTONE:** AI Generation (Phase 1 - 70%)

---

#### **WEEK 12: Responsive + Image Library + Preview**

**Theme:** Polish and preview  
**Focus:** Mobile support, assets, preview mode  
**Team:** Frontend team (3 people)  
**Story Points:** 18 SP

**Tasks:**

22. **P1.12: Responsive Design Controls [8 SP]**
    - **Assignee:** Frontend Developer
    - **Duration:** 4 days
    - **Dependencies:** P1.5 (properties panel)
    - **Deliverables:**
      - Breakpoint switcher (desktop, tablet, mobile)
      - Responsive props (hide on mobile, etc.)
      - Preview at each breakpoint
      - Media query generation
    - **Blockers:** None
    - **Success Criteria:** Components adapt to different screen sizes

23. **P1.13: Image Library & Upload [5 SP]**
    - **Assignee:** Full-stack Developer
    - **Duration:** 3 days
    - **Dependencies:** P0.7 (R2 storage)
    - **Deliverables:**
      - Image library modal
      - Upload from computer
      - Unsplash integration (free images)
      - Image search
      - Insert image into canvas
    - **Blockers:** Unsplash API key
    - **Success Criteria:** User can upload and insert images

24. **P1.14: Site Preview Mode [5 SP]**
    - **Assignee:** Frontend Developer
    - **Duration:** 3 days
    - **Dependencies:** P1.4 (rendering)
    - **Deliverables:**
      - "Preview" button in toolbar
      - Full-screen preview (no editor UI)
      - Works on all pages
      - Exit preview → back to editor
    - **Blockers:** None
    - **Success Criteria:** Can preview site without editing UI

**End-of-Week 12 Checkpoint:**
- ✅ Responsive controls working
- ✅ Image library functional
- ✅ Preview mode works
- 🎯 **MILESTONE:** MVP Core Complete (Phase 1 - 80%)

---

### **SPRINT 7: SEO + Polish (Weeks 13-14)**

---

#### **WEEK 13: Site Preview & Testing**

**Theme:** Quality assurance  
**Focus:** Preview mode, testing  
**Team:** Frontend team + QA  
**Story Points:** 5 SP

**Tasks:**

25. **P1.14: Site Preview Mode [5 SP]** (continued from Week 12 if needed)
    - **Focus:** Polish and bug fixing
    - **Testing:** Cross-browser, mobile testing

**End-of-Week 13 Checkpoint:**
- ✅ Preview mode stable
- ✅ Major bugs fixed

---

#### **WEEK 14: SEO Settings + Final Polish**

**Theme:** SEO and final touches  
**Focus:** Metadata, launch prep  
**Team:** Full team  
**Story Points:** 5 SP

**Tasks:**

26. **P1.15: Basic SEO Settings [5 SP]**
    - **Assignee:** Full-stack Developer
    - **Duration:** 3 days
    - **Dependencies:** P1.10 (pages)
    - **Deliverables:**
      - SEO settings page
      - Page title, description
      - Open Graph tags
      - Favicon upload
      - Meta tags in published HTML
    - **Blockers:** None
    - **Success Criteria:** Published sites have proper SEO tags

**End-of-Week 14 Checkpoint:**
- ✅ SEO settings working
- 🎯 **MILESTONE:** Phase 1 Complete (90%)

---

### **SPRINTS 8-10: Buffer + Launch Prep (Weeks 15-20)**

---

#### **WEEKS 15-18: Buffer for Delays + Bug Fixing**

**Theme:** Catch-up and polish  
**Focus:** Fix critical path delays, bugs  
**Team:** Full team  
**Story Points:** Reserved

**Activities:**
- Fix any tasks that slipped from previous sprints
- Address critical bugs from testing
- Performance optimization
- Security audit
- Documentation updates
- User testing (internal)

**Checkpoint (Week 18):**
- ✅ All Phase 1 tasks complete
- ✅ Major bugs resolved
- 🎯 **MILESTONE:** Feature Complete

---

#### **WEEKS 19-20: Launch Preparation**

**Theme:** Go live!  
**Focus:** Production deployment, monitoring  
**Team:** Full team + DevOps  
**Story Points:** 0 (operational)

**Activities:**

**Week 19: Pre-Launch**
- Production environment setup
- Final security review
- Performance testing (load, stress)
- Monitoring setup (Sentry, Better Uptime)
- Analytics integration (PostHog)
- Create launch materials (blog post, video)
- Beta tester recruitment

**Week 20: Launch Week**
- Deploy to production
- Domain configuration
- SSL certificates
- Product Hunt launch
- Social media announcement
- Monitor for issues
- Gather initial feedback

**End-of-Week 20:**
- 🚀 **MILESTONE:** MVP LAUNCHED!
- 🎯 **GOAL:** First 100 users signed up

---

## 📊 SPRINT PLANNING

### Sprint Overview Table

| Sprint | Weeks | Theme | Tasks | Story Points | Key Deliverables |
|--------|-------|-------|-------|--------------|------------------|
| **1** | 1-2 | Foundation | 6 | 31 SP | Repo, DB, Auth, Frontend, API |
| **2** | 3-4 | Infrastructure | 5 | 21 SP | Storage, Cache, AI, Components |
| **3** | 5-6 | Dashboard + Canvas | 3 | 23 SP | Dashboard, Projects, Drag-drop |
| **4** | 7-8 | Components | 3 | 29 SP | Rendering, Properties, 20 components |
| **5** | 9-10 | UX + AI | 4 | 23 SP | Undo/redo, Auto-save, Pages, AI chat |
| **6** | 11-12 | AI + Polish | 4 | 31 SP | AI generation, Responsive, Images |
| **7** | 13-14 | SEO + Preview | 2 | 10 SP | Preview mode, SEO settings |
| **8-10** | 15-20 | Buffer + Launch | N/A | N/A | Bug fixes, Launch prep |

### Sprint Velocity

**Planned Velocity:** ~25 SP per 2-week sprint  
**Total Planned:** 168 SP (over 7 productive sprints)  
**Buffer:** 3 sprints (6 weeks) for delays

**Risk Mitigation:**
- If team delivers 80% velocity → Still completes by Week 18
- If critical path blocked → Buffer weeks absorb delays
- If scope creep → Defer to post-MVP backlog

---

## 🔗 DEPENDENCIES MAP

### Critical Path (Cannot be parallelized)

```
P0.1 (Init)
  ↓
P0.2 (Database)
  ↓
P0.3 (Auth) → P0.5 (API)
  ↓              ↓
P0.4 (Frontend) ←┘
  ↓
P0.6 (State)
  ↓
P1.1 (Dashboard) → P1.2 (Create Project)
  ↓
P1.3 (Canvas) ⚠️ CRITICAL
  ↓
P1.4 (Rendering)
  ↓
P1.5 (Properties) + P1.6 (20 Components) ⚠️ PARALLEL
  ↓
P1.9 (AI Chat) + P1.11 (AI Generation) ⚠️ AI PATH
  ↓
P1.14 (Preview) → P1.15 (SEO)
  ↓
🚀 LAUNCH
```

### Can Work in Parallel

**Week 3:**
- P0.7 (Storage) + P0.8 (Cache) + P0.9 (AI) → All parallel

**Week 8:**
- P1.6 (Components) → Split across 4 developers

**Week 12:**
- P1.12 (Responsive) + P1.13 (Images) + P1.14 (Preview) → Parallel

### Blocking Dependencies

⚠️ **High Risk Tasks** (block many others):
- P1.3: Canvas Foundation → Blocks all subsequent UI work
- P1.4: Rendering System → Blocks components, properties
- P0.9: AI Integration → Blocks AI chat, AI generation

🔒 **Must Complete First:**
- Phase 0 (all tasks) → Required for Phase 1 to start
- P1.3 + P1.4 → Required for any canvas functionality

---

## 🎯 MILESTONES & GATES

### Phase Gates (Go/No-Go Decisions)

**Gate 1: Foundation Complete (Week 4)**
- ✅ Team can run the app locally
- ✅ Database + Auth working
- ✅ Frontend + API communicating
- **Decision:** Proceed to Phase 1 or fix foundational issues

**Gate 2: Canvas Working (Week 6)**
- ✅ Drag-drop functional
- ✅ Components can be placed on canvas
- ✅ Component tree shows structure
- **Decision:** Proceed to component system or refactor canvas

**Gate 3: Component System Ready (Week 8)**
- ✅ 20 components available
- ✅ Properties panel edits components
- ✅ Rendering from JSON schema works
- **Decision:** Proceed to AI features or expand component library

**Gate 4: AI Integration Working (Week 11)**
- ✅ AI generates full sites from prompts
- ✅ Generated sites render correctly
- ✅ Quality acceptable (70%+ usable without edits)
- **Decision:** Proceed to polish or improve AI quality

**Gate 5: MVP Feature Complete (Week 14)**
- ✅ All Phase 1 tasks complete
- ✅ SEO settings working
- ✅ Preview mode functional
- **Decision:** Proceed to launch or add missing features

### Key Milestones

| Week | Milestone | Description | Success Metric |
|------|-----------|-------------|----------------|
| **2** | Foundation | Core infrastructure ready | Auth + DB + API working |
| **4** | Phase 0 Done | All foundational tasks complete | Team can build features |
| **6** | Canvas MVP | Drag-drop working | Can place components |
| **8** | Components | 20 components available | Full component library |
| **11** | AI Generation | AI creates sites | User gets working site |
| **14** | Feature Complete | All MVP features done | Ready for testing |
| **18** | Code Freeze | No new features | Bug fixes only |
| **20** | 🚀 Launch | MVP live in production | First 100 users |

---

## 👥 TEAM ALLOCATION

### Team Composition (Year 1)

**Total Headcount:** 11 people

**Engineering (8 people):**
- 1 CTO/Tech Lead
- 2 Full-stack Developers
- 1 Frontend Developer (UI specialist)
- 1 Backend Developer (API specialist)
- 1 AI/ML Engineer
- 1 DevOps Engineer
- 1 Product Designer

**Non-Engineering (3 people):**
- 1 CEO/Founder (product decisions)
- 1 Marketing Manager (content, launch prep)
- 1 Customer Success (user testing, feedback)

### Weekly Team Allocation

**Weeks 1-4 (Phase 0):**
- Backend: 3 people (Database, API, Infrastructure)
- Frontend: 3 people (React, Components, UI)
- DevOps: 1 person (Deployment, CI/CD)
- AI: 1 person (Provider integration)
- Design: 1 person (Design system, mockups)

**Weeks 5-8 (Canvas + Components):**
- Frontend: 4 people (Canvas is complex!)
- Backend: 2 people (API support)
- AI: 1 person (Prepare for AI features)
- DevOps: 1 person (Performance, monitoring)

**Weeks 9-12 (AI Features):**
- AI: 2 people (AI generation is critical)
- Frontend: 3 people (Chat UI, Responsive)
- Backend: 2 people (API, Storage)

**Weeks 13-20 (Polish + Launch):**
- Full team: Testing, bug fixing, launch prep
- Marketing: Ramp up (launch materials)
- Customer Success: Beta testers

### Skill Requirements

**Must Have:**
- TypeScript (all engineers)
- React 18 (frontend team)
- Node.js / Fastify (backend team)
- PostgreSQL / Prisma (database team)
- LLM experience (AI engineer)

**Nice to Have:**
- Experience with Webflow/Framer (product inspiration)
- AI prompt engineering
- SaaS product experience
- Drag-drop libraries (react-dnd)

---

## ⚠️ RISK ASSESSMENT

### Top 10 Risks (Ranked by Impact × Probability)

**1. Canvas Drag-Drop Complexity [HIGH RISK]**
- **Impact:** 🔴 Critical (blocks all UI work)
- **Probability:** 70% (complex feature)
- **Mitigation:**
  - Allocate senior developer
  - Use proven library (react-dnd)
  - Build prototype first (Week 5)
  - Budget extra time (13 SP → realistic)
- **Contingency:** Simplify to click-to-add (no drag-drop)

**2. AI Generation Quality [HIGH RISK]**
- **Impact:** 🔴 Critical (core value prop)
- **Probability:** 60% (AI is unpredictable)
- **Mitigation:**
  - Extensive prompt engineering
  - Use Claude Sonnet 4 (best model)
  - Fallback to templates
  - User can edit after generation
- **Contingency:** Start with templates + AI enhancement

**3. Scope Creep [MEDIUM RISK]**
- **Impact:** 🟠 High (delays launch)
- **Probability:** 50% (typical for startups)
- **Mitigation:**
  - Strict Phase 1 scope (MVP only)
  - Defer nice-to-haves to Phase 2
  - Weekly scope review
  - Product manager enforces priorities
- **Contingency:** Cut features to hit Week 20 launch

**4. Team Velocity Lower Than Expected [MEDIUM RISK]**
- **Impact:** 🟠 High (delays milestones)
- **Probability:** 40% (realistic for new team)
- **Mitigation:**
  - 6-week buffer (Weeks 15-20)
  - Plan for 80% velocity
  - Track velocity after Sprint 1
  - Adjust plan by Week 4
- **Contingency:** Reduce scope or extend timeline

**5. Key Person Risk (CTO/AI Engineer) [MEDIUM RISK]**
- **Impact:** 🟠 High (critical roles)
- **Probability:** 20% (illness, departure)
- **Mitigation:**
  - Knowledge sharing (documentation)
  - Pair programming
  - Cross-training
  - Code reviews
- **Contingency:** Hire contractor temporarily

**6. Third-Party API Issues [MEDIUM RISK]**
- **Impact:** 🟡 Medium (workarounds exist)
- **Probability:** 30% (dependencies)
- **Services at Risk:**
  - Anthropic API (AI)
  - Clerk (auth)
  - Cloudflare R2 (storage)
  - Railway (database)
- **Mitigation:**
  - Use stable, proven services
  - Build fallbacks (OpenAI for AI)
  - Monitor uptime
- **Contingency:** Switch providers if needed

**7. Performance Issues [LOW RISK]**
- **Impact:** 🟡 Medium (affects UX)
- **Probability:** 30% (canvas can be slow)
- **Mitigation:**
  - Optimize rendering (React.memo)
  - Lazy loading
  - Debounce auto-save
  - Performance testing (Week 16)
- **Contingency:** Add loading states, simplify animations

**8. Security Vulnerabilities [LOW RISK]**
- **Impact:** 🔴 Critical (if exploited)
- **Probability:** 15% (new codebase)
- **Mitigation:**
  - Use Clerk (no manual auth)
  - Security audit (Week 16)
  - Input validation
  - HTTPS everywhere
- **Contingency:** Patch quickly, bug bounty program

**9. Browser Compatibility [LOW RISK]**
- **Impact:** 🟡 Medium (limits users)
- **Probability:** 20% (modern web)
- **Mitigation:**
  - Target modern browsers only (Chrome, Safari, Firefox)
  - Use polyfills where needed
  - Test on all browsers (Week 17)
- **Contingency:** Drop support for old browsers

**10. Funding Runs Out [LOW RISK]**
- **Impact:** 🔴 Critical (company dies)
- **Probability:** 10% (seed round in place)
- **Mitigation:**
  - $2M seed provides 22-month runway
  - MVP launch by Month 5
  - Start fundraising by Month 12
- **Contingency:** Cut team size, extend timeline

### Risk Heat Map

```
        HIGH IMPACT
            |
   [1]      |      [2]
   Canvas   |   AI Quality
            |
   [3]      |      [8]
   Scope    |   Security
   Creep    |
------------|------------
            |
   [7]      |      [4]
   Perf     |   Velocity
            |
            |
        LOW IMPACT
```

---

## 🛤️ CRITICAL PATH ANALYSIS

### Longest Path (Cannot Be Shortened)

**Total Duration:** 12 weeks (minimum)  
**With Buffer:** 20 weeks (includes 8 weeks buffer)

**Critical Path Tasks:**

1. **Week 1:** P0.1 → P0.2 → P0.3 (Foundation)
2. **Week 2:** P0.4 → P0.5 → P0.6 (App skeleton)
3. **Week 5:** P1.1 → P1.2 (Dashboard + Create)
4. **Week 6:** P1.3 (Canvas) ⚠️ BOTTLENECK (5-6 days)
5. **Week 7:** P1.4 → P1.5 (Rendering + Properties)
6. **Week 8:** P1.6 (20 Components) ⚠️ BOTTLENECK
7. **Week 10:** P1.9 (AI Chat)
8. **Week 11:** P1.11 (AI Generation) ⚠️ BOTTLENECK
9. **Week 13-14:** P1.14 → P1.15 (Preview + SEO)

**Total:** 9 weeks of critical path work  
**Buffer:** 11 weeks of parallel work + buffer

### Bottlenecks (Slow Down Project)

**1. P1.3: Canvas Foundation (Week 6) - 13 SP**
- Most complex single task
- Blocks all subsequent canvas work
- **Strategy:** Start early, allocate senior dev, prototype first

**2. P1.6: 20 Components (Week 8) - 13 SP**
- Time-intensive (many components)
- Requires design + dev + testing
- **Strategy:** Parallelize across 4 developers

**3. P1.11: AI Generation (Week 11) - 13 SP**
- Unpredictable (AI quality varies)
- Requires iteration and testing
- **Strategy:** Start prompt engineering in Week 9

### Acceleration Strategies

**To Finish Early:**
- Reduce buffer from 8 weeks → 4 weeks (finish Week 16)
- Parallelize more tasks (hire 2 more devs)
- Use pre-built libraries (reduce custom code)
- Simplify AI generation (use templates)

**To Recover from Delays:**
- Use buffer weeks (15-20)
- Cut non-critical features (defer to Phase 2)
- Hire contractors for specific tasks
- Reduce scope (launch with 10 components instead of 20)

---

## 📈 SUCCESS METRICS

### Weekly Metrics to Track

**Velocity (Story Points per Sprint):**
- Target: 25 SP per 2-week sprint
- Measure: Actual completed SP
- Alert: If < 20 SP, team is behind

**Burn-Down Chart:**
- Total remaining SP vs weeks
- Should trend toward zero by Week 14
- Flatten = trouble

**Task Completion Rate:**
- % of tasks finished on time
- Target: 80%+ on-time
- Alert: If < 70%, adjust plan

**Bug Count:**
- New bugs found per week
- Target: < 10 new bugs/week
- Alert: If > 20, quality issue

**Test Coverage:**
- Code coverage %
- Target: 70%+
- Alert: If < 50%, add tests

### Launch Readiness Metrics (Week 18-20)

**Pre-Launch Checklist:**
- [ ] All Phase 1 tasks complete (26 tasks)
- [ ] Security audit passed
- [ ] Performance targets met (Lighthouse 90+)
- [ ] Browser testing complete (Chrome, Safari, Firefox)
- [ ] Documentation updated
- [ ] Marketing materials ready
- [ ] Beta testers recruited (50 people)
- [ ] Production environment configured
- [ ] Monitoring tools active (Sentry, Uptime)
- [ ] Backup plan in place

**Launch Day Metrics:**
- Sign-ups in first 24 hours (Target: 100)
- Uptime % (Target: 99.9%)
- Error rate (Target: < 1%)
- User activation (Target: 50% create first project)

### Post-Launch Metrics (Week 21+)

**Product Metrics:**
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Projects created
- AI generations requested
- Sites published

**Business Metrics:**
- Free → Paid conversion (Target: 15%)
- Churn rate (Target: < 3.5% monthly)
- ARPU (Target: $35/month)
- CAC (Target: < $100)

---

## 🎯 CONCLUSION

### Summary

This 20-week roadmap provides a **realistic timeline** for building Bubble Gum MVP from zero to launch. Key takeaways:

✅ **Foundation First** (Weeks 1-4): Get the basics right  
✅ **Canvas is Critical** (Week 6): Allocate best resources  
✅ **Component Library** (Week 8): Essential for AI generation  
✅ **AI Quality** (Week 11): Core value proposition  
✅ **Buffer Weeks** (15-20): Absorb delays, polish, launch  

### Critical Success Factors

1. **Stick to Scope:** MVP only, defer Phase 2-5 to post-launch
2. **Manage Risks:** Address Canvas, AI quality, and velocity early
3. **Use Buffer Wisely:** Don't add features, use for polish and fixes
4. **Launch by Week 20:** Even if imperfect, get feedback early

### Next Steps

**Immediate Actions:**
1. ✅ Review roadmap with team
2. ✅ Assign owners to each task
3. ✅ Set up Sprint 1 (Weeks 1-2)
4. ✅ Begin P0.1 (Project Initialization)
5. ✅ Schedule weekly standups
6. ✅ Create Slack channels for coordination
7. ✅ Set up project management tool (Jira/Linear)

**Week 1 Goals:**
- ✅ Repository created and running
- ✅ Database accessible
- ✅ Authentication working
- ✅ Team aligned on roadmap

---

**Document Status:** ✅ Complete  
**Last Updated:** November 1, 2025  
**Next Review:** End of Sprint 1 (Week 2)  
**Owner:** CTO / Product Manager

---

*This roadmap is a living document. Update weekly based on actual progress. Adjust timeline and scope as needed, but always prioritize launching by Week 20.*

**Ready to build? Let's ship Bubble Gum! 🚀**