/**
 * Features Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Features grid section for showcasing product/service capabilities.
 * Composed of IconBox molecules with section header.
 *
 * @example Basic usage
 * ```tsx
 * <Features
 *   features={[
 *     { id: '1', icon: '🚀', title: 'Fast', description: 'Lightning speed' }
 *   ]}
 * />
 * ```
 *
 * @example Full-featured
 * ```tsx
 * <Features
 *   sectionTitle="Why Choose Us"
 *   sectionDescription="Our key features"
 *   features={features}
 *   layout="grid-3"
 *   iconColor="primary"
 * />
 * ```
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useOrganismContext, mergeParameters, MoleculeProvider } from '@/context/parameters/ParameterContext';
import { IconBox } from '@/components/molecules/IconBox';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import type { FeaturesProps } from './Features.types';
import styles from './Features.module.css';

export const Features: React.FC<FeaturesProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useOrganismContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as FeaturesProps;

  // Destructure with defaults
  const {
    sectionTitle,
    sectionDescription,
    features,
    layout = 'grid-3',
    iconSize = 'md',
    iconColor = 'primary',
    columns = 3,
    className = '',
    'data-testid': testId = 'features',
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles.features,
    styles[`features--${layout}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Compute grid classes
  const gridClasses = [
    styles['features-grid'],
    styles[`features-grid--cols-${columns}`],
  ]
    .filter(Boolean)
    .join(' ');

  // Filter out invalid DOM props from rest (MUST be before early returns)
  const validDOMProps = getValidDOMProps(rest);

  // Empty state
  if (!features || features.length === 0) {
    return (
      <section
        className={styles.features}
        data-testid={testId}
        {...validDOMProps}
      >
        <div className={styles['features-empty']}>
          <div className={styles['features-empty-icon']}>✨</div>
          <Heading level="h3" align="center">No features added</Heading>
          <Text align="center" color="muted">
            Add features to showcase your product capabilities
          </Text>
        </div>
      </section>
    );
  }

  return (
    <section
      className={classes}
      data-testid={testId}
      {...validDOMProps}
    >
      <div className={styles['features-container']}>
        {/* Section Header */}
        {(sectionTitle || sectionDescription) && (
          <div className={styles['features-header']} data-testid={`${testId}-header`}>
            {sectionTitle && (
              <Heading
                level="h2"
                align="center"
                className={styles['features-title']}
                data-testid={`${testId}-title`}
              >
                {sectionTitle}
              </Heading>
            )}

            {sectionDescription && (
              <Text
                align="center"
                color="muted"
                className={styles['features-description']}
                data-testid={`${testId}-description`}
              >
                {sectionDescription}
              </Text>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className={gridClasses} data-testid={`${testId}-grid`}>
          <MoleculeProvider value={{ iconSize, iconColor }}>
            {features.map((feature) => (
              <div
                key={feature.id}
                className={styles['features-item']}
                data-testid={`${testId}-item-${feature.id}`}
              >
                <IconBox
                  icon={feature.icon}
                  heading={feature.title}
                  description={feature.description}
                  align={layout === 'list' ? 'left' : 'center'}
                  layout={layout === 'list' ? 'horizontal' : 'vertical'}
                  iconSize={iconSize}
                  iconColor={iconColor}
                  showBorder
                  hoverable
                />
              </div>
            ))}
          </MoleculeProvider>
        </div>
      </div>
    </section>
  );
};

// Display name for React DevTools
Features.displayName = 'Features';

// Default export for convenience
export default Features;
