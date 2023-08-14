/*global chrome*/
import React, { useEffect, useState } from 'react';
import './App.css';
import { contrastColor, getNextEyePleasingColor } from './constants';

const TodoList = ({ setTasksByHour }) => {
  const [todos, setTodos] = useState([]);
  const [newTodoName, setNewTodoName] = useState('');

  // Load todos from local storage when the component mounts
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
  // Load todos from chrome.storage.sync when the component mounts

  // useEffect(() => {
  //   chrome.storage.sync.get(['todos'], (result) => {
  //     const storedTodos = result.todos;
  //     if (storedTodos) {
  //       setTodos(JSON.parse(storedTodos));
  //     }
  //   });
  // }, []);

  // // Save todos to chrome.storage.sync whenever the todos change
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
    // Move the todo to the first hour ('6:00 AM') in tasksByHour
    setTasksByHour((prevTasksByHour) => ({
      ...prevTasksByHour,
      '6:00 AM': [...prevTasksByHour['6:00 AM'], { id: todoId, name, color }],
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
              document.querySelector('#todo-input').focus();
              handleAddTodo();
            }
          }}
        />
      </div>
      <div className="todo-list">
        {todos.map((todo) => (
          <div
            className="task-box"
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
