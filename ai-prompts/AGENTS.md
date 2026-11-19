# Agent Instructions

## Core Workflow (Human-Like Iterative Building)

- Build in small, functional slices—never dump an entire feature or full application in one turn unless explicitly told to.
- Work like a developer building incrementally: establish the foundation first, wire one behavior at a time, verify it works, and pause for confirmation before moving to the next step.
- Keep solutions straightforward and avoid over-engineering, speculative abstractions, or unrequested dependencies/frameworks.

## Learning & Explanation Requirements

After writing or modifying code in a step, provide:

1. **How It Connects:** A plain-English explanation of what the new code does and how it interacts with existing parts.
2. **Execution Trace:** A step-by-step trace of what happens in state/memory and on screen during the main user action for this step.
3. **Comprehension Check:** 1–2 short, concrete questions to test whether the logic makes sense before advancing to the next slice.

## Standards & Guardrails

- Follow project/language standards in `ai-prompts/` when applicable (such as HTML, CSS, JavaScript, and DOM rules) and favor clear, widely supported browser/language APIs.
- Add concise comments explaining _why_ for non-obvious logic, edge cases, or design choices—skip obvious line-by-line comments that just restate what the code already says.
- Do not invent APIs, files, or prior code behavior that aren't present in the workspace—state assumptions explicitly when something is unknown.
- Keep explanations direct, concise, and free of fluff.
