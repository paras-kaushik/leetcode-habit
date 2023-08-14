/*global chrome*/
import React from 'react';
import TodoList from './TodoList';
import DailyPlanner from './DailyPlanner';
import { useState, useEffect } from 'react';
import { initialTasksByHour } from './constants';

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
  //Load tasks from chrome.storage.sync when the component mounts

  // useEffect(() => {
  //   chrome.storage.sync.get(['tasksByHour'], (result) => {
  //     const storedTasks = result.tasksByHour;
  //     if (storedTasks) {
  //       setTasksByHour(JSON.parse(storedTasks));
  //     }
  //   });
  // }, []);

  // // Save tasks to chrome.storage.sync whenever it changes
  // useEffect(() => {
  //   chrome.storage.sync.set({ tasksByHour: JSON.stringify(tasksByHour) });
  // }, [tasksByHour]);

  useEffect(() => {
    // Function to update the current date and time
    const updateDateTime = () => {
      setCurrentDateTime(new Date());
    };

    // Set an interval to update the date and time every second
    const intervalId = setInterval(updateDateTime, 1000);

    // Clean up the interval on component unmount
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
