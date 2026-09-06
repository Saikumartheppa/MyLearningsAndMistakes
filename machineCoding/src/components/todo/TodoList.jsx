import { useState } from "react";
import styles from "./style.module.scss";
const TodoItem = ({
  todoItem,
  handleCheckboxClick,
  handleDeleteTodo,
  editingTodoId,
  handleEditTodo,
  handleCancelTodo,
  handleSaveTodo
}) => {
  const { id, title, isCompleted } = todoItem;
  const [editedValue, setEditedValue] = useState(title);
  const handleEditStart = (todoId) => {
    setEditedValue(title);
    handleEditTodo(todoId);
  }
  const isEditing = (id) => {
    return editingTodoId === id;
  };
  const handleEditedValue = (value) => {
    setEditedValue(value);
  };
  return (
    <div className={styles["todo__todoItem"]}>
      {!isEditing(id) && (
        <input
          type="checkbox"
          checked={isCompleted}
          className={styles["todo__checkBox"]}
          onChange={() => handleCheckboxClick(id)}
        />
      )}
      {isEditing(id) ? (
        <input
          className={styles["todo__input-field"]}
          value={editedValue}
          onChange={(e) => handleEditedValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSaveTodo(id , e.target.value)}
        />
      ) : (
        <p className={`${isCompleted ? styles["todo--title-completed"] : ""}`} onDoubleClick={(e)=> handleEditStart(id)}>
          {title}
        </p>
      )}
      {isEditing(id) ? (
        <button
          className={styles["todo__editBtn"]}
          onClick={() => {
            handleSaveTodo(id, editedValue)
          }}
        >
          Save
        </button>
      ) : (
        <button
          className={styles["todo__editBtn"]}
          onClick={() => handleEditStart(id)}
        >
          Edit
        </button>
      )}

      {isEditing(id) ? (
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
   handleSaveTodo
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
          />
        );
      })}
    </div>
  );
};
export default TodoList;
