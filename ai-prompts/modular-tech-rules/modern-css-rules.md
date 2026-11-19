# modern-css-rules.md

## Primary Directive

Enforce modern, performant, and accessible CSS using native Baseline Widely Available features, logical flow properties, and component-driven architecture without legacy workarounds or preprocessor dependencies.

## Negative Constraints

- **DO NOT** use legacy layout hacks (`float`, `clearfix`).
- **DO NOT** abuse `position: relative` offsets (`top`/`left`/`inset`) for layout spacing—the box is painted elsewhere while its flow slot stays put, creating phantom gaps. Change flow inputs (margins, `gap`, Grid/Flex alignment) instead.
- **DO NOT** use `position: absolute`/`fixed` outside overlays, tooltips, popovers, dialogs, and decorative positioning. `position: relative` is valid as a containing block for absolute descendants, for optical micro-alignment, and for `z-index` stacking control; `position: sticky` remains valid for scroll-pinned headers, sidebars, and table headers.
- **DO NOT** rely on viewport media queries for component layouts; implement `@container` **size** queries instead (and explicitly name containers via `container-name` to prevent collisions). Viewport MQs remain valid for global page layout and typography scale.
- **DO NOT** use `100vh` for full-height sections; use dynamic viewport units (`dvh`/`svh`) to prevent mobile clipping.
- **DO NOT** engage in specificity wars, deep selector nesting (>3 levels), or `!important`. Manage cascade order via `@layer`, control specificity with `:where()`, and avoid IDs as component styling hooks.
- **DO NOT** use fixed pixel values (`px`) for font sizes or major spatial layout; use fluid relative units (`rem`, `em`, `ch`, `clamp()`). Assume the standard browser root font-size (`1rem = 16px`) and do not alter `html { font-size }` to the `62.5%` hack. Reserve `px` for borders, hairlines, `box-shadow`/`outline` offsets, `clamp()`/`min()`/`max()` bounds, and sub-pixel precision.
- **DO NOT** use CSS `@import` chains to load stylesheets; always use preloaded `<link>` tags to prevent render-blocking performance hits.

## High-Leverage Rules

- **Cascade Architecture:** Explicitly declare baseline layer sequence (`@layer reset, base, components, utilities;`) to govern global cascade precedence cleanly. _Note: Unlayered normal declarations beat layered normal declarations, and `!important` inverts layer precedence. Keep author CSS inside layers; avoid `!important` entirely._
- **Layout & Sizing:** Default to CSS Grid (leveraging `minmax()` and `subgrid`) for 2D structures and Flexbox (`gap`) for 1D alignments; enforce physical-to-logical property mapping (`margin-inline`, `padding-block`).
- **Color & Variables:** Build design systems using custom properties (`:root`) powered by `:root { color-scheme: light dark; }`, perceptually uniform `oklch()` palettes, programmatic `color-mix()`, and native `light-dark()` color schemes (gated behind `@supports (color: light-dark(white, black))` with a `prefers-color-scheme` fallback where necessary).
- **Selectors & Nesting:** Leverage native CSS nesting (`&`), intentional relational `:has()` for conditional state styling (note: `:has()` inherits its argument's specificity), and grouping/specificity pseudo-classes (`:is()`, `:where()`) to eliminate preprocessor dependencies.
- **Markup Cleanliness:** Use CSS pseudo-elements (`::before`/`::after`) for purely decorative elements (icons, accent lines, background overlays) instead of injecting extra HTML wrapper tags.
- **Performance & Motion:** Reserve element dimensions using `aspect-ratio` to prevent Cumulative Layout Shift (CLS), restrict layout animations strictly to `transform` and `opacity`, use `will-change` sparingly and remove post-animation, and gate motion behind `prefers-reduced-motion: reduce`.
- **Accessibility Integration:** Enforce a minimum contrast ratio of 4.5:1, preserve native keyboard focus visibility (`:focus-visible`), style native interactive controls using `accent-color`, support `prefers-contrast`, and ensure scaling adapts gracefully to user font settings.

## Guardrails

- **Validity:** Output valid, pure CSS syntax wrapped in clean code blocks without manual or legacy vendor prefixes (use standard properties or omit).
- **Progressive Enhancement:** Provide `@supports` fallbacks only for features not yet Baseline Widely Available; maintain zero external preprocessor or polyfill dependencies.
- **Formatting:** Enforce strict 2-space indentation, lowercase property names, clean block separation, and double quotes for content/URLs.
