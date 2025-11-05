// ═══════════════════════════════════════════════════════════════
// NAVBAR COMPONENT
// ═══════════════════════════════════════════════════════════════
// Navigation bar with logo and links
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
// @ts-ignore - Will be used when spacing controls are applied
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';

interface NavbarComponentProps {
  component: CanvasComponent;
}

export function NavbarComponent({ component }: NavbarComponentProps) {
  const { props, style } = component;

  const logo = (props.logo as string) || 'Logo';
  const links = (props.links as Array<{ text: string; href: string }>) || [
    { text: 'Home', href: '#' },
    { text: 'About', href: '#about' },
    { text: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 shadow-sm"
      style={style as React.CSSProperties}
    >
      {/* Logo */}
      <div className="text-xl font-bold text-slate-900">{logo}</div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            {link.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
