# SlideKit for Claude

> Turn your ideas into beautiful, animated presentations — by talking to Claude.

SlideKit is a skill for [Claude Code](https://claude.ai/code) that lets you create professional presentations the way humans actually think: by describing what you want, not wrestling with design tools.

You write. Claude designs. You refine in a live browser editor. Done.

---

## What Is This?

Most presentation tools make you think in slides from the start. You drag boxes, pick fonts, fiddle with spacing. It's slow, and the blank canvas is paralyzing.

SlideKit flips this. You start a conversation with Claude — your ideas, your outline, your content. When you're ready, you type `/present`, and Claude builds the whole presentation in one shot: every slide, every layout, every animation. A browser editor opens instantly with a live preview.

Then the real magic: you describe changes in plain English. "Make the heading bigger." "Add a timeline slide after slide 3." "Explore different layouts for this frame." Claude updates the presentation live, and the browser refreshes within milliseconds.

No Figma. No PowerPoint. No drag-and-drop. Just you and Claude.

---

## Who Is This For?

- **Founders and PMs** who need to ship decks fast without a designer
- **Researchers and analysts** turning complex ideas into visual narratives
- **Educators** building lecture materials with real visual impact
- **Anyone** who'd rather talk through an idea than fight with slide templates

You do not need to know how to code. You do not need design experience. If you can describe what you want, SlideKit can build it.

---

## How It Works

### Step 1 — Build your content in Claude chat

Start a conversation with Claude the way you normally would. Write your outline. Develop your ideas. Refine your arguments. Don't think about slides yet — just think about what you want to communicate.

```
You: I'm building a presentation for our board about our Q2 results.
     Here's the narrative: we hit revenue targets but customer retention
     dipped 8%. The story is: growth is real, but we need to fix churn
     before Series B. Key slides: overview, financials, retention analysis,
     what we're doing about it, ask.

Claude: [helps you develop the narrative, refine the message, sharpen the data]
```

### Step 2 — Generate the presentation

When you're ready, type:

```
/present
```

Claude reads the entire conversation, makes all the design decisions, and generates a complete presentation — all slides, layouts, backgrounds, typography, and animations — in one pass. A browser editor opens automatically at `http://localhost:3456`.

### Step 3 — Edit with your words

The browser shows a live preview of every slide. You can click any element to select it, and tell Claude what to change:

```
You: Make the headline on slide 1 bigger and bolder.
You: The retention chart slide feels too text-heavy — make it more visual.
You: Add a "What We're Doing" slide after the retention analysis.
You: Explore different design directions for the title slide.
```

The browser updates instantly — usually in under a second. You never touch code.

### Step 4 — Present or export

Click **Preview** for a fullscreen presentation view you can present directly from the browser. Click **Export** for a single `.html` file you can email, share as an attachment, or host anywhere. No dependencies. Opens in any browser.

---

## The Editor

When you open SlideKit, you'll see a dark-themed editor that looks like this:

```
┌─────────────────────────────────────────────────────────────────┐
│  [Title]   [≡ Scroll | ⊞ Frame]   [↓ Export]  [▶ Preview]      │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│  [Frame  │              Live canvas                             │
│  Strip]  │                                                      │
│          │    Each slide appears here. Hover to get            │
│  Thumb-  │    controls. Click elements to select them.         │
│  nails   │                                                      │
│  of      │                                                      │
│  every   │                                                      │
│  slide   │                                         [Queue pill]│
└──────────┴──────────────────────────────────────────────────────┘
```

### The Frame Strip (left panel)

Shows thumbnail previews of every slide. Each thumbnail shows the actual background and heading text. Click any thumbnail to jump to that slide. Toggle between thumbnail and list view using the icons at the top.

### The Canvas (center)

Shows your slides as you scroll through them. Two modes:

- **Scroll mode** — all slides stacked vertically, like a webpage. Good for editing and reviewing.
- **Frame mode** — one slide fills the full canvas. Good for focused editing and fine-tuning.

Switch between them with the segmented control in the top bar.

### The Per-Slide Toolbar

Hover over any slide to reveal a toolbar at the top with these actions:

| Button | What it does |
|---|---|
| ↺ Regenerate | Claude rewrites this slide keeping the same content intent |
| ⊞ Layout | Switch to a different layout type (hero, cards, two-column, etc.) |
| 👁 Hide | Exclude this slide from preview/export without deleting it |
| 🔒 Lock | Protect from AI edits |
| ⧉ Duplicate | Make a copy of this slide |
| 🗑 Delete | Remove this slide |

### The Queue (bottom-right)

As you work, you can accumulate a list of changes you want Claude to make. These pile up in the **Queue** — a floating panel in the bottom-right corner. When you're ready to apply them all at once, type `slideit` in the chat. Claude executes every queued item and marks them done. You can review what changed before clearing.

---

## Selecting Elements

Click any element inside a slide to select it. A floating toolbar appears above the element with:

- **Chat about this** — starts a conversation with Claude specifically about that element
- **Content** — text-focused modifications (rewrite, simplify, punch up, hide, remove)
- **Design** — visual modifications (restyle, more contrast, more visual, explore variants)
- **Behaviour** — animation modifications (entrance, hover, idle loop, emphasis)
- **Custom** — type any freeform instruction, added to the queue

Once an element is selected, you can navigate the DOM tree with keyboard shortcuts:

| Key | Navigation |
|---|---|
| `↑` | Select parent container |
| `↓` | Select first child element |
| `←` | Select previous sibling |
| `→` | Select next sibling |
| `Tab` | Next sibling |
| `Shift+Tab` | Previous sibling |
| `Esc` | Deselect |

The **layer scrubber** (a small violet pill on the right edge of the selection) shows dots above and below representing parent and child levels. Drag it up/down or click the dots to jump between levels.

---

## Animations

SlideKit generates animations automatically when creating slides. You can also add or change them by selecting an element and using the **Behaviour** menu.

### Entrance animations
Play when the slide first appears.

| Effect | Description |
|---|---|
| `fade` | Fades in |
| `fly-up` | Rises up from below |
| `fly-down` | Falls from above |
| `fly-left` | Slides in from the right |
| `fly-right` | Slides in from the left |
| `scale-in` | Scales up from slightly smaller |
| `blur-in` | Sharpens into focus |
| `wipe` | Reveals left to right |

### Idle animations
Loop continuously while the slide is visible.

- **Breathe** — gentle scale pulse
- **Float** — slow vertical bob
- **Pulse glow** — opacity throb
- **Spin** — continuous rotation (for icons/decorative elements)

### Hover animations
React when the viewer hovers over an element.

- **Lift** — rises and scales up slightly
- **Glow** — brightens
- **Scale** — grows

### Emphasis animations
One-shot attention-getters, typically delayed.

- **Bounce** — pops up and down
- **Shake** — shakes side to side
- **Flash** — blinks
- **Pop** — scales up and back

---

## Explore Layouts

When you want to see alternative design directions for a slide, hover the slide and click the ✦ wand icon. A popover appears — optionally type context ("make it more visual", "try a timeline format") then click **Generate options**.

Type `slideit` in Claude chat to trigger generation. Claude inserts 3–5 variant slides directly after the original. Each variant is a regular slide — you can keep as many as you want and delete the rest.

---

## The Queue System

The queue is a way to accumulate requests before executing them all at once.

**Adding to the queue:**
- Select an element → click any action in Content/Design/Behaviour menus → item appears in queue
- Add freeform notes by clicking **Custom** (pushpin icon) on any element

**The queue panel** shows two types of items:
- ✏ **Notes** — your freeform text instructions
- ✦ **AI actions** — structured requests like Explore or animation changes (these carry full context about the selected element, neighboring slides, and theme)

**To execute:** Type `slideit` in Claude chat. Claude processes every pending item in order and marks them ✓ Executed. You can then review what changed and click "Clear executed items" to clean up.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Tab` / `Shift+Tab` | Navigate between sibling elements when one is selected |
| `↑ ↓ ← →` | Navigate DOM tree levels and siblings |
| `Esc` | Deselect current element |

---

## Layouts Reference

When Claude generates slides, it picks the best layout for each piece of content. You can also change any slide's layout at any time using the toolbar.

| Layout | Best for |
|---|---|
| **Hero** | Title slides, big statements, chapter headers |
| **Two-column** | Side-by-side comparisons, before/after, context + detail |
| **Cards** | Feature lists, team bios, option comparisons, bullet breakdowns |
| **Text** | Quotes, detailed explanations, body-heavy content |
| **Image full** | Full-bleed photography with overlaid text |
| **Raw** | Complete creative freedom — Claude writes custom HTML, CSS, and animations |

The **raw** layout is how SlideKit achieves the most visually complex slides. Claude can create timelines, custom charts, unique visual structures — anything that can be expressed in HTML. These look like professionally designed web pages, not template slides.

---

## Export

Click **Export** to download a single `.html` file. This file:

- Contains everything — all slides, all styles, all animations, all assets
- Has zero dependencies — no internet connection needed to view it
- Opens in any modern browser (Chrome, Safari, Firefox, Edge)
- Is fully self-contained — you can email it, put it in Dropbox, host it on a server

The exported file includes the full presentation viewer with slide navigation, keyboard shortcuts, and a back-to-editor button.

---

## Installation

SlideKit requires [Claude Code](https://claude.ai/code) and the [Superpowers plugin system](https://github.com/superpowers-sh/superpowers).

### Install Superpowers

Follow the [Superpowers installation guide](https://github.com/superpowers-sh/superpowers) to set up the plugin system for Claude Code.

### Install SlideKit

```bash
git clone https://github.com/aviranrevach/slidekit ~/.claude/skills/slidekit
```

That's it. The `/present` skill is now available in every Claude Code session.

### Start a presentation

1. Open a Claude Code session
2. Work on your content in chat
3. Type `/present` when ready
4. The editor opens at `http://localhost:3456`

---

## Tips for Getting the Best Results

**Write first, design later.** The best presentations start with clear thinking, not pretty slides. Use Claude to develop your narrative before generating visuals.

**Be specific about what you want.** "Make slide 3 more compelling" is vague. "Make the heading on slide 3 larger, use orange for the key phrase, and add a timeline visual below it" gives Claude everything it needs.

**Use Explore for major design decisions.** When you're not sure what direction a slide should go, use the Explore Layouts feature to see 3–5 interpretations. You can keep multiple and decide later.

**Use the queue for batching.** If you have 5 changes across different slides, queue them all up and run `slideit` once. Claude processes them in sequence and you see all the changes together.

**Lock slides you love.** Once a slide is exactly right, lock it from the per-slide toolbar. Locked slides are skipped during bulk operations like "regenerate all" or future explore sessions.

**Select the right level.** When describing a change to Claude, select the most specific element possible. If you want to change a heading, select the heading itself — not the whole slide.

---

## How the Technical Side Works (for the curious)

SlideKit is built around a single principle: **Claude edits JSON, the renderer handles the visuals.**

Every presentation is stored as a `presentation.json` file — a structured description of every slide, every element, every style, and every animation. Claude reads and writes only this file. A JavaScript renderer converts the JSON into HTML and CSS in real time.

This separation means:
- Claude never has to parse raw HTML or reverse-engineer your design
- Every change is precise and predictable
- The editor can hot-reload in milliseconds (it just watches the JSON file for changes)
- The same JSON produces perfectly consistent output every time

The dev server runs locally on your machine. Your presentation data never leaves your computer during editing — only when you choose to export.

```
presentation.json  →  renderer.js  →  live HTML in browser
      ↑                                        |
   Claude edits                        you see changes
      ↑                                        |
  selection.json  ←  you click elements in browser
```

---

## Project Structure

```
your-presentation/
├── presentation.json      ← the presentation (Claude edits this)
└── .present/
    ├── server.js          ← local dev server + hot-reload
    ├── renderer.js        ← JSON → HTML converter
    └── editor.html        ← the browser editor (all-in-one)
```

---

## Contributing

SlideKit is open source. Issues, ideas, and pull requests are welcome at [github.com/aviranrevach/slidekit](https://github.com/aviranrevach/slidekit).

---

*Built for Claude Code · Powered by GSAP animations · Designed with Linear aesthetics*
