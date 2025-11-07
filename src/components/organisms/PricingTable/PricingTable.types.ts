/**
 * PricingTable Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for PricingTable organism component
 */

import type { OrganismParameters, ButtonVariant } from '@/types/parameters';

/**
 * Layout variants for pricing table grid
 */
export type PricingTableLayout = 'grid-2' | 'grid-3' | 'grid-4';

/**
 * Billing period for pricing toggle
 */
export type BillingPeriod = 'monthly' | 'yearly';

/**
 * Feature item in pricing tier
 */
export interface PricingFeature {
  id: string;
  text: string;
  included: boolean;
}

/**
 * Individual pricing tier configuration
 */
export interface PricingTier {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Tier name (e.g., "Starter", "Pro")
   */
  name: string;

  /**
   * Price amount (string for formatting flexibility)
   */
  price: string | number;

  /**
   * Billing period (e.g., "/month", "/year")
   */
  period?: string;

  /**
   * Tier description
   */
  description?: string;

  /**
   * List of features (simple strings or detailed objects)
   */
  features: string[] | PricingFeature[];

  /**
   * CTA button text
   */
  ctaText: string;

  /**
   * CTA button link
   */
  ctaHref?: string;

  /**
   * CTA button variant
   * @default 'primary' for highlighted tier, 'secondary' for others
   */
  ctaVariant?: ButtonVariant;

  /**
   * Highlight this tier (makes it stand out)
   */
  highlighted?: boolean;

  /**
   * Badge label (e.g., "Popular", "Best Value")
   */
  badge?: string;

  /**
   * Whether this tier is disabled
   */
  disabled?: boolean;
}

/**
 * PricingTable Props
 *
 * @example Basic pricing table
 * ```tsx
 * <PricingTable
 *   tiers={[
 *     {
 *       id: '1',
 *       name: 'Starter',
 *       price: '$29',
 *       period: '/month',
 *       features: ['Feature 1', 'Feature 2'],
 *       ctaText: 'Get Started'
 *     }
 *   ]}
 * />
 * ```
 *
 * @example Full-featured pricing table
 * ```tsx
 * <PricingTable
 *   tiers={[
 *     {
 *       id: '1',
 *       name: 'Free',
 *       price: '$0',
 *       description: 'For individuals',
 *       features: ['1 site', 'Basic support'],
 *       ctaText: 'Start Free'
 *     },
 *     {
 *       id: '2',
 *       name: 'Pro',
 *       price: '$49',
 *       period: '/month',
 *       description: 'For professionals',
 *       features: [
 *         { id: '1', text: '10 sites', included: true },
 *         { id: '2', text: 'Priority support', included: true },
 *         { id: '3', text: 'Advanced analytics', included: true }
 *       ],
 *       ctaText: 'Get Pro',
 *       highlighted: true,
 *       badge: 'Most Popular'
 *     }
 *   ]}
 *   layout="grid-3"
 *   showPeriodToggle={true}
 *   onTierClick={(tier) => console.log('Tier clicked:', tier)}
 * />
 * ```
 */
export interface PricingTableProps extends OrganismParameters {
  /**
   * Array of pricing tiers (required)
   */
  tiers: PricingTier[];

  /**
   * Grid layout variant
   * @default 'grid-3'
   */
  layout?: PricingTableLayout;

  /**
   * Show billing period toggle (monthly/yearly)
   * @default false
   */
  showPeriodToggle?: boolean;

  /**
   * Default billing period
   * @default 'monthly'
   */
  defaultPeriod?: BillingPeriod;

  /**
   * Callback when billing period changes
   */
  onPeriodChange?: (period: BillingPeriod) => void;

  /**
   * Callback when tier is clicked
   */
  onTierClick?: (tier: PricingTier) => void;

  /**
   * Callback when CTA button is clicked
   */
  onCtaClick?: (tier: PricingTier, event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'pricing-table'
   */
  'data-testid'?: string;
}

/**
 * PricingTable component that supports Context API parameter inheritance
 */
export type PricingTableComponent = React.FC<PricingTableProps>;
