// ═══════════════════════════════════════════════════════════════
// CMS BLOCK COMPONENT - M3 CMS
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Flexible content block for CMS pages
// Features:
// - Title + HTML content rendering
// - Multiple layout styles (default/boxed/banner)
// - Background color support
// - Rich text HTML display
// - Fully customizable via properties
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';

export function CMSBlockComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;

  const title = (props.title as string) || '';
  const content = (props.content as string) || '';
  const layout = (props.layout as 'default' | 'boxed' | 'banner') || 'default';
  const backgroundColor = (props.backgroundColor as string) || '';

  // Empty state
  if (!title && !content) {
    return (
      <div className="p-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
        <div className="text-center text-slate-500">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-sm font-medium">Empty CMS Block</p>
          <p className="text-xs mt-1">Add title and content in the properties panel →</p>
        </div>
      </div>
    );
  }

  // Layout styles
  const layoutStyles = {
    default: 'py-8',
    boxed: 'p-8 border-2 border-slate-200 rounded-lg shadow-sm',
    banner: 'py-12 px-6 text-center',
  };

  return (
    <div
      className={layoutStyles[layout]}
      style={{
        backgroundColor: backgroundColor || undefined,
      }}
    >
      {/* Title */}
      {title && (
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          {title}
        </h2>
      )}

      {/* Content (HTML) */}
      {content && (
        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {/* Fallback if content is empty but title exists */}
      {title && !content && (
        <p className="text-slate-600 italic">No content added yet</p>
      )}
    </div>
  );
}
