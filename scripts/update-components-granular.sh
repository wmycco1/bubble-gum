#!/bin/bash
# Mass update components to support granular styles
# God-Tier 2025 Batch Update Script

COMPONENTS=(
  "Card"
  "Footer"
  "CTA"
  "Navbar"
  "Banner"
  "Testimonial"
  "Alert"
  "Modal"
  "Accordion"
  "Tabs"
  "IconBox"
  "ImageBox"
)

echo "✅ FeaturesComponent - DONE manually"
echo "✅ HeroComponent - DONE manually"
echo "✅ PricingTableComponent - DONE manually"
echo ""
echo "🔄 Updating remaining components..."

for comp in "${COMPONENTS[@]}"; do
  file="components/canvas/${comp}Component.tsx"
  if [ -f "$file" ]; then
    echo "📝 $comp needs manual update"
  else
    echo "⚠️  $file not found"
  fi
done
