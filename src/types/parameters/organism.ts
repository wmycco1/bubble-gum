/**
 * Organism Parameters
 * God-Tier Development Protocol 2025
 *
 * Organism components: Hero, PricingTable, Navbar, Forms, Carousel, etc.
 * Responsible for: Complex sections, content, interactions, navigation
 */

import { TemplateParameters } from './template';
import {
  AnimationType,
  TransitionConfig,
  HoverEffect,
  LinkTarget,
  ValidationRules,
  IconType,
  ComponentVariant,
} from './utils';

/**
 * OrganismParameters
 *
 * Organism-level components are complex sections that combine multiple molecules/atoms.
 * They inherit all Template parameters and add content, navigation, forms, media.
 *
 * @example
 * <Hero
 *   title="Welcome"
 *   subtitle="Build amazing sites"
 *   ctaText="Get Started"
 *   ctaLink="/signup"
 *   backgroundImage="/hero-bg.jpg"
 *   animation="fade"
 * />
 */
export interface OrganismParameters extends TemplateParameters {
  // ============================================
  // CONTENT & DATA (PRIMARY)
  // ============================================

  /**
   * Main title/heading
   */
  title?: string;

  /**
   * Subtitle/secondary heading
   */
  subtitle?: string;

  /**
   * Description text
   */
  description?: string;

  /**
   * Main content (HTML or plain text)
   */
  content?: string;

  /**
   * Content in markdown format
   */
  markdown?: string;

  /**
   * Array of items (for lists, carousels, tables)
   */
  items?: any[];

  /**
   * Data object (flexible structure)
   */
  data?: Record<string, any>;

  /**
   * Label text
   */
  label?: string;

  /**
   * Message text (for alerts, notifications)
   */
  message?: string;

  /**
   * Heading text (alternative to title)
   */
  heading?: string;

  // ============================================
  // NAVIGATION & LINKS (PRIMARY)
  // ============================================

  /**
   * Call-to-action button text
   */
  ctaText?: string;

  /**
   * Call-to-action link URL
   */
  ctaLink?: string;

  /**
   * Secondary CTA text
   */
  secondaryCtaText?: string;

  /**
   * Secondary CTA link
   */
  secondaryCtaLink?: string;

  /**
   * Generic link URL
   */
  link?: string;

  /**
   * Link href (alternative to link)
   */
  href?: string;

  /**
   * Link target
   */
  target?: LinkTarget;

  /**
   * Button text (for button-containing organisms)
   */
  buttonText?: string;

  /**
   * Button link
   */
  buttonLink?: string;

  /**
   * Button color
   */
  buttonColor?: string;

  /**
   * Action handler (alternative to link)
   */
  onAction?: () => void | Promise<void>;

  /**
   * Navigate to URL programmatically
   */
  navigate?: (url: string) => void;

  /**
   * Scroll to element ID
   */
  scrollTo?: string;

  /**
   * Smooth scroll enabled
   */
  smoothScroll?: boolean;

  // ============================================
  // FORMS & VALIDATION (CONDITIONAL)
  // ============================================

  /**
   * Form title
   */
  formTitle?: string;

  /**
   * Submit button text
   */
  submitText?: string;

  /**
   * Submit button handler
   */
  onSubmit?: (data: any) => void | Promise<void>;

  /**
   * Reset button handler
   */
  onReset?: () => void;

  /**
   * Form validation rules
   */
  validation?: ValidationRules;

  /**
   * Show validation errors
   */
  showErrors?: boolean;

  /**
   * Error message
   */
  errorMessage?: string;

  /**
   * Success message
   */
  successMessage?: string;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Form method
   */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';

  /**
   * Form action URL
   */
  action?: string;

  // ============================================
  // MEDIA & EMBEDS (CONDITIONAL)
  // ============================================

  /**
   * Icon name
   */
  icon?: string;

  /**
   * Icon type
   */
  iconType?: IconType;

  /**
   * Icon size
   */
  iconSize?: number | string;

  /**
   * Icon color
   */
  iconColor?: string;

  /**
   * Image URL
   */
  image?: string;

  /**
   * Image alt text (accessibility)
   */
  imageAlt?: string;

  /**
   * Video URL
   */
  video?: string;

  /**
   * Video poster (thumbnail)
   */
  poster?: string;

  /**
   * Video autoplay
   */
  autoplay?: boolean;

  /**
   * Video loop
   */
  loop?: boolean;

  /**
   * Video muted
   */
  muted?: boolean;

  /**
   * Thumbnail image
   */
  thumbnail?: string;

  /**
   * Avatar image URL
   */
  avatar?: string;

  /**
   * Logo image URL
   */
  logo?: string;

  // ============================================
  // INTERACTIONS & ANIMATIONS
  // ============================================

  /**
   * Animation type
   */
  animation?: AnimationType;

  /**
   * Transition configuration
   */
  transition?: TransitionConfig;

  /**
   * Hover effect
   */
  hover?: HoverEffect;

  /**
   * Active state
   */
  active?: boolean;

  /**
   * Focus state
   */
  focused?: boolean;

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * Change handler
   */
  onChange?: (value: any) => void;

  /**
   * Input handler
   */
  onInput?: (value: string) => void;

  /**
   * Select handler
   */
  onSelect?: (value: any) => void;

  // ============================================
  // VISIBILITY CONTROLS (COMMON IN ORGANISMS)
  // ============================================

  /**
   * Show/hide controls
   */
  showControls?: boolean;

  /**
   * Show/hide indicators
   */
  showIndicators?: boolean;

  /**
   * Show/hide navigation arrows
   */
  showArrow?: boolean;

  /**
   * Show/hide divider
   */
  showDivider?: boolean;

  /**
   * Show/hide rating
   */
  showRating?: boolean;

  /**
   * Show/hide avatar
   */
  showAvatar?: boolean;

  /**
   * Show/hide company name
   */
  showCompany?: boolean;

  /**
   * Show/hide thumbnail
   */
  showThumbnail?: boolean;

  /**
   * Show/hide sidebar
   */
  showSidebar?: boolean;

  /**
   * Show/hide captions
   */
  showCaptions?: boolean;

  /**
   * Show/hide quantity selector
   */
  showQuantity?: boolean;

  /**
   * Show/hide value/count
   */
  showValue?: boolean;

  // ============================================
  // CAROUSEL/SLIDER SPECIFIC
  // ============================================

  /**
   * Number of slides to show
   */
  slidesToShow?: number;

  /**
   * Number of slides to scroll
   */
  slidesToScroll?: number;

  /**
   * Infinite loop
   */
  infinite?: boolean;

  /**
   * Auto-advance slides
   */
  autoAdvance?: boolean;

  /**
   * Auto-advance interval (ms)
   */
  autoAdvanceInterval?: number;

  /**
   * Slide transition speed (ms)
   */
  speed?: number;

  /**
   * Pause on hover
   */
  pauseOnHover?: boolean;

  /**
   * Swipe enabled (mobile)
   */
  swipeable?: boolean;

  /**
   * Draggable (desktop)
   */
  draggable?: boolean;

  // ============================================
  // PRICING TABLE SPECIFIC
  // ============================================

  /**
   * Pricing plans/tiers
   */
  plans?: Array<{
    name: string;
    price: number;
    period?: string;
    features: string[];
    highlighted?: boolean;
    ctaText?: string;
    ctaLink?: string;
  }>;

  /**
   * Highlighted plan index
   */
  highlightedPlan?: number;

  /**
   * Show annual pricing
   */
  showAnnual?: boolean;

  /**
   * Currency symbol
   */
  currency?: string;

  // ============================================
  // ACCORDION/TABS SPECIFIC
  // ============================================

  /**
   * Allow multiple items open (accordion)
   */
  allowMultiple?: boolean;

  /**
   * Default open item(s)
   */
  defaultOpen?: number | number[];

  /**
   * Active tab index
   */
  activeTab?: number;

  /**
   * Tab change handler
   */
  onTabChange?: (index: number) => void;

  /**
   * Accordion item click handler
   */
  onItemClick?: (index: number) => void;

  // ============================================
  // TESTIMONIAL SPECIFIC
  // ============================================

  /**
   * Author name
   */
  author?: string;

  /**
   * Author role/title
   */
  role?: string;

  /**
   * Company name
   */
  company?: string;

  /**
   * Rating (1-5)
   */
  rating?: number;

  /**
   * Review/testimonial text
   */
  review?: string;

  // ============================================
  // NAVBAR/MENU SPECIFIC
  // ============================================

  /**
   * Menu items
   */
  menuItems?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: string;
    children?: any[];
  }>;

  /**
   * Sticky navigation
   */
  sticky?: boolean;

  /**
   * Transparent background (until scroll)
   */
  transparent?: boolean;

  /**
   * Mobile menu open state
   */
  mobileMenuOpen?: boolean;

  /**
   * Toggle mobile menu
   */
  onToggleMobileMenu?: () => void;

  // ============================================
  // E-COMMERCE SPECIFIC
  // ============================================

  /**
   * Product ID
   */
  productId?: string;

  /**
   * Product SKU
   */
  sku?: string;

  /**
   * Price
   */
  price?: number;

  /**
   * Sale price
   */
  salePrice?: number;

  /**
   * Stock quantity
   */
  stock?: number;

  /**
   * Stock status
   */
  stockStatus?: 'in-stock' | 'out-of-stock' | 'backorder';

  /**
   * Max quantity
   */
  maxQuantity?: number;

  /**
   * Add to cart handler
   */
  onAddToCart?: (productId: string, quantity: number) => void;

  /**
   * Wishlist handler
   */
  onAddToWishlist?: (productId: string) => void;

  // ============================================
  // VARIANT & STYLING
  // ============================================

  /**
   * Component variant
   */
  variant?: ComponentVariant | string;

  /**
   * Color mode (light/dark theme)
   */
  colorMode?: 'light' | 'dark' | 'auto';

  /**
   * Size preset
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Alignment
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Vertical alignment
   */
  verticalAlign?: 'top' | 'center' | 'bottom';
}
