#!/bin/bash
# Markdown to PDF Converter - Bash Wrapper
# Usage: ./convert.sh <input.md> [output.pdf]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
python3 "$SCRIPT_DIR/md2pdf.py" "$@"
