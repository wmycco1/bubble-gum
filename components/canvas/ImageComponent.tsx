// ═══════════════════════════════════════════════════════════════
// IMAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
// NEW system: Uses CanvasComponent props + style
// Features: Responsive, rounded corners, alt text
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
// @ts-ignore - Will be used when spacing controls are applied
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import Image from 'next/image';

interface ImageComponentProps {
  component: CanvasComponent;
}

export function ImageComponent({ component }: ImageComponentProps) {
  const { props, style } = component;

  const src = (props.src as string) || 'https://images.unsplash.com/photo-1557683316-973673baf926';
  const alt = (props.alt as string) || 'Image';

  return (
    <div className="px-6 py-8">
      <div className="relative w-full" style={style as React.CSSProperties}>
        <Image
          src={src}
          alt={alt}
          width={800}
          height={600}
          className="rounded-lg object-cover w-full h-auto"
          unoptimized={src.startsWith('http')}
        />
      </div>
    </div>
  );
}
