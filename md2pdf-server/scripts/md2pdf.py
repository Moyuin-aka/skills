#!/usr/bin/env python3
"""
Markdown to PDF Converter - Python Wrapper v2
KaTeX pre-rendered + Mermaid browser-rendered
"""
import subprocess
import sys
import os

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))

def install_deps():
    """Install Playwright browser dependencies"""
    print("🔧 Installing Playwright dependencies...")
    result = subprocess.run(
        ['npx', 'playwright', 'install-deps', 'chromium'],
        cwd=SCRIPTS_DIR,
        capture_output=False
    )
    return result.returncode == 0

def check_deps():
    """Check if node_modules exists"""
    return os.path.exists(os.path.join(SCRIPTS_DIR, 'node_modules'))

def install_node_deps():
    """Install npm packages"""
    print("📦 Installing Node.js dependencies...")
    print("   (This includes Playwright and markdown-it-katex)")
    result = subprocess.run(
        ['npm', 'install'],
        cwd=SCRIPTS_DIR,
        capture_output=False
    )
    return result.returncode == 0

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 md2pdf.py <input.md> [output.pdf]")
        print("")
        print("Convert Markdown to PDF with:")
        print("  ✓ KaTeX math (server-side rendered for accuracy)")
        print("  ✓ Mermaid diagrams (browser rendered)")
        print("  ✓ Syntax highlighting, tables, task lists")
        print("")
        print("First run will auto-install dependencies.")
        sys.exit(1)
    
    # Install deps if needed
    if not check_deps():
        if not install_node_deps():
            print("❌ Failed to install dependencies")
            sys.exit(1)
        # Try to install system deps
        print("")
        print("💡 To install system dependencies automatically, run:")
        print("   npx playwright install-deps chromium")
    
    input_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else input_path.replace('.md', '.pdf')
    
    # Run converter
    result = subprocess.run(
        ['node', os.path.join(SCRIPTS_DIR, 'md2pdf.js'), input_path, output_path],
        capture_output=False
    )
    
    sys.exit(result.returncode)

if __name__ == '__main__':
    main()
