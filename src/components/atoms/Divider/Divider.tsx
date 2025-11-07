'use client';
import React from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: 'thin' | 'medium' | 'thick';
  color?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 'thin',
  color = 'gray-200',
  className = '',
}) => {
  const thicknessMap = { thin: '1px', medium: '2px', thick: '4px' };
  const isHorizontal = orientation === 'horizontal';

  const style = isHorizontal
    ? { height: thicknessMap[thickness], width: '100%' }
    : { width: thicknessMap[thickness], height: '100%' };

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`bg-${color} ${className}`}
      style={style}
    />
  );
};
