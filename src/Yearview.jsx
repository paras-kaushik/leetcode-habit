/*global chrome*/
import React, { useState, useEffect } from 'react';
import { days, getCurrentDay, tasksByDay as inittbd } from './constants';
import YearPlanner from './YearPlanner';
import TodoList from './TodoList';

const Yearview = () => {
  const [tasksByDay, setTasksByDay] = useState(inittbd);
  const [currentDay, setCurrentDay] = useState(getCurrentDay());

  useEffect(() => {
    chrome.storage.sync.get(['tasksByDay'], (result) => {
      const storedTasks = result.tasksByDay;
      if (storedTasks) {
        setTasksByDay(JSON.parse(storedTasks));
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.set({ tasksByDay: JSON.stringify(tasksByDay) });
  }, [tasksByDay]);

  useEffect(() => {
    const updateDateTime = () => {
      setCurrentDay(getCurrentDay());
    };
    const intervalId = setInterval(updateDateTime, 1000*60*60);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="app-container app-container-year">
      <YearPlanner
        tasksByDay={tasksByDay}
        setTasksByDay={setTasksByDay}
        currentDay={currentDay}
      />
    </div>
  );
};

export default Yearview;
