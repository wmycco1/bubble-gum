// SocialIcons Component
import type { CanvasComponent } from '@/lib/editor/types';
export function SocialIconsComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const icons = (props.icons as Array<{id: string; platform: string; url: string}>) || [];
  return <div className="flex gap-3">{icons.map(i => (
    <a key={i.id} href={i.url} className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">{i.platform?.charAt(0).toUpperCase()}</a>
  ))}</div>;
}
