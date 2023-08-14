import React, { useEffect, useState } from 'react';
import Schedule from './Schedule';
import { hours, getNextEyePleasingColor, formatDate } from './constants';

const DailyPlanner = ({ tasksByHour, setTasksByHour, currentDateTime }) => {
  // states controlling addition to tasksByHour
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskHour, setNewTaskHour] = useState('6:00 AM');

  // Rest of the functions (handleTaskDrop, handleNewTaskNameChange, etc.)
  const handleTaskDrop = (taskId, oldHour, newHour, name) => {
    // Find the task in the old hour's tasks
    const oldTasks = tasksByHour[oldHour];
    const taskIndex = oldTasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      // Remove the task from the old hour's tasks
      const updatedOldTasks = [...oldTasks];
      updatedOldTasks.splice(taskIndex, 1);

      // Add the task to the new hour's tasks
      const updatedNewTasks = [...(tasksByHour[newHour] || [])];
      updatedNewTasks.push({ ...oldTasks[taskIndex] });

      // Update the tasksByHour state
      setTasksByHour({
        ...tasksByHour,
        [oldHour]: updatedOldTasks,
        [newHour]: updatedNewTasks,
      });
    }
  };

  const handleNewTaskNameChange = (event) => {
    setNewTaskName(event.target.value);
  };

  const handleAddTask = () => {
    if (newTaskName.trim() !== '') {
      // Generate a random color (hex code)
      const randomColor = getNextEyePleasingColor();

      const updatedTasksByHour = {
        ...tasksByHour,
        [newTaskHour]: [
          ...tasksByHour[newTaskHour],
          {
            id: Math.random().toString(),
            name: newTaskName,
            color: randomColor,
          },
        ],
      };

      setTasksByHour(updatedTasksByHour);
      setNewTaskName(''); // Clear the input
      setNewTaskHour('6:00 AM');
    }
  };

  const handleTaskDelete = (taskId, hour) => {
    const updatedTasks = tasksByHour[hour].filter((task) => task.id !== taskId);
    setTasksByHour({
      ...tasksByHour,
      [hour]: updatedTasks,
    });
  };

  const handleTaskUpdate = (taskId, hour, newName) => {
    const updatedTasks = tasksByHour[hour].map((task) =>
      task.id === taskId ? { ...task, name: newName } : task
    );
    setTasksByHour({
      ...tasksByHour,
      [hour]: updatedTasks,
    });
  };

  const handleTaskCopy = (id, hour, name, color) => {
    // Find the index of the current hour in the hours array
    const currentHourIndex = hours.findIndex((h) => h === hour);

    if (currentHourIndex !== -1) {
      // Find the next available empty hour
      let nextEmptyHourIndex = currentHourIndex + 1;
      while (nextEmptyHourIndex < hours.length) {
        const nextHour = hours[nextEmptyHourIndex];
        if (!tasksByHour[nextHour] || tasksByHour[nextHour].length === 0) {
          // Found an empty hour, copy the task
          const copiedTask = { id: Math.random().toString(), name, color };
          // Update the tasksByHour state
          setTasksByHour((prevTasksByHour) => ({
            ...prevTasksByHour,
            [nextHour]: [...(prevTasksByHour[nextHour] || []), copiedTask],
          }));
          return;
        }
        nextEmptyHourIndex++;
      }
    }
  };

  return (
    <div className="day-schedule">
      <h2>
        <span>Day Schedule : </span>
        <span>{formatDate(currentDateTime)}</span>
      </h2>
      <div className="input-container">
        <input
          autoFocus
          type="search"
          id="task-input"
          placeholder="Task description"
          value={newTaskName}
          onChange={handleNewTaskNameChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              document.querySelector('#task-input').focus();
              handleAddTask();
            }
          }}
        />
        {/* <select
          value={newTaskHour}
          onChange={handleNewTaskHourChange}
        >
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select> */}
        {/* <button onClick={() => {
          document.querySelector("#task-input").focus();
          handleAddTask();
        }}>Add Task</button> */}
      </div>
      <Schedule
        hours={hours}
        tasksByHour={tasksByHour}
        onTaskDrop={handleTaskDrop}
        handleTaskUpdate={handleTaskUpdate}
        handleTaskDelete={handleTaskDelete}
        handleTaskCopy={handleTaskCopy}
      />
    </div>
  );
};

export default DailyPlanner;
