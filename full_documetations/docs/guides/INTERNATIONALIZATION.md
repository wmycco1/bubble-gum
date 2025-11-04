# 🌍 Internationalization (i18n) - Bubble Gum

Multi-language support guide.

---

## 🎯 Supported Languages

- 🇺🇸 English (en)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇯🇵 Japanese (ja)

---

## 🔧 Setup

### Install next-intl

```bash
npm install next-intl
```

### Configuration

```typescript
// next.config.js
module.exports = {
  i18n: {
    locales: ['en', 'es', 'fr', 'de', 'ja'],
    defaultLocale: 'en',
  },
};
```

### Translation Files

```json
// messages/en.json
{
  "nav": {
    "home": "Home",
    "dashboard": "Dashboard",
    "editor": "Editor"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  }
}
```

---

## 💬 Usage

```typescript
import { useTranslations } from 'next-intl';

export function Navigation() {
  const t = useTranslations('nav');

  return (
    <nav>
      <a href="/">{t('home')}</a>
      <a href="/dashboard">{t('dashboard')}</a>
    </nav>
  );
}
```

---

## 📅 Date & Currency

```typescript
// Format date
const date = new Date();
const formatted = new Intl.DateTimeFormat(locale).format(date);

// Format currency
const price = 99.99;
const formatted = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: 'USD',
}).format(price);
```

---

**i18n Guide Complete! 🌍**
