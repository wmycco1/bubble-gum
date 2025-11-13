# 🚨 Quick Recovery Guide

**Purpose:** Instant restoration commands for critical system states

---

## 🎯 Spacing System - V7.11 Hybrid

**When to use:** If margin/padding behavior breaks after changes

### Quick Restore:
```bash
# View available versions
git tag -l "v7.*"

# Restore V7.11 Hybrid Margin System (STABLE)
git checkout v7.11-hybrid-margin-stable

# Or cherry-pick to current branch
git cherry-pick 1b9a001

# Or hard reset (⚠️ DESTRUCTIVE - loses uncommitted changes)
git reset --hard v7.11-hybrid-margin-stable
```

### Verify After Restore:
- [ ] margin-right increases → Badge moves LEFT ✅
- [ ] margin-left increases → Badge moves RIGHT ✅
- [ ] margin-top increases → wrapper HEIGHT expands ✅
- [ ] margin-bottom increases → wrapper HEIGHT expands ✅

### Full Documentation:
See: `docs/SPACING_VERSIONS.md`

---

## 📝 Adding New Recovery Points

When you complete a critical feature:

```bash
# Create annotated tag
git tag -a vX.Y-feature-name-stable -m "Description of stable state"

# Push tag to remote
git push origin vX.Y-feature-name-stable

# Document in this file
```

---

## 🔍 Find Specific Commit

```bash
# Search commit messages
git log --grep="keyword" --oneline

# Search by date
git log --since="2025-11-01" --until="2025-11-13" --oneline

# Search by file
git log -- path/to/file.tsx
```

---

## ⚙️ Common Recovery Scenarios

### Dev Server Issues:
```bash
pkill -9 node && sleep 3 && rm -rf .next && npm run dev
```

### Database Reset:
```bash
npx prisma migrate reset
npx prisma db push
npx prisma db seed
```

### Node Modules Corruption:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Last Updated:** 2025-11-13
