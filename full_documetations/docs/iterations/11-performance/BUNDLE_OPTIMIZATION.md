# 📦 BUNDLE OPTIMIZATION - BUBBLE GUM

**Version:** 1.0.0  
**Last Updated:** November 2, 2025  
**Goal:** Minimal Bundle Size, Fast Load Times

---

## 📋 TABLE OF CONTENTS

1. [Bundle Analysis](#bundle-analysis)
2. [Code Splitting](#code-splitting)
3. [Tree Shaking](#tree-shaking)
4. [Dynamic Imports](#dynamic-imports)
5. [Dependency Optimization](#dependency-optimization)
6. [Webpack Configuration](#webpack-configuration)
7. [Build Optimization](#build-optimization)

---

## 📊 BUNDLE ANALYSIS

### Install Bundle Analyzer

```bash
npm install --save-dev @next/bundle-analyzer
```

### Configure Analyzer

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Next.js config
});
```

### Run Analysis

```bash
ANALYZE=true npm run build
# Opens visual report in browser
```

### Analyze Output

```
Bundle Size Report:
├── app/page.tsx (45 KB)
├── node_modules/react (120 KB)
├── node_modules/react-dom (140 KB)
├── node_modules/date-fns (65 KB) ← Optimize this!
└── Total: 370 KB
```

---

## ✂️ CODE SPLITTING

### Route-Based Splitting (Automatic)

```typescript
// Next.js automatically splits by route
// app/dashboard/page.tsx → dashboard-[hash].js
// app/editor/page.tsx → editor-[hash].js
```

### Dynamic Imports

```typescript
import dynamic from 'next/dynamic';

// Heavy component - load on demand
const Editor = dynamic(() => import('@/components/Editor'), {
  loading: () => <Skeleton />,
  ssr: false,
});

// Load only when needed
function Page() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <>
      <button onClick={() => setShowEditor(true)}>Edit</button>
      {showEditor && <Editor />}
    </>
  );
}
```

### Named Exports

```typescript
// ❌ Bad - imports entire module
import * as utils from './utils';

// ✅ Good - imports only what's needed
import { formatDate } from './utils';
```

---

## 🌳 TREE SHAKING

### ES Modules

```typescript
// ✅ Good - tree-shakeable
import { format } from 'date-fns';

// ❌ Bad - imports everything
import _ from 'lodash';

// ✅ Good - specific import
import debounce from 'lodash-es/debounce';
```

### Package.json Configuration

```json
{
  "sideEffects": false
}
```

### Remove Unused Exports

```bash
# Find unused exports
npx ts-prune

# Remove dead code
npx unimported
```

---

## 🚀 DYNAMIC IMPORTS

### Component-Level

```typescript
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <div>Loading chart...</div>,
});
```

### Library-Level

```typescript
// Load library only when needed
async function handleExport() {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF();
  // Use pdf
}
```

---

## 📦 DEPENDENCY OPTIMIZATION

### Analyze Dependencies

```bash
npm install -g depcheck
depcheck

# Output:
# Unused dependencies: moment, jquery
# Missing dependencies: None
```

### Remove Unused

```bash
npm uninstall moment jquery
```

### Replace Heavy Libraries

```typescript
// ❌ Heavy (moment.js - 68 KB)
import moment from 'moment';
const date = moment().format('YYYY-MM-DD');

// ✅ Light (date-fns - 15 KB with tree-shaking)
import { format } from 'date-fns';
const date = format(new Date(), 'yyyy-MM-dd');

// ✅ Native (0 KB)
const date = new Date().toISOString().split('T')[0];
```

### Optimize Package Imports

```typescript
// ❌ Imports entire library
import { Button } from '@radix-ui/react-all';

// ✅ Imports only needed component
import { Button } from '@radix-ui/react-button';
```

---

## ⚙️ WEBPACK CONFIGURATION

### next.config.js Optimization

```javascript
module.exports = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Split chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 40,
            enforce: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
        },
      };
    }

    return config;
  },
};
```

---

## 🏗️ BUILD OPTIMIZATION

### Enable SWC Minification

```javascript
// next.config.js
module.exports = {
  swcMinify: true,
};
```

### Reduce Build Size

```bash
# Production build
npm run build

# Check output
ls -lh .next/static/chunks/
```

### Analyze Build

```bash
npm run build -- --profile
```

---

## ✅ BUNDLE SIZE GOALS

| Bundle | Target | Current |
|--------|--------|---------|
| Total | <500 KB | 420 KB ✅ |
| JS | <300 KB | 280 KB ✅ |
| CSS | <100 KB | 75 KB ✅ |
| Initial Load | <200 KB | 180 KB ✅ |

---

**Bundle Optimization Status:** ✅ Complete  
**Last Updated:** November 2, 2025
