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


export default function Sandbox() {
    const progMapInit = new Map<string, Task[]>();
    progMapInit.set("a", [dummyTasks[0], dummyTasks[1], dummyTasks[2]]);
    progMapInit.set("b", [dummyTasks[3], dummyTasks[4], dummyTasks[5]]);
    const progBarsMap = useRef<Map<string, Task[]>>(progMapInit);

    function addTask(progBarId: string, task: Task): Task[]{
        const newProgBarMap = progBarsMap;
        const newTaskArray = [...progBarsMap.current.get(progBarId)!, task];
        newProgBarMap.current.set(progBarId, newTaskArray);
        return newTaskArray
    }

    function switchTaskIndices(oldIndex: number, newIndex: number, progBarId: string): Task[]{
        const newTasks: Task[] = [];
        const progBarTasks: Task[] = progBarsMap.current.get(progBarId)!
        if (newIndex < 0) newIndex = 0; // im not sure why it does 
        const movingDown = (oldIndex < newIndex);
        for (let i = 0; i < progBarTasks.length; i++) {
            let newTask = progBarTasks[i];
            if (newTask.index == oldIndex) { // if this is the selected task, move it to its new position
                newTask.index = newIndex
            }
            else if (movingDown) {
                if (newTask.index <= newIndex && newTask.index >= oldIndex) { // if the task is moving down, everything at or above the new index needs to shift upwards
                    newTask.index = progBarTasks[i].index - 1;                // also, if the task is above where the moving task started, do nothing
                } // otherwise, the position should stay the same
    
            }
            else if (!movingDown){ // if the task is moving up, everything at or below the new index needs to shift down
                if (newTask.index >= newIndex && newTask.index <= oldIndex) { // also , if the task is below where the selected task started, do nothing
                    newTask.index = progBarTasks[i].index + 1;
                }
                // everything above the new index can stay where is was
            }
    
            newTasks.push(newTask);
        }
        progBarsMap.current.set(progBarId, newTasks)
        return newTasks;
    }

    const [formVisible, setFormVisible] = useState<boolean>(false)
    const toggleForm = () => {
        setFormVisible(!formVisible)
    }
  
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
            <div style={{"display": "flex", "justifyContent": "center"}}>
                <ProgBar id={"a"} tasks={progBarsMap.current.get("a") || [] }  addTask={addTask} switchTaskIndices={switchTaskIndices} />
            </div>
           
        </div>

    )
}