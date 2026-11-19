# modern-dom-rules.md

## Primary Directive

Write clean, modern, and accessible browser DOM code using standard Baseline Widely Available Web APIs without legacy patterns or unsafe HTML injection.

## Negative Constraints

- **DO NOT** pass untrusted or dynamic strings to `innerHTML`, `outerHTML`, or `insertAdjacentHTML()`; use `textContent` or safe DOM node methods instead.
- **DO NOT** use inline event attributes (`onclick="..."`) or legacy `on*` property assignments (`el.onclick = ...`); use `addEventListener()`.
- **DO NOT** call a handler with parentheses (`handleClick()`) inside `addEventListener()`.
- **DO NOT** use `parentNode.removeChild()` or `insertBefore()` when `remove()`, `replaceWith()`, `append()`, or `prepend()` is cleaner.

## High-Leverage Rules

- **Element Selection:** Prefer `document.querySelector()` and `document.querySelectorAll()` with CSS selectors for consistent, readable queries.
- **Content & Attributes:** Use `textContent` for plain text, `classList` (`add`, `remove`, `toggle`, `contains`) for class state, and `dataset` for `data-*` attributes.
- **HTML Insertion:** Prefer `textContent` for text and DOM node creation (`createElement` + `append`) for structure; if HTML markup must be inserted, sanitize with a maintained library (such as DOMPurify) and prefer `setHTML()` where supported rather than inserting raw untrusted markup.
- **Node Lifecycle:** Create elements with `document.createElement()`, update trees with `append()`, `prepend()`, `replaceChildren()`, and `remove()`, and read form inputs via `.value`.
- **Event Handling:** Extract multi-line or reusable handlers into named functions outside `addEventListener()`, use arrow callbacks for brief local actions, and use event delegation or `AbortController` (`signal`) where appropriate.
- **Native UI:** Prefer `<dialog>` for modals; treat newer APIs such as the Popover API as opt-in only when explicitly requested or verified for target browsers.

## Guardrails

- **Compatibility:** Do not introduce Newly available or non-Widely Available APIs unless explicitly opted in with browser support or fallbacks addressed.
- **Safety:** Guard `querySelector()` results against `null` before reading properties or attaching listeners, and check `NodeList.length` or iterate safely for `querySelectorAll()`.
