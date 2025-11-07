/**
 * ImageBox Component (Molecule)
 * God-Tier Development Protocol 2025
 *
 * A molecule component that composes Image and Text atoms
 * to create image cards with optional captions.
 *
 * @example Basic usage
 * ```tsx
 * <ImageBox
 *   src="/photo.jpg"
 *   alt="Description"
 *   caption="A beautiful scene"
 * />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <MoleculeProvider value={{ size: 'lg', rounded: true }}>
 *   <ImageBox src="/photo.jpg" alt="Large photo" />
 * </MoleculeProvider>
 * ```
 */

import React from 'react';
import { useMoleculeContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { Image } from '@/components/atoms/Image';
import { Text } from '@/components/atoms/Text';
import type { ImageBoxProps } from './ImageBox.types';
import styles from './ImageBox.module.css';

export const ImageBox: React.FC<ImageBoxProps> = (props) => {
  // Get inherited parameters from Molecule context
  const contextParams = useMoleculeContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as ImageBoxProps;

  // Destructure with defaults
  const {
    src,
    alt,
    caption,
    size = 'md',
    imageSize = 'full',
    fit = 'cover',
    aspectRatio,
    rounded = false,
    captionSize = 'sm',
    captionColor = 'muted',
    captionAlign = 'left',
    loading = 'lazy',
    className = '',
    id,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'data-testid': testId = 'imagebox',
    children,
    onClick,
    hoverable = false,
    showBorder = false,
    showShadow = false,
  } = params;

  // Compute CSS classes
  const classes = [
    styles.imagebox,
    styles[`imagebox--${size}`],
    hoverable && styles['imagebox--hoverable'],
    showBorder && styles['imagebox--border'],
    showShadow && styles['imagebox--shadow'],
    onClick && styles['imagebox--clickable'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Determine if component is interactive
  const isInteractive = !!onClick;

  // Handle click
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  // Handle keyboard navigation (Enter/Space for clickable boxes)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.(e as any);
    }
  };

  // Render as figure element (semantic HTML)
  const WrapperElement = isInteractive ? 'figure' : 'figure';

  return (
    <WrapperElement
      id={id}
      className={classes}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
    >
      {/* Image */}
      <div className={styles.imagebox__image} data-testid={`${testId}-image`}>
        <Image
          src={src}
          alt={alt}
          size={imageSize}
          fit={fit}
          aspectRatio={aspectRatio}
          rounded={rounded}
          loading={loading}
        />
      </div>

      {/* Caption or Children */}
      {(caption || children) && (
        <figcaption className={styles.imagebox__caption} data-testid={`${testId}-caption`}>
          {children ? (
            <div className={styles.imagebox__children}>{children}</div>
          ) : caption ? (
            <Text
              size={captionSize}
              color={captionColor}
              align={captionAlign}
              data-testid={`${testId}-caption-text`}
            >
              {caption}
            </Text>
          ) : null}
        </figcaption>
      )}
    </WrapperElement>
  );
};

// Display name for React DevTools
ImageBox.displayName = 'ImageBox';

// Default export for convenience
export default ImageBox;
