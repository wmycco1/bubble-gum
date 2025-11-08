/**
 * Component Mapping Registry
 * Maps old canvas components to new Atomic Design System components
 * God-Tier Development Protocol 2025
 *
 * Purpose: Enable migration from /components/canvas/ to /src/components/
 * Preserves: ALL props, styles, custom CSS, and functionality
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Atoms (15 components)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { Button } from '@/src/components/atoms/Button/Button';
import { Text } from '@/src/components/atoms/Text/Text';
import { Heading } from '@/src/components/atoms/Heading/Heading';
import { Image } from '@/src/components/atoms/Image/Image';
import { Link } from '@/src/components/atoms/Link/Link';
import { Icon } from '@/src/components/atoms/Icon/Icon';
import { Input } from '@/src/components/atoms/Input/Input';
import { Checkbox } from '@/src/components/atoms/Checkbox/Checkbox';
import { Textarea } from '@/src/components/atoms/Textarea/Textarea';
import { Badge } from '@/src/components/atoms/Badge/Badge';
import { Divider } from '@/src/components/atoms/Divider/Divider';
import { Spacer } from '@/src/components/atoms/Spacer/Spacer';
import { HTML } from '@/src/components/atoms/HTML/HTML';
import { Video } from '@/src/components/atoms/Video/Video';
import { Submit } from '@/src/components/atoms/Submit/Submit';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Molecules (11 components)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { Alert } from '@/src/components/molecules/Alert/Alert';
import { Breadcrumb } from '@/src/components/molecules/Breadcrumb/Breadcrumb';
import { Counter } from '@/src/components/molecules/Counter/Counter';
import { IconList } from '@/src/components/molecules/IconList/IconList';
import { ImageBox } from '@/src/components/molecules/ImageBox/ImageBox';
import { Modal } from '@/src/components/molecules/Modal/Modal';
import { Progress } from '@/src/components/molecules/Progress/Progress';
import { StarRating } from '@/src/components/molecules/StarRating/StarRating';
import { Toggle } from '@/src/components/molecules/Toggle/Toggle';
import { Tooltip } from '@/src/components/molecules/Tooltip/Tooltip';
// NOTE: SocialIcons is in organisms, not molecules
import { SocialIcons } from '@/src/components/organisms/SocialIcons/SocialIcons';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Organisms (33 components)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { Accordion } from '@/src/components/organisms/Accordion/Accordion';
import { AddToCart } from '@/src/components/organisms/AddToCart/AddToCart';
import { Banner } from '@/src/components/organisms/Banner/Banner';
import { BannerSlider } from '@/src/components/organisms/BannerSlider/BannerSlider';
import { Card } from '@/src/components/organisms/Card/Card';
import { Carousel } from '@/src/components/organisms/Carousel/Carousel';
import { CMSBlock } from '@/src/components/organisms/CMSBlock/CMSBlock';
import { CMSPage } from '@/src/components/organisms/CMSPage/CMSPage';
import { CTA } from '@/src/components/organisms/CTA/CTA';
import { FacebookContent } from '@/src/components/organisms/FacebookContent/FacebookContent';
import { FacebookLike } from '@/src/components/organisms/FacebookLike/FacebookLike';
import { Features } from '@/src/components/organisms/Features/Features';
import { Footer } from '@/src/components/organisms/Footer/Footer';
import { Form } from '@/src/components/organisms/Form/Form';
import { FormBuilder } from '@/src/components/organisms/FormBuilder/FormBuilder';
import { GoogleMaps } from '@/src/components/organisms/GoogleMaps/GoogleMaps';
import { Hero } from '@/src/components/organisms/Hero/Hero';
// NOTE: IconBox is actually in molecules, not organisms
import { IconBox } from '@/src/components/molecules/IconBox/IconBox';
import { InnerSection } from '@/src/components/organisms/InnerSection/InnerSection';
import { Menu } from '@/src/components/organisms/Menu/Menu';
import { MultistepFormBuilder } from '@/src/components/organisms/MultistepFormBuilder/MultistepFormBuilder';
import { Navbar } from '@/src/components/organisms/Navbar/Navbar';
import { NewProducts } from '@/src/components/organisms/NewProducts/NewProducts';
import { OrdersAndReturns } from '@/src/components/organisms/OrdersAndReturns/OrdersAndReturns';
import { PricingTable } from '@/src/components/organisms/PricingTable/PricingTable';
import { ProductList } from '@/src/components/organisms/ProductList/ProductList';
import { ProductSlider } from '@/src/components/organisms/ProductSlider/ProductSlider';
import { RecentlyCompared } from '@/src/components/organisms/RecentlyCompared/RecentlyCompared';
import { RecentlyViewed } from '@/src/components/organisms/RecentlyViewed/RecentlyViewed';
import { Slider } from '@/src/components/organisms/Slider/Slider';
import { SoundCloud } from '@/src/components/organisms/SoundCloud/SoundCloud';
import { Tabs } from '@/src/components/organisms/Tabs/Tabs';
import { Testimonial } from '@/src/components/organisms/Testimonial/Testimonial';
import { TextEditor } from '@/src/components/organisms/TextEditor/TextEditor';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Templates (4 components)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { Container } from '@/src/components/templates/Container/Container';
import { Section } from '@/src/components/templates/Section/Section';
import { Grid } from '@/src/components/templates/Grid/Grid';
import { Layout } from '@/src/components/templates/Layout/Layout';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component Type
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import type { ComponentType } from './types';

/**
 * Component Mapping Registry
 *
 * Maps old canvas component types to new atomic components.
 * Supports both old naming (ButtonComponent) and new naming (Button).
 *
 * Total: 63 components (15 Atoms + 11 Molecules + 33 Organisms + 4 Templates)
 */
export const COMPONENT_MAPPING: Record<ComponentType, React.ComponentType<any>> = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Atoms (15)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Button': Button,
  'ButtonComponent': Button,

  'Text': Text,
  'TextComponent': Text,

  'Heading': Heading,
  'HeadingComponent': Heading,

  'Image': Image,
  'ImageComponent': Image,

  'Link': Link,
  'LinkComponent': Link,

  'Icon': Icon,
  'IconComponent': Icon,

  'Input': Input,
  'InputComponent': Input,

  'Checkbox': Checkbox,
  'CheckboxComponent': Checkbox,

  'Textarea': Textarea,
  'TextareaComponent': Textarea,

  'Badge': Badge,
  'BadgeComponent': Badge,

  'Divider': Divider,
  'DividerComponent': Divider,

  'Spacer': Spacer,
  'SpacerComponent': Spacer,

  'HTML': HTML,
  'HTMLComponent': HTML,

  'Video': Video,
  'VideoComponent': Video,

  'Submit': Submit,
  'SubmitComponent': Submit,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Molecules (11)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Alert': Alert,
  'AlertComponent': Alert,

  'Breadcrumb': Breadcrumb,
  'BreadcrumbComponent': Breadcrumb,

  'Counter': Counter,
  'CounterComponent': Counter,

  'IconList': IconList,
  'IconListComponent': IconList,

  'ImageBox': ImageBox,
  'ImageBoxComponent': ImageBox,

  'Modal': Modal,
  'ModalComponent': Modal,

  'Progress': Progress,
  'ProgressComponent': Progress,

  'StarRating': StarRating,
  'StarRatingComponent': StarRating,

  'Toggle': Toggle,
  'ToggleComponent': Toggle,

  'Tooltip': Tooltip,
  'TooltipComponent': Tooltip,

  'SocialIcons': SocialIcons,
  'SocialIconsComponent': SocialIcons,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Organisms (33)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Accordion': Accordion,
  'AccordionComponent': Accordion,

  'AddToCart': AddToCart,
  'AddToCartComponent': AddToCart,

  'Banner': Banner,
  'BannerComponent': Banner,

  'BannerSlider': BannerSlider,
  'BannerSliderComponent': BannerSlider,

  'Card': Card,
  'CardComponent': Card,

  'Carousel': Carousel,
  'CarouselComponent': Carousel,

  'CMSBlock': CMSBlock,
  'CMSBlockComponent': CMSBlock,

  'CMSPage': CMSPage,
  'CMSPageComponent': CMSPage,

  'CTA': CTA,
  'CTAComponent': CTA,

  'FacebookContent': FacebookContent,
  'FacebookContentComponent': FacebookContent,

  'FacebookLike': FacebookLike,
  'FacebookLikeComponent': FacebookLike,

  'Features': Features,
  'FeaturesComponent': Features,

  'Footer': Footer,
  'FooterComponent': Footer,

  'Form': Form,
  'FormComponent': Form,

  'FormBuilder': FormBuilder,
  'FormBuilderComponent': FormBuilder,

  'GoogleMaps': GoogleMaps,
  'GoogleMapsComponent': GoogleMaps,

  'Hero': Hero,
  'HeroComponent': Hero,

  'IconBox': IconBox,
  'IconBoxComponent': IconBox,

  'InnerSection': InnerSection,
  'InnerSectionComponent': InnerSection,

  'Menu': Menu,
  'MenuComponent': Menu,

  'MultistepFormBuilder': MultistepFormBuilder,
  'MultistepFormBuilderComponent': MultistepFormBuilder,

  'Navbar': Navbar,
  'NavbarComponent': Navbar,

  'NewProducts': NewProducts,
  'NewProductsComponent': NewProducts,

  'OrdersAndReturns': OrdersAndReturns,
  'OrdersAndReturnsComponent': OrdersAndReturns,

  'PricingTable': PricingTable,
  'PricingTableComponent': PricingTable,

  'ProductList': ProductList,
  'ProductListComponent': ProductList,

  'ProductSlider': ProductSlider,
  'ProductSliderComponent': ProductSlider,

  'RecentlyCompared': RecentlyCompared,
  'RecentlyComparedComponent': RecentlyCompared,

  'RecentlyViewed': RecentlyViewed,
  'RecentlyViewedComponent': RecentlyViewed,

  'Slider': Slider,
  'SliderComponent': Slider,

  'SoundCloud': SoundCloud,
  'SoundCloudComponent': SoundCloud,

  'Tabs': Tabs,
  'TabsComponent': Tabs,

  'Testimonial': Testimonial,
  'TestimonialComponent': Testimonial,

  'TextEditor': TextEditor,
  'TextEditorComponent': TextEditor,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Templates (4)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'Container': Container,
  'ContainerComponent': Container,

  'Section': Section,
  'SectionComponent': Section,

  'Grid': Grid,
  'GridComponent': Grid,

  'Layout': Layout,
};

/**
 * Get new atomic component by type
 *
 * @param type - Component type (old or new naming)
 * @returns React component or undefined
 */
export function getComponentByType(type: ComponentType): React.ComponentType<any> | undefined {
  return COMPONENT_MAPPING[type];
}

/**
 * Check if component type is mapped
 *
 * @param type - Component type to check
 * @returns true if component exists in mapping
 */
export function isComponentMapped(type: string): type is ComponentType {
  return type in COMPONENT_MAPPING;
}

/**
 * Get all supported component types
 *
 * @returns Array of all component types
 */
export function getAllComponentTypes(): ComponentType[] {
  return Object.keys(COMPONENT_MAPPING) as ComponentType[];
}
