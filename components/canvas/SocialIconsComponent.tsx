// ═══════════════════════════════════════════════════════════════
// SOCIAL ICONS COMPONENT - M3 Extended Library
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Social media icons with real platform icons
// Features:
// - Support for 15+ social platforms (Facebook, Twitter, Instagram, etc.)
// - Real icon graphics using lucide-react
// - Size variants (sm, md, lg, xl)
// - Style variants (solid, outline, rounded, square)
// - Hover effects
// - Color variants (brand colors or monochrome)
// - CRUD control for adding/removing/editing icons
// ═══════════════════════════════════════════════════════════════

'use client';

import type { CanvasComponent } from '@/lib/editor/types';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Mail,
  Phone,
  Globe,
  MessageCircle,
  Send,
  Music,
  Video,
  Camera,
  Share2
} from 'lucide-react';

interface SocialIcon {
  id: string;
  platform: string;
  url: string;
  label?: string;
  [key: string]: unknown;
}

export function SocialIconsComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;

  const icons = (props.icons as SocialIcon[] | undefined) || [
    { id: '1', platform: 'facebook', url: 'https://facebook.com/yourpage', label: 'Facebook' },
    { id: '2', platform: 'twitter', url: 'https://twitter.com/yourhandle', label: 'Twitter' },
    { id: '3', platform: 'instagram', url: 'https://instagram.com/yourprofile', label: 'Instagram' },
    { id: '4', platform: 'linkedin', url: 'https://linkedin.com/company/yourcompany', label: 'LinkedIn' },
    { id: '5', platform: 'youtube', url: 'https://youtube.com/@yourchannel', label: 'YouTube' }
  ];

  const size = (props.size as 'sm' | 'md' | 'lg' | 'xl') || 'md';
  const variant = (props.variant as 'solid' | 'outline' | 'rounded' | 'square') || 'rounded';
  const colorMode = (props.colorMode as 'brand' | 'monochrome') || 'brand';

  // Empty state
  if (icons.length === 0) {
    return (
      <div className="p-6 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
        <div className="text-center text-slate-500">
          <div className="text-3xl mb-2">🔗</div>
          <p className="text-sm font-medium">No social icons added</p>
          <p className="text-xs mt-1">Add social icons in the properties panel →</p>
        </div>
      </div>
    );
  }

  // Get icon component by platform
  const getIconComponent = (platform: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      facebook: <Facebook className="w-full h-full" />,
      twitter: <Twitter className="w-full h-full" />,
      instagram: <Instagram className="w-full h-full" />,
      linkedin: <Linkedin className="w-full h-full" />,
      youtube: <Youtube className="w-full h-full" />,
      github: <Github className="w-full h-full" />,
      email: <Mail className="w-full h-full" />,
      phone: <Phone className="w-full h-full" />,
      website: <Globe className="w-full h-full" />,
      whatsapp: <MessageCircle className="w-full h-full" />,
      telegram: <Send className="w-full h-full" />,
      tiktok: <Music className="w-full h-full" />,
      twitch: <Video className="w-full h-full" />,
      snapchat: <Camera className="w-full h-full" />,
      other: <Share2 className="w-full h-full" />
    };

    return iconMap[platform.toLowerCase()] || iconMap.other;
  };

  // Get brand color by platform
  const getBrandColor = (platform: string): string => {
    if (colorMode === 'monochrome') {
      return 'bg-slate-700 hover:bg-slate-900';
    }

    const colorMap: Record<string, string> = {
      facebook: 'bg-[#1877F2] hover:bg-[#0C63D4]',
      twitter: 'bg-[#1DA1F2] hover:bg-[#0D8BD9]',
      instagram: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90',
      linkedin: 'bg-[#0A66C2] hover:bg-[#084D92]',
      youtube: 'bg-[#FF0000] hover:bg-[#CC0000]',
      github: 'bg-[#181717] hover:bg-[#000000]',
      email: 'bg-blue-600 hover:bg-blue-700',
      phone: 'bg-green-600 hover:bg-green-700',
      website: 'bg-indigo-600 hover:bg-indigo-700',
      whatsapp: 'bg-[#25D366] hover:bg-[#1EBE57]',
      telegram: 'bg-[#0088CC] hover:bg-[#0077B3]',
      tiktok: 'bg-[#000000] hover:bg-[#FF0050]',
      twitch: 'bg-[#9146FF] hover:bg-[#7B2EFF]',
      snapchat: 'bg-[#FFFC00] hover:bg-[#FFEB3B] text-slate-900',
      other: 'bg-slate-600 hover:bg-slate-700'
    };

    return (colorMap[platform.toLowerCase()] ?? colorMap.other) as string;
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5',
    xl: 'w-16 h-16 p-3'
  };

  // Variant classes
  const variantClasses = {
    solid: 'rounded',
    outline: 'rounded border-2 bg-transparent hover:bg-opacity-10',
    rounded: 'rounded-full',
    square: 'rounded-none'
  };

  const sizeClass = sizeClasses[size];
  const variantClass = variantClasses[variant];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {icons.map((icon) => {
        const brandColor = getBrandColor(icon.platform);
        const isOutline = variant === 'outline';

        return (
          <a
            key={icon.id}
            href={icon.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={icon.label || icon.platform}
            className={`
              ${sizeClass}
              ${variantClass}
              ${isOutline ? 'border-current' : brandColor}
              flex items-center justify-center
              text-white
              transition-all duration-200
              hover:scale-110
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            `}
            title={icon.label || icon.platform}
          >
            {getIconComponent(icon.platform)}
          </a>
        );
      })}
    </div>
  );
}
