import { useState } from "react";
import styles from "./style.module.scss";
const TodoItem = ({
  todoItem,
  handleCheckboxClick,
  handleDeleteTodo,
  editingTodoId,
  handleEditTodo,
  handleCancelTodo,
  handleSaveTodo,
  selectedTodoIds,
  handleSelectTodo,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd
}) => {
  const { id, title, isCompleted } = todoItem;
  const [editedValue, setEditedValue] = useState(title);
  const handleEditStart = () => {
    setEditedValue(title);
    handleEditTodo(id);
  };
  const isEditing = editingTodoId === id;
  const handleEditedValue = (value) => {
    setEditedValue(value);
  };
  return (
    <div
      className={styles["todo__todoItem"]}
      draggable
      onDragStart={(e) => handleDragStart(e , id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e,id)}
      onDragEnd={handleDragEnd}
    >
      {!isEditing && (
        <input
          type="checkbox"
          checked={selectedTodoIds.has(id)}
          className={styles["todo__checkBox"]}
          onChange={() => handleSelectTodo(id)}
        />
      )}
      {!isEditing && (
        <input
          type="checkbox"
          checked={isCompleted}
          className={styles["todo__checkBox"]}
          onChange={() => handleCheckboxClick(id)}
        />
      )}
      {isEditing ? (
        <input
          className={styles["todo__input-field"]}
          value={editedValue}
          onChange={(e) => handleEditedValue(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleSaveTodo(id, e.target.value)
          }
        />
      ) : (
        <p
          className={`${styles["todo__title"]} ${isCompleted ? styles["todo--title-completed"] : ""}`}
          onDoubleClick={handleEditStart}
        >
          {title}
        </p>
      )}
      {isEditing ? (
        <button
          className={styles["todo__editBtn"]}
          onClick={() => {
            handleSaveTodo(id, editedValue);
          }}
        >
          Save
        </button>
      ) : (
        <button className={styles["todo__editBtn"]} onClick={handleEditStart}>
          Edit
        </button>
      )}
      {isEditing ? (
        <button
          className={styles["todo--deleteBtn"]}
          onClick={() => {
            handleCancelTodo(id);
            setEditedValue(title);
          }}
        >
          Cancel
        </button>
      ) : (
        <button
          className={styles["todo--deleteBtn"]}
          onClick={() => handleDeleteTodo(id)}
        >
          Delete
        </button>
      )}
    </div>
  );
};
const TodoList = (props) => {
  const {
    todoList,
    handleCheckboxClick,
    handleDeleteTodo,
    editingTodoId,
    handleEditTodo,
    handleCancelTodo,
    handleSaveTodo,
    selectedTodoIds,
    handleSelectTodo,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  } = props;
  return (
    <div className={styles["todo__todoList"]}>
      {todoList?.map((todoItem) => {
        return (
          <TodoItem
            key={todoItem?.id}
            todoItem={todoItem}
            handleCheckboxClick={handleCheckboxClick}
            handleDeleteTodo={handleDeleteTodo}
            editingTodoId={editingTodoId}
            handleEditTodo={handleEditTodo}
            handleCancelTodo={handleCancelTodo}
            handleSaveTodo={handleSaveTodo}
            selectedTodoIds={selectedTodoIds}
            handleSelectTodo={handleSelectTodo}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragEnd={handleDragEnd}
          />
        );
      })}
    </div>
  );
};
export default TodoList;
