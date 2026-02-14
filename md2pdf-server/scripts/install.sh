#!/bin/bash
# Quick install script for md2pdf skill
set -e

echo "🦑 Installing md2pdf skill dependencies..."
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Install npm packages
echo "📦 Installing npm packages..."
npm install

echo ""
echo "🔧 Installing Playwright browser dependencies..."
echo "   (This installs required system libraries for Chromium)"
npx playwright install-deps chromium

echo ""
echo "✅ Installation complete!"
echo ""
echo "Usage:"
echo "  python3 md2pdf.py input.md output.pdf"
