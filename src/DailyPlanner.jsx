import React, { useEffect, useState } from 'react';
import Schedule from './Schedule';
import {
  hours,
  getNextEyePleasingColor,
  formatDate,
  formatDateHour,
  findIndexOfHour,
} from './constants';

const DailyPlanner = ({ tasksByHour, setTasksByHour, currentDateTime }) => {
  // states controlling addition to tasksByHour
  const currentHour = formatDateHour(currentDateTime);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskHour, setNewTaskHour] = useState('12 AM');

  const handleAddTask = () => {
    if (newTaskName.trim() !== '') {
      const randomColor = getNextEyePleasingColor();
      // schedules task at 12AM by default -it is dragged to appropiiate hour later
      const updatedTasksByHour = {
        ...tasksByHour,
        [newTaskHour]: [
          ...tasksByHour[newTaskHour],
          {
            id: Math.random().toString(),
            name: newTaskName,
            isDone: false,
            color: randomColor,
          },
        ],
      };

      setTasksByHour(updatedTasksByHour); // replcae state with new state
      //reset inputs
      setNewTaskName('');
      setNewTaskHour('12 AM');
    }
  };

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

  const handleTaskUpdate = (taskId, hour, newName) => {
    const updatedTasks = tasksByHour[hour].map((task) =>
      task.id === taskId ? { ...task, name: newName } : task
    );
    setTasksByHour({
      ...tasksByHour,
      [hour]: updatedTasks,
    });
  };

  const handleTaskDelete = (taskId, hour) => {
    const updatedTasks = tasksByHour[hour].filter((task) => task.id !== taskId);
    setTasksByHour({
      ...tasksByHour,
      [hour]: updatedTasks,
    });
  };

  const handleTaskCopy = (id, hour, name, color, done) => {
    // Find the index of the current hour in the hours array
    const currentHourIndex = hours.findIndex((h) => h === hour);

    if (currentHourIndex !== -1) {
      // Find the next available empty hour
      let nextEmptyHourIndex = currentHourIndex + 1;
      while (nextEmptyHourIndex < hours.length) {
        const nextHour = hours[nextEmptyHourIndex];
        if (!tasksByHour[nextHour] || tasksByHour[nextHour].length === 0) {
          // Found an empty hour, copy the task
          const copiedTask = {
            id: Math.random().toString(),
            name,
            color,
            done,
          };
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

  const handleTaskDone = (id, hour, name, color, done) => {
    const updatedTasks = tasksByHour[hour].map((task) =>
      task.id === id ? { ...task, isDone: true } : task
    );

    setTasksByHour({
      ...tasksByHour,
      [hour]: updatedTasks,
    });
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
          onChange={(event) => {
            setNewTaskName(event.target.value);
          }}
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
        handleTaskDone={handleTaskDone}
        activeHourIndex={findIndexOfHour(currentHour)}
      />
    </div>
  );
};

export default DailyPlanner;

/**
 *
 *  <Schedule
        hours={hours.filter(
          (hour, index) => index >= findIndexOfHour(currentHour)
        )}
        tasksByHour={tasksByHour}
        onTaskDrop={handleTaskDrop}
        handleTaskUpdate={handleTaskUpdate}
        handleTaskDelete={handleTaskDelete}
        handleTaskCopy={handleTaskCopy}
        handleTaskDone={handleTaskDone}
      />
 *
 */
