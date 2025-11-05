// ═══════════════════════════════════════════════════════════════
// ICON COMPONENT
// ═══════════════════════════════════════════════════════════════
// Purpose: Lucide icon component
// Features: Multiple icons, sizes, colors
// ═══════════════════════════════════════════════════════════════

import {
  Check,
  X,
  AlertCircle,
  Info,
  Star,
  Heart,
  Home,
  User,
  Mail,
  Phone,
  Menu,
  Search,
  ShoppingCart,
  Settings,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Download,
  Upload,
  Trash2,
  Edit,
  Eye,
  Lock,
  Unlock,
  type LucideIcon,
} from 'lucide-react';
import type { CanvasComponent } from '@/lib/editor/types';
// @ts-ignore - Will be used when spacing controls are applied
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';

interface IconComponentProps {
  component: CanvasComponent;
}

const ICON_MAP: Record<string, LucideIcon> = {
  check: Check,
  x: X,
  alert: AlertCircle,
  info: Info,
  star: Star,
  heart: Heart,
  home: Home,
  user: User,
  mail: Mail,
  phone: Phone,
  menu: Menu,
  search: Search,
  cart: ShoppingCart,
  settings: Settings,
  'chevron-right': ChevronRight,
  'arrow-right': ArrowRight,
  'external-link': ExternalLink,
  download: Download,
  upload: Upload,
  trash: Trash2,
  edit: Edit,
  eye: Eye,
  lock: Lock,
  unlock: Unlock,
};

export function IconComponent({ component }: IconComponentProps) {
  const { props, style } = component;

  const iconName = (props.icon as string) || 'star';
  const size = typeof props.size === 'number' ? props.size : (typeof props.size === 'string' ? parseInt(props.size) : 24);
  const color = (props.color as string) || 'currentColor';

  const Icon = ICON_MAP[iconName] || Star;

  return (
    <div className="px-6 py-3 inline-flex items-center justify-center">
      <Icon
        size={size}
        color={color}
        style={style as React.CSSProperties}
        aria-hidden="true"
      />
    </div>
  );
}
