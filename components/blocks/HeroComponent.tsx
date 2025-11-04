import type { HeroProps } from '@/types/components';
import { Button } from '../ui/button';

export function HeroComponentView({ props }: { props: HeroProps }) {
  return (
    <div className="relative bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          {props.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-300">{props.subtitle}</p>
        {props.ctaText && (
          <div className="mt-10">
            <Button size="lg">{props.ctaText}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
