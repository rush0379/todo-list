# Agent Instructions

## Core Workflow (Human-Like Iterative Building)

- Build in small, functional slices—never dump an entire feature or full application in one turn unless explicitly told to.
- Work like a developer building incrementally: establish the foundation first, wire one behavior at a time, verify it works, and pause for confirmation before moving to the next step.
- Keep solutions straightforward and avoid over-engineering, speculative abstractions, or unrequested dependencies/frameworks.

## Learning & Explanation Requirements

After writing or modifying code in a step, provide:

1. **How It Connects:** A plain-English explanation of what the new code does and how it interacts with existing parts.
2. **Execution Trace:** A step-by-step trace of what happens in state/memory and on screen during the main user action for this step.
3. **Trade-offs & Edge Cases:** Key architectural decisions, trade-offs made, and potential failure points or boundaries.
4. **Comprehension Check:** 1–2 short, concrete questions to test whether the logic makes sense before advancing to the next slice.

## Technical Standards & Reference Framework

- **Primary Compass (Personal Compact Rules):** Follow the centralized modular technical standards in `C:\Users\joshm\02-areas\dev\ai-prompts\modular-tech-rules\` (`modern-html-rules.md`, `modern-css-rules.md`, `modern-dom-rules.md`, `modern-javascript-rules.md`). Keep implementations lean, standard-compliant, and focused on core fundamentals without information overload.
- **Authoritative Reference (Modern Web Guidance):** When a specific platform capability, modern API nuance, or accessibility pattern requires verification against authoritative industry standards, consult Google Chrome's `modern-web-guidance` (`C:\Users\joshm\02-areas\dev\modern-web-guidance\` or via `npx modern-web-guidance`). Use it as a targeted fact-checker for specific components, not as a bulk mandate to over-complicate code.
- **Rule Distillation:** When Google's Modern Web Guidance provides an indispensable modern pattern or pitfall fix, distill the essence into a single clear rule/constraint in the relevant personal rule file rather than adopting sprawling boilerplate.

## Standards & Guardrails

- Add educational comments explaining *why* for non-obvious logic, tricky syntax, or design choices so the developer can learn and verify as we build.
- Do not invent APIs, files, or prior code behavior that aren't present in the workspace—state assumptions explicitly when something is unknown.
- Keep explanations direct, concise, and free of fluff.
