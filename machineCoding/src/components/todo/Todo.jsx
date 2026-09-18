import { useEffect, useState, useRef } from "react";
import { TodoInput, TodoList, TodoFilters, TodoSearch } from "../todo";
import { TODOS_STORAGE_KEY as todoKey } from "../constants";
import styles from "./style.module.scss";
const Todo = () => {
  const [todoInputField, setTodoInputField] = useState("");
  const [todoList, setTodoList] = useState(() =>
    parseLocalStorageTodos(todoKey),
  );
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [selectedTodoIds, setSelectedTodoIds] = useState(new Set());
  const deletedTodosInfoRef = useRef(null);
  const undoTimerRef = useRef(null);
  const [showUndo, setShowUndo] = useState(false);
  const activeTodosCount = todoList.filter((todo) => !todo.isCompleted).length;
  const shouldMarkAllCompleted = activeTodosCount > 0;
  const getBulkCompleteCta =
    todoList.length && !shouldMarkAllCompleted
      ? "Mark all InComplete"
      : "Mark all completed";
  function parseLocalStorageTodos(key) {
    try {
      let storedTodos = localStorage.getItem(key);
      return storedTodos ? JSON.parse(storedTodos) : [];
    } catch (err) {
      console.error(err.message);
      return [];
    }
  }
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
  const handleInputField = (value) => {
    setTodoInputField(value);
  };
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
  const handleCheckboxClick = (todoId) => {
    setTodoList((prevList) =>
      prevList.map((todo) =>
        todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo,
      ),
    );
  };
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
  const handleDeleteTodo = (todoId) => {
    const deletedIndex = todoList.findIndex((todo) => todo.id === todoId);
    if (deletedIndex === -1) {
      return;
    }
    deletedTodosInfoRef.current = [
      {
        todo: todoList[deletedIndex],
        position: deletedIndex,
      },
    ];
    setTodoList((prevList) => prevList.filter((todo) => todo.id !== todoId));
    setSelectedTodoIds((prevSet) => {
      const newSet = new Set(prevSet);
      newSet.delete(todoId);
      return newSet;
    });
    setShowUndo(true);
    startUndoTimer();
  };
  const handleEditTodo = (toBeEditedTodoId) => {
    setEditingTodoId(toBeEditedTodoId);
  };
  const handleCancelTodo = () => {
    setEditingTodoId(null);
  };
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
  const handleSelectTodo = (todoId) => {
    setSelectedTodoIds((prevSet) => {
      const newSet = new Set(prevSet);
      newSet.has(todoId) ? newSet.delete(todoId) : newSet.add(todoId);
      return newSet;
    });
  };
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
  useEffect(() => {
    localStorage.setItem(todoKey, JSON.stringify(todoList));
  }, [todoList]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText.trim().toLowerCase());
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);
  useEffect(() => {
    return () => {
      deletedTodosInfoRef.current = null;
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
        undoTimerRef.current = null;
      }
    };
  }, []);
  return (
    <div className={styles["todo"]}>
      <h1>Todo App</h1>
      <TodoInput
        todoInputField={todoInputField}
        handleInputField={handleInputField}
        handleAddTodoItem={handleAddTodoItem}
      />
      <TodoSearch searchText={searchText} setSearchText={setSearchText} />
      <div className={styles["todo__filter-container"]}>
        <TodoFilters appliedFilter={filter} setFilter={setFilter} />
      </div>
      <span>Active Todos : {activeTodosCount}</span>
      <div>
        <button
          className={`${selectedTodoIds.size > 0 ? styles["todo__bulk-deleteBtn"] : styles["todo__bulk-deleteBtn--disabled"]}`}
          onClick={handleBulkDelete}
          disabled={selectedTodoIds.size === 0}
        >
          Delete Selected
        </button>
        <button
          className={`${todoList.length > 0 ? styles["todo__mark-allBtn"] : styles["todo__bulk-deleteBtn--disabled"]}`}
          onClick={handleBulkToggle}
          disabled={todoList.length === 0}
        >
          {getBulkCompleteCta}
        </button>
        <span>Selected Todos : {selectedTodoIds.size}</span>
      </div>
      <TodoList
        todoList={filteredTodos}
        handleCheckboxClick={handleCheckboxClick}
        handleDeleteTodo={handleDeleteTodo}
        editingTodoId={editingTodoId}
        handleEditTodo={handleEditTodo}
        handleCancelTodo={handleCancelTodo}
        handleSaveTodo={handleSaveTodo}
        selectedTodoIds={selectedTodoIds}
        handleSelectTodo={handleSelectTodo}
      />
      {showUndo && (
        <div className={styles["todo__undo-container"]}>
          <span>Todo Deleted</span>
          <button className={styles["todo__undoBtn"]} onClick={handleUndoTodo}>
            Undo
          </button>
        </div>
      )}
    </div>
  );
};
export default Todo;
