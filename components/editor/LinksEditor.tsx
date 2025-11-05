'use client';

// ═══════════════════════════════════════════════════════════════
// LINKS EDITOR - Visual editor for link arrays
// ═══════════════════════════════════════════════════════════════
// Replaces JSON textarea with user-friendly UI
// Features: Add/Remove/Edit links inline
// ═══════════════════════════════════════════════════════════════

export interface Link {
  text: string;
  href: string;
}

interface LinksEditorProps {
  value: Link[];
  onChange: (links: Link[]) => void;
  maxLinks?: number;
}

export function LinksEditor({ value, onChange, maxLinks = 10 }: LinksEditorProps) {
  const links = value.map((link, index) => ({ ...link, id: `link-${index}` }));

  const handleAdd = () => {
    if (links.length >= maxLinks) return;
    const newLinks = [...value, { text: 'New Link', href: '#' }];
    onChange(newLinks);
  };

  const handleRemove = (index: number) => {
    const newLinks = value.filter((_, i) => i !== index);
    onChange(newLinks);
  };

  const handleUpdate = (index: number, field: 'text' | 'href', newValue: string) => {
    const newLinks = value.map((link, i) =>
      i === index ? { ...link, [field]: newValue } : link
    );
    onChange(newLinks);
  };

  return (
    <div className="space-y-2">
      {links.map((link, index) => (
        <div key={link.id} className="flex items-center gap-2 p-2 border border-slate-200 rounded bg-white">
          {/* Text Input */}
          <input
            type="text"
            value={link.text}
            onChange={(e) => handleUpdate(index, 'text', e.target.value)}
            className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
            placeholder="Link text"
          />

          {/* Arrow */}
          <span className="text-slate-400">→</span>

          {/* Href Input */}
          <input
            type="text"
            value={link.href}
            onChange={(e) => handleUpdate(index, 'href', e.target.value)}
            className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
            placeholder="URL"
          />

          {/* Remove Button */}
          <button
            onClick={() => handleRemove(index)}
            className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Remove link"
          >
            ✕
          </button>
        </div>
      ))}

      {/* Add Button */}
      {links.length < maxLinks && (
        <button
          onClick={handleAdd}
          className="w-full py-2 text-sm text-slate-600 border border-dashed border-slate-300 rounded hover:border-slate-400 hover:bg-slate-50 transition-colors"
        >
          + Add Link
        </button>
      )}

      {/* Counter */}
      <div className="text-xs text-slate-500 text-right">
        {links.length} / {maxLinks} links
      </div>
    </div>
  );
}
