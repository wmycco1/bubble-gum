import type { TextProps } from '@/types/components';

export function TextComponentView({ props }: { props: TextProps }) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[props.align];

  const variantClass = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-semibold',
    paragraph: 'text-base',
  }[props.variant];

  const Tag = props.variant === 'paragraph' ? 'p' : props.variant;

  return (
    <div className="px-6 py-8">
      <Tag className={`${variantClass} ${alignClass} text-slate-900`}>
        {props.content}
      </Tag>
    </div>
  );
}
