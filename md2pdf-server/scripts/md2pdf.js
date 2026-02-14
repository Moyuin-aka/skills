#!/usr/bin/env node
/**
 * Markdown to PDF Converter v2
 * KaTeX pre-rendered (Node.js side) + Mermaid browser-rendered
 * Based on expert advice: https://github.com/microsoft/playwright
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// Use markdown-it with KaTeX plugin for server-side math rendering
const MarkdownIt = require('markdown-it');
const markdownItKatex = require('markdown-it-katex');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
}).use(markdownItKatex, {
  throwOnError: false,
  errorColor: '#cc0000'
});

// Custom renderer for Mermaid
md.renderer.rules.fence = function(tokens, idx, options, env, self) {
  const token = tokens[idx];
  const code = token.content;
  const lang = token.info.trim();
  
  if (lang === 'mermaid') {
    // Keep mermaid code for browser rendering
    return `<div class="mermaid">${code}</div>`;
  }
  
  // Default code block rendering
  return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code)}</code></pre>`;
};

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function createHtmlDocument(title, bodyContent, katexCssContent) {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    
    <!-- KaTeX CSS (inlined with absolute file:// font URLs) -->
    <style>
${katexCssContent}
    </style>
    
    <!-- Mermaid JS (for browser rendering) -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    
    <style>
        @page {
            size: A4;
            margin: 2cm 1.5cm;
        }
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                         "Noto Sans", "Helvetica Neue", Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.7;
            color: #333;
            max-width: 100%;
            word-wrap: break-word;
        }
        
        h1 {
            font-size: 22pt;
            font-weight: 600;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-top: 28pt;
            margin-bottom: 16pt;
            color: #1a1a1a;
            page-break-after: avoid;
        }
        
        h2 {
            font-size: 16pt;
            font-weight: 600;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 8px;
            margin-top: 24pt;
            margin-bottom: 12pt;
            color: #2a2a2a;
            page-break-after: avoid;
        }
        
        h3 {
            font-size: 13pt;
            font-weight: 600;
            margin-top: 18pt;
            margin-bottom: 10pt;
            color: #333;
            page-break-after: avoid;
        }
        
        h4, h5, h6 {
            font-size: 11pt;
            font-weight: 600;
            margin-top: 14pt;
            margin-bottom: 8pt;
            page-break-after: avoid;
        }
        
        p {
            margin: 10px 0;
            text-align: justify;
            orphans: 3;
            widows: 3;
        }
        
        blockquote {
            border-left: 4px solid #ddd;
            margin: 16px 0;
            padding: 12px 20px;
            background: #f9f9f9;
            font-style: italic;
            color: #555;
            page-break-inside: avoid;
        }
        
        blockquote p {
            margin: 0;
        }
        
        /* KaTeX math styles */
        .katex {
            font-size: 1em;
        }
        
        .katex-display {
            margin: 1em 0;
            overflow-x: auto;
            overflow-y: hidden;
        }
        
        code {
            font-family: "SFMono-Regular", Monaco, "Cascadia Code", Consolas, 
                         "Liberation Mono", monospace;
            font-size: 9.5pt;
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            color: #e83e8c;
        }
        
        pre {
            background: #f8f8f8;
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            border: 1px solid #e0e0e0;
            margin: 16px 0;
            page-break-inside: avoid;
        }
        
        pre code {
            background: none;
            padding: 0;
            color: #333;
            font-size: 9pt;
            line-height: 1.5;
        }
        
        ul, ol {
            margin: 12px 0;
            padding-left: 24px;
        }
        
        li {
            margin: 6px 0;
        }
        
        li > ul, li > ol {
            margin: 6px 0;
        }
        
        hr {
            border: none;
            border-top: 1px solid #e0e0e0;
            margin: 24px 0;
        }
        
        a {
            color: #0366d6;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
            page-break-inside: avoid;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
        }
        
        th {
            background: #f5f5f5;
            font-weight: 600;
        }
        
        tr:nth-child(even) {
            background: #fafafa;
        }
        
        /* Mermaid container */
        .mermaid {
            text-align: center;
            margin: 20px 0;
            page-break-inside: avoid;
        }
        
        .mermaid svg {
            max-width: 100%;
            height: auto;
        }
        
        img {
            max-width: 100%;
            height: auto;
        }
        
        /* Print-specific */
        @media print {
            .mermaid[data-processed="true"] {
                display: block;
            }
        }
    </style>
</head>
<body>
${bodyContent}

<script>
    // Initialize Mermaid
    mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        flowchart: { 
            curve: 'basis',
            padding: 20
        },
        sequence: { 
            showSequenceNumbers: true,
            diagramMarginX: 50,
            diagramMarginY: 10
        },
        gantt: {
            titleTopMargin: 25,
            barHeight: 20
        }
    });
</script>
</body>
</html>`;
}

async function markdownToPdf(inputPath, outputPath) {
    if (!fs.existsSync(inputPath)) {
        throw new Error(`File not found: ${inputPath}`);
    }

    console.log(`📄 Converting: ${path.basename(inputPath)}`);
    
    // Read markdown
    const markdown = fs.readFileSync(inputPath, 'utf-8');
    
    // Extract title from first h1 or filename
    const titleMatch = markdown.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(inputPath, '.md');
    
    // Step 1: Render Markdown + KaTeX (server-side)
    console.log('📝 Rendering Markdown + KaTeX...');
    const htmlBody = md.render(markdown);
    
    // Step 2: Build KaTeX CSS with absolute font URLs for reliable headless rendering
    const katexCssPath = require.resolve('katex/dist/katex.min.css');
    const katexDistDir = path.dirname(katexCssPath).replace(/\\/g, '/');
    const katexCssRaw = fs.readFileSync(katexCssPath, 'utf-8');
    const katexCssPatched = katexCssRaw.replace(
        /url\((['"]?)(fonts\/[^'"\)]+)\1\)/g,
        (_, __, relPath) => `url("file://${katexDistDir}/${relPath}")`
    );

    const fullHtml = createHtmlDocument(title, htmlBody, katexCssPatched);

    // Write temp HTML so file:// base works consistently
    const tmpHtmlPath = outputPath.replace(/\.pdf$/i, '.tmp.render.html');
    fs.writeFileSync(tmpHtmlPath, fullHtml, 'utf-8');

    // Step 3: Launch browser for Mermaid rendering + PDF generation
    console.log('🚀 Launching browser...');
    const browser = await chromium.launch({ headless: true });
    
    try {
        const page = await browser.newPage();
        
        // Load from file:// to ensure KaTeX CSS + fonts load reliably
        await page.goto(`file://${tmpHtmlPath}`, {
            waitUntil: 'networkidle',
            timeout: 30000
        });
        
        // Step 4: Wait for Mermaid to render (CRITICAL!)
        console.log('⏳ Waiting for Mermaid diagrams...');
        const mermaidCount = await page.evaluate(() => {
            return document.querySelectorAll('.mermaid').length;
        });
        
        if (mermaidCount > 0) {
            console.log(`   Found ${mermaidCount} Mermaid chart(s)`);
            
            // Wait for all mermaid charts to be processed
            await page.waitForFunction((count) => {
                const svgs = document.querySelectorAll('.mermaid svg');
                return svgs.length === count;
            }, mermaidCount, { timeout: 30000 });
            
            console.log('   ✓ Mermaid charts rendered');
        } else {
            console.log('   No Mermaid charts found');
        }
        
        // Extra wait for any async rendering
        await page.waitForTimeout(500);
        
        // Step 5: Generate PDF
        console.log('🖨️  Generating PDF...');
        await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true,
            margin: { 
                top: '2cm', 
                right: '1.5cm', 
                bottom: '2cm', 
                left: '1.5cm' 
            },
            displayHeaderFooter: true,
            headerTemplate: '<div></div>',
            footerTemplate: `
                <div style="font-size: 8pt; width: 100%; text-align: center; 
                            padding: 0 1cm; color: #666; font-family: sans-serif;">
                    <span class="pageNumber"></span> / <span class="totalPages"></span>
                </div>
            `
        });
        
        const stats = fs.statSync(outputPath);
        console.log('✅ PDF created successfully!');
        console.log(`   📁 ${outputPath}`);
        console.log(`   📊 ${(stats.size / 1024).toFixed(1)} KB`);
        
    } finally {
        await browser.close();
        if (typeof tmpHtmlPath !== 'undefined' && fs.existsSync(tmpHtmlPath)) {
            fs.unlinkSync(tmpHtmlPath);
        }
    }
}

// Main
(async () => {
    const inputPath = process.argv[2];
    const outputPath = process.argv[3] || inputPath.replace(/\.md$/i, '.pdf');
    
    if (!inputPath) {
        console.error('Usage: node md2pdf.js <input.md> [output.pdf]');
        console.error('');
        console.error('Features:');
        console.error('  - Markdown with GitHub-flavored extensions');
        console.error('  - KaTeX math (server-side rendered)');
        console.error('  - Mermaid diagrams (browser rendered)');
        console.error('  - Syntax highlighting, tables, task lists');
        process.exit(1);
    }
    
    try {
        await markdownToPdf(inputPath, outputPath);
    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.message.includes('chromium')) {
            console.error('');
            console.error('💡 Try running: npx playwright install-deps');
        }
        process.exit(1);
    }
})();
