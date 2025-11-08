/**
 * PricingTable Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * A comprehensive pricing table component for displaying multiple pricing tiers.
 * Composed of Heading, Text, Badge, Button atoms and IconList molecule.
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
 *   tiers={pricingTiers}
 *   layout="grid-3"
 *   showPeriodToggle={true}
 *   onTierClick={(tier) => console.log(tier)}
 * />
 * ```
 */

'use client';

import React, { useState } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Heading } from '@/components/atoms/Heading';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Text } from '@/components/atoms/Text';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Badge } from '@/components/atoms/Badge';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Button } from '@/components/atoms/Button';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Icon } from '@/components/atoms/Icon';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { PricingTableProps, PricingTier, BillingPeriod, PricingFeature } from './PricingTable.types';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import styles from './PricingTable.module.css';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';

export const PricingTable: React.FC<PricingTableProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as PricingTableProps;

  // Destructure with defaults
  const {
    tiers,
    layout = 'grid-3',
    showPeriodToggle = false,
    defaultPeriod = 'monthly',
    onPeriodChange,
    onTierClick,
    onCtaClick,
    className = '',
    'data-testid': testId = 'pricing-table',
    style,
    ...rest
  } = params;

  // State for billing period toggle
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(defaultPeriod);

  // Handle period toggle
  const handlePeriodToggle = (period: BillingPeriod) => {
    setBillingPeriod(period);
    onPeriodChange?.(period);
  };

  // Handle tier click
  const handleTierClick = (tier: PricingTier) => {
    if (!tier.disabled) {
      onTierClick?.(tier);
    }
  };

  // Handle CTA click
  const handleCtaClick = (tier: PricingTier, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!tier.disabled) {
      if (onCtaClick) {
        event.preventDefault();
        onCtaClick(tier, event);
      }
    }
  };

  // Render feature item
  const renderFeature = (feature: string | PricingFeature, index: number, highlighted: boolean) => {
    const isString = typeof feature === 'string';
    const text = isString ? feature : feature.text;
    const included = isString ? true : feature.included;
    const featureId = isString ? `feature-${index}` : feature.id;

    return (
      <li key={featureId} className={styles['feature-item']}>
        <Icon
          name={included ? 'check' : 'x'}
          size="sm"
          color={included ? (highlighted ? 'primary' : 'success') : 'muted'}
          className={styles['feature-icon']}
        />
        <Text
          size="sm"
          color={included ? 'default' : 'muted'}
          className={styles['feature-text']}
        >
          {text}
        </Text>
      </li>
    );
  };

  // Compute CSS classes
  const containerClasses = [
    styles['pricing-table'],
    styles[`pricing-table--${layout}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Empty state
  if (!tiers || tiers.length === 0) {
    return (
      <div className={styles['pricing-table-empty']} data-testid={`${testId}-empty`}>
        <Text align="center" color="muted">
          No pricing tiers available
        </Text>
      </div>
    );
  }

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <section
      className={containerClasses}
      style={style as React.CSSProperties}
      data-testid={testId}
      {...validDOMProps}
    >
      {/* Period Toggle (Optional) */}
      {showPeriodToggle && (
        <div className={styles['pricing-table-toggle']} data-testid={`${testId}-toggle`}>
          <button
            className={`${styles['toggle-button']} ${
              billingPeriod === 'monthly' ? styles['toggle-button--active'] : ''
            }`}
            onClick={() => handlePeriodToggle('monthly')}
            aria-pressed={billingPeriod === 'monthly'}
            data-testid={`${testId}-toggle-monthly`}
          >
            Monthly
          </button>
          <button
            className={`${styles['toggle-button']} ${
              billingPeriod === 'yearly' ? styles['toggle-button--active'] : ''
            }`}
            onClick={() => handlePeriodToggle('yearly')}
            aria-pressed={billingPeriod === 'yearly'}
            data-testid={`${testId}-toggle-yearly`}
          >
            Yearly
          </button>
        </div>
      )}

      {/* Pricing Tiers Grid */}
      <div className={styles['pricing-table-grid']} data-testid={`${testId}-grid`}>
        {tiers.map((tier) => {
          const tierClasses = [
            styles['pricing-tier'],
            tier.highlighted && styles['pricing-tier--highlighted'],
            tier.disabled && styles['pricing-tier--disabled'],
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <article
              key={tier.id}
              className={tierClasses}
              onClick={() => handleTierClick(tier)}
              data-testid={`${testId}-tier-${tier.id}`}
            >
              {/* Badge (Popular/Best Value) */}
              {tier.badge && (
                <div className={styles['tier-badge-wrapper']}>
                  <Badge
                    variant={tier.highlighted ? 'primary' : 'default'}
                    size="sm"
                    className={styles['tier-badge']}
                    data-testid={`${testId}-tier-${tier.id}-badge`}
                  >
                    {tier.badge}
                  </Badge>
                </div>
              )}

              {/* Tier Content */}
              <div className={styles['tier-content']}>
                {/* Tier Name */}
                <AtomProvider value={{ align: 'center' }}>
                  <Heading
                    level="h3"
                    className={styles['tier-name']}
                    data-testid={`${testId}-tier-${tier.id}-name`}
                  >
                    {tier.name}
                  </Heading>

                  {/* Tier Description */}
                  {tier.description && (
                    <Text
                      size="sm"
                      color="muted"
                      className={styles['tier-description']}
                      data-testid={`${testId}-tier-${tier.id}-description`}
                    >
                      {tier.description}
                    </Text>
                  )}
                </AtomProvider>

                {/* Price */}
                <div className={styles['tier-price-wrapper']}>
                  <div className={styles['tier-price']}>
                    <span
                      className={styles['tier-price-amount']}
                      data-testid={`${testId}-tier-${tier.id}-price`}
                    >
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span
                        className={styles['tier-price-period']}
                        data-testid={`${testId}-tier-${tier.id}-period`}
                      >
                        {tier.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  text={tier.ctaText}
                  variant={tier.ctaVariant || (tier.highlighted ? 'primary' : 'secondary')}
                  size="lg"
                  fullWidth
                  disabled={tier.disabled}
                  onClick={(e) => handleCtaClick(tier, e)}
                  {...(tier.ctaHref && !onCtaClick ? { as: 'a' as any, href: tier.ctaHref } : {})}
                  className={styles['tier-cta']}
                  data-testid={`${testId}-tier-${tier.id}-cta`}
                />

                {/* Features List */}
                {tier.features && tier.features.length > 0 && (
                  <ul
                    className={styles['tier-features']}
                    data-testid={`${testId}-tier-${tier.id}-features`}
                  >
                    {tier.features.map((feature, index) =>
                      renderFeature(feature, index, tier.highlighted || false)
                    )}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

// Display name for React DevTools
PricingTable.displayName = 'PricingTable';

// Default export for convenience
export default PricingTable;
