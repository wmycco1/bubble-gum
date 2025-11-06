// ═══════════════════════════════════════════════════════════════
// CMS PAGE COMPONENT - M3 CMS
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Full page layout for CMS content
// Features:
// - Hero section with title + subtitle
// - Main content area with HTML
// - Sidebar support (optional)
// - Breadcrumb navigation
// - Last updated date
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';

export function CMSPageComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;

  const title = (props.title as string) || 'Page Title';
  const subtitle = (props.subtitle as string) || '';
  const content = (props.content as string) || '';
  const breadcrumbs = (props.breadcrumbs as string[]) || ['Home', 'Page'];
  const lastUpdated = (props.lastUpdated as string) || new Date().toLocaleDateString();
  const showSidebar = (props.showSidebar as boolean) ?? false;

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-200 py-3 px-6">
        <nav className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-slate-400">/</span>}
              <span className={index === breadcrumbs.length - 1 ? 'text-slate-900 font-medium' : 'text-slate-600'}>
                {crumb}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-slate-700">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className={showSidebar ? 'grid grid-cols-1 lg:grid-cols-3 gap-8' : ''}>
          {/* Content Area */}
          <div className={showSidebar ? 'lg:col-span-2' : ''}>
            {content ? (
              <div
                className="prose prose-slate prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 text-center">
                <p className="text-slate-500 text-sm">No content added yet</p>
                <p className="text-slate-400 text-xs mt-1">Add content in the properties panel →</p>
              </div>
            )}

            {/* Last Updated */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          {showSidebar && (
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* On This Page */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">On This Page</h3>
                  <nav className="space-y-2">
                    <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">Introduction</a>
                    <a href="#" className="block text-sm text-slate-600 hover:text-slate-900">Getting Started</a>
                    <a href="#" className="block text-sm text-slate-600 hover:text-slate-900">Features</a>
                  </nav>
                </div>

                {/* Related Pages */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Related</h3>
                  <nav className="space-y-2">
                    <a href="#" className="block text-sm text-slate-600 hover:text-slate-900">Related Page 1</a>
                    <a href="#" className="block text-sm text-slate-600 hover:text-slate-900">Related Page 2</a>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
