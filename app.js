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
  // Non-mutating update or array push. We push the new item to our memory array.
  todos.push(newTodo);

  // 4. Tell the Chef to re-render the screen (The Meal)
  renderTodos();

  // 5. Reset the input field so it's clean and ready for the next task
  todoInputElement.value = "";
  // Keep the keyboard cursor active in the input box for rapid typing
  todoInputElement.focus();
}

/**
 * Handles clicks within the task list container.
 *
 * Pattern: Event Delegation
 * -------------------------
 * What is Event Delegation?
 * Instead of attaching individual click listeners to every single delete button
 * (which requires adding and removing listeners every time tasks are created or destroyed),
 * we attach a SINGLE click listener to the parent <ul> container!
 *
 * When any button inside the <ul> is clicked, the event naturally "bubbles" up to the <ul>.
 * We check if the clicked target was a delete button. If so, we read the item ID
 * from the parent <li> and update our in-memory data.
 *
 * @param {MouseEvent} event - The click event.
 */
function handleListClick(event) {
  // Check if what was clicked has data-action="delete"
  // 'event.target' is the exact HTML element the user clicked on.
  // '.closest()' searches upward from the clicked element to find a matching selector.
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
  }

  const deleteButton = targetElement.closest('[data-action="delete"]');
  if (!deleteButton) {
    // If the click wasn't on or inside a delete button, ignore it
    return;
  }

  // Find the parent <li> to get its unique task ID
  const listItem = deleteButton.closest(".todo-item");
  if (!(listItem instanceof HTMLElement)) {
    return;
  }

  const todoId = listItem.dataset.id;
  if (!todoId) {
    return;
  }

  // Update State (The Recipe): Filter out the task with this ID
  // '.filter()' returns a brand new array keeping every item EXCEPT the one matching todoId
  todos = todos.filter((todo) => todo.id !== todoId);

  // Tell the Chef to re-render the screen (The Meal)
  renderTodos();
}

// =============================================================================
// 5. INITIALIZATION & EVENT LISTENERS
// =============================================================================

// Attach the submit event listener to the form element
todoFormElement?.addEventListener("submit", handleAddTodo);

// Attach the delegated click listener to the <ul> list
todoListElement?.addEventListener("click", handleListClick);

// Perform initial render on script load to display initial in-memory tasks
renderTodos();
