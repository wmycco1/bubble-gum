// ═══════════════════════════════════════════════════════════════
// FOOTER COMPONENT
// ═══════════════════════════════════════════════════════════════
// Footer with copyright and links
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';

interface FooterComponentProps {
  component: CanvasComponent;
}

export function FooterComponent({ component }: FooterComponentProps) {
  const { props, style } = component;

  const copyright = (props.copyright as string) || `© ${new Date().getFullYear()} Company Name. All rights reserved.`;
  const links = (props.links as Array<{ text: string; href: string }>) || [
    { text: 'Privacy Policy', href: '#privacy' },
    { text: 'Terms of Service', href: '#terms' },
    { text: 'Contact', href: '#contact' },
  ];

  return (
    <footer
      className="border-t border-slate-200 bg-slate-50 px-8 py-8"
      style={style as React.CSSProperties}
    >
      <div className="mx-auto max-w-7xl">
        {/* Links */}
        {links && links.length > 0 && (
          <div className="mb-4 flex flex-wrap justify-center gap-6">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm text-slate-600 transition-colors hover:text-slate-900"
              >
                {link.text}
              </a>
            ))}
          </div>
        )}

        {/* Copyright */}
        <div className="text-center text-sm text-slate-500">{copyright}</div>
      </div>
    </footer>
  );
}
