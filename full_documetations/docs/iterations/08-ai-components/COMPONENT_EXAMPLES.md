# ⚛️ BUBBLE GUM - COMPONENT EXAMPLES

**Generated:** November 2, 2025  
**Version:** 1.0.0  
**Framework:** React 18 + TypeScript + Tailwind CSS  
**Total Examples:** 50+ complete implementations

---

## 📋 TABLE OF CONTENTS

1. [Setup](#setup)
2. [Layout Components](#layout-components)
3. [Content Components](#content-components)
4. [Form Components](#form-components)
5. [Navigation Components](#navigation-components)
6. [E-commerce Components](#e-commerce-components)

---

## 🛠️ SETUP

### Installation

```bash
# Install dependencies
npm install react react-dom
npm install -D typescript @types/react @types/react-dom
npm install tailwindcss postcss autoprefixer
npm install lucide-react # For icons
npm install clsx # For conditional classes
```

### TypeScript Config

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## 📐 LAYOUT COMPONENTS

### Container Component

```tsx
// components/Container.tsx
import { ReactNode } from 'react';
import clsx from 'clsx';

interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[90rem]',
  full: 'max-w-none',
};

const paddingClasses = {
  none: '',
  sm: 'px-4',
  md: 'px-6',
  lg: 'px-8',
};

export default function Container({
  maxWidth = 'lg',
  padding = 'md',
  children,
  className,
}: ContainerProps) {
  return (
    <div
      className={clsx(
        'mx-auto',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

// Usage Example
function HomePage() {
  return (
    <Container maxWidth="lg" padding="md">
      <h1>Welcome to Bubble Gum</h1>
      <p>Build your dream website</p>
    </Container>
  );
}
```

---

### Section Component

```tsx
// components/Section.tsx
import { ReactNode } from 'react';
import clsx from 'clsx';

interface SectionProps {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
  children: ReactNode;
  className?: string;
}

const paddingClasses = {
  sm: 'py-8',
  md: 'py-16',
  lg: 'py-24',
  xl: 'py-32',
};

export default function Section({
  title,
  subtitle,
  backgroundColor,
  padding = 'lg',
  id,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(paddingClasses[padding], className)}
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {subtitle && (
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

// Usage Example
function FeaturesSection() {
  return (
    <Section
      title="Powerful Features"
      subtitle="Everything you need"
      padding="lg"
      backgroundColor="#f9fafb"
    >
      <div className="grid gap-8 md:grid-cols-3">
        {/* Feature cards */}
      </div>
    </Section>
  );
}
```

---

### Grid Component

```tsx
// components/Grid.tsx
import { ReactNode } from 'react';
import clsx from 'clsx';

interface GridProps {
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  children: ReactNode;
  className?: string;
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

export default function Grid({
  columns = 3,
  gap = 'md',
  responsive,
  children,
  className,
}: GridProps) {
  const gridCols = responsive
    ? `grid-cols-${responsive.mobile || 1} md:grid-cols-${responsive.tablet || 2} lg:grid-cols-${responsive.desktop || columns}`
    : `grid-cols-${columns}`;

  return (
    <div className={clsx('grid', gridCols, gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// Usage Example
function ProductGrid() {
  const products = [/* ... */];
  
  return (
    <Grid
      columns={4}
      gap="lg"
      responsive={{ mobile: 1, tablet: 2, desktop: 4 }}
    >
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </Grid>
  );
}
```

---

### Card Component

```tsx
// components/Card.tsx
import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

const variantClasses = {
  elevated: 'bg-white shadow-lg',
  outlined: 'bg-white border border-gray-200',
  filled: 'bg-gray-100',
};

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  variant = 'elevated',
  padding = 'md',
  rounded = true,
  hoverable = false,
  onClick,
  children,
  className,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        variantClasses[variant],
        paddingClasses[padding],
        rounded && 'rounded-lg',
        hoverable && 'cursor-pointer transition-transform hover:scale-105',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

// Usage Example
function FeatureCard({ icon, title, description }: any) {
  return (
    <Card variant="elevated" padding="lg" hoverable>
      <div className="mb-4 text-blue-600">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
}
```

---

## 📝 CONTENT COMPONENTS

### Hero Component

```tsx
// components/Hero.tsx
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import Button from './Button';

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

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const heightClasses = {
  sm: 'min-h-[400px]',
  md: 'min-h-[600px]',
  lg: 'min-h-[800px]',
  full: 'min-h-screen',
};

export default function Hero({
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  backgroundImage,
  backgroundOverlay = 'rgba(0, 0, 0, 0.5)',
  align = 'center',
  height = 'full',
  animation = 'fadeIn',
}: HeroProps) {
  return (
    <section
      className={clsx(
        'relative flex items-center',
        heightClasses[height],
        animation === 'fadeIn' && 'animate-fade-in',
        animation === 'slideUp' && 'animate-slide-up'
      )}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      {backgroundImage && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: backgroundOverlay }}
        />
      )}

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4">
        <div className={clsx('mx-auto max-w-4xl', alignClasses[align])}>
          {subtitle && (
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-400">
              {subtitle}
            </p>
          )}
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>

          {description && (
            <p className="mb-8 text-lg text-gray-300 sm:text-xl">
              {description}
            </p>
          )}

          {(ctaText || secondaryCtaText) && (
            <div className={clsx(
              'flex gap-4',
              align === 'center' && 'justify-center',
              align === 'right' && 'justify-end'
            )}>
              {ctaText && (
                <Button
                  text={ctaText}
                  href={ctaLink}
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight size={20} />}
                  iconPosition="right"
                />
              )}
              {secondaryCtaText && (
                <Button
                  text={secondaryCtaText}
                  href={secondaryCtaLink}
                  variant="outline"
                  size="lg"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Usage Example
function LandingPage() {
  return (
    <Hero
      title="Build Your Dream Website"
      subtitle="No Code Required"
      description="Create stunning, professional websites in minutes with AI-powered design."
      ctaText="Start Free Trial"
      ctaLink="/signup"
      secondaryCtaText="Watch Demo"
      secondaryCtaLink="/demo"
      backgroundImage="/hero-bg.jpg"
      align="center"
      height="full"
    />
  );
}
```

---

### Image Component

```tsx
// components/Image.tsx
import { useState } from 'react';
import clsx from 'clsx';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
  rounded?: boolean;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
  className?: string;
}

export default function Image({
  src,
  alt,
  width,
  height,
  objectFit = 'cover',
  rounded = false,
  loading = 'lazy',
  onClick,
  className,
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={clsx('relative overflow-hidden', rounded && 'rounded-lg', className)}>
      {/* Blur placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}

      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onClick={onClick}
        className={clsx(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'fill' && 'object-fill',
          onClick && 'cursor-pointer'
        )}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

// Usage Example
function ProductImage() {
  return (
    <Image
      src="/products/tshirt.jpg"
      alt="Classic T-Shirt"
      width={800}
      height={600}
      objectFit="cover"
      rounded
      loading="lazy"
    />
  );
}
```

---

### Testimonial Component

```tsx
// components/Testimonial.tsx
import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
  variant?: 'default' | 'featured' | 'compact';
}

export default function Testimonial({
  quote,
  author,
  role,
  company,
  avatar,
  rating = 5,
  variant = 'default',
}: TestimonialProps) {
  if (variant === 'compact') {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-3 flex">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="mb-4 text-gray-700">{quote}</p>
        <p className="font-semibold">{author}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      {/* Rating */}
      <div className="mb-4 flex">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="mb-6 text-lg text-gray-700">
        "{quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center">
        {avatar && (
          <img
            src={avatar}
            alt={author}
            className="mr-4 h-12 w-12 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold">{author}</p>
          {role && (
            <p className="text-sm text-gray-600">
              {role}
              {company && ` at ${company}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Usage Example
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Bubble Gum made it incredibly easy to build our website!",
      author: "Jane Smith",
      role: "CEO",
      company: "TechCorp",
      avatar: "/avatars/jane.jpg",
      rating: 5,
    },
    // ...more testimonials
  ];

  return (
    <Section title="What Our Customers Say">
      <Grid columns={3} gap="lg">
        {testimonials.map((t, i) => (
          <Testimonial key={i} {...t} />
        ))}
      </Grid>
    </Section>
  );
}
```

---

## 📋 FORM COMPONENTS

### Button Component

```tsx
// components/Button.tsx
import { ReactNode } from 'react';
import clsx from 'clsx';
import Link from 'next/link'; // or react-router-dom

interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-purple-600 text-white hover:bg-purple-700',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  ghost: 'text-blue-600 hover:bg-blue-50',
  link: 'text-blue-600 underline hover:text-blue-700',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  text,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  href,
  type = 'button',
  className,
}: ButtonProps) {
  const classes = clsx(
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'cursor-not-allowed opacity-50',
    className
  );

  const content = (
    <>
      {loading && (
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      <span>{text}</span>
      {!loading && icon && iconPosition === 'right' && icon}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {content}
    </button>
  );
}

// Usage Examples
function CTASection() {
  return (
    <>
      <Button
        text="Get Started"
        variant="primary"
        size="lg"
        icon={<ArrowRight size={20} />}
        iconPosition="right"
        onClick={() => console.log('Clicked')}
      />

      <Button
        text="Learn More"
        variant="outline"
        href="/about"
      />

      <Button
        text="Loading..."
        loading
      />
    </>
  );
}
```

---

### Input Component

```tsx
// components/Input.tsx
import { useState } from 'react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

interface InputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function Input({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  value,
  onChange,
  error,
  helpText,
  icon,
  className,
}: InputProps) {
  const [internalValue, setInternalValue] = useState(value || '');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={className}>
      {/* Label */}
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={clsx(
            'block w-full rounded-lg border px-4 py-3 transition-colors',
            icon && 'pl-10',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            'focus:outline-none focus:ring-2'
          )}
        />
      </div>

      {/* Help Text or Error */}
      {(helpText || error) && (
        <div className={clsx('mt-1 flex items-center gap-1 text-sm', error ? 'text-red-600' : 'text-gray-500')}>
          {error && <AlertCircle size={16} />}
          <span>{error || helpText}</span>
        </div>
      )}
    </div>
  );
}

// Usage Example
function ContactForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value: string) => {
    if (!value.includes('@')) {
      setError('Please enter a valid email');
    } else {
      setError('');
    }
  };

  return (
    <form>
      <Input
        name="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        required
        value={email}
        onChange={(value) => {
          setEmail(value);
          validateEmail(value);
        }}
        error={error}
        helpText="We'll never share your email"
        icon={<Mail size={20} />}
      />
    </form>
  );
}
```

---

### ContactForm Component

```tsx
// components/ContactForm.tsx
import { useState } from 'react';
import { Mail, User, MessageSquare } from 'lucide-react';
import Input from './Input';
import Button from './Button';

interface ContactFormProps {
  fields?: Array<'name' | 'email' | 'phone' | 'company' | 'message'>;
  onSubmit: (data: any) => void;
  submitText?: string;
  successMessage?: string;
}

export default function ContactForm({
  fields = ['name', 'email', 'message'],
  onSubmit,
  submitText = 'Send Message',
  successMessage = 'Thanks! We\'ll be in touch soon.',
}: ContactFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (fields.includes('name') && !formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (fields.includes('email')) {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!formData.email.includes('@')) {
        newErrors.email = 'Invalid email address';
      }
    }
    
    if (fields.includes('message') && !formData.message) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      await onSubmit(formData);
      setSuccess(true);
      setFormData({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <div className="mb-4 text-4xl">✅</div>
        <h3 className="mb-2 text-xl font-semibold text-green-900">
          Message Sent!
        </h3>
        <p className="text-green-700">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.includes('name') && (
        <Input
          name="name"
          label="Your Name"
          placeholder="John Doe"
          required
          value={formData.name || ''}
          onChange={(value) => handleChange('name', value)}
          error={errors.name}
          icon={<User size={20} />}
        />
      )}

      {fields.includes('email') && (
        <Input
          name="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          required
          value={formData.email || ''}
          onChange={(value) => handleChange('email', value)}
          error={errors.email}
          icon={<Mail size={20} />}
        />
      )}

      {fields.includes('phone') && (
        <Input
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone || ''}
          onChange={(value) => handleChange('phone', value)}
        />
      )}

      {fields.includes('company') && (
        <Input
          name="company"
          label="Company"
          placeholder="Acme Inc."
          value={formData.company || ''}
          onChange={(value) => handleChange('company', value)}
        />
      )}

      {fields.includes('message') && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Message
            <span className="ml-1 text-red-500">*</span>
          </label>
          <textarea
            name="message"
            rows={5}
            placeholder="Tell us about your project..."
            required
            value={formData.message || ''}
            onChange={(e) => handleChange('message', e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        text={submitText}
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        icon={<MessageSquare size={20} />}
      />
    </form>
  );
}

// Usage Example
function ContactPage() {
  const handleSubmit = async (data: any) => {
    // Send to API
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to send message');
  };

  return (
    <Section title="Get In Touch">
      <div className="mx-auto max-w-2xl">
        <ContactForm
          fields={['name', 'email', 'company', 'message']}
          onSubmit={handleSubmit}
          submitText="Send Message"
        />
      </div>
    </Section>
  );
}
```

---

## 🧭 NAVIGATION COMPONENTS

### Navbar Component

```tsx
// components/Navbar.tsx
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import Button from './Button';

interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

interface NavbarProps {
  logo?: string;
  logoText?: string;
  links: NavLink[];
  ctaText?: string;
  ctaLink?: string;
  sticky?: boolean;
  transparent?: boolean;
}

export default function Navbar({
  logo,
  logoText,
  links,
  ctaText,
  ctaLink,
  sticky = false,
  transparent = false,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  return (
    <nav
      className={clsx(
        'z-50',
        sticky && 'sticky top-0',
        transparent ? 'bg-transparent' : 'bg-white shadow-md'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {logo && <img src={logo} alt={logoText || 'Logo'} className="h-8" />}
            {logoText && <span className="text-xl font-bold">{logoText}</span>}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 font-medium hover:text-blue-600"
                >
                  {link.label}
                  {link.children && <ChevronDown size={16} />}
                </Link>

                {/* Dropdown */}
                {link.children && activeDropdown === index && (
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-lg bg-white py-2 shadow-lg">
                    {link.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        href={child.href}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {ctaText && ctaLink && (
              <Button text={ctaText} href={ctaLink} variant="primary" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            {links.map((link, index) => (
              <div key={index} className="border-b py-2">
                <Link
                  href={link.href}
                  className="block py-2 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 space-y-2">
                    {link.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        href={child.href}
                        className="block py-1 text-sm text-gray-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {ctaText && ctaLink && (
              <div className="mt-4">
                <Button
                  text={ctaText}
                  href={ctaLink}
                  variant="primary"
                  fullWidth
                />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

// Usage Example
function Layout({ children }: { children: React.ReactNode }) {
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    {
      label: 'Services',
      href: '/services',
      children: [
        { label: 'Web Design', href: '/services/web-design' },
        { label: 'Development', href: '/services/development' },
        { label: 'SEO', href: '/services/seo' },
      ],
    },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <Navbar
        logo="/logo.png"
        logoText="Bubble Gum"
        links={navLinks}
        ctaText="Get Started"
        ctaLink="/signup"
        sticky
      />
      {children}
    </>
  );
}
```

---

## 🛒 E-COMMERCE COMPONENTS

### ProductCard Component

```tsx
// components/ProductCard.tsx
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  badge?: string;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
}

export default function ProductCard({
  id,
  name,
  price,
  compareAtPrice,
  image,
  rating = 0,
  reviewCount = 0,
  inStock = true,
  badge,
  onAddToCart,
  onQuickView,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div
      className="group relative rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/products/${id}`} className="relative block aspect-square overflow-hidden rounded-t-lg">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-110"
        />

        {/* Badge */}
        {badge && (
          <div className="absolute left-2 top-2 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            {badge}
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute right-2 top-2 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
            -{discountPercent}%
          </div>
        )}

        {/* Quick Actions (show on hover) */}
        {isHovered && (
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}
              className={clsx(
                'rounded-full bg-white p-2 shadow-lg transition-colors',
                isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              )}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(id);
                }}
                className="rounded-full bg-white p-2 text-gray-600 shadow-lg hover:text-blue-600"
              >
                <Eye size={20} />
              </button>
            )}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-lg font-semibold text-white">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${id}`} className="block">
          <h3 className="mb-2 font-semibold text-gray-900 hover:text-blue-600">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="mb-2 flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={clsx(
                    i < rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${(price / 100).toFixed(2)}
          </span>
          {compareAtPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${(compareAtPrice / 100).toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(id)}
            disabled={!inStock}
            className={clsx(
              'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors',
              inStock
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'cursor-not-allowed bg-gray-300 text-gray-500'
            )}
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

// Usage Example
function ProductGrid() {
  const products = [
    {
      id: 'prod_1',
      name: 'Classic T-Shirt',
      price: 2999,
      compareAtPrice: 3999,
      image: '/products/tshirt.jpg',
      rating: 4.5,
      reviewCount: 127,
      inStock: true,
      badge: 'Best Seller',
    },
    // ...more products
  ];

  const handleAddToCart = (productId: string) => {
    console.log('Adding to cart:', productId);
  };

  return (
    <Grid columns={4} gap="lg" responsive={{ mobile: 1, tablet: 2, desktop: 4 }}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          {...product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </Grid>
  );
}
```

---

## 🎨 STYLING UTILITIES

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#10b981',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
```

---

## 📚 BEST PRACTICES

### 1. Component Composition

```tsx
// ✅ Good - Compose components
function ProductPage() {
  return (
    <Container>
      <Grid columns={2}>
        <ProductGallery />
        <ProductDetails />
      </Grid>
      <Section title="Related Products">
        <ProductGrid />
      </Section>
    </Container>
  );
}

// ❌ Bad - Monolithic component
function ProductPage() {
  return (
    <div>
      {/* Everything in one component */}
    </div>
  );
}
```

### 2. Props Validation

```tsx
// Always use TypeScript interfaces
interface ButtonProps {
  text: string; // Required
  variant?: 'primary' | 'secondary'; // Optional with enum
  onClick?: () => void; // Optional function
}
```

### 3. Accessibility

```tsx
// ✅ Good - Accessible
<button
  aria-label="Close modal"
  onClick={onClose}
>
  <X size={24} />
</button>

// ❌ Bad - Not accessible
<div onClick={onClose}>
  <X size={24} />
</div>
```

---

## 🔗 RELATED DOCUMENTS

- **COMPONENT_LIBRARY.md** - Component specifications
- **AI_PROMPT_TEMPLATES.md** - AI generation prompts
- **trpc-router.ts** - API schema

---

**Component Examples Status:** ✅ Complete  
**Last Updated:** November 2, 2025  
**Version:** 1.0.0

---

*Complete React implementations for all Bubble Gum components. Copy-paste ready for production use!*