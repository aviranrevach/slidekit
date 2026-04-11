#!/usr/bin/env node
'use strict';

const crypto = require('crypto');

// Accept rawHTML as JSON via argv[2] or stdin
if (process.argv[2]) {
  run(JSON.parse(process.argv[2]));
} else {
  const chunks = [];
  process.stdin.on('data', c => chunks.push(c));
  process.stdin.on('end', () => run(JSON.parse(Buffer.concat(chunks).toString())));
}

function run(frameJson) {
  const rawHTML = frameJson.rawHTML || '';

  // ── Checksum ────────────────────────────────────────────────────────────────
  const checksum = crypto.createHash('md5').update(rawHTML).digest('hex');

  // ── Extract elements ────────────────────────────────────────────────────────
  function extractElements(html) {
    const elements = [];

    // Headings
    const headingRe = /<(h[1-6])[^>]*(?:class="([^"]*)")?[^>]*(?:id="([^"]*)")?[^>]*>([\s\S]*?)<\/h[1-6]>/gi;
    let m;
    while ((m = headingRe.exec(html)) !== null) {
      const tag = m[1].toLowerCase();
      const cls = m[2] ? '.' + m[2].trim().split(/\s+/)[0] : '';
      const id  = m[3] ? '#' + m[3] : '';
      const content = m[4].replace(/<[^>]+>/g, '').trim().slice(0, 80);
      if (!content) continue;
      elements.push({
        role: tag === 'h1' ? 'heading' : 'subheading',
        selector: id || cls || tag,
        content,
        editable: true,
      });
    }

    // Paragraphs (first 3 only)
    const pRe = /<p[^>]*(?:class="([^"]*)")?[^>]*>([^<]{10,})/gi;
    let pCount = 0;
    while ((m = pRe.exec(html)) !== null && pCount < 3) {
      const cls = m[1] ? '.' + m[1].trim().split(/\s+/)[0] : 'p';
      elements.push({
        role: 'body',
        selector: cls,
        content: m[2].trim().slice(0, 80),
        editable: true,
      });
      pCount++;
    }

    return elements;
  }

  // ── Detect fragile areas ────────────────────────────────────────────────────
  function detectFragile(html) {
    const fragile = [];
    if (/@keyframes/.test(html))
      fragile.push('Contains @keyframes animation — do not rename or remove keyframe names');
    if (/<svg/.test(html))
      fragile.push('Contains SVG — do not modify viewBox or coordinate values');
    if (/<canvas/.test(html))
      fragile.push('Contains <canvas> — do not change its id or dimensions');
    if (/transition\s*:/.test(html))
      fragile.push('Contains CSS transitions — preserve timing and property names');
    return fragile;
  }

  const elements = extractElements(rawHTML);
  const fragile  = detectFragile(rawHTML);

  const meta = {
    title: '',
    description: '',
    elements,
    interactions: [],
    fragile,
    editHints: '',
    checksum,
  };

  process.stdout.write(JSON.stringify(meta, null, 2) + '\n');
}
