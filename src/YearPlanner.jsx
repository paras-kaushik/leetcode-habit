import React ,{useState} from 'react'
import { days, findIndexOfDay, getNextEyePleasingColor } from './constants';
import Schedule from './Schedule';

const YearPlanner = ({ tasksByDay, setTasksByDay, currentDay }) => {
    const [newTaskName, setNewTaskName] = useState('');

      const handleAddTask = () => {
        if (newTaskName.trim() !== '') {
          const randomColor = getNextEyePleasingColor();
          const updatedTasksByDay = {
            ...tasksByDay,
            [currentDay]: [
              ...tasksByDay[currentDay],
              {
                id: Math.random().toString(),
                name: newTaskName,
                isDone: false,
                color: randomColor,
              },
            ],
          };

          setTasksByDay(updatedTasksByDay);
          setNewTaskName('');
        }
      };

      const handleTaskDrop = (taskId, oldDay, newDay, name) => {
        const oldTasks = tasksByDay[oldDay];
        const taskIndex = oldTasks.findIndex((task) => task.id === taskId);

        if (taskIndex !== -1) {
          const updatedOldTasks = [...oldTasks];
          updatedOldTasks.splice(taskIndex, 1);

          const updatedNewTasks = [...(tasksByDay[newDay] || [])];
          updatedNewTasks.push({ ...oldTasks[taskIndex] });

          setTasksByDay({
            ...tasksByDay,
            [oldDay]: updatedOldTasks,
            [newDay]: updatedNewTasks,
          });
        }
      };

      const handleTaskUpdate = (taskId, day, newName) => {
        const updatedTasks = tasksByDay[day].map((task) =>
          task.id === taskId ? { ...task, name: newName } : task
        );
        setTasksByDay({
          ...tasksByDay,
          [day]: updatedTasks,
        });
      };

      const handleTaskDelete = (taskId, day) => {
        const updatedTasks = tasksByDay[day].filter(
          (task) => task.id !== taskId
        );
        setTasksByDay({
          ...tasksByDay,
          [day]: updatedTasks,
        });
      };

      const handleTaskCopy = (id, day, name, color, done) => {

        const currentDayIndex = days.findIndex((h) => h === day);

        if (currentDayIndex !== -1) {

          let nextEmptyDayIndex = currentDayIndex + 1;
          while (nextEmptyDayIndex < days.length) {
            const nextDay = days[nextEmptyDayIndex];
            if (!tasksByDay[nextDay] || tasksByDay[nextDay].length === 0) {

              const copiedTask = {
                id: Math.random().toString(),
                name,
                color,
                done,
              };

              setTasksByDay((prevTasksByDay) => ({
                ...prevTasksByDay,
                [nextDay]: [...(prevTasksByDay[nextDay] || []), copiedTask],
              }));
              return;
            }
            nextEmptyDayIndex++;
          }
        }
      };

      const handleTaskDone = (id, day, name, color, done) => {
        const updatedTasks = tasksByDay[day].map((task) =>
          task.id === id ? { ...task, isDone: true } : task
        );

        setTasksByDay({
          ...tasksByDay,
          [day]: updatedTasks,
        });
      };

  return (
    <div className="day-schedule">
      <h2>
        <span>Day Schedule : </span>
        <span>{currentDay}</span>
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
      </div>
      <Schedule
        hours={days}
        tasksByHour={tasksByDay}
        onTaskDrop={handleTaskDrop}
        handleTaskUpdate={handleTaskUpdate}
        handleTaskDelete={handleTaskDelete}
        handleTaskCopy={handleTaskCopy}
        handleTaskDone={handleTaskDone}
        activeHourIndex={findIndexOfDay(currentDay)}
        isYearSchedule={true}
      />
    </div>
  );
};

export default YearPlanner
