/**
 * Filter DOM Props Utility
 * God-Tier Development Protocol 2025
 *
 * Filters out React-specific props that should not be passed to DOM elements.
 * This prevents React warnings in Next.js 16 + React 19.
 *
 * @example
 * ```tsx
 * const { validProps, invalidProps } = filterDOMProps(rest);
 * return <div {...validProps}>content</div>;
 * ```
 */

/**
 * List of valid HTML attributes that can be passed to DOM elements.
 * Based on React's HTML attributes whitelist.
 */
const VALID_DOM_ATTRIBUTES = new Set([
  // Standard HTML attributes
  'id',
  'className',
  'style',
  'title',
  'role',
  'tabIndex',
  'dir',
  'lang',
  'hidden',
  'draggable',
  'contentEditable',
  'spellCheck',
  'translate',

  // ARIA attributes (aria-*)
  // We allow all aria-* attributes via regex check

  // Data attributes (data-*)
  // We allow all data-* attributes via regex check

  // Event handlers (on*)
  // We allow all on* attributes via regex check

  // Form attributes
  'accept',
  'acceptCharset',
  'action',
  'autoComplete',
  'autoFocus',
  'checked',
  'disabled',
  'form',
  'formAction',
  'formEncType',
  'formMethod',
  'formNoValidate',
  'formTarget',
  'max',
  'maxLength',
  'min',
  'minLength',
  'multiple',
  'name',
  'pattern',
  'placeholder',
  'readOnly',
  'required',
  'size',
  'step',
  'type',
  'value',

  // Link attributes
  'href',
  'hrefLang',
  'target',
  'rel',
  'download',

  // Media attributes
  'alt',
  'src',
  'srcSet',
  'sizes',
  'poster',
  'preload',
  'autoPlay',
  'controls',
  'loop',
  'muted',
  'playsInline',

  // Table attributes
  'colSpan',
  'rowSpan',
  'headers',
  'scope',

  // Other common attributes
  'width',
  'height',
  'loading',
  'decoding',
  'referrerPolicy',
  'crossOrigin',
]);

/**
 * Check if an attribute is a valid DOM attribute
 */
function isValidDOMAttribute(key: string): boolean {
  // Check if it's in the whitelist
  if (VALID_DOM_ATTRIBUTES.has(key)) {
    return true;
  }

  // Allow aria-* attributes
  if (key.startsWith('aria-')) {
    return true;
  }

  // Allow data-* attributes
  if (key.startsWith('data-')) {
    return true;
  }

  // Allow event handlers (onClick, onMouseEnter, etc.)
  if (key.startsWith('on') && key.length > 2 && key[2] === key[2].toUpperCase()) {
    return true;
  }

  return false;
}

/**
 * Filter props to only include valid DOM attributes
 *
 * @param props - Props object to filter
 * @returns Object with validProps (safe for DOM) and invalidProps (React-specific)
 */
export function filterDOMProps<T extends Record<string, any>>(
  props: T
): {
  validProps: Partial<T>;
  invalidProps: Partial<T>;
} {
  const validProps: Partial<T> = {};
  const invalidProps: Partial<T> = {};

  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      if (isValidDOMAttribute(key)) {
        validProps[key] = props[key];
      } else {
        invalidProps[key] = props[key];
      }
    }
  }

  return { validProps, invalidProps };
}

/**
 * Get only valid DOM props (shorthand for filterDOMProps)
 */
export function getValidDOMProps<T extends Record<string, any>>(
  props: T
): Partial<T> {
  return filterDOMProps(props).validProps;
}
