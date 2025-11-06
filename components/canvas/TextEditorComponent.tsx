// TextEditor Component - Rich text WYSIWYG editor
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeAllStyles, buildClassNameFromProps } from '@/lib/utils/apply-custom-props';

export function TextEditorComponent({ component }: { component: CanvasComponent }) {
  const { style, props } = component;
  const content = (props.content as string) || '<p>Rich text content...</p>';
  const finalStyle = mergeAllStyles(style as React.CSSProperties, props);

  return (
    <div
      className={buildClassNameFromProps(props, 'prose max-w-none')}
      style={finalStyle}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
