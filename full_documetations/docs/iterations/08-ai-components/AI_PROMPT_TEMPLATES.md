# 🤖 BUBBLE GUM - AI PROMPT TEMPLATES

**Generated:** November 1, 2025  
**Version:** 1.0.0  
**AI Model:** Claude Sonnet 4.5  
**Purpose:** Site generation & content creation

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [System Prompt](#system-prompt)
3. [Site Generation Prompts](#site-generation-prompts)
4. [Component Generation](#component-generation)
5. [Content Writing](#content-writing)
6. [Best Practices](#best-practices)

---

## 🌐 OVERVIEW

Bubble Gum uses Claude Sonnet 4.5 for AI-powered site generation. This document contains the prompt engineering system for generating high-quality, production-ready websites.

### Key Features

- ✅ **Structured output** - JSON schema validation
- ✅ **Brand-aware** - Understands business types
- ✅ **Responsive** - Mobile-first design
- ✅ **Accessible** - WCAG 2.1 AA compliant
- ✅ **SEO-optimized** - Meta tags, semantic HTML

---

## 🧠 SYSTEM PROMPT

This is the base system prompt used for all AI generations:

```markdown
You are an expert web designer and developer specializing in creating modern, 
professional websites. You have deep knowledge of:

- UI/UX best practices
- Responsive design principles
- Accessibility (WCAG 2.1 AA)
- SEO optimization
- Modern web technologies (React, Tailwind CSS)
- Content strategy
- Conversion optimization

When generating websites, you:

1. **Understand the business** - Ask clarifying questions if needed
2. **Follow design principles** - Use proper hierarchy, spacing, contrast
3. **Write compelling copy** - Clear, benefit-focused, conversion-oriented
4. **Structure content logically** - Hero → Features → Benefits → CTA
5. **Optimize for devices** - Mobile-first, responsive design
6. **Consider accessibility** - Semantic HTML, ARIA labels, keyboard navigation
7. **Think about SEO** - Meta tags, headings, alt text

Your output must be valid JSON following the Bubble Gum component schema.
```

---

## 🏗️ SITE GENERATION PROMPTS

### Template: Portfolio Website

**User Prompt:**
```
Create a modern portfolio for a [profession] showcasing [key skills/services].
```

**System Instruction:**
```markdown
Generate a portfolio website with the following structure:

**Pages Required:**
1. Homepage
   - Hero section with name, title, and CTA
   - Featured work (3-6 projects)
   - Skills/Services section
   - Testimonials (if applicable)
   - Contact CTA

2. About page
   - Personal story
   - Professional background
   - Skills & expertise
   - Education/Certifications

3. Work/Portfolio page
   - Project grid with filters
   - Each project: image, title, description, tags, link

4. Contact page
   - Contact form (name, email, message)
   - Email address
   - Social links

**Design Guidelines:**
- Clean, minimal aesthetic
- Strong typography hierarchy
- Professional color scheme (2-3 colors max)
- High-quality placeholder images
- Mobile-responsive grid layouts

**Components to Use:**
- Hero (full-width, centered text)
- ProjectCard (image, title, description, tags)
- SkillBadge (icon, label)
- ContactForm (name, email, message, submit)
- Footer (social links, copyright)

**Output Format:**
Return JSON with structure:
{
  "pages": [
    {
      "name": "Homepage",
      "slug": "/",
      "metaTitle": "...",
      "metaDescription": "...",
      "content": {
        "components": [...]
      }
    }
  ]
}
```

**Example Output:**
```json
{
  "pages": [
    {
      "name": "Homepage",
      "slug": "/",
      "metaTitle": "John Doe - Freelance Web Developer",
      "metaDescription": "Full-stack web developer specializing in React, Node.js, and modern web technologies.",
      "content": {
        "components": [
          {
            "id": "hero_1",
            "type": "Hero",
            "props": {
              "title": "Hi, I'm John Doe",
              "subtitle": "Full-Stack Web Developer",
              "description": "I build beautiful, performant web applications that solve real problems.",
              "ctaText": "View My Work",
              "ctaLink": "/work",
              "backgroundImage": "/assets/hero-bg.jpg",
              "align": "center"
            }
          },
          {
            "id": "section_2",
            "type": "Section",
            "props": {
              "title": "Featured Projects",
              "subtitle": "Recent work I'm proud of",
              "padding": "large"
            },
            "children": [
              {
                "id": "grid_1",
                "type": "Grid",
                "props": {
                  "columns": 3,
                  "gap": "large"
                },
                "children": [
                  {
                    "id": "project_1",
                    "type": "ProjectCard",
                    "props": {
                      "image": "/assets/project-1.jpg",
                      "title": "E-commerce Platform",
                      "description": "Built a scalable e-commerce platform handling 10k+ transactions/day",
                      "tags": ["React", "Node.js", "PostgreSQL"],
                      "link": "/work/ecommerce-platform"
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  ]
}
```

---

### Template: Business Website

**User Prompt:**
```
Create a professional website for a [business type] that offers [services].
```

**System Instruction:**
```markdown
Generate a business website with:

**Pages Required:**
1. Homepage
   - Hero with value proposition
   - Services overview (3-6 services)
   - Why choose us / Benefits
   - Social proof (testimonials, logos, stats)
   - Call-to-action

2. Services page
   - Service cards with details
   - Pricing (if applicable)
   - Process/How it works
   - FAQ

3. About page
   - Company story
   - Mission & values
   - Team members
   - Credentials/Certifications

4. Contact page
   - Contact form
   - Business info (address, phone, hours)
   - Map embed (optional)

**Design Guidelines:**
- Professional, trustworthy aesthetic
- Clear hierarchy and navigation
- Strong calls-to-action
- Trust indicators (testimonials, logos, certifications)
- Industry-appropriate color scheme

**Components:**
- Hero (with background image or gradient)
- ServiceCard (icon, title, description, link)
- StatsCounter (number, label, icon)
- TestimonialCard (quote, author, company, avatar)
- ContactForm (name, email, phone, message, submit)

**Tone:**
- Professional yet approachable
- Benefit-focused (not feature-focused)
- Clear, jargon-free language
- Action-oriented CTAs
```

---

### Template: E-commerce Store

**User Prompt:**
```
Create an online store for [product category] with [number] products.
```

**System Instruction:**
```markdown
Generate an e-commerce website with:

**Pages Required:**
1. Homepage
   - Hero banner with main offer
   - Featured products (6-8)
   - Category highlights
   - Benefits/USPs
   - Newsletter signup

2. Shop/Products page
   - Product grid with filters
   - Sort options (price, popularity, new)
   - Pagination

3. Product Detail page (template)
   - Product images (gallery)
   - Title, price, description
   - Add to cart button
   - Specifications
   - Related products

4. Cart page
   - Cart items list
   - Quantity controls
   - Subtotal, shipping, total
   - Checkout button

5. Checkout page (Stripe integration)
   - Shipping information
   - Payment method
   - Order summary

**Design Guidelines:**
- Clean, modern e-commerce aesthetic
- Large, high-quality product images
- Clear pricing and CTAs
- Trust badges (secure checkout, returns, shipping)
- Mobile-optimized checkout flow

**Components:**
- Hero (banner with promotion)
- ProductCard (image, title, price, rating, quick-add)
- ProductGallery (multiple images, zoom)
- AddToCart (size/variant selector, quantity, button)
- CartItem (image, title, quantity controls, remove)
- CheckoutForm (Stripe Elements integration)

**Important:**
- All prices in cents (e.g., $29.99 = 2999)
- Include product variants (size, color)
- Add inventory tracking
- Set up Stripe payment intents
```

---

### Template: Blog/Content Site

**User Prompt:**
```
Create a blog website about [topic] for [audience].
```

**System Instruction:**
```markdown
Generate a blog website with:

**Pages Required:**
1. Homepage
   - Hero with blog tagline
   - Featured posts (3 posts)
   - Latest posts (10-12 posts)
   - Newsletter signup
   - About snippet

2. Blog Archive
   - Post list with pagination
   - Category filters
   - Search functionality
   - Tag cloud

3. Blog Post (template)
   - Post title, date, author
   - Featured image
   - Content (rich text)
   - Tags
   - Social share buttons
   - Related posts

4. About page
   - Author bio
   - Mission/Why this blog exists
   - Contact info

**Design Guidelines:**
- Reading-focused design
- Excellent typography
- Minimal distractions
- Fast loading times
- SEO-optimized structure

**Components:**
- Hero (simple, text-focused)
- BlogPostCard (image, title, excerpt, date, author)
- BlogPostContent (formatted markdown/HTML)
- Newsletter (email input, subscribe button)
- SocialShare (Twitter, Facebook, LinkedIn buttons)

**Content Strategy:**
- Attention-grabbing headlines
- Clear, scannable content structure
- Compelling excerpts (120-160 chars)
- SEO-optimized meta descriptions
- Internal linking between related posts
```

---

## 🧩 COMPONENT GENERATION

### Generating Individual Components

**User Prompt:**
```
Create a [component type] component for [purpose].
```

**Example: Hero Component**

**System Instruction:**
```markdown
Generate a Hero component with the following specs:

**Purpose:** Primary landing section, first thing users see

**Required Props:**
- title (string) - Main headline
- subtitle (string) - Supporting text
- description (string) - Additional context
- ctaText (string) - Call-to-action button text
- ctaLink (string) - Button destination
- backgroundImage (string, optional) - Background image URL
- align (enum: left, center, right)

**Design Requirements:**
- Full viewport height (min-h-screen)
- Responsive typography (text-4xl on mobile, text-6xl on desktop)
- Gradient overlay if using background image
- Clear contrast between text and background
- Prominent CTA button
- Optional secondary CTA

**Accessibility:**
- Semantic HTML (h1 for title)
- ARIA labels for CTAs
- Keyboard navigable
- Screen reader friendly

**Output Format:**
Return JSON component schema:
{
  "id": "hero_1",
  "type": "Hero",
  "props": { ... }
}
```

**Generated Output:**
```json
{
  "id": "hero_1",
  "type": "Hero",
  "props": {
    "title": "Build Your Dream Website",
    "subtitle": "No Code Required",
    "description": "Create stunning, professional websites in minutes with AI-powered design.",
    "ctaText": "Start Building Free",
    "ctaLink": "/signup",
    "secondaryCtaText": "Watch Demo",
    "secondaryCtaLink": "/demo",
    "backgroundImage": "/assets/hero-gradient.jpg",
    "backgroundOverlay": "rgba(0, 0, 0, 0.4)",
    "align": "center",
    "height": "full",
    "animation": "fadeIn"
  }
}
```

---

## ✍️ CONTENT WRITING

### Generating Copy

**System Instruction for Headlines:**
```markdown
Write compelling headlines that:
1. Clearly state the value proposition
2. Use benefit-focused language
3. Create curiosity or urgency
4. Are 6-12 words long
5. Use power words (build, discover, transform, unlock)

Examples:
❌ "We Offer Web Development Services"
✅ "Transform Your Ideas Into Stunning Websites"

❌ "Contact Us For More Information"
✅ "Ready to Start Your Project? Let's Talk"
```

**System Instruction for Descriptions:**
```markdown
Write product/service descriptions that:
1. Start with the main benefit
2. Address pain points
3. Include social proof
4. End with a clear call-to-action
5. Are scannable (short paragraphs, bullet points)

Structure:
- Opening: Main benefit/outcome
- Body: How it works, key features
- Proof: Testimonial or stat
- Close: Clear CTA

Length: 100-150 words for services, 50-80 words for products
```

**System Instruction for CTAs:**
```markdown
Write call-to-action copy that:
1. Uses action verbs (Get, Start, Discover, Join)
2. Creates urgency (Today, Now, Limited)
3. Reduces friction (Free, No Credit Card)
4. States the benefit

Examples:
Primary CTAs: "Start Building Free", "Get Started Today", "Try Risk-Free"
Secondary CTAs: "Learn More", "Watch Demo", "See Examples"
```

---

## 📝 BEST PRACTICES

### Prompt Engineering Tips

**1. Be Specific**
```
❌ "Create a website"
✅ "Create a professional portfolio website for a freelance photographer 
   showcasing wedding and portrait photography with 3 pages"
```

**2. Provide Context**
```
Good prompt includes:
- Business type/industry
- Target audience
- Key services/products
- Desired tone (professional, playful, luxurious)
- Any specific requirements (colors, sections)
```

**3. Use Examples**
```
"Create a hero section similar to [example.com] but with [differences]"
```

**4. Iterate**
```
First generation: "Create a restaurant website"
Refinement: "Make the hero more dramatic with a full-screen image"
Refinement: "Add a reservation form in the header"
```

### Quality Checks

Before accepting AI-generated output, verify:

✅ **Structure**
- All required pages present
- Logical navigation flow
- Proper component hierarchy

✅ **Content**
- Clear, grammatically correct copy
- Benefit-focused messaging
- No placeholder text (or clearly marked)

✅ **Design**
- Consistent spacing and typography
- Appropriate color contrast
- Responsive layout definitions

✅ **Accessibility**
- Semantic HTML structure
- Alt text for images
- Keyboard navigation support

✅ **SEO**
- Meta titles (50-60 chars)
- Meta descriptions (150-160 chars)
- Proper heading hierarchy (h1 → h6)

---

## 🔄 PROMPT CHAINS

### Multi-Step Generation

For complex sites, use prompt chaining:

**Step 1: Site Structure**
```
Prompt: "Design the information architecture for a [business type] website.
List all pages and their main sections."

Output: Page list with sections
```

**Step 2: Homepage Generation**
```
Prompt: "Generate the homepage based on this structure: [structure].
Focus on creating a compelling hero and clear value proposition."

Output: Homepage JSON
```

**Step 3: Subpage Generation**
```
Prompt: "Generate the [page name] page. Maintain design consistency with
the homepage but focus on [specific goal]."

Output: Subpage JSON
```

**Step 4: Content Refinement**
```
Prompt: "Review and improve the copy for the [section] section.
Make it more [adjective] and focused on [benefit]."

Output: Updated content
```

---

## 🎨 STYLE PROMPTS

### Design System Generation

**Prompt:**
```
Create a design system for a [business type] with the following:

**Brand Personality:** [adjectives: modern, trustworthy, innovative, etc.]

**Color Palette:**
- Primary color: [color preference or let AI suggest]
- Secondary color: [...]
- Accent color: [...]
- Neutral colors: [shades of gray]

**Typography:**
- Heading font: [preference or "modern sans-serif"]
- Body font: [preference or "readable sans-serif"]
- Font sizes: Responsive scale (mobile to desktop)

**Spacing:**
- Base unit: 4px
- Scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px

**Components:**
- Buttons: Primary, secondary, outline variants
- Cards: Elevated, flat, bordered
- Forms: Input fields, textareas, selects
- Badges: Success, warning, error, info

Output as CSS variables and Tailwind config.
```

---

## 🧪 TESTING PROMPTS

Use these prompts to test AI output quality:

**Test 1: Clarity**
```
"Explain what this website is about in one sentence."
Expected: Clear, concise description of value proposition
```

**Test 2: Navigation**
```
"List all pages and how they connect."
Expected: Complete site map with logical flow
```

**Test 3: Accessibility**
```
"Describe how a screen reader would navigate this page."
Expected: Semantic structure, proper labeling
```

**Test 4: Mobile Experience**
```
"How does this layout adapt to mobile devices?"
Expected: Responsive breakpoints, mobile-first design
```

---

## 📊 PROMPT TEMPLATES LIBRARY

### Quick Reference

| Use Case | Template | Output |
|----------|----------|--------|
| Portfolio | `portfolio-[profession].md` | 3 pages |
| Business | `business-[industry].md` | 4 pages |
| E-commerce | `ecommerce-[category].md` | 5 pages |
| Blog | `blog-[topic].md` | 4 pages |
| Landing Page | `landing-[goal].md` | 1 page |
| Restaurant | `restaurant-[cuisine].md` | 4 pages |
| SaaS | `saas-[product].md` | 5 pages |
| Agency | `agency-[service].md` | 4 pages |

---

## 🔗 RELATED DOCUMENTS

- **COMPONENT_LIBRARY.md** - Component specifications
- **COMPONENT_EXAMPLES.md** - React implementation
- **API_DOCUMENTATION.md** - AI generation endpoints

---

**AI Prompt Templates Status:** ✅ Complete  
**Last Updated:** November 1, 2025  
**Version:** 1.0.0

---

*These prompts are optimized for Claude Sonnet 4.5. Regular testing and refinement ensure high-quality output for all use cases.*