import React, { useState } from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";
import { findIndexOfDay } from "./constants";

const Hour = ({ hour, tasks, onTaskDrop, handleTaskUpdate, handleTaskDelete, handleTaskCopy, handleTaskDone, isActive }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: "task",
        drop: (item) => {
            // Handle the drop event here.
            // You can access both oldHour and newHour from the item object.
            console.log(item);
            const { id, oldHour, name } = item;
            // Check if the task is being dropped onto a different hour
            if (oldHour !== hour) {
                // Handle the drop event here
                onTaskDrop(id, oldHour, hour, name);
            } else {
                // Task is being dropped onto the same hour, do nothing or provide feedback
                console.log("Task cannot be dropped onto the same hour.");
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    });

    return (
        <div
            className="hour-box"
            ref={drop}
            style={{
                height: "4vh", // Adjust the height as needed
                background: isActive ? isOver ? "lightgreen" : canDrop ? "lightblue" : "white" : "lightgray",
            }}
        >
            <p className="task-hour">{hour}</p>
            {tasks.map((task) => (
                <Task
                    key={task.id}
                    task={task}
                    hour={hour}
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                    oncopy={handleTaskCopy}
                    onDone={handleTaskDone}
                />
            ))}
        </div>
    );
};

const Schedule = ({
    hours,
    tasksByHour,
    onTaskDrop,
    handleTaskUpdate,
    handleTaskDelete,
    handleTaskCopy,
    handleTaskDone,
    activeHourIndex,
    isYearSchedule = false
}) => {
    const [currentPage, setCurrentPage] = useState(activeHourIndex);
    const startIndex = currentPage;
    const endIndex = startIndex + 30;
    const visibleHours = isYearSchedule? hours.slice(startIndex, endIndex):hours;
    return (
        <div className="schedule">
            {isYearSchedule && (<div className="pagination">
                <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
                    disabled={currentPage === 0}
                >
                    Previous Days
                </button>
                <button
                    onClick={() =>
                        setCurrentPage(Math.min(currentPage + 1,364))
                    }
                    disabled={currentPage ===364}
                >
                    Next Days
                </button>
            </div>)}
            <div className="hour-box-container">
                {visibleHours.map((hour, index) => (
                    <Hour
                        key={hour}
                        hour={hour}
                        isActive={!isYearSchedule ? index >= activeHourIndex : findIndexOfDay(hour) >= activeHourIndex}
                        tasks={tasksByHour[hour] || []}
                        onTaskDrop={onTaskDrop}
                        handleTaskDelete={handleTaskDelete}
                        handleTaskUpdate={handleTaskUpdate}
                        handleTaskCopy={handleTaskCopy}
                        handleTaskDone={handleTaskDone}
                    />
                ))}
            </div>
        </div>
    );
};

export default Schedule;
