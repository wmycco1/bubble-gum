/**
 * Base Parameters
 * God-Tier Development Protocol 2025
 *
 * Core parameters inherited by ALL atomic levels (Template → Organism → Molecule → Atom)
 */

import React from 'react';

/**
 * BaseParameters
 *
 * These parameters are available on EVERY component regardless of atomic level.
 * Provides core functionality for: identification, styling, accessibility, testing.
 *
 * @example
 * <Button id="submit-btn" className="custom-class" aria-label="Submit form" />
 */
export interface BaseParameters {
  // ============================================
  // IDENTIFICATION & META
  // ============================================

  /**
   * Unique identifier for the component
   * Used for: DOM manipulation, form submissions, analytics
   */
  id?: string;

  /**
   * CSS class name(s) to apply
   * Used for: custom styling, targeting
   */
  className?: string;

  /**
   * Inline styles (use sparingly - prefer className)
   * Used for: dynamic styles, one-off adjustments
   */
  style?: React.CSSProperties;

  /**
   * Data attributes for custom metadata
   * Automatically prefixed with 'data-'
   *
   * @example
   * dataAttributes={{ userId: '123', category: 'button' }}
   * // Renders: data-user-id="123" data-category="button"
   */
  dataAttributes?: Record<string, string | number>;

  // ============================================
  // ACCESSIBILITY (WCAG 2.2 AA)
  // ============================================

  /**
   * Accessible label for screen readers
   * REQUIRED for: icon-only buttons, image components without alt
   *
   * @example
   * <Button aria-label="Close modal">×</Button>
   */
  'aria-label'?: string;

  /**
   * ID of element that describes this component
   * Used for: complex descriptions, error messages
   *
   * @example
   * <Input aria-describedby="password-requirements" />
   * <div id="password-requirements">Must be 8+ characters</div>
   */
  'aria-describedby'?: string;

  /**
   * ID of element that labels this component
   * Alternative to aria-label when label exists separately
   *
   * @example
   * <label id="email-label">Email</label>
   * <Input aria-labelledby="email-label" />
   */
  'aria-labelledby'?: string;

  /**
   * ARIA role override
   * Use only when semantic HTML is insufficient
   *
   * @example
   * <div role="button" onClick={handleClick}>Click me</div>
   */
  role?: string;

  /**
   * Indicates element is hidden from screen readers
   * Use for: decorative elements, duplicate content
   *
   * @example
   * <Icon aria-hidden={true} /> {/* Decorative icon */}
   */
  'aria-hidden'?: boolean;

  /**
   * Indicates element state is expanded or collapsed
   * Use for: accordions, dropdowns, disclosures
   */
  'aria-expanded'?: boolean;

  /**
   * Indicates element has popup (menu, dialog, etc.)
   * Use for: dropdown triggers, modal openers
   */
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

  /**
   * ID of element controlled by this component
   * Use for: accordion triggers, tab controls
   *
   * @example
   * <button aria-controls="panel-1">Show Panel</button>
   * <div id="panel-1">Panel content</div>
   */
  'aria-controls'?: string;

  /**
   * Indicates current state in a set
   * Use for: current page, current step, active tab
   */
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';

  /**
   * Indicates element is disabled
   * Automatically set by disabled prop, can override
   */
  'aria-disabled'?: boolean;

  /**
   * Indicates element has invalid value
   * Use for: form validation errors
   */
  'aria-invalid'?: boolean;

  /**
   * Indicates element is required
   * Automatically set by required prop, can override
   */
  'aria-required'?: boolean;

  /**
   * Live region politeness level
   * Use for: dynamic content updates, notifications
   */
  'aria-live'?: 'off' | 'polite' | 'assertive';

  /**
   * Indicates element is busy/loading
   * Use for: async data loading, form submission
   */
  'aria-busy'?: boolean;

  // ============================================
  // TESTING
  // ============================================

  /**
   * Test ID for automated testing (React Testing Library, Playwright)
   * Preferred over selecting by className or text
   *
   * @example
   * <Button data-testid="submit-button">Submit</Button>
   *
   * // In tests:
   * screen.getByTestId('submit-button');
   */
  'data-testid'?: string;

  /**
   * Cypress test selector (optional, some teams prefer data-cy)
   *
   * @example
   * <Button data-cy="submit-btn">Submit</Button>
   *
   * // In Cypress:
   * cy.get('[data-cy=submit-btn]').click();
   */
  'data-cy'?: string;

  // ============================================
  // PERFORMANCE
  // ============================================

  /**
   * React key prop for list items
   * REQUIRED for: components in .map() loops
   *
   * @example
   * {items.map(item => (
   *   <Card key={item.id} {...item} />
   * ))}
   */
  key?: string | number;

  /**
   * React ref for DOM access
   * Use for: focus management, scroll control, measurements
   *
   * @example
   * const inputRef = useRef<HTMLInputElement>(null);
   * <Input ref={inputRef} />
   */
  ref?: React.Ref<any>;

  // ============================================
  // CHILDREN & COMPOSITION
  // ============================================

  /**
   * Child components or content
   * Used for: composition, slots, render props
   *
   * @example
   * <Container>
   *   <Heading>Title</Heading>
   *   <Text>Content</Text>
   * </Container>
   */
  children?: React.ReactNode;

  // ============================================
  // POLYMORPHIC COMPONENT
  // ============================================

  /**
   * Render as different HTML element
   * Use for: semantic HTML flexibility
   *
   * @example
   * <Text as="h1">Heading</Text>
   * <Text as="p">Paragraph</Text>
   * <Button as="a" href="/link">Link Button</Button>
   */
  as?: React.ElementType;

  // ============================================
  // SEO & METADATA
  // ============================================

  /**
   * Title attribute (tooltip on hover)
   * Use sparingly - not accessible on touch devices
   *
   * @example
   * <abbr title="HyperText Markup Language">HTML</abbr>
   */
  title?: string;

  /**
   * Language of content (for multi-language sites)
   *
   * @example
   * <Text lang="es">Hola mundo</Text>
   */
  lang?: string;

  /**
   * Text direction override
   *
   * @example
   * <Text dir="rtl">مرحبا بالعالم</Text>
   */
  dir?: 'ltr' | 'rtl' | 'auto';

  // ============================================
  // ADVANCED
  // ============================================

  /**
   * Tab index for keyboard navigation
   * -1: Programmatically focusable only
   *  0: Natural tab order
   * >0: Manual tab order (avoid - breaks accessibility)
   *
   * @example
   * <div tabIndex={0} onClick={handleClick}>Focusable div</div>
   */
  tabIndex?: number;

  /**
   * Prevent default browser behavior
   * Use for: custom drag & drop, context menus
   */
  draggable?: boolean;

  /**
   * Spellcheck attribute
   */
  spellCheck?: boolean;

  /**
   * Autocapitalize attribute (mobile)
   */
  autoCapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';

  /**
   * Autocorrect attribute (mobile)
   */
  autoCorrect?: 'on' | 'off';

  /**
   * Contenteditable attribute
   * Use for: rich text editors, inline editing
   */
  contentEditable?: boolean | 'true' | 'false' | 'inherit';

  /**
   * Hidden attribute (removes from DOM flow)
   * Prefer visibility controls from ResponsiveParameters
   */
  hidden?: boolean;

  /**
   * Inert attribute (HTML5 - disables interactions)
   * Use for: modal backdrops, disabled sections
   */
  inert?: boolean;

  /**
   * Popover attribute (HTML5 - experimental)
   */
  popover?: 'auto' | 'manual';

  // ============================================
  // EVENTS
  // ============================================

  /**
   * Click handler
   * Available on all components for flexibility
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * Double click handler
   */
  onDoubleClick?: (event: React.MouseEvent) => void;

  /**
   * Context menu (right-click) handler
   */
  onContextMenu?: (event: React.MouseEvent) => void;

  /**
   * Focus handler
   */
  onFocus?: (event: React.FocusEvent) => void;

  /**
   * Blur handler
   */
  onBlur?: (event: React.FocusEvent) => void;

  /**
   * Mouse enter handler (doesn't bubble)
   */
  onMouseEnter?: (event: React.MouseEvent) => void;

  /**
   * Mouse leave handler (doesn't bubble)
   */
  onMouseLeave?: (event: React.MouseEvent) => void;

  /**
   * Mouse over handler (bubbles)
   */
  onMouseOver?: (event: React.MouseEvent) => void;

  /**
   * Mouse out handler (bubbles)
   */
  onMouseOut?: (event: React.MouseEvent) => void;

  /**
   * Mouse down handler
   */
  onMouseDown?: (event: React.MouseEvent) => void;

  /**
   * Mouse up handler
   */
  onMouseUp?: (event: React.MouseEvent) => void;

  /**
   * Mouse move handler
   */
  onMouseMove?: (event: React.MouseEvent) => void;

  /**
   * Key down handler
   */
  onKeyDown?: (event: React.KeyboardEvent) => void;

  /**
   * Key up handler
   */
  onKeyUp?: (event: React.KeyboardEvent) => void;

  /**
   * Key press handler (deprecated but still used)
   */
  onKeyPress?: (event: React.KeyboardEvent) => void;

  /**
   * Touch start handler (mobile)
   */
  onTouchStart?: (event: React.TouchEvent) => void;

  /**
   * Touch end handler (mobile)
   */
  onTouchEnd?: (event: React.TouchEvent) => void;

  /**
   * Touch move handler (mobile)
   */
  onTouchMove?: (event: React.TouchEvent) => void;

  /**
   * Touch cancel handler (mobile)
   */
  onTouchCancel?: (event: React.TouchEvent) => void;

  /**
   * Drag start handler
   */
  onDragStart?: (event: React.DragEvent) => void;

  /**
   * Drag end handler
   */
  onDragEnd?: (event: React.DragEvent) => void;

  /**
   * Drag enter handler
   */
  onDragEnter?: (event: React.DragEvent) => void;

  /**
   * Drag leave handler
   */
  onDragLeave?: (event: React.DragEvent) => void;

  /**
   * Drag over handler
   */
  onDragOver?: (event: React.DragEvent) => void;

  /**
   * Drop handler
   */
  onDrop?: (event: React.DragEvent) => void;

  /**
   * Scroll handler
   */
  onScroll?: (event: React.UIEvent) => void;

  /**
   * Wheel handler (mouse wheel/trackpad)
   */
  onWheel?: (event: React.WheelEvent) => void;

  /**
   * Animation start handler
   */
  onAnimationStart?: (event: React.AnimationEvent) => void;

  /**
   * Animation end handler
   */
  onAnimationEnd?: (event: React.AnimationEvent) => void;

  /**
   * Animation iteration handler
   */
  onAnimationIteration?: (event: React.AnimationEvent) => void;

  /**
   * Transition end handler
   */
  onTransitionEnd?: (event: React.TransitionEvent) => void;
}

/**
 * Type guard to check if component has children
 */
export function hasChildren(props: BaseParameters): props is Required<Pick<BaseParameters, 'children'>> {
  return props.children !== undefined && props.children !== null;
}

/**
 * Type guard to check if component is polymorphic
 */
export function isPolymorphic(props: BaseParameters): props is Required<Pick<BaseParameters, 'as'>> {
  return props.as !== undefined;
}

/**
 * Helper to merge data attributes
 */
export function mergeDataAttributes(
  ...dataAttrs: Array<Record<string, string | number> | undefined>
): Record<string, string> {
  const merged: Record<string, string> = {};

  dataAttrs.forEach((attrs) => {
    if (!attrs) return;

    Object.entries(attrs).forEach(([key, value]) => {
      // Convert camelCase to kebab-case and prefix with 'data-'
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      merged[`data-${kebabKey}`] = String(value);
    });
  });

  return merged;
}

/**
 * Helper to extract ARIA props from BaseParameters
 */
export function extractAriaProps(props: BaseParameters): Record<string, any> {
  const ariaProps: Record<string, any> = {};

  Object.keys(props).forEach((key) => {
    if (key.startsWith('aria-')) {
      ariaProps[key] = (props as any)[key];
    }
  });

  return ariaProps;
}
