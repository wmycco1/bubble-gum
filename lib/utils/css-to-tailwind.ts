// ═══════════════════════════════════════════════════════════════
// CSS TO TAILWIND CONVERTER UTILITY
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - PHASE 1: Custom CSS/Tailwind Editor
// Features:
// - Parse CSS string to object
// - Convert CSS properties to Tailwind classes
// - Bidirectional conversion (CSS ↔ Tailwind)
// - Handle common CSS properties
// - Support for custom values
// ═══════════════════════════════════════════════════════════════

/**
 * CSS to Tailwind class mapping
 * Based on Tailwind CSS v4.1.16 (Nov 2025)
 */
const CSS_TO_TAILWIND_MAP: Record<string, (value: string) => string | null> = {
  // Display & Layout
  display: (value) => {
    const map: Record<string, string> = {
      block: 'block',
      'inline-block': 'inline-block',
      inline: 'inline',
      flex: 'flex',
      'inline-flex': 'inline-flex',
      grid: 'grid',
      'inline-grid': 'inline-grid',
      none: 'hidden',
    };
    return map[value] || null;
  },

  // Flexbox
  'flex-direction': (value) => {
    const map: Record<string, string> = {
      row: 'flex-row',
      'row-reverse': 'flex-row-reverse',
      column: 'flex-col',
      'column-reverse': 'flex-col-reverse',
    };
    return map[value] || null;
  },

  'justify-content': (value) => {
    const map: Record<string, string> = {
      'flex-start': 'justify-start',
      'flex-end': 'justify-end',
      center: 'justify-center',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
      'space-evenly': 'justify-evenly',
    };
    return map[value] || null;
  },

  'align-items': (value) => {
    const map: Record<string, string> = {
      'flex-start': 'items-start',
      'flex-end': 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    };
    return map[value] || null;
  },

  // Spacing (using Tailwind spacing scale)
  margin: (value) => convertSpacing('m', value),
  'margin-top': (value) => convertSpacing('mt', value),
  'margin-right': (value) => convertSpacing('mr', value),
  'margin-bottom': (value) => convertSpacing('mb', value),
  'margin-left': (value) => convertSpacing('ml', value),

  padding: (value) => convertSpacing('p', value),
  'padding-top': (value) => convertSpacing('pt', value),
  'padding-right': (value) => convertSpacing('pr', value),
  'padding-bottom': (value) => convertSpacing('pb', value),
  'padding-left': (value) => convertSpacing('pl', value),

  // Sizing
  width: (value) => convertSize('w', value),
  height: (value) => convertSize('h', value),
  'min-width': (value) => convertSize('min-w', value),
  'min-height': (value) => convertSize('min-h', value),
  'max-width': (value) => convertSize('max-w', value),
  'max-height': (value) => convertSize('max-h', value),

  // Typography
  'font-size': (value) => {
    const map: Record<string, string> = {
      '12px': 'text-xs',
      '14px': 'text-sm',
      '16px': 'text-base',
      '18px': 'text-lg',
      '20px': 'text-xl',
      '24px': 'text-2xl',
      '30px': 'text-3xl',
      '36px': 'text-4xl',
      '48px': 'text-5xl',
      '60px': 'text-6xl',
    };
    return map[value] || `text-[${value}]`;
  },

  'font-weight': (value) => {
    const map: Record<string, string> = {
      '100': 'font-thin',
      '200': 'font-extralight',
      '300': 'font-light',
      '400': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold',
      '800': 'font-extrabold',
      '900': 'font-black',
      thin: 'font-thin',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };
    return map[value] || null;
  },

  'text-align': (value) => {
    const map: Record<string, string> = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    };
    return map[value] || null;
  },

  'text-transform': (value) => {
    const map: Record<string, string> = {
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
      none: 'normal-case',
    };
    return map[value] || null;
  },

  'text-decoration': (value) => {
    const map: Record<string, string> = {
      underline: 'underline',
      'line-through': 'line-through',
      none: 'no-underline',
    };
    return map[value] || null;
  },

  'line-height': (value) => `leading-[${value}]`,
  'letter-spacing': (value) => `tracking-[${value}]`,

  // Colors
  color: (value) => `text-[${value}]`,
  'background-color': (value) => `bg-[${value}]`,
  'border-color': (value) => `border-[${value}]`,

  // Border
  'border-width': (value) => {
    const map: Record<string, string> = {
      '0px': 'border-0',
      '1px': 'border',
      '2px': 'border-2',
      '4px': 'border-4',
      '8px': 'border-8',
    };
    return map[value] || `border-[${value}]`;
  },

  'border-radius': (value) => {
    const map: Record<string, string> = {
      '0px': 'rounded-none',
      '2px': 'rounded-sm',
      '4px': 'rounded',
      '6px': 'rounded-md',
      '8px': 'rounded-lg',
      '12px': 'rounded-xl',
      '16px': 'rounded-2xl',
      '24px': 'rounded-3xl',
      '9999px': 'rounded-full',
    };
    return map[value] || `rounded-[${value}]`;
  },

  // Effects
  opacity: (value) => {
    const percentage = Math.round(parseFloat(value) * 100);
    return `opacity-${percentage}`;
  },

  'box-shadow': (value) => {
    const map: Record<string, string> = {
      '0 1px 2px 0 rgba(0, 0, 0, 0.05)': 'shadow-sm',
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)': 'shadow',
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)': 'shadow-md',
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)': 'shadow-lg',
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)': 'shadow-xl',
      none: 'shadow-none',
    };
    return map[value] || null;
  },

  // Position
  position: (value) => {
    const map: Record<string, string> = {
      static: 'static',
      fixed: 'fixed',
      absolute: 'absolute',
      relative: 'relative',
      sticky: 'sticky',
    };
    return map[value] || null;
  },

  // Z-index
  'z-index': (value) => `z-[${value}]`,

  // Overflow
  overflow: (value) => {
    const map: Record<string, string> = {
      auto: 'overflow-auto',
      hidden: 'overflow-hidden',
      visible: 'overflow-visible',
      scroll: 'overflow-scroll',
    };
    return map[value] || null;
  },
};

/**
 * Convert spacing value to Tailwind class
 */
function convertSpacing(prefix: string, value: string): string | null {
  // Tailwind spacing scale (in px)
  const spacingMap: Record<string, string> = {
    '0px': '0',
    '1px': 'px',
    '2px': '0.5',
    '4px': '1',
    '6px': '1.5',
    '8px': '2',
    '10px': '2.5',
    '12px': '3',
    '14px': '3.5',
    '16px': '4',
    '20px': '5',
    '24px': '6',
    '28px': '7',
    '32px': '8',
    '36px': '9',
    '40px': '10',
    '48px': '12',
    '56px': '14',
    '64px': '16',
  };

  const tailwindValue = spacingMap[value];
  if (tailwindValue) {
    return `${prefix}-${tailwindValue}`;
  }

  // Custom value
  return `${prefix}-[${value}]`;
}

/**
 * Convert size value to Tailwind class
 */
function convertSize(prefix: string, value: string): string | null {
  const sizeMap: Record<string, string> = {
    '100%': 'full',
    '50%': '1/2',
    '33.333333%': '1/3',
    '66.666667%': '2/3',
    '25%': '1/4',
    '75%': '3/4',
    '20%': '1/5',
    auto: 'auto',
    '100vw': 'screen',
    '100vh': 'screen',
  };

  const tailwindValue = sizeMap[value];
  if (tailwindValue) {
    return `${prefix}-${tailwindValue}`;
  }

  // Custom value
  return `${prefix}-[${value}]`;
}

/**
 * Parse CSS string to object
 */
export function parseCSS(cssString: string): Record<string, string> {
  const cssObject: Record<string, string> = {};

  if (!cssString.trim()) return cssObject;

  // Remove comments
  const cleanCSS = cssString.replace(/\/\*[\s\S]*?\*\//g, '');

  // Split by semicolon
  const declarations = cleanCSS.split(';').filter((d) => d.trim());

  for (const declaration of declarations) {
    const [property, ...valueParts] = declaration.split(':');
    if (!property || valueParts.length === 0) continue;

    const prop = property.trim();
    const value = valueParts.join(':').trim();

    if (prop && value) {
      cssObject[prop] = value;
    }
  }

  return cssObject;
}

/**
 * Convert CSS object to Tailwind classes
 */
export function cssToTailwind(cssObject: Record<string, string>): string[] {
  const tailwindClasses: string[] = [];

  for (const [property, value] of Object.entries(cssObject)) {
    const converter = CSS_TO_TAILWIND_MAP[property];
    if (converter) {
      const tailwindClass = converter(value);
      if (tailwindClass) {
        tailwindClasses.push(tailwindClass);
      }
    }
  }

  return tailwindClasses;
}

/**
 * Convert CSS string directly to Tailwind classes
 */
export function convertCSSStringToTailwind(cssString: string): string {
  const cssObject = parseCSS(cssString);
  const tailwindClasses = cssToTailwind(cssObject);
  return tailwindClasses.join(' ');
}

/**
 * Convert Tailwind classes to CSS object (simplified reverse mapping)
 */
export function tailwindToCSS(tailwindClasses: string): Record<string, string> {
  const cssObject: Record<string, string> = {};
  const classes = tailwindClasses.split(/\s+/).filter((c) => c.trim());

  // This is a simplified reverse mapping - only common classes
  const tailwindToCSSMap: Record<string, Record<string, string>> = {
    // Display
    block: { display: 'block' },
    hidden: { display: 'none' },
    flex: { display: 'flex' },
    grid: { display: 'grid' },

    // Flex direction
    'flex-row': { 'flex-direction': 'row' },
    'flex-col': { 'flex-direction': 'column' },

    // Justify
    'justify-center': { 'justify-content': 'center' },
    'justify-between': { 'justify-content': 'space-between' },

    // Align
    'items-center': { 'align-items': 'center' },
    'items-start': { 'align-items': 'flex-start' },

    // Text
    'text-center': { 'text-align': 'center' },
    'text-left': { 'text-align': 'left' },
    'text-right': { 'text-align': 'right' },

    // Font weight
    'font-bold': { 'font-weight': '700' },
    'font-semibold': { 'font-weight': '600' },
    'font-medium': { 'font-weight': '500' },
    'font-normal': { 'font-weight': '400' },

    // Border radius
    rounded: { 'border-radius': '4px' },
    'rounded-lg': { 'border-radius': '8px' },
    'rounded-full': { 'border-radius': '9999px' },

    // Position
    relative: { position: 'relative' },
    absolute: { position: 'absolute' },
    fixed: { position: 'fixed' },
  };

  for (const className of classes) {
    const cssProps = tailwindToCSSMap[className];
    if (cssProps) {
      Object.assign(cssObject, cssProps);
    } else {
      // Handle arbitrary values like w-[100px]
      const match = className.match(/^([\w-]+)-\[(.+)\]$/);
      if (match) {
        const [, prefix, value] = match;
        // Map prefix to CSS property
        const prefixMap: Record<string, string> = {
          w: 'width',
          h: 'height',
          m: 'margin',
          mt: 'margin-top',
          mr: 'margin-right',
          mb: 'margin-bottom',
          ml: 'margin-left',
          p: 'padding',
          pt: 'padding-top',
          pr: 'padding-right',
          pb: 'padding-bottom',
          pl: 'padding-left',
          text: 'color',
          bg: 'background-color',
          border: 'border-color',
          rounded: 'border-radius',
          z: 'z-index',
          leading: 'line-height',
          tracking: 'letter-spacing',
        };

        const cssProp = prefix ? prefixMap[prefix] : undefined;
        if (cssProp && value) {
          cssObject[cssProp] = value;
        }
      }
    }
  }

  return cssObject;
}

/**
 * Format CSS object to string
 */
export function formatCSSObject(cssObject: Record<string, string>): string {
  return Object.entries(cssObject)
    .map(([property, value]) => `${property}: ${value};`)
    .join('\n');
}
