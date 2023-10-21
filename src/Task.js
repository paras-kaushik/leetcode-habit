import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { contrastColor } from "./constants";

const Task = ({ task, hour, onDelete, onUpdate, oncopy, onDone }) => {
    const [{ isDragging }, drag] = useDrag({
        type: "task",
        item: { id: task.id, name: task.name, oldHour: hour },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const [isEditing, setIsEditing] = useState(false);
    const [updatedName, setUpdatedName] = useState(task.name);

    const handleCopy = () => {
        oncopy(task.id, hour, task.name, task.color, task.done)
    }

    const handleTaskDone = () => {
        onDone(task.id, hour, task.name, task.color, task.done);
    }

    const handleDelete = () => {
        onDelete(task.id, hour);
    };

    const handleUpdate = () => {
        onUpdate(task.id, hour, updatedName);
        setIsEditing(false);
    };



    return (
        <div
            className="task-box"
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: "move",
                border: "1px solid #ccc",
                padding: "8px",
                color: contrastColor(task.color),
                background: `${task.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                />
            ) : (
                <div>{task.name}</div>
            )}
            <div className="task-icons">
                {!task.isDone && (<i onClick={handleTaskDone} class="fa-solid fa-check"></i>)}
                {!task.isDone && (<i onClick={handleCopy} class="fa-solid fa-clone"></i>)}

                {!task.isDone ?
                    isEditing ? (
                        <i onClick={handleUpdate} class="fas fa-save" ></i>
                    ) : (
                        <i onClick={() => setIsEditing(true)} class="fas fa-edit"></i>
                    ) : null}

                <i onClick={handleDelete} class="fa fa-trash" aria-hidden="true"></i>

            </div>
        </div >
    );
};

export default Task;
