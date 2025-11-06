// ═══════════════════════════════════════════════════════════════
// HTML SANITIZATION - XSS PREVENTION
// ═══════════════════════════════════════════════════════════════
// Sanitizes user-generated HTML using DOMPurify
// Prevents XSS attacks by removing malicious scripts
// ═══════════════════════════════════════════════════════════════

// Dynamic import for client-side only (Next.js 16 compatibility)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let DOMPurify: any = null;

if (typeof window !== 'undefined') {
  // Client-side only
  import('dompurify').then((module) => {
    DOMPurify = module.default;
  });
}

/**
 * Sanitize HTML to prevent XSS attacks
 * Use for general user-generated content
 * @param dirty - Unsanitized HTML string
 * @returns Sanitized HTML string
 */
export function sanitizeHTML(dirty: string): string {
  if (!DOMPurify) {
    // Fallback: strip all HTML tags if DOMPurify not loaded
    return dirty.replace(/<[^>]*>/g, '').trim();
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b',
      'i',
      'em',
      'strong',
      'a',
      'p',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'br',
      'img',
      'blockquote',
      'code',
      'pre',
      'span',
      'div',
    ],
    ALLOWED_ATTR: ['href', 'class', 'alt', 'src', 'target', 'rel'],
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|news|data):|[^a-z]|[a-z+.\-]*(?:[^a-z+.\-:]|$))/i,
  });
}

/**
 * Sanitize rich text editor content
 * More permissive - allows styling and formatting
 * @param dirty - Unsanitized rich text HTML
 * @returns Sanitized HTML string
 */
export function sanitizeRichText(dirty: string): string {
  if (!DOMPurify) {
    // Fallback: strip all HTML tags if DOMPurify not loaded
    return dirty.replace(/<[^>]*>/g, '').trim();
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b',
      'i',
      'em',
      'strong',
      'a',
      'p',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'br',
      'span',
      'div',
      'blockquote',
      'code',
      'pre',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    ALLOWED_ATTR: ['href', 'class', 'style', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize marketing/landing page content
 * Minimal HTML allowed - mostly for links and formatting
 * @param dirty - Unsanitized marketing HTML
 * @returns Sanitized HTML string
 */
export function sanitizeMarketing(dirty: string): string {
  if (!DOMPurify) {
    // Fallback: strip all HTML tags if DOMPurify not loaded
    return dirty.replace(/<[^>]*>/g, '').trim();
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['a', 'br', 'p', 'strong', 'em', 'u', 'b', 'i'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    KEEP_CONTENT: true,
  });
}

/**
 * Strip all HTML tags - return plain text only
 * Use when you need absolute safety
 * @param dirty - HTML string
 * @returns Plain text (no HTML)
 */
export function stripHTML(dirty: string): string {
  if (!DOMPurify) {
    // Fallback: strip all HTML tags with regex
    const stripped = dirty.replace(/<[^>]*>/g, '');
    return stripped.replace(/\s+/g, ' ').trim();
  }

  // First sanitize with DOMPurify to prevent XSS
  const sanitized = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  });

  // Then strip all remaining HTML tags with regex
  const stripped = sanitized.replace(/<[^>]*>/g, '');

  // Remove extra whitespace and trim
  return stripped.replace(/\s+/g, ' ').trim();
}

/**
 * Sanitize URL to prevent javascript: and data: URIs
 * @param url - Unsanitized URL
 * @returns Sanitized URL or empty string if dangerous
 */
export function sanitizeURL(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http, https, and mailto protocols
    if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      return url;
    }
    return '';
  } catch {
    // Invalid URL
    return '';
  }
}
