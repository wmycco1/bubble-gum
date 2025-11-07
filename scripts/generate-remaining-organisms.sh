#!/bin/bash
# Script to generate remaining organism component files
# God-Tier Development Protocol 2025

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Generating 16 remaining organism components (96 files)...${NC}"

BASE_DIR="/var/www/bubble-gum/src/components/organisms"

# Component names
COMPONENTS=(
  "ProductSlider"
  "AddToCart"
  "RecentlyViewed"
  "RecentlyCompared"
  "NewProducts"
  "CMSBlock"
  "CMSPage"
  "FormBuilder"
  "MultistepFormBuilder"
  "OrdersAndReturns"
  "TextEditor"
  "SocialIcons"
  "GoogleMaps"
  "Video"
  "FacebookContent"
  "FacebookLike"
)

for COMPONENT in "${COMPONENTS[@]}"; do
  COMPONENT_DIR="$BASE_DIR/$COMPONENT"
  echo -e "${GREEN}✓ Creating $COMPONENT...${NC}"

  # Create directory if not exists
  mkdir -p "$COMPONENT_DIR"

  # Create files (actual content will be added separately)
  touch "$COMPONENT_DIR/${COMPONENT}.types.ts"
  touch "$COMPONENT_DIR/${COMPONENT}.tsx"
  touch "$COMPONENT_DIR/${COMPONENT}.module.css"
  touch "$COMPONENT_DIR/${COMPONENT}.test.tsx"
  touch "$COMPONENT_DIR/README.md"
  touch "$COMPONENT_DIR/index.ts"
done

echo -e "${BLUE}✅ Directory structure created for all 16 components${NC}"
echo -e "${BLUE}📝 Now adding content to each file...${NC}"
