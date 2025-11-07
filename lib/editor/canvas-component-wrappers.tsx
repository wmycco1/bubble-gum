/**
 * Canvas Component Wrappers
 * Temporary wrappers for components that don't have atomic versions yet
 * God-Tier Development Protocol 2025
 *
 * Purpose: Enable migration while atomic versions are being completed
 * These wrappers convert atomic props back to canvas component format
 */

'use client';

import React from 'react';
import type { CanvasComponent } from './types';
import { CounterComponent } from '@/components/canvas/CounterComponent';
import { IconListComponent } from '@/components/canvas/IconListComponent';
import { InnerSectionComponent } from '@/components/canvas/InnerSectionComponent';
import { SoundCloudComponent } from '@/components/canvas/SoundCloudComponent';

/**
 * Convert atomic props back to CanvasComponent format
 *
 * Takes props like: { text: 'Hello', style: {...}, 'data-canvas-id': 'comp-123' }
 * Returns: { id: 'comp-123', type: 'Counter', props: { text: 'Hello' }, style: {...} }
 */
function convertAtomicPropsToCanvas(props: Record<string, any>, type: string): CanvasComponent {
  const { style, 'data-canvas-id': id, children, ...restProps } = props;

  return {
    id: id || `temp-${Date.now()}`,
    type,
    props: restProps,
    style: style || {},
    children: children || [],
  };
}

/**
 * Counter Wrapper
 * Wraps CounterComponent to accept atomic props
 */
export function CounterWrapper(props: Record<string, any>) {
  const canvasComponent = convertAtomicPropsToCanvas(props, 'Counter');
  return <CounterComponent component={canvasComponent} />;
}

/**
 * IconList Wrapper
 * Wraps IconListComponent to accept atomic props
 */
export function IconListWrapper(props: Record<string, any>) {
  const canvasComponent = convertAtomicPropsToCanvas(props, 'IconList');
  return <IconListComponent component={canvasComponent} />;
}

/**
 * InnerSection Wrapper
 * Wraps InnerSectionComponent to accept atomic props
 */
export function InnerSectionWrapper(props: Record<string, any>) {
  const canvasComponent = convertAtomicPropsToCanvas(props, 'InnerSection');

  // Handle children prop specially for container components
  if (props.children) {
    canvasComponent.children = Array.isArray(props.children)
      ? props.children
      : [props.children];
  }

  return <InnerSectionComponent component={canvasComponent} />;
}

/**
 * SoundCloud Wrapper
 * Wraps SoundCloudComponent to accept atomic props
 */
export function SoundCloudWrapper(props: Record<string, any>) {
  const canvasComponent = convertAtomicPropsToCanvas(props, 'SoundCloud');
  return <SoundCloudComponent component={canvasComponent} />;
}
