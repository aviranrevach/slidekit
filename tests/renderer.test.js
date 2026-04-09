import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';

// Load renderer into a jsdom window
function loadRenderer() {
  const src = readFileSync(
    new URL('../templates/renderer.js', import.meta.url), 'utf8'
  );
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    runScripts: 'dangerously',
  });
  dom.window.eval(src);
  return dom.window.PresentRenderer;
}

test('renderElement - heading produces h1 with content', () => {
  const R = loadRenderer();
  const html = R.renderElement({
    id: 'el-1', type: 'heading', content: 'Hello World',
    style: { fontSize: '48px', color: '#fff' },
  });
  assert.ok(html.includes('<h1'), 'should produce h1');
  assert.ok(html.includes('Hello World'), 'should include content');
  assert.ok(html.includes('font-size: 48px'), 'should apply style');
  assert.ok(html.includes('data-element-id="el-1"'), 'should have data attr');
});

test('renderElement - raw layout injects rawHTML directly', () => {
  const R = loadRenderer();
  const frame = {
    id: 'frame-1', layout: 'raw',
    rawHTML: '<section class="custom"><h1>Raw!</h1></section>',
  };
  const el = R.renderFrame(frame, 0, {});
  assert.ok(el.innerHTML.includes('Raw!'), 'should inject rawHTML');
  assert.ok(el.querySelector('.custom'), 'should preserve custom class');
});

test('renderElement - style object converts camelCase to kebab-case', () => {
  const R = loadRenderer();
  const html = R.renderElement({
    id: 'el-2', type: 'body', content: 'text',
    style: { fontSize: '16px', fontWeight: '700', backdropFilter: 'blur(4px)' },
  });
  assert.ok(html.includes('font-size: 16px'));
  assert.ok(html.includes('font-weight: 700'));
  assert.ok(html.includes('backdrop-filter: blur(4px)'));
});

test('renderPresentation - returns container with one child per frame', () => {
  const R = loadRenderer();
  const json = {
    meta: { title: 'Test', navigation: 'slides', theme: 'dark' },
    frames: [
      { id: 'f1', layout: 'hero', elements: [{ id: 'e1', type: 'heading', content: 'A', style: {} }] },
      { id: 'f2', layout: 'text', elements: [{ id: 'e2', type: 'body', content: 'B', style: {} }] },
    ],
  };
  const container = R.renderPresentation(json);
  assert.equal(container.querySelectorAll('.present-frame').length, 2);
  assert.equal(container.querySelector('#f1').dataset.layout, 'hero');
});
