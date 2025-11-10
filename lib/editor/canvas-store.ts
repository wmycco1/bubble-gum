// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - CANVAS STORE (ZUSTAND)
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Added localStorage persistence
// Enterprise-grade state management for visual editor
// Features: Undo/Redo, Time-travel debugging, Immutable updates, localStorage backup
// ═══════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { temporal } from 'zundo';
import { nanoid } from 'nanoid';
import type { CanvasComponent, CanvasState, ComponentType, ComponentProps, ComponentStyle } from './types';
import { logger } from '@/lib/utils/logger';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Store Interface
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CanvasStore extends CanvasState {
  // Component actions
  addComponent: (typeOrConfig: ComponentType | { type: ComponentType; props?: ComponentProps }, parentId?: string, index?: number) => void;
  updateComponent: (id: string, updates: Partial<CanvasComponent>) => void;
  deleteComponent: (id: string) => void;
  moveComponent: (id: string, newParentId: string | null, newIndex: number) => void;
  duplicateComponent: (id: string) => void;
  setComponents: (components: CanvasComponent[]) => void; // For reordering

  // Selection actions
  selectComponent: (id: string | null) => void;
  setHoveredComponent: (id: string | null) => void;

  // Style actions
  updateComponentStyle: (id: string, style: Partial<ComponentStyle>) => void;
  updateComponentProps: (id: string, props: Partial<ComponentProps>) => void;
  updateResponsiveStyle: (id: string, breakpoint: 'desktop' | 'tablet' | 'mobile', style: Partial<ComponentStyle>) => void;

  // UI actions
  setIsDragging: (isDragging: boolean) => void;
  setIsResizing: (isResizing: boolean) => void;
  setZoom: (zoom: number) => void;
  setDeviceMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;

  // ═══════════════════════════════════════════════════════════════
  // NEW: EDITOR MODE ACTIONS (God-Tier 2025)
  // ═══════════════════════════════════════════════════════════════
  setEditorMode: (mode: 'simple' | 'advanced') => void;

  // Utility actions
  clearCanvas: () => void;
  loadComponents: (components: CanvasComponent[]) => void;
  getComponentById: (id: string) => CanvasComponent | undefined;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Default Component Templates
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const getDefaultComponent = (type: ComponentType): Omit<CanvasComponent, 'id'> => {
  const defaults: Record<ComponentType, Omit<CanvasComponent, 'id'>> = {
    Button: {
      type: 'Button',
      props: { text: 'Click Me', variant: 'default' },
      style: {
        padding: '0.5rem 1rem',
        backgroundColor: '#000000',
        color: '#ffffff',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        border: 'none',
        fontSize: '0.875rem',
        fontWeight: '500',
      },
    },
    Text: {
      type: 'Text',
      props: { text: 'Edit this text' },
      style: {
        fontSize: '1rem',
        lineHeight: '1.5',
        color: '#000000',
      },
    },
    Heading: {
      type: 'Heading',
      props: { text: 'Heading', variant: 'h2' },
      style: {
        fontSize: '1.875rem',
        fontWeight: '700',
        lineHeight: '1.2',
        color: '#000000',
        marginBottom: '1rem',
      },
    },
    Image: {
      type: 'Image',
      props: {
        src: 'https://via.placeholder.com/400x300',
        alt: 'Placeholder image',
      },
      style: {
        width: '100%',
        height: 'auto',
        borderRadius: '0.5rem',
      },
    },
    Container: {
      type: 'Container',
      props: {},
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        border: '1px dashed #e2e8f0',
        borderRadius: '0.5rem',
        minHeight: '100px',
      },
      children: [],
    },
    Section: {
      type: 'Section',
      props: {},
      style: {
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem',
        backgroundColor: '#ffffff',
        minHeight: '200px',
      },
      children: [],
    },
    Grid: {
      type: 'Grid',
      props: {},
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        padding: '1rem',
        minHeight: '150px',
      },
      children: [],
    },
    Card: {
      type: 'Card',
      props: {},
      style: {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      },
      children: [],
    },
    Input: {
      type: 'Input',
      props: {
        type: 'text',
        placeholder: 'Enter text...',
      },
      style: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #e2e8f0',
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
      },
    },
    Form: {
      type: 'Form',
      props: {},
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        minHeight: '150px',
      },
      children: [],
    },
    Navbar: {
      type: 'Navbar',
      props: { logo: 'Logo', links: [{ text: 'Home', href: '#' }] },
      style: {},
    },
    NavbarComponent: {
      type: 'NavbarComponent',
      props: { logo: 'Logo', links: [{ text: 'Home', href: '#' }] },
      style: {},
    },
    Hero: {
      type: 'Hero',
      props: { title: 'Hero Title', subtitle: 'Subtitle' },
      style: {},
    },
    HeroComponent: {
      type: 'HeroComponent',
      props: { title: 'Hero Title', subtitle: 'Subtitle' },
      style: {},
    },
    Footer: {
      type: 'Footer',
      props: { copyright: '© 2025 Company' },
      style: {},
    },
    FooterComponent: {
      type: 'FooterComponent',
      props: { copyright: '© 2025 Company' },
      style: {},
    },
    Features: {
      type: 'Features',
      props: { title: 'Features', features: [] },
      style: {},
    },
    FeaturesComponent: {
      type: 'FeaturesComponent',
      props: { title: 'Features', features: [] },
      style: {},
    },
    CTA: {
      type: 'CTA',
      props: { title: 'Call to Action', buttonText: 'Click Here' },
      style: {},
    },
    CTAComponent: {
      type: 'CTAComponent',
      props: { title: 'Call to Action', buttonText: 'Click Here' },
      style: {},
    },
    SectionComponent: {
      type: 'SectionComponent',
      props: {},
      style: {},
      children: [],
    },
    TextComponent: {
      type: 'TextComponent',
      props: { text: 'Text' },
      style: {},
    },
    ImageComponent: {
      type: 'ImageComponent',
      props: { src: 'https://via.placeholder.com/400x300', alt: 'Image' },
      style: {},
    },
    ButtonComponent: {
      type: 'ButtonComponent',
      props: { text: 'Button' },
      style: {},
    },
    InputComponent: {
      type: 'InputComponent',
      props: { placeholder: 'Input...' },
      style: {},
    },
    FormComponent: {
      type: 'FormComponent',
      props: {},
      style: {},
      children: [],
    },
    ContainerComponent: {
      type: 'ContainerComponent',
      props: {},
      style: {},
      children: [],
    },
    GridComponent: {
      type: 'GridComponent',
      props: {},
      style: {},
      children: [],
    },
    CardComponent: {
      type: 'CardComponent',
      props: {},
      style: {},
      children: [],
    },
    Link: {
      type: 'Link',
      props: { text: 'Click here', href: '#' },
      style: {},
    },
    LinkComponent: {
      type: 'LinkComponent',
      props: { text: 'Click here', href: '#' },
      style: {},
    },
    Icon: {
      type: 'Icon',
      props: { icon: 'star', size: '24' },
      style: {},
    },
    IconComponent: {
      type: 'IconComponent',
      props: { icon: 'star', size: '24' },
      style: {},
    },
    Textarea: {
      type: 'Textarea',
      props: { label: 'Message', placeholder: 'Enter your message...' },
      style: {},
    },
    TextareaComponent: {
      type: 'TextareaComponent',
      props: { label: 'Message', placeholder: 'Enter your message...' },
      style: {},
    },
    Checkbox: {
      type: 'Checkbox',
      props: { label: 'Accept terms and conditions' },
      style: {},
    },
    CheckboxComponent: {
      type: 'CheckboxComponent',
      props: { label: 'Accept terms and conditions' },
      style: {},
    },
    Submit: {
      type: 'Submit',
      props: { text: 'Submit' },
      style: {},
    },
    SubmitComponent: {
      type: 'SubmitComponent',
      props: { text: 'Submit' },
      style: {},
    },
    HeadingComponent: {
      type: 'HeadingComponent',
      props: { text: 'Heading', level: 'h2' },
      style: {},
    },
    // M2: New Interactive Components
    Accordion: {
      type: 'Accordion',
      props: {
        items: [
          { id: '1', title: 'Accordion Item 1', content: 'Content for item 1' },
          { id: '2', title: 'Accordion Item 2', content: 'Content for item 2' },
          { id: '3', title: 'Accordion Item 3', content: 'Content for item 3' },
        ],
        allowMultiple: false,
        defaultOpen: [],
        variant: 'default',
        iconType: 'chevron',
      },
      style: {},
    },
    AccordionComponent: {
      type: 'AccordionComponent',
      props: {
        items: [
          { id: '1', title: 'Accordion Item 1', content: 'Content for item 1' },
          { id: '2', title: 'Accordion Item 2', content: 'Content for item 2' },
          { id: '3', title: 'Accordion Item 3', content: 'Content for item 3' },
        ],
        allowMultiple: false,
        defaultOpen: [],
        variant: 'default',
        iconType: 'chevron',
      },
      style: {},
    },
    Tabs: {
      type: 'Tabs',
      props: {
        tabs: [
          { id: '1', label: 'Tab 1', content: 'Content for tab 1' },
          { id: '2', label: 'Tab 2', content: 'Content for tab 2' },
          { id: '3', label: 'Tab 3', content: 'Content for tab 3' },
        ],
        defaultActive: '1',
        variant: 'default',
        orientation: 'horizontal',
        closable: false,
      },
      style: {},
    },
    TabsComponent: {
      type: 'TabsComponent',
      props: {
        tabs: [
          { id: '1', label: 'Tab 1', content: 'Content for tab 1' },
          { id: '2', label: 'Tab 2', content: 'Content for tab 2' },
          { id: '3', label: 'Tab 3', content: 'Content for tab 3' },
        ],
        defaultActive: '1',
        variant: 'default',
        orientation: 'horizontal',
        closable: false,
      },
      style: {},
    },
    Counter: {
      type: 'Counter',
      props: {
        initialValue: 0,
        min: 0,
        max: 100,
        step: 1,
        label: 'Counter',
        size: 'md',
        showButtons: true,
        format: 'number',
      },
      style: {},
    },
    CounterComponent: {
      type: 'CounterComponent',
      props: {
        initialValue: 0,
        min: 0,
        max: 100,
        step: 1,
        label: 'Counter',
        size: 'md',
        showButtons: true,
        format: 'number',
      },
      style: {},
    },
    Progress: {
      type: 'Progress',
      props: {
        value: 50,
        variant: 'default',
        showLabel: true,
        animated: false,
        striped: false,
      },
      style: {},
    },
    ProgressComponent: {
      type: 'ProgressComponent',
      props: {
        value: 50,
        variant: 'default',
        showLabel: true,
        animated: false,
        striped: false,
      },
      style: {},
    },
    Tooltip: {
      type: 'Tooltip',
      props: {
        text: 'Hover me',
        content: 'This is a tooltip',
        placement: 'top',
        trigger: 'hover',
        delay: 200,
      },
      style: {},
    },
    TooltipComponent: {
      type: 'TooltipComponent',
      props: {
        text: 'Hover me',
        content: 'This is a tooltip',
        placement: 'top',
        trigger: 'hover',
        delay: 200,
      },
      style: {},
    },
    Modal: {
      type: 'Modal',
      props: {
        title: 'Modal Title',
        content: 'Modal content goes here...',
        size: 'md',
        closeButton: true,
        backdrop: true,
        centered: true,
      },
      style: {},
    },
    ModalComponent: {
      type: 'ModalComponent',
      props: {
        title: 'Modal Title',
        content: 'Modal content goes here...',
        size: 'md',
        closeButton: true,
        backdrop: true,
        centered: true,
      },
      style: {},
    },
    Alert: {
      type: 'Alert',
      props: {
        title: 'Alert Title',
        message: 'This is an alert message',
        variant: 'info',
        dismissible: true,
      },
      style: {},
    },
    AlertComponent: {
      type: 'AlertComponent',
      props: {
        title: 'Alert Title',
        message: 'This is an alert message',
        variant: 'info',
        dismissible: true,
      },
      style: {},
    },
    Badge: {
      type: 'Badge',
      props: {
        text: 'Badge',
        variant: 'default',
        size: 'md',
        dot: false,
        pulse: false,
      },
      style: {},
    },
    BadgeComponent: {
      type: 'BadgeComponent',
      props: {
        text: 'Badge',
        variant: 'default',
        size: 'md',
        dot: false,
        pulse: false,
      },
      style: {},
    },
    Breadcrumb: {
      type: 'Breadcrumb',
      props: {
        items: [
          { id: '1', label: 'Home', href: '/' },
          { id: '2', label: 'Products', href: '/products' },
          { id: '3', label: 'Current Page', href: '#' },
        ],
        separator: 'slash',
      },
      style: {},
    },
    BreadcrumbComponent: {
      type: 'BreadcrumbComponent',
      props: {
        items: [
          { id: '1', label: 'Home', href: '/' },
          { id: '2', label: 'Products', href: '/products' },
          { id: '3', label: 'Current Page', href: '#' },
        ],
        separator: 'slash',
      },
      style: {},
    },
    Divider: {
      type: 'Divider',
      props: {
        orientation: 'horizontal',
        variant: 'solid',
        label: '',
        labelPosition: 'center',
        thickness: '1px',
        color: '#e2e8f0',
        spacing: '1rem',
      },
      style: {},
    },
    DividerComponent: {
      type: 'DividerComponent',
      props: {
        orientation: 'horizontal',
        variant: 'solid',
        label: '',
        labelPosition: 'center',
        thickness: '1px',
        color: '#e2e8f0',
        spacing: '1rem',
      },
      style: {},
    },
    Carousel: {
      type: 'Carousel',
      props: {
        slides: [
          {
            id: '1',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            title: 'Slide 1',
            description: 'Beautiful mountain landscape',
          },
          {
            id: '2',
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
            title: 'Slide 2',
            description: 'Serene forest path',
          },
          {
            id: '3',
            image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
            title: 'Slide 3',
            description: 'Peaceful beach sunset',
          },
        ],
        autoPlay: true,
        interval: 3000,
        showControls: true,
        showIndicators: true,
        loop: true,
      },
      style: {},
    },
    CarouselComponent: {
      type: 'CarouselComponent',
      props: {
        slides: [
          {
            id: '1',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            title: 'Slide 1',
            description: 'Beautiful mountain landscape',
          },
          {
            id: '2',
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
            title: 'Slide 2',
            description: 'Serene forest path',
          },
          {
            id: '3',
            image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
            title: 'Slide 3',
            description: 'Peaceful beach sunset',
          },
        ],
        autoPlay: true,
        interval: 3000,
        showControls: true,
        showIndicators: true,
        loop: true,
      },
      style: {},
    },
    // M3: Extended Component Library (God-Tier 2025)
    // Layout Components
    InnerSection: {
      type: 'InnerSection',
      props: { maxWidth: '1200px', padding: '2rem' },
      style: { backgroundColor: '#f9fafb', borderRadius: '0.5rem' },
      children: [],
    },
    InnerSectionComponent: {
      type: 'InnerSectionComponent',
      props: { maxWidth: '1200px', padding: '2rem' },
      style: { backgroundColor: '#f9fafb', borderRadius: '0.5rem' },
      children: [],
    },
    Spacer: {
      type: 'Spacer',
      props: { height: '2rem' },
      style: {},
    },
    SpacerComponent: {
      type: 'SpacerComponent',
      props: { height: '2rem' },
      style: {},
    },
    // Content Components
    Banner: {
      type: 'Banner',
      props: {
        title: 'Welcome to Our Site',
        subtitle: 'Discover amazing features',
        ctaText: 'Get Started',
        ctaLink: '#',
        backgroundImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
        overlay: true,
        overlayOpacity: 0.5,
        textAlign: 'center',
        height: '500px',
      },
      style: {},
    },
    BannerComponent: {
      type: 'BannerComponent',
      props: {
        title: 'Welcome to Our Site',
        subtitle: 'Discover amazing features',
        ctaText: 'Get Started',
        ctaLink: '#',
        backgroundImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
        overlay: true,
        overlayOpacity: 0.5,
        textAlign: 'center',
        height: '500px',
      },
      style: {},
    },
    HTML: {
      type: 'HTML',
      props: { content: '<p>Custom HTML content</p>', sanitize: true },
      style: {},
    },
    HTMLComponent: {
      type: 'HTMLComponent',
      props: { content: '<p>Custom HTML content</p>', sanitize: true },
      style: {},
    },
    Video: {
      type: 'Video',
      props: {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        provider: 'youtube',
        controls: true,
        aspectRatio: '16:9',
      },
      style: {},
    },
    VideoComponent: {
      type: 'VideoComponent',
      props: {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        provider: 'youtube',
        controls: true,
        aspectRatio: '16:9',
      },
      style: {},
    },
    TextEditor: {
      type: 'TextEditor',
      props: { content: '<p>Rich text content here...</p>', toolbar: true },
      style: {},
    },
    TextEditorComponent: {
      type: 'TextEditorComponent',
      props: { content: '<p>Rich text content here...</p>', toolbar: true },
      style: {},
    },
    IconBox: {
      type: 'IconBox',
      props: {
        icon: '⭐',
        heading: 'Feature Title',
        description: 'Description of the feature',
        variant: 'default',
        alignment: 'center',
      },
      style: {},
    },
    IconBoxComponent: {
      type: 'IconBoxComponent',
      props: {
        icon: '⭐',
        heading: 'Feature Title',
        description: 'Description of the feature',
        variant: 'default',
        alignment: 'center',
      },
      style: {},
    },
    ImageBox: {
      type: 'ImageBox',
      props: {
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        alt: 'Image',
        caption: 'Image caption',
        aspectRatio: 'landscape',
      },
      style: {},
    },
    ImageBoxComponent: {
      type: 'ImageBoxComponent',
      props: {
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        alt: 'Image',
        caption: 'Image caption',
        aspectRatio: 'landscape',
      },
      style: {},
    },
    IconList: {
      type: 'IconList',
      props: {
        items: [
          { id: '1', icon: '✓', text: 'First item' },
          { id: '2', icon: '✓', text: 'Second item' },
          { id: '3', icon: '✓', text: 'Third item' },
        ],
        variant: 'checkmarks',
        spacing: 'normal',
      },
      style: {},
    },
    IconListComponent: {
      type: 'IconListComponent',
      props: {
        items: [
          { id: '1', icon: '✓', text: 'First item' },
          { id: '2', icon: '✓', text: 'Second item' },
          { id: '3', icon: '✓', text: 'Third item' },
        ],
        variant: 'checkmarks',
        spacing: 'normal',
      },
      style: {},
    },
    // Integration Components
    GoogleMaps: {
      type: 'GoogleMaps',
      props: {
        address: 'New York, NY',
        zoom: 12,
        height: '400px',
        mapType: 'roadmap',
        showControls: true,
      },
      style: {},
    },
    GoogleMapsComponent: {
      type: 'GoogleMapsComponent',
      props: {
        address: 'New York, NY',
        zoom: 12,
        height: '400px',
        mapType: 'roadmap',
        showControls: true,
      },
      style: {},
    },
    SoundCloud: {
      type: 'SoundCloud',
      props: { url: '', autoPlay: false, visual: true },
      style: {},
    },
    SoundCloudComponent: {
      type: 'SoundCloudComponent',
      props: { url: '', autoPlay: false, visual: true },
      style: {},
    },
    SocialIcons: {
      type: 'SocialIcons',
      props: {
        icons: [
          { id: '1', platform: 'facebook', url: 'https://facebook.com' },
          { id: '2', platform: 'twitter', url: 'https://twitter.com' },
          { id: '3', platform: 'instagram', url: 'https://instagram.com' },
        ],
        size: 'md',
        variant: 'filled',
        shape: 'circle',
      },
      style: {},
    },
    SocialIconsComponent: {
      type: 'SocialIconsComponent',
      props: {
        icons: [
          { id: '1', platform: 'facebook', url: 'https://facebook.com' },
          { id: '2', platform: 'twitter', url: 'https://twitter.com' },
          { id: '3', platform: 'instagram', url: 'https://instagram.com' },
        ],
        size: 'md',
        variant: 'filled',
        shape: 'circle',
      },
      style: {},
    },
    FacebookLike: {
      type: 'FacebookLike',
      props: { url: '', layout: 'standard', action: 'like', size: 'small' },
      style: {},
    },
    FacebookLikeComponent: {
      type: 'FacebookLikeComponent',
      props: { url: '', layout: 'standard', action: 'like', size: 'small' },
      style: {},
    },
    FacebookContent: {
      type: 'FacebookContent',
      props: { url: '', type: 'post', showText: true },
      style: {},
    },
    FacebookContentComponent: {
      type: 'FacebookContentComponent',
      props: { url: '', type: 'post', showText: true },
      style: {},
    },
    // Slider Components
    BannerSlider: {
      type: 'BannerSlider',
      props: {
        slides: [
          {
            id: '1',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
            title: 'Slide 1',
            ctaText: 'Learn More',
            ctaLink: '#',
          },
          {
            id: '2',
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
            title: 'Slide 2',
            ctaText: 'Get Started',
            ctaLink: '#',
          },
        ],
        autoPlay: true,
        interval: 5000,
        showControls: true,
        height: '500px',
      },
      style: {},
    },
    BannerSliderComponent: {
      type: 'BannerSliderComponent',
      props: {
        slides: [
          {
            id: '1',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
            title: 'Slide 1',
            ctaText: 'Learn More',
            ctaLink: '#',
          },
          {
            id: '2',
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
            title: 'Slide 2',
            ctaText: 'Get Started',
            ctaLink: '#',
          },
        ],
        autoPlay: true,
        interval: 5000,
        showControls: true,
        height: '500px',
      },
      style: {},
    },
    Slider: {
      type: 'Slider',
      props: {
        items: [
          { id: '1', content: 'Item 1', title: 'First' },
          { id: '2', content: 'Item 2', title: 'Second' },
          { id: '3', content: 'Item 3', title: 'Third' },
        ],
        itemsPerView: 3,
        autoPlay: false,
        showControls: true,
      },
      style: {},
    },
    SliderComponent: {
      type: 'SliderComponent',
      props: {
        items: [
          { id: '1', content: 'Item 1', title: 'First' },
          { id: '2', content: 'Item 2', title: 'Second' },
          { id: '3', content: 'Item 3', title: 'Third' },
        ],
        itemsPerView: 3,
        autoPlay: false,
        showControls: true,
      },
      style: {},
    },
    Toggle: {
      type: 'Toggle',
      props: {
        items: [
          { id: '1', trigger: 'Toggle 1', content: 'Content 1' },
          { id: '2', trigger: 'Toggle 2', content: 'Content 2' },
        ],
        variant: 'default',
        animated: true,
      },
      style: {},
    },
    ToggleComponent: {
      type: 'ToggleComponent',
      props: {
        items: [
          { id: '1', trigger: 'Toggle 1', content: 'Content 1' },
          { id: '2', trigger: 'Toggle 2', content: 'Content 2' },
        ],
        variant: 'default',
        animated: true,
      },
      style: {},
    },
    // Review Components
    Testimonial: {
      type: 'Testimonial',
      props: {
        quote: 'This is an amazing product!',
        author: 'John Doe',
        role: 'CEO',
        company: 'Company Inc.',
        rating: 5,
        showRating: true,
        variant: 'card',
      },
      style: {},
    },
    TestimonialComponent: {
      type: 'TestimonialComponent',
      props: {
        quote: 'This is an amazing product!',
        author: 'John Doe',
        role: 'CEO',
        company: 'Company Inc.',
        rating: 5,
        showRating: true,
        variant: 'card',
      },
      style: {},
    },
    StarRating: {
      type: 'StarRating',
      props: {
        rating: 4.5,
        maxRating: 5,
        size: 'md',
        interactive: false,
        showValue: true,
        halfStars: true,
      },
      style: {},
    },
    StarRatingComponent: {
      type: 'StarRatingComponent',
      props: {
        rating: 4.5,
        maxRating: 5,
        size: 'md',
        interactive: false,
        showValue: true,
        halfStars: true,
      },
      style: {},
    },
    // Navigation Components
    Menu: {
      type: 'Menu',
      props: {
        items: [
          { id: '1', label: 'Home', href: '/' },
          { id: '2', label: 'About', href: '/about' },
          { id: '3', label: 'Contact', href: '/contact' },
        ],
        orientation: 'horizontal',
        variant: 'default',
      },
      style: {},
    },
    MenuComponent: {
      type: 'MenuComponent',
      props: {
        items: [
          { id: '1', label: 'Home', href: '/' },
          { id: '2', label: 'About', href: '/about' },
          { id: '3', label: 'Contact', href: '/contact' },
        ],
        orientation: 'horizontal',
        variant: 'default',
      },
      style: {},
    },
    // E-commerce Components
    ProductList: {
      type: 'ProductList',
      props: {
        products: [
          {
            id: '1',
            name: 'Product 1',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            rating: 4.5,
            inStock: true,
          },
        ],
        layout: 'grid',
        columns: 3,
        showAddToCart: true,
      },
      style: {},
    },
    ProductListComponent: {
      type: 'ProductListComponent',
      props: {
        products: [
          {
            id: '1',
            name: 'Product 1',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            rating: 4.5,
            inStock: true,
          },
        ],
        layout: 'grid',
        columns: 3,
        showAddToCart: true,
      },
      style: {},
    },
    ProductSlider: {
      type: 'ProductSlider',
      props: {
        products: [
          {
            id: '1',
            name: 'Product 1',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            rating: 4.5,
          },
        ],
        itemsPerView: 4,
        autoPlay: false,
        showControls: true,
      },
      style: {},
    },
    ProductSliderComponent: {
      type: 'ProductSliderComponent',
      props: {
        products: [
          {
            id: '1',
            name: 'Product 1',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            rating: 4.5,
          },
        ],
        itemsPerView: 4,
        autoPlay: false,
        showControls: true,
      },
      style: {},
    },
    AddToCart: {
      type: 'AddToCart',
      props: {
        productId: '1',
        variant: 'button',
        size: 'md',
        buttonText: 'Add to Cart',
        showQuantity: true,
      },
      style: {},
    },
    AddToCartComponent: {
      type: 'AddToCartComponent',
      props: {
        productId: '1',
        variant: 'button',
        size: 'md',
        buttonText: 'Add to Cart',
        showQuantity: true,
      },
      style: {},
    },
    PricingTable: {
      type: 'PricingTable',
      props: {
        plans: [
          {
            id: '1',
            name: 'Basic',
            price: 9.99,
            period: 'month',
            features: ['Feature 1', 'Feature 2'],
            ctaText: 'Choose Plan',
          },
        ],
        columns: 3,
        variant: 'cards',
      },
      style: {},
    },
    PricingTableComponent: {
      type: 'PricingTableComponent',
      props: {
        plans: [
          {
            id: '1',
            name: 'Basic',
            price: 9.99,
            period: 'month',
            features: ['Feature 1', 'Feature 2'],
            ctaText: 'Choose Plan',
          },
        ],
        columns: 3,
        variant: 'cards',
      },
      style: {},
    },
    RecentlyViewed: {
      type: 'RecentlyViewed',
      props: {
        maxItems: 8,
        layout: 'slider',
        title: 'Recently Viewed',
        showAddToCart: true,
      },
      style: {},
    },
    RecentlyViewedComponent: {
      type: 'RecentlyViewedComponent',
      props: {
        maxItems: 8,
        layout: 'slider',
        title: 'Recently Viewed',
        showAddToCart: true,
      },
      style: {},
    },
    RecentlyCompared: {
      type: 'RecentlyCompared',
      props: {
        maxItems: 4,
        showDifferencesOnly: false,
        title: 'Recently Compared',
      },
      style: {},
    },
    RecentlyComparedComponent: {
      type: 'RecentlyComparedComponent',
      props: {
        maxItems: 4,
        showDifferencesOnly: false,
        title: 'Recently Compared',
      },
      style: {},
    },
    NewProducts: {
      type: 'NewProducts',
      props: {
        maxItems: 8,
        layout: 'grid',
        columns: 4,
        showBadge: true,
        badgeText: 'New',
        daysThreshold: 30,
      },
      style: {},
    },
    NewProductsComponent: {
      type: 'NewProductsComponent',
      props: {
        maxItems: 8,
        layout: 'grid',
        columns: 4,
        showBadge: true,
        badgeText: 'New',
        daysThreshold: 30,
      },
      style: {},
    },
    // Form Components
    FormBuilder: {
      type: 'FormBuilder',
      props: {
        fields: [
          { id: '1', type: 'text', label: 'Name', required: true },
          { id: '2', type: 'email', label: 'Email', required: true },
        ],
        submitText: 'Submit',
        layout: 'vertical',
        showLabels: true,
      },
      style: {},
    },
    FormBuilderComponent: {
      type: 'FormBuilderComponent',
      props: {
        fields: [
          { id: '1', type: 'text', label: 'Name', required: true },
          { id: '2', type: 'email', label: 'Email', required: true },
        ],
        submitText: 'Submit',
        layout: 'vertical',
        showLabels: true,
      },
      style: {},
    },
    MultistepFormBuilder: {
      type: 'MultistepFormBuilder',
      props: {
        steps: [
          {
            id: '1',
            title: 'Step 1',
            fields: [{ id: '1', type: 'text', label: 'Name', required: true }],
          },
          {
            id: '2',
            title: 'Step 2',
            fields: [{ id: '2', type: 'email', label: 'Email', required: true }],
          },
        ],
        showProgress: true,
        progressStyle: 'steps',
      },
      style: {},
    },
    MultistepFormBuilderComponent: {
      type: 'MultistepFormBuilderComponent',
      props: {
        steps: [
          {
            id: '1',
            title: 'Step 1',
            fields: [{ id: '1', type: 'text', label: 'Name', required: true }],
          },
          {
            id: '2',
            title: 'Step 2',
            fields: [{ id: '2', type: 'email', label: 'Email', required: true }],
          },
        ],
        showProgress: true,
        progressStyle: 'steps',
      },
      style: {},
    },
    // CMS Components
    CMSBlock: {
      type: 'CMSBlock',
      props: { blockIdentifier: 'footer-links', showTitle: true, cache: true },
      style: {},
    },
    CMSBlockComponent: {
      type: 'CMSBlockComponent',
      props: { blockIdentifier: 'footer-links', showTitle: true, cache: true },
      style: {},
    },
    CMSPage: {
      type: 'CMSPage',
      props: { pageIdentifier: 'about-us', showBreadcrumbs: true, showTitle: true },
      style: {},
    },
    CMSPageComponent: {
      type: 'CMSPageComponent',
      props: { pageIdentifier: 'about-us', showBreadcrumbs: true, showTitle: true },
      style: {},
    },
    OrdersAndReturns: {
      type: 'OrdersAndReturns',
      props: {
        title: 'Orders and Returns',
        requireEmail: true,
        requireOrderNumber: true,
        submitText: 'Find Order',
      },
      style: {},
    },
    OrdersAndReturnsComponent: {
      type: 'OrdersAndReturnsComponent',
      props: {
        title: 'Orders and Returns',
        requireEmail: true,
        requireOrderNumber: true,
        submitText: 'Find Order',
      },
      style: {},
    },
  };

  return defaults[type] || defaults.Text;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Initial State
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const initialState: CanvasState = {
  components: [],
  selectedComponentId: null,
  hoveredComponentId: null,
  past: [],
  future: [],
  isDragging: false,
  isResizing: false,
  zoom: 1,
  deviceMode: 'desktop',
  editorMode: 'advanced', // Default to advanced mode (full properties panel)
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Persistence Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface PersistedState {
  components: CanvasComponent[];
  version: number;
  timestamp: number;
}

const STORAGE_KEY = 'bubble-gum-canvas-v1';
const STORAGE_VERSION = 1;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Store Implementation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const useCanvasStore = create<CanvasStore>()(
  persist(
    devtools(
      temporal(
        (set, get) => ({
        ...initialState,

        // Add new component
        addComponent: (typeOrConfig, parentId, index) => {
          // Support both old API (type string) and new API (config object)
          const isConfigObject = typeof typeOrConfig === 'object' && 'type' in typeOrConfig;
          const type = isConfigObject ? typeOrConfig.type : typeOrConfig;
          const customProps = isConfigObject ? typeOrConfig.props : undefined;

          const defaultComponent = getDefaultComponent(type);

          const newComponent: CanvasComponent = {
            ...defaultComponent,
            id: nanoid(),
            parentId,
            // Merge custom props with default props
            props: customProps ? { ...defaultComponent.props, ...customProps } : defaultComponent.props,
          };

          set((state) => {
            const components = [...state.components];

            if (parentId) {
              // Add as child to parent component
              const updateChildren = (comps: CanvasComponent[]): CanvasComponent[] => {
                return comps.map((comp) => {
                  if (comp.id === parentId) {
                    const children = comp.children || [];
                    const newChildren = [...children];
                    if (index !== undefined) {
                      newChildren.splice(index, 0, newComponent);
                    } else {
                      newChildren.push(newComponent);
                    }
                    return { ...comp, children: newChildren };
                  }
                  if (comp.children) {
                    return { ...comp, children: updateChildren(comp.children) };
                  }
                  return comp;
                });
              };

              return {
                components: updateChildren(components),
                selectedComponentId: newComponent.id,
              };
            } else {
              // Add to root level
              if (index !== undefined) {
                components.splice(index, 0, newComponent);
              } else {
                components.push(newComponent);
              }

              return {
                components,
                selectedComponentId: newComponent.id,
              };
            }
          });
        },

        // Update component
        updateComponent: (id, updates) => {
          set((state) => {
            const updateInTree = (comps: CanvasComponent[]): CanvasComponent[] => {
              return comps.map((comp) => {
                if (comp.id === id) {
                  return { ...comp, ...updates };
                }
                if (comp.children) {
                  return { ...comp, children: updateInTree(comp.children) };
                }
                return comp;
              });
            };

            return {
              components: updateInTree(state.components),
            };
          });
        },

        // Delete component
        deleteComponent: (id) => {
          set((state) => {
            const removeFromTree = (comps: CanvasComponent[]): CanvasComponent[] => {
              return comps
                .filter((comp) => comp.id !== id)
                .map((comp) => {
                  if (comp.children) {
                    return { ...comp, children: removeFromTree(comp.children) };
                  }
                  return comp;
                });
            };

            return {
              components: removeFromTree(state.components),
              selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
            };
          });
        },

        // Move component
        moveComponent: (id, newParentId, newIndex) => {
          set((state) => {
            // Find and remove component from current location
            let movedComponent: CanvasComponent | undefined;

            const removeFromTree = (comps: CanvasComponent[]): CanvasComponent[] => {
              return comps
                .filter((comp) => {
                  if (comp.id === id) {
                    movedComponent = comp;
                    return false;
                  }
                  return true;
                })
                .map((comp) => {
                  if (comp.children) {
                    return { ...comp, children: removeFromTree(comp.children) };
                  }
                  return comp;
                });
            };

            let components = removeFromTree(state.components);

            if (!movedComponent) return state;

            // Update parentId
            movedComponent = { ...movedComponent, parentId: newParentId || undefined };

            // Insert at new location
            if (newParentId) {
              const insertIntoTree = (comps: CanvasComponent[]): CanvasComponent[] => {
                return comps.map((comp) => {
                  if (comp.id === newParentId) {
                    const children = comp.children || [];
                    const newChildren = [...children];
                    newChildren.splice(newIndex, 0, movedComponent!);
                    return { ...comp, children: newChildren };
                  }
                  if (comp.children) {
                    return { ...comp, children: insertIntoTree(comp.children) };
                  }
                  return comp;
                });
              };

              components = insertIntoTree(components);
            } else {
              components.splice(newIndex, 0, movedComponent);
            }

            return { components };
          });
        },

        // Set components (for reordering)
        setComponents: (components) => {
          set({ components });
        },

        // Duplicate component
        duplicateComponent: (id) => {
          const component = get().getComponentById(id);
          if (!component) return;

          const duplicateDeep = (comp: CanvasComponent): CanvasComponent => {
            const newComp = {
              ...comp,
              id: nanoid(),
              children: comp.children?.map(duplicateDeep),
            };
            return newComp;
          };

          const duplicated = duplicateDeep(component);

          set((state) => {
            if (component.parentId) {
              const addToParent = (comps: CanvasComponent[]): CanvasComponent[] => {
                return comps.map((comp) => {
                  if (comp.id === component.parentId) {
                    const children = comp.children || [];
                    const index = children.findIndex((c) => c.id === id);
                    const newChildren = [...children];
                    newChildren.splice(index + 1, 0, duplicated);
                    return { ...comp, children: newChildren };
                  }
                  if (comp.children) {
                    return { ...comp, children: addToParent(comp.children) };
                  }
                  return comp;
                });
              };

              return {
                components: addToParent(state.components),
                selectedComponentId: duplicated.id,
              };
            } else {
              const components = [...state.components];
              const index = components.findIndex((c) => c.id === id);
              components.splice(index + 1, 0, duplicated);

              return {
                components,
                selectedComponentId: duplicated.id,
              };
            }
          });
        },

        // Selection
        selectComponent: (id) => set({ selectedComponentId: id }),
        setHoveredComponent: (id) => set({ hoveredComponentId: id }),

        // Style updates
        updateComponentStyle: (id, style) => {
          set((state) => {
            const updateInTree = (comps: CanvasComponent[]): CanvasComponent[] => {
              return comps.map((comp) => {
                if (comp.id === id) {
                  return {
                    ...comp,
                    style: { ...comp.style, ...style },
                  };
                }
                if (comp.children) {
                  return { ...comp, children: updateInTree(comp.children) };
                }
                return comp;
              });
            };

            return {
              components: updateInTree(state.components),
            };
          });
        },

        updateResponsiveStyle: (id, breakpoint, style) => {
          set((state) => {
            const updateInTree = (comps: CanvasComponent[]): CanvasComponent[] => {
              return comps.map((comp) => {
                if (comp.id === id) {
                  if (breakpoint === 'desktop') {
                    // Desktop is base style, update directly
                    // IMPORTANT: Remove properties with undefined values (explicit deletion)
                    const mergedStyle = { ...comp.style, ...style };
                    Object.keys(style).forEach((key) => {
                      if (style[key as keyof typeof style] === undefined) {
                        delete mergedStyle[key as keyof typeof mergedStyle];
                      }
                    });

                    return {
                      ...comp,
                      style: mergedStyle,
                    };
                  } else {
                    // Tablet/Mobile are nested overrides
                    const currentBreakpointStyle = comp.style[breakpoint] || {};
                    const mergedBreakpointStyle = { ...currentBreakpointStyle, ...style };

                    // Remove properties with undefined values
                    Object.keys(style).forEach((key) => {
                      if (style[key as keyof typeof style] === undefined) {
                        delete mergedBreakpointStyle[key as keyof typeof mergedBreakpointStyle];
                      }
                    });

                    return {
                      ...comp,
                      style: {
                        ...comp.style,
                        [breakpoint]: mergedBreakpointStyle,
                      },
                    };
                  }
                }
                if (comp.children) {
                  return { ...comp, children: updateInTree(comp.children) };
                }
                return comp;
              });
            };

            return {
              components: updateInTree(state.components),
            };
          });
        },

        updateComponentProps: (id, props) => {
          logger.debug('🔧 updateComponentProps called:', { id, props });

          set((state) => {
            const updateInTree = (comps: CanvasComponent[]): CanvasComponent[] => {
              return comps.map((comp) => {
                if (comp.id === id) {
                  const updated = {
                    ...comp,
                    props: { ...comp.props, ...props },
                  };
                  logger.debug('✅ Component props updated:', {
                    id,
                    oldProps: comp.props,
                    newProps: updated.props,
                  });
                  return updated;
                }
                if (comp.children) {
                  return { ...comp, children: updateInTree(comp.children) };
                }
                return comp;
              });
            };

            const newComponents = updateInTree(state.components);

            // Save to history for undo/redo
            return {
              components: newComponents,
              past: [...state.past, state.components],
              future: [], // Clear future when making new changes
            };
          });
        },

        // UI state
        setIsDragging: (isDragging) => set({ isDragging }),
        setIsResizing: (isResizing) => set({ isResizing }),
        setZoom: (zoom) => set({ zoom }),
        setDeviceMode: (deviceMode) => set({ deviceMode }),

        // ═══════════════════════════════════════════════════════════════
        // NEW: EDITOR MODE (God-Tier 2025)
        // ═══════════════════════════════════════════════════════════════
        setEditorMode: (editorMode) => set({ editorMode }),

        // Utility
        clearCanvas: () => set({ ...initialState }),
        loadComponents: (components) => set({ components }),
        getComponentById: (id) => {
          const findInTree = (comps: CanvasComponent[]): CanvasComponent | undefined => {
            for (const comp of comps) {
              if (comp.id === id) return comp;
              if (comp.children) {
                const found = findInTree(comp.children);
                if (found) return found;
              }
            }
            return undefined;
          };

          return findInTree(get().components);
        },
      }),
      {
        limit: 50, // Keep 50 history states
        equality: (a, b) => a === b,
      }
    ),
    { name: 'CanvasStore' }
  ),
  {
    name: STORAGE_KEY,
    version: STORAGE_VERSION,
    storage: createJSONStorage(() => localStorage),

    // Only persist canvas data (NOT UI state like selection, zoom)
    partialize: (state) => ({
      components: state.components,
      // DON'T persist: selectedComponentId, hoveredComponentId, zoom, deviceMode, isDragging, isResizing, past, future
    }),

    // Merge strategy: override components from localStorage, keep UI state from initialState
    merge: (persistedState: unknown, currentState) => {
      logger.debug('📦 localStorage: Restoring persisted state');
      return {
        ...currentState, // Keep UI state (selection, zoom, etc.)
        ...(persistedState as Partial<CanvasStore>), // Override with persisted canvas data
      };
    },

    // Migration function for version changes
    migrate: (persistedState: unknown, version: number) => {
      logger.debug(`🔄 localStorage: Migrating from version ${version} to ${STORAGE_VERSION}`);

      if (version === 0) {
        // Migrate from v0 to v1 (if needed in future)
        return {
          ...(persistedState as Record<string, unknown>),
          version: 1,
        };
      }

      return persistedState;
    },

    // Only persist in browser environment
    skipHydration: typeof window === 'undefined',

    // Log persistence events
    onRehydrateStorage: () => {
      logger.debug('💾 localStorage: Starting hydration');
      return (state, error) => {
        if (error) {
          console.error('❌ localStorage: Hydration error:', error);
        } else {
          logger.debug('✅ localStorage: Hydration complete', {
            components: state?.components.length || 0,
          });
        }
      };
    },
  }
)
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Undo/Redo Hooks
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const useUndo = () => {
  const undo = useCanvasStore.temporal.getState().undo;
  const pastStates = useCanvasStore.temporal.getState().pastStates;
  const canUndo = pastStates.length > 0;
  return { undo, canUndo };
};

export const useRedo = () => {
  const redo = useCanvasStore.temporal.getState().redo;
  const futureStates = useCanvasStore.temporal.getState().futureStates;
  const canRedo = futureStates.length > 0;
  return { redo, canRedo };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// localStorage Utilities
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Clear localStorage backup (call on logout or when starting fresh)
 */
export const clearCanvasLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    logger.debug('🧹 localStorage: Cleared canvas backup');
  }
};

/**
 * Get persisted state from localStorage (for conflict detection)
 */
export const getPersistedCanvasState = (): PersistedState | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return parsed.state as PersistedState;
  } catch (error) {
    console.error('❌ localStorage: Failed to read persisted state:', error);
    return null;
  }
};

/**
 * Check if localStorage has unsaved changes compared to database
 */
export const hasLocalStorageConflict = (dbComponents: CanvasComponent[]): boolean => {
  const persisted = getPersistedCanvasState();
  if (!persisted || !persisted.components) return false;

  const localCount = persisted.components.length;
  const dbCount = dbComponents.length;

  // Simple conflict detection: local has more components
  if (localCount > dbCount) {
    console.warn('⚠️ localStorage conflict detected:', {
      local: localCount,
      database: dbCount,
    });
    return true;
  }

  return false;
};
