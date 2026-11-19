# modern-html-rules.md

## Primary Directive

Enforce modern semantic HTML, strict compliance with the HTML Living Standard, and accessible, native-first architecture across all generated markup templates.

## Negative Constraints

- **DO NOT** use obsolete presentation tags (`<font>`, `<center>`, `<big>`), structural layout tables, or inline `style="..."` attributes.
- **DO NOT** inject inline JavaScript event handlers (`onclick="..."`, `onload="..."`) or rely on JS for native HTML behaviors.
- **DO NOT** use generic `<div>` or `<span>` elements when semantic landmarks (`<main>`, `<nav>`, `<article>`, `<section>`) are valid.
- **DO NOT** include self-closing slashes in void elements (use `<img src="...">`, never `<img />`).
- **DO NOT** use arbitrary non-standard custom attributes; use native `data-*` attributes exclusively when attaching custom metadata to elements.

## High-Leverage Rules

- **Semantic Structure:** Use `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, and `<section>` (strictly paired with a heading element) in a sequential outline.
- **Native Interactivity:** Prioritize `<dialog>` for modals, `<details>`/`<summary>` for disclosures, and `<picture>` with `srcset` for responsive imagery.
- **Form Controls:** Implement native validation attributes (`required`, `pattern`, `type="..."`), explicitly associate `<label for="...">` with matching `<input id="...">`, group related fields using `<fieldset>` and `<legend>`, and utilize semantic controls like `<textarea>` and `<select>` where appropriate.
- **Asset & Resource Optimization:** Place critical stylesheets in `<head>`, use `defer`/`async` on external scripts (`src="..."`), enforce `loading="lazy"` on below-the-fold media, and specify explicit `width` and `height` dimensions to prevent layout shifts.
- **Accessibility Integration:** Rely on native elements to implicitly provide ARIA roles and ensure all interactive elements remain reachable via natural keyboard navigation; apply explicit `aria-*` or `tabindex` attributes only to enhance custom interactive components.

## Guardrails

- **Validity:** Output only valid W3C/HTML Living Standard markup with correct nesting wrapped in full boilerplate (`<!DOCTYPE html>`, `<html lang="en">`, `<head>`, `<body>`) for complete pages, or a clean semantic root container for component snippets.
- **Viewport & Mobile Safety:** Always include the responsive viewport meta tag (`<meta name="viewport" content="width=device-width, initial-scale=1.0">`) within the `<head>` to ensure proper mobile scaling.
- **Formatting:** Enforce strict 2-space indentation, lowercase tag/attribute names, double quotes for attribute values, and no compressed or minified single-line outputs.
