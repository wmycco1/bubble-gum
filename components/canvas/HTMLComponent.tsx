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

import { useMemo } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { mergeAllStyles, buildClassNameFromProps } from '@/lib/utils/apply-custom-props';
import DOMPurify from 'isomorphic-dompurify';

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

  // Sanitize HTML content
  const sanitizedContent = useMemo(() => {
    if (!sanitize) {
      // WARNING: Only use unsanitized HTML from trusted sources
      return content;
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
    return DOMPurify.sanitize(content, config);
  }, [content, sanitize, allowedTags, allowedAttributes]);

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
