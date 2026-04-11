#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

const htmlFilePath = process.argv[2];
const projectDir   = process.argv[3];

if (!htmlFilePath || !projectDir) {
  console.error('Usage: node migrate.js <html-file> <project-dir>');
  process.exit(1);
}

const html = fs.readFileSync(htmlFilePath, 'utf8');

// ── Extract shared CSS ────────────────────────────────────────────────────────
function extractSharedCSS(html) {
  const lines = [];

  // @import declarations from any <style> block
  const importRe = /@import\s+url\([^)]+\)[^;]*;/g;
  let m;
  while ((m = importRe.exec(html)) !== null) {
    lines.push(m[0]);
  }

  // Root-level <style> blocks that appear before first <section> or major content div
  const bodyStart = html.indexOf('<body');
  const firstSection = html.search(/<section|<article/i);
  const cutoff = firstSection > -1 ? Math.min(firstSection, bodyStart + 500) : bodyStart + 2000;
  const headerHTML = html.slice(0, cutoff);

  const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let sr;
  while ((sr = styleRe.exec(headerHTML)) !== null) {
    const content = sr[1].trim();
    if (content && !content.startsWith('@import')) {
      lines.push(content);
    }
  }

  return [...new Set(lines)].join('\n\n');
}

// ── Extract shared JS ─────────────────────────────────────────────────────────
function extractSharedJS(html) {
  const bodyStart = html.indexOf('<body');
  const firstSection = html.search(/<section|<article/i);
  const cutoff = firstSection > -1 ? Math.min(firstSection, bodyStart + 500) : bodyStart + 2000;
  const headerHTML = html.slice(0, cutoff);

  const scripts = [];
  const scriptRe = /<script(?!\s+src)[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = scriptRe.exec(headerHTML)) !== null) {
    const content = m[1].trim();
    if (content) scripts.push(content);
  }

  return scripts.join('\n\n');
}

// ── Slice into sections ───────────────────────────────────────────────────────
function sliceSections(html) {
  // Strategy 1: <section> tags
  const sectionRe = /<section[^>]*>([\s\S]*?)<\/section>/gi;
  const sections = [];
  let m;
  while ((m = sectionRe.exec(html)) !== null) {
    sections.push(m[0]);
  }
  if (sections.length >= 2) return { strategy: 'section', sections };

  // Strategy 2: direct children of <body> or single root wrapper
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    const bodyContent = bodyMatch[1];
    const topDivs = [];
    let depth = 0, start = -1;
    for (let i = 0; i < bodyContent.length; i++) {
      if (bodyContent.slice(i).match(/^<div/i)) {
        if (depth === 0) start = i;
        depth++;
      } else if (bodyContent.slice(i).match(/^<\/div>/i)) {
        depth--;
        if (depth === 0 && start > -1) {
          topDivs.push(bodyContent.slice(start, i + 6));
          start = -1;
        }
      }
    }
    if (topDivs.length >= 2) return { strategy: 'body-children', sections: topDivs };
  }

  // Strategy 3: divs with id attributes as landmarks
  const idDivRe = /<div[^>]+id="([^"]+)"[^>]*>/g;
  const idDivs = [];
  while ((m = idDivRe.exec(html)) !== null) {
    idDivs.push({ id: m[1], pos: m.index });
  }
  if (idDivs.length >= 2) {
    const slices = idDivs.map((d, i) => {
      const end = idDivs[i + 1] ? idDivs[i + 1].pos : html.length;
      return html.slice(d.pos, end);
    });
    return { strategy: 'id-landmarks', sections: slices };
  }

  // Strategy 4: fallback — return whole body as one section
  return { strategy: 'fallback', sections: [html] };
}

// ── Main ──────────────────────────────────────────────────────────────────────
const sharedCSS = extractSharedCSS(html);
const sharedJS  = extractSharedJS(html);
const { strategy, sections } = sliceSections(html);

fs.mkdirSync(projectDir, { recursive: true });
// Scope :root variables to .frame-body-wrap to prevent leaking into editor CSS
const scopedCSS = sharedCSS ? sharedCSS.replace(/:root\s*\{/, '.frame-body-wrap {') : '';
if (scopedCSS) fs.writeFileSync(path.join(projectDir, 'shared.css'), scopedCSS, 'utf8');
if (sharedJS)  fs.writeFileSync(path.join(projectDir, 'shared.js'),  sharedJS,  'utf8');

const result = {
  strategy,
  sharedCss: !!sharedCSS,
  sharedJs: !!sharedJS,
  sections: sections.map((html, i) => {
    const h = html.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i);
    return {
      index: i + 1,
      titleHint: h ? h[1].replace(/<[^>]+>/g, '').trim().slice(0, 60) : `Section ${i + 1}`,
      htmlLength: html.length,
      rawHTML: html,
    };
  }),
};

const sectionsFile = path.join(projectDir, '_migration_sections.json');
fs.writeFileSync(sectionsFile, JSON.stringify(result, null, 2), 'utf8');

console.log(JSON.stringify({
  ok: true,
  strategy,
  sectionCount: sections.length,
  sharedCss: !!sharedCSS,
  sharedJs: !!sharedJS,
  sectionsFile,
}));
