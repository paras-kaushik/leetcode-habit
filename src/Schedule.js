import React from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";

const Hour = ({ hour, tasks, onTaskDrop, handleTaskUpdate, handleTaskDelete, handleTaskCopy }) => {
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
                background: isOver ? "lightgreen" : canDrop ? "lightblue" : "white",
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
                />
            ))}
        </div>
    );
};

const Schedule = ({ hours, tasksByHour, onTaskDrop, handleTaskUpdate, handleTaskDelete, handleTaskCopy }) => {
    return (
        <div className="schedule">
            {hours.map((hour) => (
                <Hour
                    key={hour}
                    hour={hour}
                    tasks={tasksByHour[hour] || []}
                    onTaskDrop={onTaskDrop}
                    handleTaskDelete={handleTaskDelete}
                    handleTaskUpdate={handleTaskUpdate}
                    handleTaskCopy={handleTaskCopy}
                />
            ))}
        </div>
    );
};

export default Schedule;
