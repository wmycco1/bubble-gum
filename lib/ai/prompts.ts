// ═══════════════════════════════════════════════════════════════
// AI PROMPT TEMPLATES - Bubble Gum
// ═══════════════════════════════════════════════════════════════
// System prompts and templates for AI generation
// Version: 1.0.0
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// AVAILABLE COMPONENTS LIST
// ═══════════════════════════════════════════════════════════════

export const AVAILABLE_COMPONENTS = `
Available Components (ONLY use these):

1. TextComponent
   - variants: "h1", "h2", "h3", "paragraph"
   - props: { text: string, variant: string }
   - example: { type: "TextComponent", props: { text: "Welcome", variant: "h1" } }

2. ButtonComponent
   - variants: "primary", "secondary", "outline", "ghost"
   - props: { text: string, variant: string, link?: string }
   - example: { type: "ButtonComponent", props: { text: "Get Started", variant: "primary" } }

3. ImageComponent
   - props: { src: string, alt: string, width?: number, height?: number }
   - example: { type: "ImageComponent", props: { src: "/placeholder.jpg", alt: "Hero image" } }

4. ContainerComponent
   - props: { layout: "flex" | "grid", gap?: number, children: CanvasComponent[] }
   - example: { type: "ContainerComponent", props: { layout: "flex", gap: 16 }, children: [...] }

5. HeroComponent
   - props: { title: string, subtitle?: string, ctaText?: string, ctaLink?: string }
   - example: { type: "HeroComponent", props: { title: "Build Fast", subtitle: "No code needed" } }

6. NavbarComponent
   - props: { logo: string, links: Array<{ text: string, href: string }> }
   - example: { type: "NavbarComponent", props: { logo: "Brand", links: [...] } }

7. FooterComponent
   - props: { copyright: string, links?: Array<{ text: string, href: string }> }
   - example: { type: "FooterComponent", props: { copyright: "© 2025 Company" } }

8. CardComponent
   - props: { title: string, description?: string, image?: string }
   - example: { type: "CardComponent", props: { title: "Feature", description: "..." } }

9. FormComponent
   - props: { fields: Array<{ name: string, type: string, label: string }>, submitText: string }
   - example: { type: "FormComponent", props: { fields: [...], submitText: "Submit" } }
`;

// ═══════════════════════════════════════════════════════════════
// SYSTEM PROMPTS
// ═══════════════════════════════════════════════════════════════

export const SYSTEM_PROMPT = `You are a professional web designer AI assistant for Bubble Gum, a no-code website builder.

Your role:
- Generate complete, production-ready page layouts
- Use ONLY components from the available library
- Follow modern web design best practices
- Ensure mobile-responsive design
- Include proper accessibility (WCAG AA)
- Create semantic HTML structure

Important rules:
1. Output ONLY valid JSON matching the CanvasComponent[] type
2. Use ONLY components listed in the available components
3. Every component must have a unique ID (use nanoid format like "abc123xyz")
4. Include proper styling using inline CSS objects
5. Ensure components are positioned logically (x, y coordinates)
6. Always include meaningful text content (no "Lorem ipsum")
7. Make pages visually appealing and user-friendly

${AVAILABLE_COMPONENTS}

Output Format (STRICT - FOLLOW EXACTLY):
{
  "components": [
    {
      "id": "abc123xyz",
      "type": "NavbarComponent",
      "props": { "logo": "Brand Name", "links": [{"text": "Home", "href": "#"}] },
      "style": {},
      "position": { "x": 0, "y": 0 },
      "size": { "width": 1200, "height": 80 },
      "children": []
    },
    {
      "id": "def456uvw",
      "type": "HeroComponent",
      "props": { "title": "Welcome", "subtitle": "Description", "ctaText": "Get Started", "ctaLink": "#" },
      "style": {},
      "position": { "x": 0, "y": 80 },
      "size": { "width": 1200, "height": 500 }
    }
  ],
  "metadata": {
    "title": "Page title for SEO",
    "description": "Page description for SEO",
    "suggestedRoute": "/suggested-url"
  }
}

CRITICAL RULES:
- Respond ONLY with the JSON object above
- NO markdown code blocks (no \`\`\`json)
- NO explanations or additional text
- NO comments in JSON
- Start response with { and end with }
- Ensure all JSON is valid (proper quotes, commas, brackets)`;

// ═══════════════════════════════════════════════════════════════
// PAGE GENERATION PROMPTS
// ═══════════════════════════════════════════════════════════════

export const PAGE_GENERATION_PROMPT = (
  userPrompt: string,
  pageType?: string,
  industry?: string
) => `
Generate a complete ${pageType || 'custom'} page ${industry ? `for a ${industry} business` : ''}.

User Request: "${userPrompt}"

Requirements:
- Create a professional, modern design
- Include all essential sections for a ${pageType || 'custom'} page
- Use appropriate components from the available library
- Make it visually appealing and conversion-focused
- Include clear call-to-action elements
- Ensure mobile-responsive layout
- Add proper spacing and hierarchy

Generate the page now.`;

// ═══════════════════════════════════════════════════════════════
// COMPONENT GENERATION PROMPTS
// ═══════════════════════════════════════════════════════════════

export const COMPONENT_GENERATION_PROMPT = (
  userPrompt: string,
  componentType: string,
  context?: string
) => `
Generate a single ${componentType} component.

User Request: "${userPrompt}"
${context ? `Context: ${context}` : ''}

Requirements:
- Create ONLY ONE component of type ${componentType}
- Make it production-ready and visually appealing
- Include all necessary props
- Use appropriate styling
- Ensure accessibility

Output format:
{
  "component": {
    "id": "unique-id",
    "type": "${componentType}",
    "props": { ... },
    "style": { ... },
    "position": { "x": 0, "y": 0 },
    "size": { "width": 400, "height": 200 }
  }
}

Generate the component now.`;

// ═══════════════════════════════════════════════════════════════
// TEXT IMPROVEMENT PROMPTS
// ═══════════════════════════════════════════════════════════════

export const TEXT_IMPROVEMENT_PROMPT = (
  text: string,
  variant?: string,
  tone?: string,
  length?: string
) => `
Improve this ${variant || 'text'} for a website.

Original text: "${text}"

Requirements:
- Tone: ${tone || 'professional'}
- Length: ${length || 'keep similar length'}
- Make it more engaging and compelling
- Ensure clarity and readability
- Optimize for ${variant || 'general content'}
- Keep the core message intact

Output format:
{
  "improved": "your improved text here"
}

Improve the text now.`;

// ═══════════════════════════════════════════════════════════════
// LAYOUT SUGGESTION PROMPTS
// ═══════════════════════════════════════════════════════════════

export const LAYOUT_SUGGESTION_PROMPT = (
  pageType: string,
  existingComponents?: number
) => `
Suggest an optimal layout structure for a ${pageType} page.
${existingComponents ? `The page currently has ${existingComponents} components.` : ''}

Provide:
- Recommended sections in order
- Component types for each section
- Layout arrangement (flex/grid)
- Spacing and sizing suggestions

Output format:
{
  "sections": [
    {
      "name": "Section name",
      "components": ["ComponentType1", "ComponentType2"],
      "layout": "flex" | "grid",
      "order": 1
    }
  ],
  "reasoning": "Brief explanation of the layout choices"
}

Generate the layout suggestion now.`;

// ═══════════════════════════════════════════════════════════════
// CONVERSATION CONTEXT BUILDER
// ═══════════════════════════════════════════════════════════════

export const buildConversationContext = (
  projectName?: string,
  currentPage?: string,
  existingComponents?: number
) => `
Current Context:
- Project: ${projectName || 'Untitled Project'}
- Page: ${currentPage || 'Untitled Page'}
- Existing components: ${existingComponents || 0}

Remember: Always use components from the available library. Focus on creating professional, conversion-optimized designs.`;

// ═══════════════════════════════════════════════════════════════
// QUICK PROMPT TEMPLATES
// ═══════════════════════════════════════════════════════════════

export const QUICK_PROMPTS = [
  {
    label: 'Landing Page',
    prompt: 'Create a modern landing page with hero section, features, and CTA',
    category: 'pages',
  },
  {
    label: 'Hero Section',
    prompt: 'Add a compelling hero section with headline, subtext, and call-to-action button',
    category: 'sections',
  },
  {
    label: 'Features Grid',
    prompt: 'Create a 3-column features section highlighting key benefits',
    category: 'sections',
  },
  {
    label: 'Contact Form',
    prompt: 'Add a contact form with name, email, message fields',
    category: 'components',
  },
  {
    label: 'Pricing Table',
    prompt: 'Create a pricing section with 3 tiers: Basic, Pro, Enterprise',
    category: 'sections',
  },
  {
    label: 'Testimonials',
    prompt: 'Add a testimonials section with customer reviews',
    category: 'sections',
  },
  {
    label: 'About Section',
    prompt: 'Create an about section with company story and mission',
    category: 'sections',
  },
  {
    label: 'FAQ Section',
    prompt: 'Add a FAQ section with common questions and answers',
    category: 'sections',
  },
  {
    label: 'Call to Action',
    prompt: 'Create a prominent call-to-action section at the bottom',
    category: 'components',
  },
  {
    label: 'Blog Layout',
    prompt: 'Create a blog layout with featured posts and sidebar',
    category: 'pages',
  },
];
