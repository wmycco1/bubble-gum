'use client';

import type { PageComponent } from '@/types/components';
import { HeroComponentView } from '../blocks/HeroComponent';
import { TextComponentView } from '../blocks/TextComponent';
import { ImageComponentView } from '../blocks/ImageComponent';
import { ButtonComponentView } from '../blocks/ButtonComponent';
import { FormComponentView } from '../blocks/FormComponent';

interface ComponentRendererProps {
  component: PageComponent;
}

export function ComponentRenderer({ component }: ComponentRendererProps) {
  switch (component.type) {
    case 'hero':
      return <HeroComponentView props={component.props} />;
    case 'text':
      return <TextComponentView props={component.props} />;
    case 'image':
      return <ImageComponentView props={component.props} />;
    case 'button':
      return <ButtonComponentView props={component.props} />;
    case 'form':
      return <FormComponentView props={component.props} />;
    default:
      return <div>Unknown component type</div>;
  }
}
