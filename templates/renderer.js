(function (root) {
  'use strict';

  // ── Utilities ───────────────────────────────────────────────────────────────

  function camelToKebab(str) {
    return str
      .replace(/^(webkit|moz|ms|o)([A-Z])/, (_, prefix, first) =>
        '-' + prefix + '-' + first.toLowerCase()
      )
      .replace(/([A-Z])/g, (m) => '-' + m.toLowerCase());
  }

  function styleObjectToCSS(obj) {
    if (!obj) return '';
    return Object.entries(obj)
      .map(([k, v]) => `${camelToKebab(k)}: ${v}`)
      .join('; ');
  }

  // ── Element renderer ────────────────────────────────────────────────────────

  function renderElement(el) {
    const style = styleObjectToCSS(el.style);
    const anim = el.animation || {};
    const animIn  = anim.in  || {};
    const animOut = anim.out || {};
    const baseAttrs = [
      `id="${el.id}"`,
      `data-element-id="${el.id}"`,
      `data-element-type="${el.type}"`,
      animIn.effect  ? `data-anim-in="${animIn.effect}"` : '',
      animIn.duration  != null ? `data-anim-in-duration="${animIn.duration}"` : '',
      animIn.delay     != null ? `data-anim-in-delay="${animIn.delay}"` : '',
      animOut.effect ? `data-anim-out="${animOut.effect}"` : '',
      animOut.duration != null ? `data-anim-out-duration="${animOut.duration}"` : '',
      style ? `style="${style}"` : '',
    ].filter(Boolean).join(' ');

    const content = el.content || '';

    switch (el.type) {
      case 'heading':
        return `<h1 ${baseAttrs}>${content}</h1>`;
      case 'subheading':
        return `<h2 ${baseAttrs}>${content}</h2>`;
      case 'body':
        return `<p ${baseAttrs}>${content}</p>`;
      case 'image':
        return `<img ${baseAttrs} src="${el.src || ''}" alt="${el.alt || ''}" />`;
      case 'button':
        return `<a ${baseAttrs} href="${el.href || '#'}" class="present-button">${content}</a>`;
      case 'list': {
        const items = (el.items || []).map((i) => `<li>${i}</li>`).join('');
        return `<ul ${baseAttrs}>${items}</ul>`;
      }
      case 'divider':
        return `<hr ${baseAttrs} />`;
      default:
        return `<div ${baseAttrs}>${content}</div>`;
    }
  }

  // ── Layout renderers ─────────────────────────────────────────────────────────

  function renderHeroLayout(frame) {
    const div = document.createElement('div');
    div.className = 'layout-hero';
    div.innerHTML = (frame.elements || []).map(renderElement).join('');
    return div;
  }

  function renderTwoColLayout(frame) {
    const elements = frame.elements || [];
    const mid = Math.ceil(elements.length / 2);
    const div = document.createElement('div');
    div.className = 'layout-two-col';
    div.innerHTML = `
      <div class="col-left">${elements.slice(0, mid).map(renderElement).join('')}</div>
      <div class="col-right">${elements.slice(mid).map(renderElement).join('')}</div>
    `;
    return div;
  }

  function renderCardsLayout(frame) {
    const div = document.createElement('div');
    div.className = 'layout-cards';
    div.innerHTML = (frame.elements || []).map(renderElement).join('');
    return div;
  }

  function renderTextLayout(frame) {
    const div = document.createElement('div');
    div.className = 'layout-text';
    div.innerHTML = (frame.elements || []).map(renderElement).join('');
    return div;
  }

  function renderImageFullLayout(frame) {
    const div = document.createElement('div');
    div.className = 'layout-image-full';
    div.innerHTML = (frame.elements || []).map(renderElement).join('');
    return div;
  }

  function renderRawLayout(frame) {
    const div = document.createElement('div');
    div.className = 'layout-raw';
    div.innerHTML = frame.rawHTML || '';
    return div;
  }

  const LAYOUT_RENDERERS = {
    hero: renderHeroLayout,
    'two-col': renderTwoColLayout,
    cards: renderCardsLayout,
    text: renderTextLayout,
    'image-full': renderImageFullLayout,
    raw: renderRawLayout,
  };

  // ── Frame renderer ───────────────────────────────────────────────────────────

  function renderFrame(frame, index, meta) {
    const wrapper = document.createElement('div');
    wrapper.className = 'present-frame';
    wrapper.id = frame.id;
    wrapper.dataset.frameIndex = String(index);
    wrapper.dataset.layout = frame.layout;

    if (frame.background) {
      const bg = frame.background;
      if (bg.type === 'color' || bg.type === 'gradient') {
        wrapper.style.background = bg.value;
      } else if (bg.type === 'image') {
        wrapper.style.backgroundImage = `url(${bg.value})`;
        wrapper.style.backgroundSize = 'cover';
        wrapper.style.backgroundPosition = 'center';
      }
    }

    const renderer = LAYOUT_RENDERERS[frame.layout];
    if (!renderer) {
      console.warn(`[PresentRenderer] Unknown layout "${frame.layout}" on frame "${frame.id}", falling back to raw`);
    }
    wrapper.appendChild((renderer || renderRawLayout)(frame));
    return wrapper;
  }

  // ── Presentation renderer ────────────────────────────────────────────────────

  function renderPresentation(json) {
    const { meta = {}, frames = [] } = json;
    const container = document.createElement('div');
    container.className = `present-root theme-${meta.theme || 'dark'}`;
    container.dataset.navigation = meta.navigation || 'slides';
    frames.forEach((frame, i) => container.appendChild(renderFrame(frame, i, meta)));
    return container;
  }

  // ── Export ───────────────────────────────────────────────────────────────────

  const PresentRenderer = { renderPresentation, renderFrame, renderElement };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PresentRenderer;           // CJS require() context
  } else {
    root.PresentRenderer = PresentRenderer;     // Browser (and ESM via global)
  }
})(typeof window !== 'undefined' ? window : global);
