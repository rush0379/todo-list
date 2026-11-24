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
 * We use 'let' instead of 'const' so we can reassign the array when filtering/deleting.
 * @type {TodoItem[]}
 */
let todos = [
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
 * or '#todo-form') and returns the first matching element.
 */
const todoFormElement = document.querySelector("#todo-form");
const todoInputElement = document.querySelector("#todo-input");
const todoListElement = document.querySelector("#todo-list");
const emptyStateElement = document.querySelector("#empty-state");
const todoSummaryElement = document.querySelector("#todo-summary");
const countTotalElement = document.querySelector("#count-total");
const countActiveElement = document.querySelector("#count-active");
const countCompletedElement = document.querySelector("#count-completed");

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
  deleteButton.dataset.action = "delete";
  deleteButton.textContent = "Delete";
  // Accessible name for assistive screen readers
  deleteButton.setAttribute("aria-label", `Delete "${todo.text}"`);

  // Assemble the full <li> item
  listItem.append(label, deleteButton);

  return listItem;
}

/**
 * Updates the summary counter elements with live statistics calculated from memory.
 *
 * Single Source of Truth Concept:
 * Notice we do NOT manually increment or decrement a counter variable (+1 / -1)
 * across multiple event handlers.
 * Instead, whenever anything changes, we calculate the exact totals directly
 * from the 'todos' array! This guarantees the counts can never get out of sync.
 */
function updateSummaryCounters() {
  if (!countTotalElement || !countActiveElement || !countCompletedElement || !todoSummaryElement) {
    return;
  }

  const total = todos.length;
  // Count how many tasks have completed: true
  const completed = todos.filter((todo) => todo.completed).length;
  // Active is simply total minus completed
  const active = total - completed;

  // Update text values safely
  countTotalElement.textContent = String(total);
  countActiveElement.textContent = String(active);
  countCompletedElement.textContent = String(completed);

  // Hide the summary row if there are no tasks at all to keep UI clean
  todoSummaryElement.hidden = total === 0;
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

  // 1. Update the computed metrics (total, active, completed)
  updateSummaryCounters();

  // 2. Check if we have any tasks in memory
  const hasTodos = todos.length > 0;

  // 3. Update empty state visibility using the native 'hidden' attribute
  emptyStateElement.hidden = hasTodos;

  // 4. If there are no tasks, empty the list element and exit early
  if (!hasTodos) {
    todoListElement.replaceChildren();
    return;
  }

  // 5. Map each data object in our in-memory array to a real DOM element
  const todoElements = todos.map((todo) => createTodoElement(todo));

  // 6. Atomically mount all elements into the <ul>
  todoListElement.replaceChildren(...todoElements);
}

// =============================================================================
// 4. EVENT HANDLERS & ACTIONS
// =============================================================================

/**
 * Handles the 'submit' event from the task creation form.
 *
 * Why listen to 'submit' on the <form> instead of 'click' on the <button>?
 * 1. Accessibility: Pressing the 'Enter' key inside the input automatically
 *    triggers the form's 'submit' event.
 * 2. Form Validation: The browser's native 'required' attribute validates first.
 *    If the input is empty, the browser warns the user and never fires 'submit'.
 *
 * @param {SubmitEvent} event - The native browser form submission event.
 */
function handleAddTodo(event) {
  // CRUCIAL: Stop default browser navigation!
  // By default, forms submit data to the current URL and reload the entire page.
  // 'preventDefault()' tells the browser: "I will handle this in JavaScript memory, do NOT refresh."
  event.preventDefault();

  if (!todoInputElement) {
    return;
  }

  // 1. Extract and sanitize input text
  // '.trim()' strips leading and trailing invisible spaces (e.g., "   hello   " -> "hello")
  const taskText = todoInputElement.value.trim();

  // Guard against blank submissions (e.g. if user just pressed spaces)
  if (!taskText) {
    return;
  }

  // 2. Create the new task object for memory
  // 'crypto.randomUUID()' is a modern, built-in browser API that generates
  // a guaranteed unique identifier string (e.g. "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d").
  const newTodo = {
    id: `todo-${crypto.randomUUID()}`,
    text: taskText,
    completed: false,
  };

  // 3. Update our in-memory data (The Recipe)
  // Non-mutating update (Modern JS Rule):
  // Instead of in-place mutation (todos.push), create a new array with the spread operator.
  todos = [...todos, newTodo];

  // 4. Tell the Chef to re-render the screen (The Meal)
  renderTodos();

  // 5. Reset the input field so it's clean and ready for the next task
  todoInputElement.value = "";
  // Keep the keyboard cursor active in the input box for rapid typing
  todoInputElement.focus();
}

/**
 * Handles clicks and interactions within the task list container.
 *
 * Pattern: Event Delegation
 * -------------------------
 * What is Event Delegation?
 * Instead of attaching individual event listeners to every single delete button
 * and checkbox (which requires adding and removing listeners every time tasks
 * are created or destroyed), we attach a SINGLE listener to the parent <ul> container!
 *
 * When any button or checkbox inside the <ul> is interacted with, the event
 * naturally "bubbles" up the DOM tree to the <ul>.
 *
 * We inspect 'event.target' to see what was clicked:
 * 1. Was it a Delete button? -> Remove task from memory and re-render.
 * 2. Was it a Checkbox? -> Toggle 'completed' state in memory and re-render.
 *
 * @param {Event} event - The browser DOM event.
 */
function handleListChange(event) {
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
  }

  // Find the parent <li> container to identify which task was interacted with
  const listItem = targetElement.closest(".todo-item");
  if (!(listItem instanceof HTMLElement)) {
    return;
  }

  const todoId = listItem.dataset.id;
  if (!todoId) {
    return;
  }

  // --- ACTION 1: TOGGLE TASK COMPLETION (Checkbox) ---
  // If the user checked or unchecked a checkbox:
  if (targetElement instanceof HTMLInputElement && targetElement.type === "checkbox") {
    // Non-mutating update (Modern JS Rule):
    // Use .map() to return a brand new array where only the targeted task's
    // 'completed' property is inverted (true becomes false, false becomes true).
    todos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, completed: targetElement.checked };
      }
      return todo;
    });

    // Tell the Chef to re-render the screen so styles (e.g. strikethrough) update
    renderTodos();
    return;
  }

  // --- ACTION 2: DELETE TASK (Button) ---
  const deleteButton = targetElement.closest('[data-action="delete"]');
  if (deleteButton) {
    // Filter out the task with this ID from memory
    todos = todos.filter((todo) => todo.id !== todoId);

    // Tell the Chef to re-render the screen
    renderTodos();
  }
}

// =============================================================================
// 5. INITIALIZATION & EVENT LISTENERS
// =============================================================================

// Attach the submit event listener to the form element
todoFormElement?.addEventListener("submit", handleAddTodo);

// Attach delegated listeners to the <ul> list:
// - 'click' catches the Delete button clicks
// - 'change' catches the checkbox state toggles reliably across mouse and keyboard
todoListElement?.addEventListener("click", handleListChange);
todoListElement?.addEventListener("change", handleListChange);

// Perform initial render on script load to display initial in-memory tasks
renderTodos();
