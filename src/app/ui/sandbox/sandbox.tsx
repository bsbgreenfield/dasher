'use client';

import "../../styles/task-button.css";
import "../../styles/taskRect.css";
import "../../styles/task-form.css";
import "../../styles/topbar.css";
import "../../styles/prog-bar.css";
import "../../styles/sandbox-body.css";
import { useEffect, useReducer, useRef, useState } from "react";
import TaskRect from "./taskRect";
import { colorArray, dummyTasks } from "@/app/data/dummy_data";
import { Task } from "@/app/lib/definitions/types";
import NewTaskForm from "./newTaskForm";
import ProgBar from "./progBar";
import ProgressBar from "@/app/lib/definitions/prog-bar";

export default function Sandbox() {

    let [taskElementArray, dispatchNewTaskElements] = useReducer(reducer, []);
    const progressBar = new ProgressBar(dispatchNewTaskElements);

    const [formVisible, setFormVisible] = useState<boolean>(false)
    const toggleForm = () => {
        setFormVisible(!formVisible)
    }

    const tasksArrayInit = [dummyTasks[0], dummyTasks[1], dummyTasks[2]];
    useEffect(() => {
        progressBar.generateTaskArray(tasksArrayInit)
    }, []);

    function reducer(state: any, action: { type: String, newState: any }) {
        switch (action.type) {
            case "tasks_updated": {
                return action.newState
            }
        }
    };
    
    return (
        <div>
            <div className="top-bar">
                <div className="task-button"
                    onClick={!formVisible ?
                        () => setFormVisible(true)
                        : () => setFormVisible(false)
                    }>
                    {formVisible ? "Cancel" : "Create new Task"}
                </div>
            </div>
            <NewTaskForm toggleForm={toggleForm} displayNewTask={progressBar.displayNewTask} formVisible={formVisible} />
            <ProgBar taskElementArray={taskElementArray} />
        </div>

    )
}