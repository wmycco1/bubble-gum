// ImageBox Component
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeAllStyles, buildClassNameFromProps } from '@/lib/utils/apply-custom-props';

export function ImageBoxComponent({ component }: { component: CanvasComponent }) {
  const { style, props } = component;
  const image = props.image as string || 'https://via.placeholder.com/400';
  const alt = props.alt as string || 'Image';
  const caption = props.caption as string;
  const finalStyle = mergeAllStyles(style as React.CSSProperties, props);

  return (
    <figure className={buildClassNameFromProps(props, '')} style={finalStyle}>
      <img src={image} alt={alt} className="w-full h-auto rounded" />
      {caption && <figcaption className="mt-2 text-sm text-gray-600">{caption}</figcaption>}
    </figure>
  );
}
