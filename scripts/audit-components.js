#!/usr/bin/env node
/**
 * PHASE 0.1: Component Inventory Audit Script
 * God-Tier Development Protocol 2025
 *
 * Scans all 63 components and generates comprehensive audit report
 */

const fs = require('fs');
const path = require('path');

const CANVAS_DIR = path.join(__dirname, '../components/canvas');
const OUTPUT_FILE = path.join(__dirname, '../docs/PHASE_0_COMPONENT_AUDIT.md');

// Component groups from specification
const GROUPS = {
  layout: ['Container', 'Section', 'InnerSection', 'Grid', 'Card', 'Spacer'],
  content: ['Text', 'Heading', 'Image', 'Icon', 'Video', 'HTML', 'TextEditor', 'Divider', 'Badge', 'Breadcrumb', 'IconList', 'IconBox', 'ImageBox'],
  forms: ['Form', 'FormBuilder', 'MultistepFormBuilder', 'Input', 'Textarea', 'Checkbox', 'Submit'],
  navigation: ['Navbar', 'Menu', 'Link', 'Footer', 'Breadcrumb'],
  feedback: ['Alert', 'Progress', 'Counter', 'Tooltip', 'StarRating'],
  overlay: ['Modal', 'Tooltip'],
  interactive: ['Accordion', 'Tabs', 'Toggle', 'Counter'],
  integrations: ['GoogleMaps', 'FacebookLike', 'FacebookContent', 'SoundCloud', 'SocialIcons'],
  sliders: ['Carousel', 'BannerSlider', 'Slider', 'ProductSlider'],
  reviews: ['Testimonial', 'StarRating'],
  ecommerce: ['PricingTable', 'ProductList', 'ProductSlider', 'AddToCart', 'RecentlyViewed', 'RecentlyCompared', 'NewProducts'],
  cms: ['CMSBlock', 'CMSPage', 'OrdersAndReturns'],
  sections: ['Hero', 'Banner', 'Features', 'CTA']
};

function analyzeComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const componentName = path.basename(filePath, '.tsx');

  // Extract interface/type definitions
  const interfaceMatches = content.match(/interface\s+(\w+)/g) || [];
  const typeMatches = content.match(/type\s+(\w+)/g) || [];

  // Extract props
  const propsMatch = content.match(/const\s+{\s*props[^}]*}\s*=\s*component/);
  const propsExtract = content.match(/props\.(\w+)/g) || [];
  const uniqueProps = [...new Set(propsExtract.map(p => p.replace('props.', '')))];

  // Check for children support
  const hasChildren = content.includes('children');

  // Check for conditional rendering
  const hasConditional = content.includes('if (') || content.includes('? ') || content.includes('&&');

  // Estimate complexity (lines of code)
  const lines = content.split('\n').length;

  // Check for state management
  const hasState = content.includes('useState') || content.includes('useReducer');
  const hasStore = content.includes('useCanvasStore') || content.includes('useStore');

  // Check for drag-and-drop
  const hasDnD = content.includes('useDraggable') || content.includes('useDroppable');

  return {
    name: componentName,
    filePath,
    interfaces: interfaceMatches.length,
    types: typeMatches.length,
    props: uniqueProps,
    propsCount: uniqueProps.length,
    hasChildren,
    hasConditional,
    linesOfCode: lines,
    hasState,
    hasStore,
    hasDnD,
    complexity: lines > 200 ? 'High' : lines > 100 ? 'Medium' : 'Low'
  };
}

function classifyComponentAtomic(componentName) {
  const name = componentName.replace('Component', '');

  // Atoms - simple, indivisible elements
  const atoms = ['Button', 'Input', 'Icon', 'Link', 'Image', 'Text', 'Badge', 'Divider', 'Checkbox', 'Submit', 'Heading', 'Spacer', 'HTML', 'Video', 'Textarea'];

  // Molecules - simple groups
  const molecules = ['IconBox', 'ImageBox', 'IconList', 'Alert', 'Tooltip', 'Progress', 'Counter', 'Breadcrumb', 'Toggle', 'StarRating', 'Modal'];

  // Organisms - complex sections
  const organisms = ['Hero', 'Banner', 'PricingTable', 'Accordion', 'Tabs', 'Navbar', 'Menu', 'ProductList', 'ProductSlider', 'Form', 'FormBuilder', 'MultistepFormBuilder', 'Carousel', 'BannerSlider', 'Slider', 'Features', 'CTA', 'Testimonial', 'Footer', 'Card', 'GoogleMaps', 'FacebookLike', 'FacebookContent', 'SoundCloud', 'SocialIcons', 'AddToCart', 'RecentlyViewed', 'RecentlyCompared', 'NewProducts', 'CMSBlock', 'CMSPage', 'OrdersAndReturns', 'TextEditor'];

  // Templates
  const templates = ['Container', 'Section', 'InnerSection', 'Grid'];

  if (atoms.includes(name)) return 'Atom';
  if (molecules.includes(name)) return 'Molecule';
  if (organisms.includes(name)) return 'Organism';
  if (templates.includes(name)) return 'Template';
  return 'Unclassified';
}

function generateReport() {
  const files = fs.readdirSync(CANVAS_DIR)
    .filter(f => f.endsWith('Component.tsx'))
    .sort();

  console.log(`🔍 Scanning ${files.length} components...`);

  const components = files.map(f => {
    const filePath = path.join(CANVAS_DIR, f);
    const analysis = analyzeComponent(filePath);
    const atomic = classifyComponentAtomic(analysis.name);
    return { ...analysis, atomic };
  });

  // Group by atomic level
  const byAtomic = {
    Atom: components.filter(c => c.atomic === 'Atom'),
    Molecule: components.filter(c => c.atomic === 'Molecule'),
    Organism: components.filter(c => c.atomic === 'Organism'),
    Template: components.filter(c => c.atomic === 'Template'),
    Unclassified: components.filter(c => c.atomic === 'Unclassified')
  };

  // Generate markdown report
  let report = `# PHASE 0: Component Inventory Audit Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n`;
  report += `**Total Components:** ${components.length}\n`;
  report += `**God-Tier Development Protocol 2025**\n\n`;
  report += `---\n\n`;

  report += `## 📊 Executive Summary\n\n`;
  report += `| Metric | Count |\n`;
  report += `|--------|-------|\n`;
  report += `| Total Components | ${components.length} |\n`;
  report += `| 🔬 Atoms | ${byAtomic.Atom.length} |\n`;
  report += `| 🧪 Molecules | ${byAtomic.Molecule.length} |\n`;
  report += `| 🏗️ Organisms | ${byAtomic.Organism.length} |\n`;
  report += `| 📋 Templates | ${byAtomic.Template.length} |\n`;
  report += `| ❓ Unclassified | ${byAtomic.Unclassified.length} |\n`;
  report += `| Avg Props per Component | ${Math.round(components.reduce((sum, c) => sum + c.propsCount, 0) / components.length)} |\n`;
  report += `| High Complexity | ${components.filter(c => c.complexity === 'High').length} |\n`;
  report += `| With State | ${components.filter(c => c.hasState).length} |\n`;
  report += `| With DnD | ${components.filter(c => c.hasDnD).length} |\n\n`;

  report += `---\n\n`;

  // Atomic classification details
  for (const [level, comps] of Object.entries(byAtomic)) {
    if (comps.length === 0) continue;

    const icon = {
      'Atom': '🔬',
      'Molecule': '🧪',
      'Organism': '🏗️',
      'Template': '📋',
      'Unclassified': '❓'
    }[level];

    report += `## ${icon} ${level}s (${comps.length})\n\n`;
    report += `| Component | Props | Lines | Complexity | Children | State | DnD |\n`;
    report += `|-----------|-------|-------|------------|----------|-------|-----|\n`;

    comps.forEach(c => {
      report += `| ${c.name} | ${c.propsCount} | ${c.linesOfCode} | ${c.complexity} | ${c.hasChildren ? '✅' : '❌'} | ${c.hasState ? '✅' : '❌'} | ${c.hasDnD ? '✅' : '❌'} |\n`;
    });

    report += `\n`;
  }

  report += `---\n\n`;

  // Detailed component analysis
  report += `## 📋 Detailed Component Analysis\n\n`;

  components.forEach(c => {
    report += `### ${c.name}\n\n`;
    report += `**Atomic Level:** ${c.atomic}\n`;
    report += `**Complexity:** ${c.complexity} (${c.linesOfCode} lines)\n`;
    report += `**Props:** ${c.propsCount} (${c.props.slice(0, 10).join(', ')}${c.props.length > 10 ? '...' : ''})\n`;
    report += `**Features:**\n`;
    report += `- Children Support: ${c.hasChildren ? '✅' : '❌'}\n`;
    report += `- State Management: ${c.hasState ? '✅' : '❌'}\n`;
    report += `- Store Integration: ${c.hasStore ? '✅' : '❌'}\n`;
    report += `- Drag & Drop: ${c.hasDnD ? '✅' : '❌'}\n`;
    report += `- Conditional Rendering: ${c.hasConditional ? '✅' : '❌'}\n\n`;
  });

  fs.writeFileSync(OUTPUT_FILE, report);
  console.log(`✅ Report generated: ${OUTPUT_FILE}`);

  return { components, byAtomic };
}

// Execute
try {
  const result = generateReport();
  console.log(`\n📊 Summary:`);
  console.log(`  🔬 Atoms: ${result.byAtomic.Atom.length}`);
  console.log(`  🧪 Molecules: ${result.byAtomic.Molecule.length}`);
  console.log(`  🏗️ Organisms: ${result.byAtomic.Organism.length}`);
  console.log(`  📋 Templates: ${result.byAtomic.Template.length}`);
  console.log(`  ❓ Unclassified: ${result.byAtomic.Unclassified.length}`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
