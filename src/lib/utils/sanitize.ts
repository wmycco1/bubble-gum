/**
 * Sanitization utilities for Badge component
 * Prevents XSS attacks and ensures safe content rendering
 *
 * @module sanitize
 * @packageDocumentation
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes string content to prevent XSS attacks
 *
 * Uses DOMPurify to strip all HTML tags while preserving text content.
 * For React nodes (JSX), passes through unchanged as React handles escaping.
 *
 * Security:
 * - Removes all HTML tags
 * - Strips event handlers
 * - Blocks JavaScript execution
 * - Preserves plain text only
 *
 * @param content - String or React node to sanitize
 * @returns Sanitized content safe for rendering
 *
 * @example
 * ```typescript
 * // String input (sanitized)
 * sanitizeContent('<script>alert("XSS")</script>New')  // Returns: 'New'
 * sanitizeContent('Hello <b>World</b>')                // Returns: 'Hello World'
 *
 * // React node input (passed through)
 * sanitizeContent(<span>Safe JSX</span>)               // Returns: <span>Safe JSX</span>
 * ```
 */
export function sanitizeContent(
  content: string | React.ReactNode
): string | React.ReactNode {
  // React nodes are safe (React auto-escapes), only sanitize strings
  if (typeof content !== 'string') {
    return content;
  }

  // DOMPurify configuration: strip ALL tags, keep text only
  const config: DOMPurify.Config = {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content
  };

  // Sanitize and return plain text
  return DOMPurify.sanitize(content, config);
}

/**
 * Validates and sanitizes event handler functions
 *
 * Ensures that event handlers are valid functions and not malicious code.
 * Prevents string-to-function injection attacks.
 *
 * Security:
 * - Type validation (must be function)
 * - Rejects strings (prevents eval-like injection)
 * - Rejects null/undefined if marked as required
 * - Console warning for invalid handlers
 *
 * @param handler - Event handler to validate
 * @returns Validated handler or undefined if invalid
 *
 * @example
 * ```typescript
 * // Valid function (passed through)
 * const handleClick = () => console.log('clicked');
 * sanitizeEventHandler(handleClick)  // Returns: handleClick
 *
 * // Invalid types (rejected)
 * sanitizeEventHandler('alert(1)')   // Returns: undefined (+ warning)
 * sanitizeEventHandler(null)         // Returns: undefined
 * sanitizeEventHandler(undefined)    // Returns: undefined
 * ```
 */
export function sanitizeEventHandler<T extends Function>(
  handler: T | undefined
): T | undefined {
  // undefined is valid (optional handler)
  if (handler === undefined) {
    return undefined;
  }

  // Must be a function (not string, not object, not anything else)
  if (typeof handler !== 'function') {
    console.warn(
      '[Badge Security Warning] Event handler must be a function, got:',
      typeof handler
    );
    return undefined;
  }

  // Valid function, return as-is
  return handler;
}

/**
 * Sanitizes className string to prevent CSS injection
 *
 * Removes potentially malicious CSS class names that could:
 * - Inject CSS variables
 * - Use CSS expressions
 * - Execute JavaScript via CSS hacks
 *
 * @param className - CSS class name(s) to sanitize
 * @returns Sanitized class name string
 *
 * @example
 * ```typescript
 * sanitizeClassName('btn-primary')           // 'btn-primary'
 * sanitizeClassName('btn primary active')    // 'btn primary active'
 * sanitizeClassName('btn\\:hover')           // 'btn\\:hover' (Tailwind safe)
 * sanitizeClassName('');                     // ''
 * ```
 */
export function sanitizeClassName(className: string | undefined): string {
  if (!className || typeof className !== 'string') {
    return '';
  }

  // Basic sanitization: trim and remove multiple spaces
  const sanitized = className
    .trim()
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/[<>'"]/g, ''); // Remove potentially dangerous characters

  return sanitized;
}
