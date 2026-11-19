/**
 * @file app.js
 * In-memory task tracker application logic.
 *
 * Architecture Concept: Single Source of Truth
 * --------------------------------------------
 * In modern web development, the DOM (the HTML elements on screen) should
 * NOT be your primary data store.
 * Instead:
 * 1. JavaScript maintains the data in memory (an array of objects).
 * 2. When data changes, a render function synchronizes the DOM with that memory.
 */

// =============================================================================
// 1. IN-MEMORY STATE (Single Source of Truth)
// =============================================================================

/**
 * @typedef {Object} TodoItem
 * @property {string} id - Unique identifier for the task (used for targeting actions).
 * @property {string} text - The description of the task entered by the user.
 * @property {boolean} completed - Whether the task is finished.
 */

/**
 * Our pure in-memory collection of tasks.
 * Notice: We initialize this with two items matching our earlier preview,
 * but now they live entirely in JavaScript memory!
 * @type {TodoItem[]}
 */
const todos = [
  {
    id: "todo-1",
    text: "Review project requirements and guidelines",
    completed: false,
  },
  {
    id: "todo-2",
    text: "Set up HTML structure and CSS foundation",
    completed: true,
  },
];

// =============================================================================
// 2. DOM ELEMENT REFERENCES
// =============================================================================

/**
 * Cache references to key DOM elements once at startup.
 *
 * Why querySelector?
 * 'document.querySelector()' accepts standard CSS selectors (like '#todo-list'
 * or '.todo-form') and returns the first matching element.
 */
const todoListElement = document.querySelector("#todo-list");
const emptyStateElement = document.querySelector("#empty-state");

// =============================================================================
// 3. RENDER FUNCTION (View Layer)
// =============================================================================

/**
 * Creates an individual <li> DOM node for a single todo object.
 *
 * Safe DOM Creation vs innerHTML:
 * Why NOT use 'element.innerHTML = `<li>${todo.text}</li>`'?
 * If a user creates a task containing malicious HTML/script tags, innerHTML
 * parses and runs it (Cross-Site Scripting or XSS).
 * By using 'document.createElement()' and 'element.textContent', the browser
 * treats all input strictly as plain text, making it 100% safe by default.
 *
 * @param {TodoItem} todo - The task data object to represent.
 * @returns {HTMLLIElement} The fully assembled list item element.
 */
function createTodoElement(todo) {
  // 1. Root <li> container
  const listItem = document.createElement("li");
  listItem.className = "todo-item";
  if (todo.completed) {
    listItem.classList.add("todo-item--completed");
  }
  // Store the item's unique id in a standard 'data-*' attribute (dataset.id)
  listItem.dataset.id = todo.id;

  // 2. Label container (clicking either checkbox or text toggles the checkbox)
  const label = document.createElement("label");
  label.className = "todo-item__content";

  // 3. Checkbox input
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-item__checkbox";
  checkbox.checked = todo.completed;

  // 4. Text container
  const textSpan = document.createElement("span");
  textSpan.className = "todo-item__text";
  // 'textContent' guarantees safety against HTML injection
  textSpan.textContent = todo.text;

  // Assemble the label
  label.append(checkbox, textSpan);

  // 5. Delete button
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn--danger btn--small";
  deleteButton.textContent = "Delete";
  // Accessible name for assistive screen readers
  deleteButton.setAttribute("aria-label", `Delete "${todo.text}"`);

  // Assemble the full <li> item
  listItem.append(label, deleteButton);

  return listItem;
}

/**
 * Synchronizes the DOM with the current in-memory 'todos' array.
 *
 * How replaceChildren() works:
 * Instead of manually looping to remove old children or wiping with innerHTML = "",
 * 'replaceChildren(...newNodes)' empties the parent container and replaces all
 * contents in one clean, atomic browser operation.
 */
function renderTodos() {
  if (!todoListElement || !emptyStateElement) {
    return;
  }

  // 1. Check if we have any tasks in memory
  const hasTodos = todos.length > 0;

  // 2. Update empty state visibility using the native 'hidden' attribute
  emptyStateElement.hidden = hasTodos;

  // 3. If there are no tasks, empty the list element and exit early
  if (!hasTodos) {
    todoListElement.replaceChildren();
    return;
  }

  // 4. Map each data object in our in-memory array to a real DOM element
  const todoElements = todos.map((todo) => createTodoElement(todo));

  // 5. Atomically mount all elements into the <ul>
  todoListElement.replaceChildren(...todoElements);
}

// =============================================================================
// 4. INITIALIZATION
// =============================================================================

// Perform initial render on script load to display the in-memory tasks
renderTodos();
