'use client';
import React from 'react';

export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  orientation?: 'horizontal' | 'vertical';
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  orientation = 'vertical',
}) => {
  const sizeMap = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '2rem', xl: '4rem' };
  const space = sizeMap[size];

  const style = orientation === 'vertical'
    ? { height: space, width: '100%' }
    : { width: space, height: '100%' };

  return <div style={style} aria-hidden="true" />;
};
