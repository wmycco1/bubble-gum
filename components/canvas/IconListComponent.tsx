// IconList Component
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeAllStyles, buildClassNameFromProps } from '@/lib/utils/apply-custom-props';

export function IconListComponent({ component }: { component: CanvasComponent }) {
  const { style, props } = component;
  const items = (props.items as Array<{id: string; icon?: string; text: string}>) || [];
  const finalStyle = mergeAllStyles(style as React.CSSProperties, props);

  return (
    <ul className={buildClassNameFromProps(props, 'space-y-2')} style={finalStyle}>
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-2">
          <span className="text-green-500">{item.icon || '✓'}</span>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
