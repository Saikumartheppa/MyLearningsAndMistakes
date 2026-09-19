# Todo App — Machine Coding Documentation

A progressively enhanced Todo application built with React to practice frontend machine-coding concepts, state management, component architecture, browser APIs, asynchronous operations, and performance considerations.

---

# Table of Contents

1. [Overview](#1-overview)
2. [Features](#2-features)
3. [Todo Data Model](#3-todo-data-model)
4. [Component Architecture](#4-component-architecture)
5. [State Management](#5-state-management)
6. [Derived State](#6-derived-state)
7. [Adding Todos](#7-adding-todos)
8. [Completing Todos](#8-completing-todos)
9. [Editing Todos](#9-editing-todos)
10. [Filtering Todos](#10-filtering-todos)
11. [Search](#11-search)
12. [Search Debouncing](#12-search-debouncing)
13. [Multiple Selection](#13-multiple-selection)
14. [Bulk Delete](#14-bulk-delete)
15. [Mark All Completed / Incomplete](#15-mark-all-completed--incomplete)
16. [Undo Delete](#16-undo-delete)
17. [Drag and Drop](#17-drag-and-drop)
18. [LocalStorage Persistence](#18-localstorage-persistence)
19. [React State Immutability](#19-react-state-immutability)
20. [Functional State Updates](#20-functional-state-updates)
21. [Refs vs State](#21-refs-vs-state)
22. [State Ownership](#22-state-ownership)
23. [Data Flow](#23-data-flow)
24. [Important Edge Cases](#24-important-edge-cases)
25. [Performance Considerations](#25-performance-considerations)
26. [Accessibility Considerations](#26-accessibility-considerations)
27. [Current Limitations](#27-current-limitations)
28. [Potential Interview Follow-ups](#28-potential-interview-follow-ups)
29. [Interview Questions and Answers](#29-interview-questions-and-answers)
30. [Overall Architecture](#30-overall-architecture)

---

# 1. Overview

The Todo App started with basic CRUD functionality and was progressively enhanced with common frontend machine-coding requirements.

The application supports:

- Create Todo
- Delete Todo
- Complete / uncomplete Todo
- Edit Todo
- Cancel editing
- Filter Todos
- Search Todos
- Debounced search
- Select multiple Todos
- Bulk delete
- Mark all completed
- Mark all incomplete
- Undo delete
- Drag-and-drop reordering
- LocalStorage persistence

The project is designed to demonstrate:

- React state management (single source of truth in the container component)
- Component communication via props and callbacks
- Controlled components
- Derived state
- Functional state updates
- `useEffect` (persistence, debouncing, cleanup)
- `useRef` (undo info, undo timer, in-flight drag id)
- Lazy state initialization from `localStorage`
- Browser LocalStorage API
- Native HTML Drag and Drop API
- `crypto.randomUUID()` for id generation
- Immutable state updates
- Set-based selection management
- Debouncing
- Temporary UI state
- State vs ref decisions
- CSS Modules for styling

---

# 2. Features

## Basic Features

- Add a Todo
- Delete a Todo
- Mark Todo as completed
- Mark Todo as incomplete
- Edit Todo
- Cancel editing
- Save edited Todo

## Filtering

Supported filters:

- All
- Active
- Completed

## Search

- Search Todos by title
- Case-insensitive search
- Search input is debounced (300 ms)

## Bulk Operations

- Select multiple Todos
- Delete selected Todos
- Mark all Todos completed
- Mark all Todos incomplete

## Undo

- Undo single Todo deletion
- Undo bulk deletion
- Restore original positions
- Undo window of 5 seconds
- New deletion replaces the previous undo operation

## Drag and Drop

- Drag Todo items
- Drop onto another Todo
- Reorder Todos
- Persist new order automatically

## Persistence

Todos are stored in:

```text
localStorage (key: 'todos', constant TODOS_STORAGE_KEY)
```

---

# 3. Todo Data Model

Each Todo is a plain JavaScript object with a fixed shape:

```js
{
  id: "uuid-string via crypto.randomUUID()",
  title: "todo title (trimmed before storing)",
  isCompleted: false // boolean
}
```

| Field         | Type    | Description                                        |
| ------------- | ------- | -------------------------------------------------- |
| `id`          | string  | Unique id generated with `crypto.randomUUID()`     |
| `title`       | string  | User-visible text, always `trim()`ed on add/save   |
| `isCompleted` | boolean | Completion flag, toggled by the complete checkbox   |

The id is generated at creation time inside `handleAddTodoItem`:

```js
const todoItem = {
  id: crypto.randomUUID(),
  title: trimmedValue,
  isCompleted: false,
};
```

`id` is used as the React list `key`, for selection (via `Set`), for editing
(`editingTodoId`), for drag-and-drop (`draggedTodoIdRef`), and for lookups
inside the various handlers.

---

# 4. Component Architecture

## File Map

| File                 | Responsibility                                              |
| -------------------- | ----------------------------------------------------------- |
| `Todo.jsx`           | Container component; owns all application state and logic   |
| `TodoInput.jsx`      | Controlled input + Add button (Enter key also submits)      |
| `TodoSearch.jsx`     | Controlled search input                                     |
| `TodoFilters.jsx`    | Renders filter buttons from `TODO_FILTER_BUTTONS`            |
| `TodoList.jsx`       | Maps filtered todos, contains the inline `TodoItem`          |
| `index.js`           | Barrel export for the todo module                           |
| `style.module.scss`  | CSS Modules styles                                          |
| `../constants.js`    | `TODO_FILTER_BUTTONS` and `TODOS_STORAGE_KEY`                |

## Component Tree

```text
Todo (container — all app state lives here)
├── TodoInput
│     props: todoInputField, handleInputField, handleAddTodoItem
├── TodoSearch
│     props: searchText, setSearchText
├── TodoFilters
│     props: appliedFilter, setFilter
├── TodoList
│     props: todoList(=filteredTodos) + all item callbacks
│     └── TodoItem (defined inline in TodoList.jsx)
│           props: todoItem + item callbacks
└── Undo banner (inline, rendered when showUndo is true)
```

## Barrel Export (`index.js`)

```js
export { default } from "./Todo";
export { default as TodoInput } from "./TodoInput";
export { default as TodoList } from "./TodoList";
export { default as TodoFilters } from "./TodoFilters";
export { default as TodoSearch } from "./TodoSearch";
```

`Todo.jsx` imports the presentational pieces through the same barrel:

```js
import { TodoInput, TodoList, TodoFilters, TodoSearch } from "../todo";
```

## Constants

```js
export const TODO_FILTER_BUTTONS = ["All", "Active", "Completed"];
export const TODOS_STORAGE_KEY = "todos";
```

- `TODO_FILTER_BUTTONS` drives `TodoFilters` — adding a new filter means
  adding an entry here plus a `case` in `getFilteredTodos`.
- `TODOS_STORAGE_KEY` centralizes the localStorage key so it is never
  hard-coded twice.

---

# 5. State Management

All application state is hoisted into the container component `Todo.jsx`.
Children are controlled and receive values + callbacks via props.

## State

| State                    | Initial         | Purpose                                              |
| ------------------------ | --------------- | ---------------------------------------------------- |
| `todoInputField`         | `""`            | Value of the add-todo input                          |
| `todoList`               | lazy (see below)| Array of todo objects; source of truth for the list  |
| `editingTodoId`          | `null`          | Id of the todo currently being edited (or `null`)   |
| `filter`                 | `"All"`         | Active filter: `All`, `Active`, `Completed`          |
| `searchText`             | `""`            | Raw uncontrolled-by-user search input value          |
| `debouncedSearchText`    | `""`            | Debounced, trimmed, lowercased search term           |
| `selectedTodoIds`        | `new Set()`     | Set of selected todo ids (bulk operations)           |
| `showUndo`               | `false`         | Controls the visibility of the undo banner           |

## Lazy State Initializer

`todoList` is initialized lazily from `localStorage` so the read happens only
once on mount:

```js
const [todoList, setTodoList] = useState(() =>
  parseLocalStorageTodos(todoKey),
);
```

`parseLocalStorageTodos` guards against missing or corrupt data:

```js
function parseLocalStorageTodos(key) {
  try {
    let storedTodos = localStorage.getItem(key);
    return storedTodos ? JSON.parse(storedTodos) : [];
  } catch (err) {
    console.error(err.message);
    return [];
  }
}
```

## Refs

| Ref                    | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `deletedTodosInfoRef`  | Snapshot of deleted `{ todo, position }` for undo         |
| `undoTimerRef`         | Handle of the 5 second undo timeout                       |
| `draggedTodoIdRef`     | Id of the todo currently being dragged                    |

## Local State in `TodoItem`

`TodoItem` keeps exactly one piece of local, ephemeral UI state:

```js
const [editedValue, setEditedValue] = useState(title);
```

It seeds the edit input with the current title and is reset back to `title`
when editing is cancelled — it never persists anything itself.

---

# 6. Derived State

Values computed from `todoList` (and other state) on every render rather than
stored.

```js
const activeTodosCount = todoList.filter((todo) => !todo.isCompleted).length;
const shouldMarkAllCompleted = activeTodosCount > 0;
const getBulkCompleteCta =
  todoList.length && !shouldMarkAllCompleted
    ? "Mark all InComplete"
    : "Mark all completed";
```

- `activeTodosCount` — also rendered in the UI as `Active Todos : N`.
- `shouldMarkAllCompleted` — `true` when at least one todo is active. It is
  passed as the new `isCompleted` value to every todo in `handleBulkToggle`.
- `getBulkCompleteCta` — the button label flips between
  `"Mark all completed"` and `"Mark all InComplete"`.

## The Filtered List

```js
const getFilteredTodos = () => {
  let todos = [...todoList];
  switch (filter) {
    case "Active":
      todos = todos.filter((todo) => !todo?.isCompleted);
      break;
    case "Completed":
      todos = todos.filter((todo) => todo?.isCompleted);
      break;
    default:
      break;
  }
  if (debouncedSearchText) {
    todos = todos.filter((todo) =>
      todo.title.toLowerCase().includes(debouncedSearchText),
    );
  }
  return todos;
};
const filteredTodos = getFilteredTodos();
```

The pipeline is **filter first, then search**. `filteredTodos` is the array
rendered by `TodoList` — filtering is always applied over the full
`todoList`, never over an already-filtered array.

---

# 7. Adding Todos

Flow: user types into `TodoInput` → value lives in `todoInputField` → either
clicks **Add** or presses **Enter**.

`TodoInput` is a controlled component:

```jsx
<input
  value={todoInputField}
  onChange={(e) => handleInputField(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleAddTodoItem(e.target.value)}
/>
<button onClick={() => handleAddTodoItem(todoInputField)}>Add</button>
```

`handleAddTodoItem` trims, ignores empty input, appends immutably, and clears
the field:

```js
const handleAddTodoItem = (value) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return;
  }
  const todoItem = {
    id: crypto.randomUUID(),
    title: trimmedValue,
    isCompleted: false,
  };
  setTodoList((prev) => [...prev, todoItem]);
  setTodoInputField("");
};
```

- New todos are appended to the **end** of the array, so they appear last.
- The `Set` spread pattern `[...prev]` keeps the update immutable.
- Because `todoList` later changes, the persistence effect in §18 writes the
  new item to `localStorage` automatically.

---

# 8. Completing Todos

Each `TodoItem` renders a completion checkbox bound to `todo.isCompleted`:

```jsx
<input
  type="checkbox"
  checked={isCompleted}
  onChange={() => handleCheckboxClick(id)}
/>
```

`handleCheckboxClick` maps over the list, flipping only the matching todo and
spreading the others unchanged:

```js
const handleCheckboxClick = (todoId) => {
  setTodoList((prevList) =>
    prevList.map((todo) =>
      todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo,
    ),
  );
};
```

A completed todo receives the `todo--title-completed` class, which renders the
title with `text-decoration: line-through`.

---

# 9. Editing Todos

Editing is a two-part flow: the parent controls *which* todo is being edited,
the `TodoItem` owns *what* is typed.

## Parent — who / when

| Handler              | Effect                                              |
| -------------------- | --------------------------------------------------- |
| `handleEditTodo(id)` | Sets `editingTodoId` to `id`                        |
| `handleCancelTodo()` | Sets `editingTodoId` back to `null`                 |
| `handleSaveTodo(id, value)` | Trims + validates, updates the title, closes edit |

A todo is considered in edit mode when `editingTodoId === todo.id`:

```js
const isEditing = editingTodoId === id;
```

## TodoItem — the edit UI

```js
const [editedValue, setEditedValue] = useState(title);
```

- **Enter edit mode**: double-click the title or click **Edit**. Both call
  `handleEditStart`, which re-seeds `editedValue` with the current `title`
  (safe if the title changed since the item last mounted) and lifts
  `editingTodoId` up.
- **While editing**: the checkboxes are hidden, the title is replaced by a
  controlled input bound to `editedValue`, **Edit** becomes **Save**, and
  **Delete** becomes **Cancel**.
- **Save**: pressing Enter or clicking Save calls
  `handleSaveTodo(id, value)`.
- **Cancel**: clears `editingTodoId` and resets `editedValue` back to `title`.

```js
const handleSaveTodo = (todoId, EditedValue) => {
  const trimmedValue = EditedValue.trim();
  if (!trimmedValue) {
    return;
  }
  setTodoList((prevList) =>
    prevList.map((todo) =>
      todo.id === todoId ? { ...todo, title: trimmedValue } : todo,
    ),
  );
  setEditingTodoId(null);
};
```

Empty / whitespace-only saves are ignored.

---

# 10. Filtering Todos

`TodoFilters` maps over `TODO_FILTER_BUTTONS` and renders a button per filter.
The active filter gets the `todo--appliedFilter` class:

```jsx
{todoFilterBtns.map((buttonLabel) => (
  <button
    key={buttonLabel}
    className={`${styles["todo--filterBtn"]} ${
      appliedFilter === buttonLabel ? styles["todo--appliedFilter"] : ""
    }`}
    onClick={() => setFilter(buttonLabel)}
  >
    {buttonLabel}
  </button>
))}
```

The filter value is plain state — `All` is the default and the **default case**
in `getFilteredTodos` returns the list untouched. Only one filter can be
active at a time (it is a string, not a multi-select).

---

# 11. Search

`TodoSearch` is a controlled input:

```jsx
<input
  value={searchText}
  placeholder="Search Todo..."
  onChange={(e) => setSearchText(e.target.value)}
/>
```

The search is applied in `getFilteredTodos`:

```js
if (debouncedSearchText) {
  todos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(debouncedSearchText),
  );
}
```

- **Case-insensitive**: both sides are lowercased before comparing.
- **Substring match**: `includes`, not exact equality.
- Search composes with filters: filter runs first, then search on the
  filtered result (see §6 and §10).

---

# 12. Search Debouncing

The raw input is stored in `searchText`, but the derived filtering reads
`debouncedSearchText`. A `useEffect` in `Todo.jsx` translates one into the
other:

```js
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchText(searchText.trim().toLowerCase());
  }, 300);
  return () => {
    clearTimeout(timer);
  };
}, [searchText]);
```

- Every keystroke resets the previous timeout via the cleanup function, so
  the expensive `.filter` pass only runs after 300 ms of no typing.
- The debounced value is also `trim()`ed and `.toLowerCase()`ed, so the
  per-render search already receives a normalized term.
- The empty-string guard (`if (debouncedSearchText)`) skips the search
  entirely when there is nothing to search for.

---

# 13. Multiple Selection

Selection is tracked as a `Set` of todo ids:

```js
const [selectedTodoIds, setSelectedTodoIds] = useState(new Set());
```

Each `TodoItem` renders a selection checkbox bound to set membership and
toggles with an immutable set copy:

```js
const handleSelectTodo = (todoId) => {
  setSelectedTodoIds((prevSet) => {
    const newSet = new Set(prevSet);
    newSet.has(todoId) ? newSet.delete(todoId) : newSet.add(todoId);
    return newSet;
  });
};
```

- `new Set(prevSet)` is copied before mutation — the previous state object is
  never mutated, keeping updates immutable.
- Selection checkboxes are hidden while a todo is being edited.
- The selected count is displayed in the UI: `Selected Todos : N`.
- When a selected todo is deleted individually, it is also removed from the
  set (§16); bulk delete clears the whole set (§14).

---

# 14. Bulk Delete

The **Delete Selected** button is disabled until at least one todo is
selected:

```jsx
<button
  onClick={handleBulkDelete}
  disabled={selectedTodoIds.size === 0}
>
  Delete Selected
</button>
```

`handleBulkDelete` snapshots the selected todos **with their current
positions** before removing them:

```js
const handleBulkDelete = () => {
  if (selectedTodoIds.size === 0) {
    return;
  }
  const deletedTodos = todoList
    .map((todo, index) => ({ todo, position: index }))
    .filter(({ todo }) => selectedTodoIds.has(todo?.id));
  deletedTodosInfoRef.current = deletedTodos;
  setTodoList((prevList) =>
    prevList.filter((todo) => !selectedTodoIds.has(todo.id)),
  );
  setShowUndo(true);
  startUndoTimer();
  setSelectedTodoIds(new Set());
};
```

Notable details:

- The captured `{ todo, position }` array feeds the undo feature (§16).
- `selectedTodoIds` is reset to a fresh empty `Set` afterwards.
- After removal, the persistence effect writes the trimmed list to
  `localStorage`.

---

# 15. Mark All Completed / Incomplete

One button toggles both directions based on derived state:

```jsx
<button
  onClick={handleBulkToggle}
  disabled={todoList.length === 0}
>
  {getBulkCompleteCta}
</button>
```

- Label is `"Mark all completed"` when there is at least one active todo,
  `"Mark all InComplete"` when everything is done.
- Disabled (greyed out) when the list is empty.
- The button is also `disabled` when the entire remaining list is already in
  the target state (handled by the `shouldMarkAllCompleted` derivation).

```js
const handleBulkToggle = () => {
  setTodoList((prevList) =>
    prevList.map((todo) => {
      if (todo.isCompleted === shouldMarkAllCompleted) {
        return todo;
      }
      return {
        ...todo,
        isCompleted: shouldMarkAllCompleted,
      };
    }),
  );
};
```

Todos already in the target completion state are returned unchanged — only
the mismatched ones are flipped, preserving their objects.

---

# 16. Undo Delete

Undo restores deleted todos to their **original positions** within a **5
second** window.

## Snapshot storage

Deletions record `{ todo, position }` pairs into a ref (never state — see
§21):

```js
// single delete
deletedTodosInfoRef.current = [
  { todo: todoList[deletedIndex], position: deletedIndex },
];

// bulk delete (see §14)
deletedTodosInfoRef.current = deletedTodos; // [{ todo, position }, ...]
```

The undo banner is shown via `showUndo` state, and a timer window starts:

```js
const startUndoTimer = () => {
  if (undoTimerRef.current) {
    clearTimeout(undoTimerRef.current);
  }
  undoTimerRef.current = setTimeout(() => {
    deletedTodosInfoRef.current = null;
    undoTimerRef.current = null;
    setShowUndo(false);
  }, 5000);
};
```

## The 5:1 rule on replacement

`deletedTodosInfoRef.current` is **overwritten** on every new delete, and the
pending timer is **cleared + restarted**. This means:

- The most recent deletion is always the one that can be undone.
- Deleting again cancels the previous undo opportunity.

## Restoring

```js
const handleUndoTodo = () => {
  const deletedTodosInfo = deletedTodosInfoRef.current;
  if (!deletedTodosInfo) {
    return;
  }
  const deletedTodos = [...deletedTodosInfo];
  deletedTodos.sort((a, b) => a.position - b.position);
  setTodoList((prevList) => {
    const restoredList = [...prevList];
    deletedTodos.forEach(({ todo, position }) => {
      restoredList.splice(position, 0, todo);
    });
    return restoredList;
  });
  setShowUndo(false);
  deletedTodosInfoRef.current = null;
  clearTimeout(undoTimerRef.current);
  undoTimerRef.current = null;
};
```

- Entries are sorted ascending by `position` so the `splice` inserts never
  interfere with each other's indices.
- Undo clears the undo banner, the ref, and the pending timer.

## Cleanup

On unmount, pending undo state is torn down:

```js
useEffect(() => {
  return () => {
    deletedTodosInfoRef.current = null;
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
  };
}, []);
```

`handleDeleteTodo` also removes the id from `selectedTodoIds` so a deleted
todo cannot linger in the selection set.

---

# 17. Drag and Drop

Native HTML5 Drag and Drop API. The dragged id is held in a ref, and the
destination index is based on **recompute-at-drop** (`setTodoList` functional
update reads the *latest* `prevList`), so filtered views stay correct.

## Handlers

```js
const handleDragStart = (e, draggedTodoId) => {
  draggedTodoIdRef.current = draggedTodoId;
  e.dataTransfer.effectAllowed = "move";
};
const handleDragOver = (e) => {
  e.preventDefault(); // required to allow a drop
};
const handleDrop = (e, targetTodoId) => {
  e.preventDefault();
  const draggedTodoId = draggedTodoIdRef.current;
  if (!draggedTodoId || draggedTodoId === targetTodoId) {
    return;
  }
  setTodoList((prevList) => {
    const getTodoPosition = (todoId) =>
      prevList.findIndex((todo) => todo.id === todoId);
    const draggedTodoIndex = getTodoPosition(draggedTodoId);
    const targetTodoIndex = getTodoPosition(targetTodoId);
    if (targetTodoIndex === -1 || draggedTodoIndex === -1) {
      return prevList;
    }
    const reorderedList = [...prevList];
    const [draggedItem] = reorderedList.splice(draggedTodoIndex, 1);
    const adjustedTargetIndex =
      draggedTodoIndex < targetTodoIndex
        ? targetTodoIndex - 1
        : targetTodoIndex;
    reorderedList.splice(adjustedTargetIndex, 0, draggedItem);
    return reorderedList;
  });
};
const handleDragEnd = () => {
  draggedTodoIdRef.current = null;
};
```

## The index adjustment

The dragged item is removed **first**, shrinking the array by one. When
dragging *downward* (`draggedTodoIndex < targetTodoIndex`) the target index
must shift down by one, because removing the source before inserting shifts
all later indices. Dragging upward needs no adjustment.

## Wiring on the item

```jsx
<div
  draggable
  onDragStart={(e) => handleDragStart(e, id)}
  onDragOver={handleDragOver}
  onDrop={(e) => handleDrop(e, id)}
  onDragEnd={handleDragEnd}
>
```

- `draggable` makes the whole item a drag source.
- Dropping is handled on **other items** (`targetTodoId`).
- `handleDragEnd` resets the ref so stale ids never leak into later drops.
- The reordered list persists automatically via the §18 effect.

## Flow diagram

```text
                 ┌──────────────────┐
                 │   todoList state  │
                 └────────┬─────────┘
                          │
                     render todos
                          │
                          ▼
                    ┌───────────┐
                    │ TodoItem  │
                    └─────┬─────┘
                          │
                     dragStart
                          │
                          ▼
              draggedTodoIdRef = ID
                          │
                          ▼
                      dragOver
                          │
                 preventDefault()
                          │
                          ▼
                    dragEnd clears ref
                          │
                        drop
                          │
                          ▼
              functional update - latest prevList
                          │
              ┌───────────┴───────────┐
              │                       │
        dragged index            target index
              │                       │
              └───────────┬───────────┘
                          ▼
          invalid (-1) or same id? → return prevList unchanged
                          │
                          ▼
                   remove dragged item
                          │
                          ▼
       dragging down? targetIndex - 1 (no change if up)
                          │
                          ▼
                  insert dragged item
                          │
                          ▼
                  setTodoList(newList)
                          │
                          ▼
                 localStorage (via effect)
```

---

# 18. LocalStorage Persistence

Persistence is handled by two pieces working together.

## Read (lazy initializer, on mount)

```js
const [todoList, setTodoList] = useState(() =>
  parseLocalStorageTodos(todoKey),
);
```

## Write (on every todoList change)

```js
useEffect(() => {
  localStorage.setItem(todoKey, JSON.stringify(todoList));
}, [todoList]);
```

- The write effect runs on mount **and** after every list mutation (add,
  complete, save, delete, bulk ops, undo, reorder) because all of them call
  `setTodoList`.
- The storage key comes from `TODOS_STORAGE_KEY` (`"todos"`).
- Writes are synchronous and cheap for this dataset; broken/corrupt JSON is
  caught by the `try/catch` in `parseLocalStorageTodos`, which falls back to
  `[]`.

---

# 19. React State Immutability

State is never directly mutated. Every update produces a new reference:

| Operation          | Immutable pattern                                   |
| ------------------ | --------------------------------------------------- |
| Add todo           | `[...prev, todoItem]`                               |
| Toggle complete    | `prev.map(t => t.id === id ? { ...t, isCompleted } : t)` |
| Save edited title  | `prev.map(t => t.id === id ? { ...t, title } : t)`  |
| Delete todo        | `prev.filter(t => t.id !== id)`                     |
| Bulk delete        | `prev.filter(t => !selectedTodoIds.has(t.id))`      |
| Mark all toggle    | `prev.map(t => ...)` (spreads changed ones)         |
| Reorder (DnD)      | `splice` on a shallow copy `[...prevList]`          |
| Selection toggles  | `new Set(prevSet)` before add/delete                |
| Undo restore       | `splice` on `[...prevList]`                         |

Reordering and undo copy the array first (`[...prevList]`), then use
`splice` on that copy — never on the state array itself.

---

# 20. Functional State Updates

Updates that depend on the latest state use the functional form so React
always sees the current value:

```js
setTodoList((prev) => ...);
setSelectedTodoIds((prevSet) => ...);
```

Used across handlers that could otherwise read stale state:

- `handleAddTodoItem` — appends to latest list
- `handleCheckboxClick` — maps latest list
- `handleSaveTodo` — maps latest list
- `handleDeleteTodo` / `handleBulkDelete` — filter latest list
- `handleBulkToggle` — maps latest list
- `handleSelectTodo` — copies latest set
- `handleDrop` — recomputes indices from latest `prevList` at drop time
- `handleUndoTodo` — inserts into latest list

The DnD case is the strongest argument: source/target indices are only valid
for the list **at the moment of the drop**, so they are derived inside the
updater function.

---

# 21. Refs vs State

Three values are stored in refs because they are **write-heavy, render-
irrelevant**, or hold cross-render bookkeeping. UI-visible things stay in
state.

| Value                        | Choice  | Reason                                                        |
| ---------------------------- | ------- | ------------------------------------------------------------- |
| `deletedTodosInfoRef`        | ref     | Underlying data only needed on demand; render only cares about `showUndo` |
| `undoTimerRef`               | ref     | Timer id is invisible to the UI; storing it in state would cause irrelevant re-renders |
| `draggedTodoIdRef`           | ref     | In-flight drag id; mutating it should not re-render the list  |
| `showUndo`                   | state   | The undo banner must appear/disappear → must trigger a render |
| `editingTodoId` / `filter` / etc. | state | Directly drive what the UI renders                            |

The `showUndo` + `deletedTodosInfoRef` split is deliberate: the **fact** that
something was deleted is state (it renders the banner); the **details** of
what was deleted are a ref (only read when Undo is clicked).

---

# 22. State Ownership

A clear ownership hierarchy keeps the code predictable:

- **`Todo` owns all shared application state** — the list, filters, search,
  editing id, selection, undo visibility. Children are fully controlled and
  receive everything via props.
- **`TodoItem` owns only transient edit-draft text** (`editedValue`), which
  is local UI state with no impact on siblings or persistence.
- No two components duplicate the same piece of state — there is a single
  source of truth for `todoList`, `filter`, `searchText`, etc.

This makes the component communication explicit: everything needed to render
is passed down, and every user action is bubbled up through callbacks.

---

# 23. Data Flow

Data flows one direction: **down via props, up via callbacks**.

```text
                        ┌─────────────────────────┐
                        │        Todo.jsx         │
                        │  (state + all handlers) │
                        └────────┬────────────────┘
                                 │  props (values)
              ┌──────────────────┼────────────────┐
              ▼                  ▼                ▼
        TodoInput          TodoSearch        TodoFilters
              ▲                  ▲                ▲
              └── callbacks ─────┴────────────────┘
                                 │
                                 ▼
                          TodoList (filteredTodos)
                                 │
                                 ▼
                             TodoItem
```

- Add / search / filter / edit / complete / select / delete / drag events
  originate in the leaf components and travel **up** to `Todo` handlers.
- The rendered list is `filteredTodos` (derived in `Todo`) flowing **down**
  into `TodoList`.
- Side effects (persistence, debounce, cleanup) live only in `Todo`.

---

# 24. Important Edge Cases

| Scenario                              | Handling                                                            |
| ------------------------------------- | ------------------------------------------------------------------ |
| Empty / whitespace input on add       | `trim()` guard in `handleAddTodoItem` → returns early               |
| Empty / whitespace input on save      | `trim()` guard in `handleSaveTodo` → edit stays open                |
| Drop on the same item                 | `draggedTodoId === targetTodoId` → early return                     |
| Drop without a valid dragged id       | `!draggedTodoId` → early return                                     |
| Source/target index `-1`              | Guarded → `prevList` returned unchanged                             |
| Bulk delete with nothing selected     | `selectedTodoIds.size === 0` → early return; button also `disabled` |
| Mark-all with an empty list           | Button `disabled` when `todoList.length === 0`                      |
| Corrupt / missing localStorage data   | `try/catch` in `parseLocalStorageTodos` → falls back to `[]`        |
| Deleting a selected todo              | Id removed from `selectedTodoIds` in `handleDeleteTodo`             |
| Undo after a second delete            | Ref overwritten + timer reset → only latest deletion is undoable    |
| Undo with no pending delete           | `deletedTodosInfoRef.current` null → early return                   |
| Restoring multiple items (bulk undo)  | Sorted by `position` so sequential `splice` indices stay valid      |
| Editing a deleted todo                | Item no longer rendered; `editingTodoId` harmlessly points to a missing id |
| Timer cleanup on unmount              | Cleanup effect clears ref + timer                                   |

---

# 25. Performance Considerations

Already implemented:

- **Debounced search** (§12) — the `filter` pass runs only 300 ms after the
  last keystroke, not on every keystroke.
- **Early guard clauses** — DnD and bulk operations bail out without state
  churn when inputs are invalid.
- **Derived state is cheap** for typical todo list sizes (single-pass
  `filter`/`map`).

Open optimization opportunities (not currently applied):

- No `useMemo` for `filteredTodos` — `getFilteredTodos()` runs on every
  render even when `filter`/`debouncedSearchText`/`todoList` did not change.
- No `React.memo` on `TodoItem` — completion toggles re-render every item.
- No `useCallback` around handlers — new function identities on every render
  would defeat `React.memo` anyway.
- No virtualization — rendering is fine until lists become very large.
- DnD reorders over the whole list rather than pausing filtering during drag.

---

# 26. Accessibility Considerations

What is reasonably solid today:

- Semantic native elements — `<input>`, `<button>`, `<p>`.
- Focusable interactive controls everywhere (buttons and inputs).
- Clear text labels for every button (`Add`, `Edit`, `Save`, `Cancel`,
  `Delete`, `Undo`, filter names, etc.).

Current gaps:

- Inputs lack `<label>` elements / `aria-label`; placeholders alone do not
  satisfy all assistive tech.
- The two checkboxes per row (select + complete) have no accessible names.
- The undo banner is not announced — no `role="alert"` / `aria-live`.
- Filter buttons are not a `<button aria-pressed>` toggle group.
- Counts (`Active Todos`, `Selected Todos`) are plain text spans.
- Drag & drop is mouse-only; there is no keyboard-accessible alternative for
  reordering (see §27).

---

# 27. Current Limitations

- **No cross-tab synchronization** — writes from another tab are not picked
  up (no `storage` event listener).
- **Drag and drop is mouse-only** — no touch/pointer support and no
  keyboard-based reordering (up/down buttons, for example).
- **No memoization** — generous re-render behavior for larger lists.
- **`crypto.randomUUID()`** requires a secure context (HTTPS / localhost).
- **Undo is a single snapshot** — deleting again replaces it; there is no
  redo and no multi-level history.
- **Search + filter recompute on every render**; no caching.
- **`editedValue` resets to title only on edit start/cancel** — a title
  change via another path while editing depends on these call sites.
- **No empty-state UI** when the list is empty or a filter/search yields no
  results.
- **No validation beyond trimming** — duplicate titles are allowed.
- **Styles are fixed width** (`100vw`), which can overflow small screens.

---

# 28. Potential Interview Follow-ups

Be ready to extend or defend the implementation:

1. **Combine todos + cross-tab sync**: listen to the `storage` event and call
   `setTodoList(JSON.parse(e.newValue))`.
2. **Redo / multi-level undo**: replace the single ref snapshot with a
   history stack (array of `{ todo, position }` snapshots) and redo records.
3. **Memoization**: `useMemo` on `filteredTodos`, `React.memo` on `TodoItem`,
   `useCallback` on handlers — then explain whether DnD’s stale-closure risk
   changes.
4. **Avoid stale closures in DnD**: justify why the reorder logic reads the
   indices *inside* the `setTodoList` updater.
5. **Virtualization**: swap `TodoList` for windowing when item counts grow.
6. **Custom hooks**: extract `useTodos`, `useLocalStorage`, `useDebounce`,
   `useUndoState`, `useSelection`.
7. **Test plan**: React Testing Library cases for add, edit, filter + search
   composition, undo timing (fake timers), bulk delete.
8. **Drag handles vs whole item**: limit `draggable` to a handle to avoid
   conflicts with text selection and touch.
9. **`crypto.randomUUID` fallback**: a fallback id generator for non-secure
   contexts.
10. **XSS**: React escapes `title` on render, but discuss `dangerouslySetInnerHTML` risks if introduced.

---

# 29. Interview Questions and Answers

**Q1. Why is all state in `Todo.jsx` rather than distributed across
components?**
A: It creates a single source of truth. Children like `TodoList`, filters,
and search all need the same list; storing it in the container means every
shared view derives from one array without sync bugs. `TodoItem` keeps only
transient `editedValue` for local edit UX.

**Q2. Why use a ref for deleted-todo info instead of state?**
A: The snapshot is only read when Undo is clicked. Putting it in state would
re-render the tree just to remember data nobody draws. The *visibility* of
the banner is genuinely renderable, so `showUndo` is state while the payload
is a ref.

**Q3. Why the functional form `setTodoList((prev) => ...)` everywhere?**
A: Guarantees the latest list. This is critical in DnD, where indices are
only meaningful for the array at the exact moment of `drop`, and avoids stale
closure bugs when multiple state updates queue together.

**Q4. How does undo restore positions?**
A: On delete we store `{ todo, position }` from the current list. On undo we
sort snapshots by `position` ascending, copy `[...prevList]`, and `splice`
each todo back at its stored index. Sorting prevents index shifting from
clobbering earlier inserts.

**Q5. How is debounce implemented?**
A: Raw text updates `searchText` immediately (cheap, drives the controlled
input), while a `useEffect` set a 300 ms timeout to derive
`debouncedSearchText`; the effect cleanup clears the pending timeout on every
keystroke, so filtering only happens after typing stops.

**Q6. Why adjust the target index in DnD?**
A: We splice the dragged item out first, shrinking the array. If the source
was above the target, every index after it shifts down by one, so the target
must be decremented before inserting — otherwise the item lands one slot too
far down.

**Q7. When does persistence write to localStorage?**
A: `useEffect` keyed on `todoList` runs after mount and after every
`setTodoList` call — add, complete, save, delete, bulk ops, undo, and every
drag reorder — serializing the whole array each time.

**Q8. How compatible are filtered views with drag reordering?**
A: Because indices are recomputed inside the functional updater against the
*latest* `prevList`, a drop during filtering still resolves to correct
absolute positions despite the filtered slice being rendered.

---

# 30. Overall Architecture

```text
┌───────────────────────────────────────────────────────────────┐
│                         constants.js                          │
│   TODO_FILTER_BUTTONS = ["All", "Active", "Completed"]        │
│   TODOS_STORAGE_KEY   = "todos"                                │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                          Todo.jsx                             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ State:      todoList (lazy, from localStorage)          │  │
│  │             todoInputField, editingTodoId, filter,      │  │
│  │             searchText, debouncedSearchText,            │  │
│  │             selectedTodoIds (Set), showUndo             │  │
│  │ Refs:       deletedTodosInfoRef, undoTimerRef,          │  │
│  │             draggedTodoIdRef                            │  │
│  │ Derived:    activeTodosCount, shouldMarkAllCompleted,   │  │
│  │             getBulkCompleteCta, filteredTodos           │  │
│  │ Effects:    persistence · debounce(300ms) · cleanup     │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────┬──────────────────────────────┬───────────────────────┘
         │                              │
  props down                filteredTodos down
         ▼                              ▼
  ┌─────────────┐   ┌─────────────┐   ┌──────────────────────┐
  │ TodoInput   │   │ TodoSearch  │   │ TodoList             │
  │ add + Enter │   │ raw search  │   │  maps filteredTodos  │
  └──────▲──────┘   └──────▲──────┘   │   └── TodoItem       │
         │                  │         │        edit draft    │
  ┌─────────────┐   ┌─────────────┐   │        + DnD hooks   │
  │ TodoFilters │   │ Undo banner │   └──────────────────────┘
  │ 3 buttons   │   │ showUndo    │
  └──────▲──────┘   └─────────────┘
         │
         │              callbacks up (actions)
         └──────────────┴───────────────► Todo handlers
                                          │
                                          ▼
                                  localStorage("todos")
```

## Summary

- **Containment**: one container owns the domain, every child is controlled.
- **Derivation**: visible summaries (counts, labels, filtered rows) are
  computed, never stored.
- **Persistence**: lazy read + effect-write around a single `todoList`.
- **Transient flows**: undo and drag use refs for payload bookkeeping and
  state only for what should paint.
- **Immutability + functional updates** keep every transition safe under
  batching and async timing.