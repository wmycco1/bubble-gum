'use client';

// ═══════════════════════════════════════════════════════════════
// SOCIAL ICONS CONTROL - CRUD for Social Icons Component
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - Manage social media icons
// Features:
// - Add/Remove/Edit social icons
// - Drag & drop to reorder
// - Platform selector (15+ platforms)
// - URL validation
// - Custom label support
// - Real-time updates
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ItemsEditor } from './ItemsEditor';
import { logger } from '@/lib/utils/logger';

interface SocialIconsControlProps {
  componentId: string;
}

interface SocialIcon {
  id: string;
  platform: string;
  url: string;
  label?: string;
  [key: string]: unknown;
}

export function SocialIconsControl({ componentId }: SocialIconsControlProps) {
  const components = useCanvasStore((state) => state.components);
  const updateComponentProps = useCanvasStore((state) => state.updateComponentProps);

  // Find current component
  const findComponent = (comps: typeof components, id: string): typeof components[0] | null => {
    for (const comp of comps) {
      if (comp.id === id) return comp;
      if (comp.children) {
        const found = findComponent(comp.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const component = findComponent(components, componentId);

  // Default social icons
  const defaultItems: SocialIcon[] = [
    { id: 'icon-1', platform: 'facebook', url: 'https://facebook.com/yourpage', label: 'Facebook' },
    { id: 'icon-2', platform: 'twitter', url: 'https://twitter.com/yourhandle', label: 'Twitter' },
    { id: 'icon-3', platform: 'instagram', url: 'https://instagram.com/yourprofile', label: 'Instagram' },
    { id: 'icon-4', platform: 'linkedin', url: 'https://linkedin.com/company/yourcompany', label: 'LinkedIn' }
  ];

  const [items, setItems] = useState<SocialIcon[]>(() => {
    if (!component) return defaultItems;
    const currentItems = component.props.icons as SocialIcon[] | undefined;
    return currentItems && currentItems.length > 0 ? currentItems : defaultItems;
  });

  // Sync with component changes
  useEffect(() => {
    if (!component) return;
    const currentItems = component.props.icons as SocialIcon[] | undefined;
    if (currentItems && currentItems.length > 0) {
      setItems(currentItems);
    }
  }, [component]);

  // Handle items change
  const handleItemsChange = (newItems: SocialIcon[]) => {
    logger.debug('🔄 SocialIconsControl: Updating icons', {
      componentId,
      newItems,
      itemsCount: newItems.length
    });
    setItems(newItems);
    updateComponentProps(componentId, { icons: newItems });
    logger.debug('✅ SocialIconsControl: updateComponentProps called');
  };

  // Available platforms
  const platforms = [
    { value: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
    { value: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/yourhandle' },
    { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourprofile' },
    { value: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourcompany' },
    { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
    { value: 'github', label: 'GitHub', placeholder: 'https://github.com/yourusername' },
    { value: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourusername' },
    { value: 'twitch', label: 'Twitch', placeholder: 'https://twitch.tv/yourchannel' },
    { value: 'snapchat', label: 'Snapchat', placeholder: 'https://snapchat.com/add/yourusername' },
    { value: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/1234567890' },
    { value: 'telegram', label: 'Telegram', placeholder: 'https://t.me/yourusername' },
    { value: 'email', label: 'Email', placeholder: 'mailto:your@email.com' },
    { value: 'phone', label: 'Phone', placeholder: 'tel:+1234567890' },
    { value: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
    { value: 'other', label: 'Other', placeholder: 'https://...' }
  ];

  // Render item editor
  const renderItemEditor = (
    item: SocialIcon,
    onChange: (updates: Partial<SocialIcon>) => void
  ) => {
    const selectedPlatform = platforms.find(p => p.value === item.platform);

    return (
      <div className="space-y-4">
        {/* Platform Selector */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Platform</label>
          <select
            value={item.platform}
            onChange={(e) => onChange({ platform: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {platforms.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </select>
        </div>

        {/* URL */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">URL</label>
          <input
            type="url"
            value={item.url}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder={selectedPlatform?.placeholder || 'https://...'}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Enter the full URL to your social profile
          </p>
        </div>

        {/* Label (Optional) */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">
            Label (for accessibility)
          </label>
          <input
            type="text"
            value={item.label || ''}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder={selectedPlatform?.label || 'Social Link'}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Optional: Custom label for screen readers
          </p>
        </div>

        {/* Preview Badge */}
        <div className="bg-slate-50 p-3 rounded border border-slate-200">
          <p className="text-xs font-medium text-slate-700 mb-1">Preview:</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              {selectedPlatform?.label || item.platform}
            </span>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline truncate max-w-[200px]"
              >
                {item.url}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded border border-blue-200">
        <p className="text-xs text-blue-900 font-medium">
          🔗 Social Proof: 15+ platforms supported with brand colors
        </p>
      </div>

      <ItemsEditor
        items={items}
        onItemsChange={handleItemsChange}
        itemTemplate={{
          platform: 'facebook',
          url: 'https://facebook.com/yourpage',
          label: 'Facebook'
        }}
        renderItemEditor={renderItemEditor}
        itemLabel="Social Icon"
      />
    </div>
  );
}
