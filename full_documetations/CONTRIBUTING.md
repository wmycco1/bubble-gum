# 🤝 Contributing to Bubble Gum

Thank you for your interest in contributing to Bubble Gum! This document provides guidelines and instructions for contributing.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Pull Request Process](#pull-request-process)
6. [Commit Messages](#commit-messages)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Expected Behavior

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing private information
- Unprofessional conduct

---

## 💡 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** and description
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment** (OS, browser, Node version)

**Template:**
```markdown
**Bug Description:**
A clear description of what the bug is.

**To Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What you expected to happen.

**Screenshots:**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., macOS 13.0]
- Browser: [e.g., Chrome 120]
- Node: [e.g., 18.17.0]
```

### Suggesting Features

Feature suggestions are welcome! Include:

- **Clear title** and description
- **Use case** - Why is this needed?
- **Proposed solution**
- **Alternatives** considered
- **Additional context**

### Your First Contribution

Unsure where to start? Look for issues labeled:
- `good first issue` - Easy for newcomers
- `help wanted` - Extra attention needed
- `documentation` - Documentation improvements

---

## 🔧 Development Setup

### Fork & Clone

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/bubble-gum.git
cd bubble-gum

# Add upstream remote
git remote add upstream https://github.com/original/bubble-gum.git
```

### Install Dependencies

```bash
npm install
```

### Setup Environment

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Run Development Server

```bash
npm run dev
```

### Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

---

## 📝 Coding Standards

### TypeScript

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

async function getUser(id: string): Promise<User> {
  return await prisma.user.findUnique({ where: { id } });
}

// ❌ Bad
function getUser(id) {
  return prisma.user.findUnique({ where: { id } });
}
```

### React Components

```typescript
// ✅ Good - Functional component with TypeScript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

// ❌ Bad - No types
export function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `Button.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Tests: `*.test.ts` or `*.spec.ts`
- Types: `types.ts` or `*.types.ts`

### Code Style

We use **ESLint** and **Prettier**:

```bash
# Lint
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

**Key rules:**
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Max line length: 100 characters
- Use `const` over `let` when possible
- Avoid `any` type in TypeScript

---

## 🔀 Pull Request Process

### 1. Create a Branch

```bash
# Update your fork
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/my-awesome-feature
```

Branch naming:
- Feature: `feature/description`
- Bug fix: `fix/description`
- Docs: `docs/description`
- Refactor: `refactor/description`

### 2. Make Changes

- Write clean, documented code
- Add tests for new features
- Update documentation
- Follow coding standards

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Lint
npm run lint

# Type check
npm run type-check

# Build
npm run build
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add awesome feature"
```

See [Commit Messages](#commit-messages) for format.

### 5. Push to GitHub

```bash
git push origin feature/my-awesome-feature
```

### 6. Open Pull Request

- Go to your fork on GitHub
- Click "Compare & pull request"
- Fill in the PR template
- Link related issues
- Request review

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe testing approach

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Commented complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] Tests pass locally
```

### 7. Code Review

- Address reviewer feedback
- Push additional commits
- Squash commits if requested
- Wait for approval

### 8. Merge

Once approved, maintainers will merge your PR!

---

## 📝 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
# Feature
git commit -m "feat(editor): add drag and drop support"

# Bug fix
git commit -m "fix(auth): resolve login redirect issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api)!: change API response format

BREAKING CHANGE: API now returns data in v2 format"
```

---

## 🧪 Testing Guidelines

### Unit Tests

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Tests

```typescript
// page-creation.spec.ts
import { test, expect } from '@playwright/test';

test('create new page', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('text=Create New Page');
  
  await page.fill('input[name="title"]', 'Test Page');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/\/editor\/.+/);
});
```

---

## 📚 Documentation

### When to Update Docs

- Adding new features
- Changing existing behavior
- Fixing bugs that affect usage
- Adding configuration options

### Documentation Types

1. **Code Comments** - Explain complex logic
2. **README** - Project overview
3. **API Docs** - API reference
4. **Guides** - How-to articles
5. **Examples** - Code samples

---

## 🏆 Recognition

Contributors are recognized in:
- `CONTRIBUTORS.md` file
- Release notes
- Project README

---

## 💬 Questions?

- 💬 [Discord](https://discord.gg/bubblegum)
- 📧 [Email](mailto:dev@bubblegum.app)
- 🐛 [GitHub Issues](https://github.com/yourusername/bubble-gum/issues)

---

**Thank you for contributing to Bubble Gum! 🍬**
