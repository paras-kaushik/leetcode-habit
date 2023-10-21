/*global chrome*/
import React, { useEffect, useState } from 'react';
import './App.css';
import { contrastColor, getNextEyePleasingColor } from './constants';

const TodoList = ({ setTasksByHour }) => {
  const [todos, setTodos] = useState([]);
  const [newTodoName, setNewTodoName] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState(3); //Lowest priority by def

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to local storage whenever the todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // useEffect(() => {
  //   chrome.storage.sync.get(['todos'], (result) => {
  //     const storedTodos = result.todos;
  //     if (storedTodos) {
  //       setTodos(JSON.parse(storedTodos));
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   chrome.storage.sync.set({ todos: JSON.stringify(todos) });
  // }, [todos]);

  const handleAddTodo = () => {
    if (newTodoName.trim() !== '') {
      // Generate a random color (hex code)
      const randomColor = getNextEyePleasingColor();

      // Create a new todo object
      const newTodo = {
        id: Math.random().toString(),
        name: newTodoName,
        color: randomColor,
        priority: newTodoPriority,
      };

      // Update the todo list state
      setTodos((prevTodos) => [...prevTodos, newTodo]);

      // Clear the input
      setNewTodoName('');
    }
  };

  const handleDeleteTodo = (todoId) => {
    // Remove the todo from the list
    const updatedTodos = todos.filter((todo) => todo.id !== todoId);
    setTodos(updatedTodos);
  };

  const handleScheduleTodo = (todoId, name, color) => {
    setTasksByHour((prevTasksByHour) => ({
      ...prevTasksByHour,
      '12 AM': [...prevTasksByHour['12 AM'], { id: todoId, name, color }],
    }));

    // Remove the todo from the current list
    const updatedTodos = todos.filter((todo) => todo.id !== todoId);
    setTodos(updatedTodos);
  };

  return (
    <div className="todos-container">
      <h2>Todos</h2>
      <div className="input-container">
        <input
          type="search"
          id="todo-input"
          placeholder="Todo description"
          value={newTodoName}
          onChange={(event) => setNewTodoName(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              document.querySelector('#todo-priority').focus();
            }
          }}
        />
        <select
          type="number"
          id="todo-priority"
          placeholder="Todo priority(1-3)"
          value={newTodoPriority}
          onChange={(event) => setNewTodoPriority(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              document.querySelector('#todo-input').focus();
              handleAddTodo();
            }
          }}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </div>
      <div className="todo-list">
        {todos
          .sort((a, b) => a.priority - b.priority)
          .map((todo) => (
            <div
              className="task-box task-box-todo"
              key={todo.id}
              style={{
                width: '80%',
                padding: '8px',
                marginBottom: '4px',
                border: '1px solid',
                color: contrastColor(todo.color),
                background: `${todo.color}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>{todo.name}</div>

              <div className="task-icons">
                <div>{todo.priority}</div>
                <i
                  onClick={() => handleDeleteTodo(todo.id)}
                  class="fa fa-trash"
                  aria-hidden="true"
                ></i>
                <i
                  class="fa fa-calendar"
                  aria-hidden="true"
                  onClick={() =>
                    handleScheduleTodo(todo.id, todo.name, todo.color)
                  }
                  style={{
                    padding: '4px 8px',
                  }}
                ></i>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TodoList;
