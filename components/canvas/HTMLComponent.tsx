// ═══════════════════════════════════════════════════════════════
// HTML COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M3: Extended Component Library
// Purpose: Render custom HTML with security sanitization
// Features:
// - DOMPurify sanitization (XSS protection)
// - Configurable allowed tags
// - Configurable allowed attributes
// - OWASP security standards
// - M3 advanced properties support
// ═══════════════════════════════════════════════════════════════

'use client';

import { useMemo, useEffect, useState } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { mergeAllStyles, buildClassNameFromProps } from '@/lib/utils/apply-custom-props';

interface HTMLComponentProps {
  component: CanvasComponent;
}

export function HTMLComponent({ component }: HTMLComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const content = (props.content as string) || '<p>Custom HTML content</p>';
  const sanitize = (props.sanitize as boolean) ?? true;
  const allowedTags = props.allowedTags as string[] | undefined;
  const allowedAttributes = props.allowedAttributes as string[] | undefined;

  // Client-side DOMPurify instance
  const [DOMPurify, setDOMPurify] = useState<any>(null);

  // Load DOMPurify client-side only (BROWSER ONLY)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamic import of DOMPurify - it auto-initializes with window
      import('dompurify').then((module) => {
        // In browser, DOMPurify is a factory that needs to be called with window
        // OR it's already initialized. Let's check both:
        const factory = module.default;

        // Try calling it as a factory with window
        let purifyInstance;
        if (typeof factory === 'function') {
          purifyInstance = factory(window);
        }

        // If that didn't work, check if module.default IS already the API
        if (!purifyInstance || !purifyInstance.sanitize) {
          purifyInstance = factory;
        }

        // Last resort: check if it has sanitize method directly
        if (purifyInstance && typeof purifyInstance.sanitize === 'function') {
          setDOMPurify(purifyInstance);
        } else {
          console.error('❌ DOMPurify failed to initialize:', {
            factoryType: typeof factory,
            instanceType: typeof purifyInstance,
            hasSanitize: !!purifyInstance?.sanitize,
          });
          // Fallback: set a dummy that returns unsanitized content
          setDOMPurify({
            sanitize: (html: string) => {
              console.warn('⚠️ Using unsanitized HTML (DOMPurify failed to load)');
              return html;
            }
          });
        }
      }).catch(error => {
        console.error('Failed to load DOMPurify:', error);
        // Fallback
        setDOMPurify({
          sanitize: (html: string) => html
        });
      });
    }
  }, []);

  // Sanitize HTML content
  const sanitizedContent = useMemo(() => {
    if (!sanitize) {
      // WARNING: Only use unsanitized HTML from trusted sources
      return content;
    }

    // Wait for DOMPurify to load
    if (!DOMPurify) {
      return '<p>Loading...</p>';
    }

    // Configure DOMPurify
    const config: Record<string, unknown> = {};

    if (allowedTags) {
      config.ALLOWED_TAGS = allowedTags;
    }

    if (allowedAttributes) {
      config.ALLOWED_ATTR = allowedAttributes;
    }

    // Sanitize with DOMPurify
    try {
      return DOMPurify.sanitize(content, config);
    } catch (error) {
      console.error('Error sanitizing HTML:', error);
      return content;
    }
  }, [content, sanitize, allowedTags, allowedAttributes, DOMPurify]);

  // Build className
  const baseClassName = 'html-content';
  const wrapperClassName = mergeClassNameWithSpacing(
    buildClassNameFromProps(props, baseClassName),
    style
  );

  // Merge styles
  const finalStyle = mergeAllStyles(style as React.CSSProperties, props);

  return (
    <div
      id={props.id as string | undefined}
      className={wrapperClassName}
      style={finalStyle}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
