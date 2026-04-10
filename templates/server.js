#!/usr/bin/env node
'use strict';

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT        = parseInt(process.env.PORT || '3456', 10);
const PROJECT_DIR = process.argv[2] || process.cwd();
const TEMPLATES   = path.join(__dirname);

const PRESENTATION_JSON = path.join(PROJECT_DIR, 'presentation.json');
const SELECTION_JSON    = path.join(PROJECT_DIR, 'selection.json');
const EDITOR_HTML       = path.join(TEMPLATES, 'editor.html');

const sseClients = new Set();

// Watch presentation.json — push reload event to all SSE clients
fs.watch(PRESENTATION_JSON, () => {
  const msg = 'data: reload\n\n';
  sseClients.forEach((res) => {
    try { res.write(msg); } catch { sseClients.delete(res); }
  });
});

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function jsonResponse(res, data, status = 200) {
  cors(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(typeof data === 'string' ? data : JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    cors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // SSE hot-reload stream
  if (req.url === '/events') {
    cors(res);
    res.writeHead(200, {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
    });
    res.write('data: connected\n\n');
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // Serve presentation.json
  if (req.method === 'GET' && req.url === '/presentation.json') {
    try {
      jsonResponse(res, fs.readFileSync(PRESENTATION_JSON, 'utf8'));
    } catch {
      jsonResponse(res, { error: 'not found' }, 404);
    }
    return;
  }

  // Serve selection.json (read)
  if (req.method === 'GET' && req.url === '/selection.json') {
    try {
      jsonResponse(res, fs.readFileSync(SELECTION_JSON, 'utf8'));
    } catch {
      jsonResponse(res, {});
    }
    return;
  }

  // Write selection.json (POST from editor on element click)
  if (req.method === 'POST' && req.url === '/selection') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        JSON.parse(body); // validate
        fs.writeFileSync(SELECTION_JSON, body);
        cors(res);
        res.writeHead(200);
        res.end();
      } catch {
        cors(res);
        res.writeHead(400);
        res.end('invalid JSON');
      }
    });
    return;
  }

  // Serve editor.html for everything else
  try {
    const html = fs.readFileSync(EDITOR_HTML, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } catch {
    res.writeHead(500);
    res.end('editor.html not found');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Present editor running at http://localhost:${PORT}`);
});
