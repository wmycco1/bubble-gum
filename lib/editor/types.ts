// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - EDITOR TYPES
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Enterprise-grade TypeScript types for visual editor
// ═══════════════════════════════════════════════════════════════

export type ComponentType =
  | 'Button'
  | 'Text'
  | 'Heading'
  | 'Image'
  | 'Container'
  | 'Section'
  | 'Grid'
  | 'Card'
  | 'Input'
  | 'Form';

export interface ComponentStyle {
  // Layout
  width?: string;
  height?: string;
  margin?: string;
  padding?: string;
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;

  // Typography
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  textAlign?: string;
  color?: string;

  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;

  // Border
  border?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;

  // Effects
  boxShadow?: string;
  opacity?: string;
  transform?: string;
  transition?: string;
}

export interface ComponentProps {
  // Common props
  text?: string;
  href?: string;
  src?: string;
  alt?: string;
  placeholder?: string;
  variant?: string;
  size?: string;

  // Form props
  name?: string;
  type?: string;
  required?: boolean;

  // Custom HTML attributes
  [key: string]: unknown;
}

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  style: ComponentStyle;
  children?: CanvasComponent[];
  parentId?: string;
}

export interface CanvasState {
  // Components tree
  components: CanvasComponent[];

  // Selection
  selectedComponentId: string | null;
  hoveredComponentId: string | null;

  // History (for undo/redo)
  past: CanvasComponent[][];
  future: CanvasComponent[][];

  // UI state
  isDragging: boolean;
  isResizing: boolean;

  // Viewport
  zoom: number;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
}

export interface DragItem {
  type: 'new-component' | 'existing-component';
  componentType?: ComponentType;
  componentId?: string;
}

export interface DropPosition {
  parentId: string | null;
  index: number;
}
