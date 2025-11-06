// IconBox Component - Icon with heading and description
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeAllStyles, buildClassNameFromProps } from '@/lib/utils/apply-custom-props';

export function IconBoxComponent({ component }: { component: CanvasComponent }) {
  const { style, props } = component;
  const icon = props.icon as string || '⭐';
  const heading = props.heading as string || 'Feature';
  const description = props.description as string;
  const alignment = props.alignment as string || 'center';
  
  const alignClass = alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center';
  const finalStyle = mergeAllStyles(style as React.CSSProperties, props);

  return (
    <div className={buildClassNameFromProps(props, `p-6 ${alignClass}`)} style={finalStyle}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{heading}</h3>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
}
