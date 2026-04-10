# SlideKit for Claude

A Claude Code skill that turns content written in Claude chat into a fully-animated HTML presentation — with a live browser editor, hot-reload, inspector panel, and single-file export.

## How It Works

Write your content normally in Claude. When you're ready, run `/present` to activate the skill.

Claude reads the conversation, generates a complete `presentation.json`, starts a local dev server, and opens the browser editor. From there, click any element to select it, describe changes in chat, and the browser updates instantly.

```
/present
```

## Features

### Generation
- One-shot generation of all frames, layouts, styles, and animations from conversation context
- Chooses the right layout per frame: `hero`, `two-col`, `cards`, `text`, `image-full`, or `raw`
- Generates GSAP animations automatically — fade, fly-up, fly-down, fly-left, fly-right, scale-in, blur-in, wipe
- `raw` escape hatch for complex frames: inject arbitrary HTML+CSS+GSAP directly

### Editor
- **Scroll/Frame toggle** — edit all frames scrolled vertically, or focus one frame at a time
- **Frame panel** — thumbnail or list view, click to navigate, reorder by dragging
- **Per-frame toolbar** — Regenerate, Change Layout, Duplicate, Hide, Delete (appears on hover)
- **Inspector panel** — element properties, animation in/out controls, layers list
- **Hot-reload** — browser updates within 50ms of any JSON change
- **Element selection** — click any element; Claude reads the selection on the next chat turn

### Output
- **Slides mode** — fixed 1280×720 canvas, scaled to fit screen (like Keynote)
- **Scroll mode** — responsive continuous web page
- **Preview** — fullscreen presentation view in a new tab with back-to-editor button
- **Export** — single self-contained `.html` file, no dependencies, shareable as an attachment

## Architecture

Claude edits only `presentation.json`. The renderer converts JSON → HTML/CSS/GSAP animations. Claude never touches rendered HTML directly.

```
my-presentation/
  presentation.json        ← source of truth, edited by Claude
  .present/
    renderer.js            ← JSON → HTML converter + GSAP runtime
    server.js              ← local dev server with SSE hot-reload
    editor.html            ← browser editor (single file)
```

### JSON Schema

```json
{
  "meta": {
    "title": "My Presentation",
    "navigation": "slides",
    "theme": "dark",
    "aspectRatio": "16/9"
  },
  "frames": [
    {
      "id": "frame-1",
      "layout": "hero",
      "hidden": false,
      "locked": { "content": false, "layout": false },
      "background": {
        "type": "gradient",
        "value": "linear-gradient(135deg, #1a1a2e, #16213e)"
      },
      "elements": [
        {
          "id": "el-1",
          "type": "heading",
          "content": "The Big Idea",
          "style": {
            "fontSize": "72px",
            "color": "#ffffff",
            "fontWeight": 700
          },
          "animation": {
            "in":  { "effect": "fly-up", "duration": 0.6, "delay": 0.1 },
            "out": { "effect": "fade",   "duration": 0.3, "delay": 0 }
          }
        }
      ]
    }
  ]
}
```

## Installation

This skill uses the [superpowers](https://github.com/superpowers-sh/superpowers) plugin system for Claude Code.

1. Install superpowers if you haven't already
2. Clone this repo into your skills directory:
   ```bash
   git clone https://github.com/aviranrevach/slidekit ~/.claude/skills/present
   ```
3. The skill is now available as `/present` in any Claude Code session

## Usage

```
You: Let's create a presentation about [topic]. Here's the outline: ...

[work on content normally in Claude chat]

You: /present
```

Claude generates the presentation, opens the editor at `http://localhost:3456`, and you're in.

**Editing in chat:**
- Click any element in the browser → Claude knows what's selected
- Describe what you want: *"make the heading gradient purple"*, *"add a frame about pricing after frame 3"*, *"regenerate frame 5 with a cards layout"*

## Layouts

| Layout | Use for |
|---|---|
| `hero` | Large headline + subtitle |
| `two-col` | Side-by-side content, 50/50 split |
| `cards` | Feature comparisons, lists, team bios |
| `text` | Body-heavy frames, quotes, explanations |
| `image-full` | Full-bleed image with overlaid text |
| `raw` | Anything else — full creative control with inline HTML+CSS+GSAP |

## Animation Effects

`fade` · `fly-up` · `fly-down` · `fly-left` · `fly-right` · `scale-in` · `blur-in` · `wipe`

Set per-element in/out independently. Control duration and delay. For advanced choreography, describe it in chat — Claude writes GSAP directly into the frame.
