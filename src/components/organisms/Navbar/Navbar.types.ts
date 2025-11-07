/**
 * Navbar Component Types
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Navbar component (Organism level)
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * Navbar link item configuration
 */
export interface NavbarLink {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Display label
   */
  label: string;

  /**
   * Link URL
   */
  href: string;

  /**
   * External link (opens in new tab)
   * @default false
   */
  external?: boolean;

  /**
   * Active state (current page)
   * @default false
   */
  active?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Icon name (optional)
   */
  icon?: string;
}

/**
 * Navbar visual variants
 */
export type NavbarVariant = 'light' | 'dark' | 'transparent';

/**
 * Mobile breakpoint options
 */
export type MobileBreakpoint = 'sm' | 'md' | 'lg';

/**
 * Navbar-specific parameters
 * Extends OrganismParameters with navbar-specific props
 *
 * @example Basic usage
 * ```tsx
 * <Navbar
 *   logo="My Brand"
 *   logoHref="/"
 *   links={[
 *     { id: '1', label: 'Home', href: '/' },
 *     { id: '2', label: 'About', href: '/about' },
 *     { id: '3', label: 'Contact', href: '/contact' },
 *   ]}
 * />
 * ```
 *
 * @example With sticky and variant
 * ```tsx
 * <Navbar
 *   logo={<img src="/logo.svg" alt="Logo" />}
 *   links={links}
 *   sticky
 *   variant="dark"
 *   mobileBreakpoint="md"
 * />
 * ```
 *
 * @example With React Node logo
 * ```tsx
 * <Navbar
 *   logo={<Logo />}
 *   logoHref="/"
 *   links={navigationLinks}
 *   onLogoClick={() => console.log('Logo clicked')}
 * />
 * ```
 */
export interface NavbarProps extends OrganismParameters {
  /**
   * Logo (string or React component)
   * Can be text, image URL, or custom component
   */
  logo?: string | React.ReactNode;

  /**
   * Logo link href
   * @default '/'
   */
  logoHref?: string;

  /**
   * Navigation links (required)
   * Array of link configurations
   */
  links: NavbarLink[];

  /**
   * Sticky positioning
   * When true, navbar sticks to top when scrolling
   * @default false
   */
  sticky?: boolean;

  /**
   * Visual variant
   * Determines color scheme
   * @default 'light'
   */
  variant?: NavbarVariant;

  /**
   * Mobile breakpoint
   * Screen size where hamburger menu appears
   * @default 'md'
   */
  mobileBreakpoint?: MobileBreakpoint;

  /**
   * Show mobile menu (controlled)
   * External control of mobile menu state
   */
  showMobileMenu?: boolean;

  /**
   * Mobile menu toggle handler
   * Called when hamburger button is clicked
   */
  onMobileMenuToggle?: (isOpen: boolean) => void;

  /**
   * Logo click handler
   * Called when logo is clicked
   */
  onLogoClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;

  /**
   * Link click handler
   * Called when any navigation link is clicked
   */
  onLinkClick?: (link: NavbarLink, event: React.MouseEvent<HTMLAnchorElement>) => void;

  /**
   * Shadow enabled
   * Adds shadow to navbar
   * @default true
   */
  shadow?: boolean;

  /**
   * Full width
   * When true, navbar spans full viewport width
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Max width (when not full width)
   * Maximum content width
   * @default '1200px'
   */
  maxWidth?: string;

  /**
   * Z-index value
   * Controls stacking order
   * @default 1000
   */
  zIndex?: number;
}
