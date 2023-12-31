/*global chrome*/
import React from 'react';
import TodoList from './TodoList';
import DailyPlanner from './DailyPlanner';
import { useState, useEffect } from 'react';
import {
  beep,
  findIndexOfHour,
  formatDate,
  initialTasksByHour,
} from './constants';

const Dayview = () => {
  const [tasksByHour, setTasksByHour] = useState(initialTasksByHour);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasksByHour');
    if (storedTasks) {
      setTasksByHour(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasksByHour', JSON.stringify(tasksByHour));
  }, [tasksByHour]);

  // useEffect(() => {
  //   chrome.storage.sync.get(['tasksByHour'], (result) => {
  //     const storedTasks = result.tasksByHour;
  //     if (storedTasks) {
  //       setTasksByHour(JSON.parse(storedTasks));
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   chrome.storage.sync.set({ tasksByHour: JSON.stringify(tasksByHour) });
  // }, [tasksByHour]);

  useEffect(() => {
    const updateDateTime = () => {
      setCurrentDateTime(new Date());
    };
    const intervalId = setInterval(updateDateTime, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="app-container">
      <DailyPlanner
        tasksByHour={tasksByHour}
        setTasksByHour={setTasksByHour}
        currentDateTime={currentDateTime}
      />
      <TodoList setTasksByHour={setTasksByHour} />
    </div>
  );
};

export default Dayview;
