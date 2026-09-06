import { useState } from "react";
import { TodoInput, TodoList, TodoFilters } from "../todo";
import styles from "./style.module.scss";
const Todo = () => {
  const [todoInputField, setTodoInputField] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [filter, setFilter] = useState("All");
  const getFilteredTodos = (filter) => {
    switch (filter) {
      case "Active":
        return todoList.filter((todo) => !todo?.isCompleted);
      case "Completed":
        return todoList.filter((todo) => todo?.isCompleted);
      default:
        return todoList;
    }
  };
  const filteredTodos = getFilteredTodos(filter);
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
  const handleCheckboxClick = (toBeCompletedTodoId) => {
    setTodoList((prevList) =>
      prevList.map((todo) =>
        todo.id === toBeCompletedTodoId
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo,
      ),
    );
  };
  const handleDeleteTodo = (toBeDeletedTodoId) => {
    const updatedTodoList = todoList.filter(
      (todo) => todo.id !== toBeDeletedTodoId,
    );
    setTodoList(updatedTodoList);
  };
  const handleEditTodo = (toBeEditedTodoId) => {
    setEditingTodoId(toBeEditedTodoId);
  };
  const handleCancelTodo = () => {
    setEditingTodoId(null);
  };
  const handleSaveTodo = (toBeSavedTodoId, EditedValue) => {
    const trimmedValue = EditedValue.trim();
    if (!trimmedValue) {
      return;
    }
    const updatedTodoList = todoList.map((todo) =>
      todo.id === toBeSavedTodoId ? { ...todo, title: trimmedValue } : todo,
    );
    setTodoList(updatedTodoList);
    setEditingTodoId(null);
  };
  const fetchNumberOfActiveTodos = () => {
    const activeTodos = todoList?.reduce((acc, todo) => {
      return !todo?.isCompleted ? acc + 1 : acc;
    }, 0);
    return activeTodos;
  };
  return (
    <div className={styles["todo"]}>
      <h1>Todo App</h1>
      <TodoInput
        todoInputField={todoInputField}
        handleInputField={handleInputField}
        handleAddTodoItem={handleAddTodoItem}
      />
      <div className={styles["todo__filter-container"]}>
        <TodoFilters appliedFilter={filter} setFilter={setFilter} />
      </div>
      <span>Active Todo's : {fetchNumberOfActiveTodos()}</span>
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
