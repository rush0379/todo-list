# modern-javascript-rules.md

## Primary Directive

Write modern, native-standard JavaScript (ES2025+) prioritizing immutability, explicit error handling, code hygiene via JSDoc, and tree-shakeable ES modules without legacy patterns or unsafe shortcuts.

## Negative Constraints

- **DO NOT** use `var`, loose equality (`==`), `eval()`, `new Function()`, or string-based timers.
- **DO NOT** build strings with `+` concatenation; use template literals (`` `${}` ``) for interpolation, and `Array.prototype.join()` for joining collections.
- **DO NOT** mutate state directly; use non-mutating array and object methods.
- **DO NOT** use `JSON.parse(JSON.stringify())` for deep cloning—use `structuredClone()`.
- **DO NOT** implement custom deep-merge helpers without blocking `__proto__`, `constructor`, and `prototype` keys.
- **DO NOT** mix CommonJS (`require`) with ES Modules in the same project.
- **DO NOT** use `any` in JSDoc types; define explicit shapes or use `unknown`.
- **DO NOT** write deep, nested `if/else` chains where early returns can flatten control flow.
- **DO NOT** overuse default exports (`export default`); prefer named exports for utility and multi-export modules, reserving default exports strictly for single-value framework entry points or module bindings.
- **DO NOT** throw generic `Error` objects where specific built-in error subclasses (`TypeError`, `RangeError`, `ReferenceError`) or structured chaining (`cause`) apply.
- **DO NOT** define object blueprints via manual `prototype` manipulation (`Foo.prototype.x = ...`, `Object.create` chains); use `class` and `extends` instead.

## High-Leverage Rules

- **Variables & Scoping:** Default to `const`; use `let` strictly for reassignment; never use `var`.
- **Null Safety & Flow:** Use optional chaining (`?.`) and nullish coalescing (`??`) for defensive property access and fallbacks; avoid `||` for default values where `0`, `""`, or `false` are valid. Use early returns to reduce cyclomatic complexity.
- **Functions & `this`:** Use arrow functions for callbacks (including `addEventListener` handlers) and anywhere `.bind(this)` would otherwise be needed (they inherit lexical `this`). Use `function` declarations for top-level and exported functions (hoisting, clearer stack traces). Use traditional methods for object and class methods, and never use arrows as constructors — arrows lack dynamic `this` and `arguments`, cannot be constructed with `new`, and class-field arrows allocate a new function per instance.
- **Immutability & Structures:** Use non-mutating array methods (`toSorted`, `toReversed`, `toSpliced`, `with`) instead of in-place mutation. Prefer `Map` and `Set` for unique collections or non-string keys.
- **Async Execution:** Use `async/await` with `Promise.all` for interdependent fail-fast batches, `Promise.allSettled` when every outcome must be observed, and `Promise.any()` for first-success logic. Handle every promise rejection explicitly with no floating promises or empty catch blocks.
- **Modern APIs:** Leverage native ES2022–ES2025+ features (`Array.prototype.at()`, `Array.prototype.findLast()`, `Object.hasOwn()`, `Error.cause`, `Object.groupBy`, `Map.groupBy`, `Promise.withResolvers()`, and `Set` methods like `union` and `intersection`).
- **Encapsulation & Typing:** Use private class fields (`#field`) and static blocks. Ensure all exported functions include clear JSDoc blocks with `@param` and `@returns` tags.

## Guardrails

- **Syntax:** Output valid ES2025+ syntax using ESM (`import`/`export`) with `node:` prefixes for Node.js runtime built-in imports only (use standard relative or bare specifiers for browser modules).
- **Environment:** No TypeScript annotations, no JSX, and no polyfill boilerplate in vanilla JS files.
