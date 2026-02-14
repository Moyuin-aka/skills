---
name: md2pdf-server
description: Lightweight Markdown to PDF converter for server environments. Renders KaTeX math server-side and Mermaid diagrams via headless browser. No system Chromium installation required—bundles its own headless shell. Use when converting markdown documents with math formulas or diagrams to PDF, especially in Docker containers or VPS without GUI.
---

# md2pdf-server

轻量级 Markdown 转 PDF 工具，专为服务器环境设计。

> Server-friendly Markdown to PDF converter with KaTeX SSR and Mermaid browser rendering.

## 特点

- ✅ **零系统依赖** — 自带 Chromium headless-shell，无需 apt-get 安装
- ✅ **KaTeX 服务端渲染** — Node.js 端预渲染数学公式，准确快速
- ✅ **Mermaid 浏览器渲染** — Playwright 动态渲染图表
- ✅ **Playwright** — 比 Puppeteer 更现代、更稳定
- ✅ **Docker/VPS 友好** — 专为无 GUI 环境设计

## 架构

```
Markdown → markdown-it + markdown-it-katex (服务端 KaTeX)
         → HTML (公式已预渲染)
         → Playwright + headless-shell → Mermaid 渲染 → PDF
```

## 安装

```bash
cd md2pdf-server/scripts
./install.sh
```

或手动：
```bash
npm install
npx playwright install chromium
```

## 使用

```bash
python3 md2pdf.py input.md output.pdf
```

## 依赖

- Node.js 18+
- Playwright (自动下载 Chromium)
- markdown-it + markdown-it-katex

## 支持的语法

- GitHub Flavored Markdown
- KaTeX 数学公式 (`$...$` 和 `$$...$$`)
- Mermaid 图表 (流程图、时序图、甘特图)
- 代码高亮、表格、任务列表

## 为什么不用 Puppeteer？

Playwright 是微软出品，相比 Puppeteer：
- 更快的页面加载和渲染
- 更好的字体渲染质量
- 更小的 PDF 体积
- 更活跃的维护

## 作者

Created by **clawmo** 🐾  
For **Moyuin** | 2026
