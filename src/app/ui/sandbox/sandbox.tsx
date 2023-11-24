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

    const progressBar = new ProgressBar();
    let taskPosMapInit = new Map<number, [number, number]>([[0, [0, 50]], [1, [50, 100]], [2, [150, 200]]]);

    const displayNewTask = (createdTask: Task) => {
        const newTasks: Task[] = [...tasksArray.current, createdTask];
        tasksArray.current = newTasks;
        const newElementArray = progressBar.generateTaskArray(newTasks);
        console.log(newElementArray);
        dispatchNewTaskElements({
            type:"tasks_updated",
            newState: newElementArray
        })
    }

    const toggleForm = () => {
        setFormVisible(!formVisible)
    }

/*     function generateTaskArray(tasksWithNewIndices: Task[]) {
        updatePosMap(tasksWithNewIndices); // update map of the element postions based on the new indices

        const newElementArray: React.JSX.Element[] = genTaskElementArray(tasksWithNewIndices);

        setTaskElementArray(newElementArray);

    };

    function updatePosMap(tasks: Task[]) {
        const newTaskPosMap = new Map<number, [number, number]>()
        let newYPos: number = 0; //initialize new position (pixels) for the first task element

        for (let i = 0; i < tasks.length; i++) {

            let taskAtIthPosition = tasks.find(task => task.index == i)
            newTaskPosMap.set(i, [newYPos, taskAtIthPosition!.height])

            newYPos = newYPos + taskAtIthPosition!.height
        }
        posMap.current = newTaskPosMap;
    }
    function genTaskElementArray(tasks: Task[]): React.JSX.Element[] {
        const newElementArray: React.JSX.Element[] = [];
        for (let i = 0; i < tasks.length; i++) {
            let taskAtIthPosition = tasks.find(task => task.index == i)
            let taskElement: React.JSX.Element =
                <TaskRect
                    key={taskAtIthPosition!.id}
                    task={taskAtIthPosition!}
                    yPos={posMap.current.get(i)![0]}
                    positionMap={posMap.current} // this may be an issue as taskPosMap is not set at this point. Maybe it will update dynamically?
                    switchTaskIndices={switchTaskIndices}
                    color={colorArray[parseInt(taskAtIthPosition!.id)]}
                />

            newElementArray.push(taskElement);
        }

        return newElementArray;
    }

    function switchTaskIndices(task: Task, oldIndex: number, newIndex: number) {
        const newTasks: Task[] = [];
        if (newIndex < 0) newIndex = 0; // im not sure why it does this.
        if (oldIndex == newIndex) return;
        const movingDown = (oldIndex < newIndex);
        for (let i = 0; i <= tasksArray.current.length - 1; i++) {
            let newTask = tasksArray.current[i]
            if (newTask.index == oldIndex) { // if this is the selected task, move it to its new position
                newTask.index = newIndex
            }
            else if (movingDown) {
                if (newTask.index <= newIndex && newTask.index >= oldIndex) { // if the task is moving down, everything at or above the new index needs to shift upwards
                    newTask.index = tasksArray.current[i].index - 1;                // also, if the task is above where the moving task started, do nothing
                } // otherwise, the position should stay the same

            }
            else { // if the task is moving up, everything at or below the new index needs to shift down
                if (newTask.index >= newIndex && newTask.index <= oldIndex) { // also , if the task is below where the selected task started, do nothing
                    newTask.index = tasksArray.current[i].index + 1;
                }
                // everything above the new index can stay where is was
            }

            newTasks.push(newTask);
        }

        tasksArray.current = newTasks;

        generateTaskArray(newTasks)
    } */

    const posMap = useRef<Map<number, [number, number]>>(taskPosMapInit) // store the pos map in a ref so we can store changes without updating the tasks
    const tasksArray = useRef<Task[]>([dummyTasks[0], dummyTasks[1], dummyTasks[2]])

    const initialTaskElementArray =  [
        <TaskRect key={(dummyTasks[0].id)} task={dummyTasks[0]} yPos={0} positionMap={taskPosMapInit} color="red" switchTaskIndices={progressBar.switchTaskIndices} />,
        <TaskRect key={(dummyTasks[1].id)} task={dummyTasks[1]} yPos={50} positionMap={taskPosMapInit} color="blue" switchTaskIndices={progressBar.switchTaskIndices} />,
        <TaskRect key={(dummyTasks[2].id)} task={dummyTasks[2]} yPos={150} positionMap={taskPosMapInit} color="yellow" switchTaskIndices={progressBar.switchTaskIndices} />
    ]

    const [formVisible, setFormVisible] = useState<boolean>(false)

    let [taskElementArray, dispatchNewTaskElements] = useReducer(progressBar.reducer, initialTaskElementArray);


    useEffect(() => {
        progressBar.generateTaskArray(tasksArray.current)
    }, []

    );
    // Flow: move task -> switchTaskIndices -> update tasks -> generate task element array -> render new task element array
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
            <NewTaskForm toggleForm={toggleForm} displayNewTask={displayNewTask} formVisible={formVisible} />
            <ProgBar taskElementArray={taskElementArray} />
        </div>

    )
}