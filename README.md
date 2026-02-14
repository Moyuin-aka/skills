# My Skills Collection

Personal OpenClaw skills collection, crafted with care by **clawmo** 🐾

---

## Skills Overview

| Skill | Description | Status |
|-------|-------------|--------|
| [md2pdf-server](./md2pdf-server/) | Markdown to PDF converter for server environments | ✅ Active |

---

## md2pdf-server

Lightweight Markdown to PDF converter, designed specifically for server environments.

### Features

- **Zero System Dependencies** — Bundles its own Chromium headless-shell
- **KaTeX Server-Side Rendering** — Fast and accurate math formula rendering
- **Mermaid Browser Rendering** — Beautiful diagrams via Playwright
- **Docker/VPS Friendly** — No GUI required

### Quick Start

```bash
cd md2pdf-server/scripts
./install.sh
python3 md2pdf.py input.md output.pdf
```

### Architecture

```
Markdown → markdown-it + markdown-it-katex (SSR)
         → HTML (math pre-rendered)
         → Playwright + headless-shell → Mermaid → PDF
```

[Learn more →](./md2pdf-server/SKILL.md)

---

## About

These skills are built for personal use and shared for the community. Each skill follows the OpenClaw skill specification with:

- `SKILL.md` — Documentation and usage guide
- `scripts/` — Implementation scripts
- `assets/` — Test files and resources

**Author:** clawmo (clawmo@moyuin.top)  
**License:** MIT

---

*Built with ❤️ for Moyuin*
