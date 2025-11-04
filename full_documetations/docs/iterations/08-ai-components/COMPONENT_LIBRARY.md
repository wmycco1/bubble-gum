# 🧩 BUBBLE GUM - COMPONENT LIBRARY

**Generated:** November 1, 2025  
**Version:** 1.0.0  
**Total Components:** 50+ components  
**Framework:** React + Tailwind CSS

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Layout Components](#layout-components)
3. [Content Components](#content-components)
4. [Form Components](#form-components)
5. [Navigation Components](#navigation-components)
6. [E-commerce Components](#e-commerce-components)
7. [Blog Components](#blog-components)
8. [Utility Components](#utility-components)

---

## 🌐 OVERVIEW

The Bubble Gum Component Library provides 50+ pre-built, customizable components for building modern websites.

### Key Features

- ✅ **Responsive** - Mobile-first design
- ✅ **Accessible** - WCAG 2.1 AA compliant
- ✅ **Customizable** - Props for all styling
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Performant** - Optimized rendering

### Component Categories

| Category | Components | Purpose |
|----------|------------|---------|
| **Layout** | 10 | Page structure & containers |
| **Content** | 15 | Text, images, media |
| **Forms** | 8 | User input & validation |
| **Navigation** | 6 | Menus, links, breadcrumbs |
| **E-commerce** | 8 | Products, cart, checkout |
| **Blog** | 5 | Posts, comments, archives |
| **Utility** | 8 | Buttons, badges, alerts |

---

## 📐 LAYOUT COMPONENTS

### Container

**Purpose:** Constrains content width and centers it on the page.

**Props:**
```typescript
interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

**Usage:**
```typescript
<Container maxWidth="lg" padding="md">
  <h1>Welcome</h1>
</Container>
```

**Rendered:**
```html
<div class="mx-auto max-w-7xl px-4">
  <h1>Welcome</h1>
</div>
```

---

### Section

**Purpose:** Creates distinct page sections with consistent spacing.

**Props:**
```typescript
interface SectionProps {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
  children: React.ReactNode;
}
```

**Usage:**
```typescript
<Section 
  title="Our Services"
  subtitle="What we offer"
  padding="lg"
  backgroundColor="#f9fafb"
>
  <Grid columns={3}>
    {/* Service cards */}
  </Grid>
</Section>
```

---

### Grid

**Purpose:** Responsive grid layout for organizing content.

**Props:**
```typescript
interface GridProps {
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  children: React.ReactNode;
}
```

**Usage:**
```typescript
<Grid 
  columns={3}
  gap="lg"
  responsive={{
    mobile: 1,
    tablet: 2,
    desktop: 3
  }}
>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

---

### Flex

**Purpose:** Flexbox container for flexible layouts.

**Props:**
```typescript
interface FlexProps {
  direction?: 'row' | 'column';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

---

### Card

**Purpose:** Container for grouped content with optional elevation.

**Props:**
```typescript
interface CardProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Usage:**
```typescript
<Card variant="elevated" padding="lg" hoverable>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

---

## 📝 CONTENT COMPONENTS

### Hero

**Purpose:** Primary landing section with headline, description, and CTA.

**Props:**
```typescript
interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundOverlay?: string;
  align?: 'left' | 'center' | 'right';
  height?: 'sm' | 'md' | 'lg' | 'full';
  animation?: 'none' | 'fadeIn' | 'slideUp';
}
```

**Usage:**
```typescript
<Hero
  title="Build Your Dream Website"
  subtitle="No Code Required"
  description="Create stunning websites in minutes"
  ctaText="Start Free Trial"
  ctaLink="/signup"
  secondaryCtaText="Watch Demo"
  secondaryCtaLink="/demo"
  backgroundImage="/hero-bg.jpg"
  backgroundOverlay="rgba(0, 0, 0, 0.5)"
  align="center"
  height="full"
/>
```

**Responsive Behavior:**
- Mobile: Stack CTAs vertically, smaller text
- Tablet: Side-by-side CTAs, medium text
- Desktop: Full-width with large text

---

### Text

**Purpose:** Formatted text block with typography control.

**Props:**
```typescript
interface TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption';
  content: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  maxWidth?: string;
}
```

**Usage:**
```typescript
<Text 
  variant="h1"
  content="Welcome to Our Site"
  align="center"
  fontWeight="bold"
/>

<Text 
  variant="body"
  content="This is a paragraph of text..."
  maxWidth="prose"
/>
```

---

### Image

**Purpose:** Responsive image with lazy loading and optimization.

**Props:**
```typescript
interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
  rounded?: boolean;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
}
```

**Usage:**
```typescript
<Image
  src="/product.jpg"
  alt="Product photo"
  width={800}
  height={600}
  objectFit="cover"
  rounded
  loading="lazy"
/>
```

**Features:**
- Automatic WebP conversion
- Responsive srcset
- Lazy loading by default
- Blur-up placeholder

---

### Video

**Purpose:** Embedded video player (YouTube, Vimeo, or self-hosted).

**Props:**
```typescript
interface VideoProps {
  src: string;
  provider?: 'youtube' | 'vimeo' | 'self-hosted';
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1';
}
```

---

### Icon

**Purpose:** SVG icon display with size and color control.

**Props:**
```typescript
interface IconProps {
  name: string; // From icon library (Lucide)
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  strokeWidth?: number;
}
```

**Available Icons:**
- Navigation: Menu, X, ChevronDown, ArrowRight
- Actions: Check, Plus, Minus, Edit, Trash
- Social: Facebook, Twitter, Instagram, LinkedIn
- E-commerce: ShoppingCart, Heart, Package, CreditCard
- General: User, Mail, Phone, MapPin, Calendar

---

### Testimonial

**Purpose:** Customer testimonial with quote, author, and avatar.

**Props:**
```typescript
interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
  variant?: 'default' | 'featured' | 'compact';
}
```

**Usage:**
```typescript
<Testimonial
  quote="Bubble Gum made it so easy to build our website!"
  author="Jane Smith"
  role="CEO"
  company="TechCorp"
  avatar="/avatars/jane.jpg"
  rating={5}
  variant="featured"
/>
```

---

### Stats

**Purpose:** Display numerical statistics with labels and icons.

**Props:**
```typescript
interface StatsProps {
  stats: Array<{
    value: string | number;
    label: string;
    icon?: string;
    suffix?: string;
  }>;
  columns?: 2 | 3 | 4;
}
```

**Usage:**
```typescript
<Stats 
  stats={[
    { value: 10000, label: 'Happy Customers', icon: 'Users', suffix: '+' },
    { value: 50, label: 'Countries', icon: 'Globe' },
    { value: 99, label: 'Satisfaction', icon: 'Heart', suffix: '%' },
  ]}
  columns={3}
/>
```

---

## 📋 FORM COMPONENTS

### Form

**Purpose:** Form wrapper with validation and submission handling.

**Props:**
```typescript
interface FormProps {
  onSubmit: (data: FormData) => void;
  validation?: ValidationSchema;
  successMessage?: string;
  errorMessage?: string;
  children: React.ReactNode;
}
```

---

### Input

**Purpose:** Text input field with label and validation.

**Props:**
```typescript
interface InputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
  placeholder?: string;
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
  icon?: string;
  helpText?: string;
}
```

**Usage:**
```typescript
<Input
  name="email"
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  required
  icon="Mail"
  helpText="We'll never share your email"
/>
```

---

### Textarea

**Purpose:** Multi-line text input.

**Props:**
```typescript
interface TextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  maxLength?: number;
}
```

---

### Select

**Purpose:** Dropdown selection input.

**Props:**
```typescript
interface SelectProps {
  name: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  placeholder?: string;
  required?: boolean;
}
```

---

### Checkbox

**Purpose:** Single checkbox input.

**Props:**
```typescript
interface CheckboxProps {
  name: string;
  label: string;
  required?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}
```

---

### Radio

**Purpose:** Radio button group.

**Props:**
```typescript
interface RadioProps {
  name: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  required?: boolean;
}
```

---

### Button

**Purpose:** Interactive button with variants and states.

**Props:**
```typescript
interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
}
```

**Usage:**
```typescript
<Button
  text="Get Started"
  variant="primary"
  size="lg"
  icon="ArrowRight"
  iconPosition="right"
  onClick={handleClick}
/>

<Button
  text="Learn More"
  variant="outline"
  href="/about"
/>
```

---

### ContactForm

**Purpose:** Pre-built contact form with common fields.

**Props:**
```typescript
interface ContactFormProps {
  fields?: Array<'name' | 'email' | 'phone' | 'company' | 'message'>;
  onSubmit: (data: ContactFormData) => void;
  submitText?: string;
  successMessage?: string;
}
```

**Usage:**
```typescript
<ContactForm
  fields={['name', 'email', 'message']}
  onSubmit={handleSubmit}
  submitText="Send Message"
  successMessage="Thanks! We'll be in touch soon."
/>
```

---

## 🧭 NAVIGATION COMPONENTS

### Navbar

**Purpose:** Main site navigation header.

**Props:**
```typescript
interface NavbarProps {
  logo?: string;
  logoText?: string;
  links: Array<{
    label: string;
    href: string;
    children?: NavLink[];
  }>;
  ctaText?: string;
  ctaLink?: string;
  sticky?: boolean;
  transparent?: boolean;
}
```

**Usage:**
```typescript
<Navbar
  logo="/logo.png"
  logoText="Bubble Gum"
  links={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { 
      label: 'Services', 
      href: '/services',
      children: [
        { label: 'Web Design', href: '/services/web-design' },
        { label: 'Development', href: '/services/development' },
      ]
    },
    { label: 'Contact', href: '/contact' },
  ]}
  ctaText="Get Started"
  ctaLink="/signup"
  sticky
/>
```

**Features:**
- Responsive mobile menu (hamburger)
- Dropdown submenus
- Sticky header on scroll
- Transparent variant

---

### Footer

**Purpose:** Site footer with links, copyright, and social icons.

**Props:**
```typescript
interface FooterProps {
  columns: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
  social?: Array<{
    platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
    url: string;
  }>;
  copyright?: string;
  backgroundColor?: string;
}
```

---

### Breadcrumb

**Purpose:** Navigation path indicator.

**Props:**
```typescript
interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
  separator?: 'slash' | 'chevron' | 'arrow';
}
```

---

### Link

**Purpose:** Styled hyperlink.

**Props:**
```typescript
interface LinkProps {
  text: string;
  href: string;
  variant?: 'default' | 'primary' | 'subtle';
  underline?: 'always' | 'hover' | 'none';
  external?: boolean;
  icon?: string;
}
```

---

## 🛒 E-COMMERCE COMPONENTS

### ProductCard

**Purpose:** Product display card for grids and listings.

**Props:**
```typescript
interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  badge?: string;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
}
```

**Usage:**
```typescript
<ProductCard
  id="prod_123"
  name="Classic T-Shirt"
  price={2999}
  compareAtPrice={3999}
  image="/products/tshirt.jpg"
  rating={4.5}
  reviewCount={127}
  inStock
  badge="Best Seller"
  onAddToCart={handleAddToCart}
/>
```

---

### AddToCart

**Purpose:** Product variant selector and add-to-cart button.

**Props:**
```typescript
interface AddToCartProps {
  productId: string;
  variants?: Array<{
    name: string;
    options: string[];
  }>;
  quantity?: number;
  onAddToCart: (data: CartItem) => void;
}
```

**Usage:**
```typescript
<AddToCart
  productId="prod_123"
  variants={[
    { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
    { name: 'Color', options: ['Black', 'White', 'Gray'] },
  ]}
  onAddToCart={handleAddToCart}
/>
```

---

### CartItem

**Purpose:** Individual item in shopping cart.

**Props:**
```typescript
interface CartItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}
```

---

### Cart

**Purpose:** Shopping cart sidebar or page.

**Props:**
```typescript
interface CartProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  onCheckout: () => void;
  onUpdateItem: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}
```

---

## 📰 BLOG COMPONENTS

### BlogPostCard

**Purpose:** Blog post preview card.

**Props:**
```typescript
interface BlogPostCardProps {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  readTime?: string;
  categories?: string[];
  href: string;
}
```

---

### BlogPostContent

**Purpose:** Full blog post with formatted content.

**Props:**
```typescript
interface BlogPostContentProps {
  title: string;
  content: string; // Markdown or HTML
  author: Author;
  publishedAt: string;
  categories: string[];
  tags: string[];
  featuredImage?: string;
  showShareButtons?: boolean;
  showComments?: boolean;
}
```

---

## 🔧 UTILITY COMPONENTS

### Badge

**Purpose:** Small label for status or categories.

**Props:**
```typescript
interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
}
```

---

### Alert

**Purpose:** Notification or message box.

**Props:**
```typescript
interface AlertProps {
  title?: string;
  message: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  dismissible?: boolean;
  icon?: string;
}
```

---

### Spinner

**Purpose:** Loading indicator.

**Props:**
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}
```

---

## 🎨 CUSTOMIZATION

### Theme Override

All components accept a `className` prop for custom styling:

```typescript
<Button
  text="Custom Button"
  className="!bg-purple-600 !hover:bg-purple-700"
/>
```

### Global Theme

Define theme in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

---

## 📚 BEST PRACTICES

### Component Selection

**1. Start Simple**
- Use Container + Section for basic layouts
- Add Grid/Flex as needed for complex arrangements

**2. Maintain Consistency**
- Reuse the same components across pages
- Keep spacing and sizing consistent
- Use theme colors, not hardcoded values

**3. Accessibility First**
- Always provide alt text for images
- Use semantic HTML (Button vs div)
- Ensure keyboard navigation
- Test with screen readers

**4. Performance**
- Use lazy loading for images
- Minimize component nesting
- Avoid inline styles when possible

---

## 🔗 RELATED DOCUMENTS

- **COMPONENT_EXAMPLES.md** - React code examples
- **AI_PROMPT_TEMPLATES.md** - Component generation prompts
- **trpc-router.ts** - Component library API

---

**Component Library Status:** ✅ Complete  
**Last Updated:** November 1, 2025  
**Version:** 1.0.0

---

*This component library provides everything needed to build modern, professional websites. All components are production-ready and fully tested.*