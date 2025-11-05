// ═══════════════════════════════════════════════════════════════
// HTML SANITIZATION - XSS PREVENTION
// ═══════════════════════════════════════════════════════════════
// Sanitizes user-generated HTML using DOMPurify
// Prevents XSS attacks by removing malicious scripts
// ═══════════════════════════════════════════════════════════════

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML to prevent XSS attacks
 * Use for general user-generated content
 * @param dirty - Unsanitized HTML string
 * @returns Sanitized HTML string
 */
export function sanitizeHTML(dirty: string): string {
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
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  });
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
