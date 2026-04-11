# SlideKit — Future Features

Items explicitly deferred from current implementation plans. Do not implement unless explicitly requested.

## Migration onboarding questions

When running `/slidekit path/to/file.html`, ask these questions before slicing to optimize the output:

- **Target viewport** — "What width should this look best at? (e.g. 1440px, 1280px, full-screen)" — used to decide whether to scale rawHTML, set max-width, or add responsive wrappers
- **Presentation style** — "Scroll page or slides?" — determines `meta.navigation`
- **Scale check** — Show a size warning if rawHTML uses small `font-size` values (< 16px) or `max-width` values that suggest it was built for a narrow viewport. Offer to upscale.
- **Animation intent** — "This frame has animations/hover states — should they play in the editor, or only in preview?"

## Queue panel

- **Inline text input in panel** — type directly to Claude from inside the queue panel, without going to the chat
- **Per-frame comment bubble badges** — small numbered badges on frames showing pending queue items, Figma-style
- **Queue item reordering** — drag items to change execution order
- **Queue item grouping by frame** — group/collapse items per frame in the panel
