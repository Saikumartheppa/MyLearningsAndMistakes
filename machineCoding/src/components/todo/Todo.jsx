import { useEffect, useState } from "react";
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
  const activeTodosCount = todoList.filter((todo) => !todo.isCompleted).length;
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
        todos = todoList.filter((todo) => !todo?.isCompleted);
        break;
      case "Completed":
        todos = todoList.filter((todo) => todo?.isCompleted);
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
  const handleDeleteTodo = (todoId) => {
    setTodoList((prevList) => prevList.filter((todo) => todo.id !== todoId));
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
      <TodoList
        todoList={filteredTodos}
        handleCheckboxClick={handleCheckboxClick}
        handleDeleteTodo={handleDeleteTodo}
        editingTodoId={editingTodoId}
        handleEditTodo={handleEditTodo}
        handleCancelTodo={handleCancelTodo}
        handleSaveTodo={handleSaveTodo}
      />
    </div>
  );
};
export default Todo;
