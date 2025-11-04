import type { ImageProps } from '@/types/components';
import Image from 'next/image';

export function ImageComponentView({ props }: { props: ImageProps }) {
  return (
    <div className="px-6 py-8">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-lg">
        <Image
          src={props.src}
          alt={props.alt}
          width={props.width || 800}
          height={props.height || 600}
          className="h-auto w-full object-cover"
        />
      </div>
    </div>
  );
}
