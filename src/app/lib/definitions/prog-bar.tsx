import { Dispatch, useRef } from "react";
import { Task } from "./types";
import { colorArray, dummyTasks } from "@/app/data/dummy_data";
import TaskRect from "@/app/ui/sandbox/taskRect";

export default class ProgressBar{
    
    private taskPosMapInit = new Map<number, [number, number]>([[0, [0, 50]], [1, [50, 100]], [2, [150, 200]]]);
    public posMap = useRef<Map<number, [number, number]>>(this.taskPosMapInit); // store the pos map in a ref so we can store changes without updating the tasks
    public tasksArray = useRef<Task[]>([dummyTasks[0], dummyTasks[1], dummyTasks[2]]);
    private dispatchNewTaskElements;
    public currentTaskElementArray: React.JSX.Element[] = [];
    constructor(
        dispatchNewTaskElements: Dispatch<{type: String, newState: React.JSX.Element[]}>,
        ) {
        this.switchTaskIndices = this.switchTaskIndices.bind(this);
        this.dispatchNewTaskElements = dispatchNewTaskElements;
    }
    displayNewTask = (createdTask: Task) => {
        const newTasks: Task[] = [...this.tasksArray.current, createdTask];
        this.tasksArray.current = newTasks;
        this.generateTaskArray(newTasks);
    }
   
    generateTaskArray(tasksWithNewIndices: Task[]): React.JSX.Element[] {
        const newTaskPosMap = this.getUpdatedPosMap(tasksWithNewIndices); // update map of the element postions based on the new indices
        this.posMap.current = newTaskPosMap;
        const newElementArray: React.JSX.Element[] = this.genTaskElementArray(tasksWithNewIndices);
        this.dispatchNewTaskElements(
            {
                type:"tasks_updated",
                newState:newElementArray
            });
            this.currentTaskElementArray = newElementArray;
            return newElementArray;
    };

     getUpdatedPosMap(tasks: Task[]): Map<number, [number, number]> {
        const newTaskPosMap = new Map<number, [number, number]>()
        let newYPos: number = 0; //initialize new position (pixels) for the first task element

        for (let i = 0; i < tasks.length; i++) {

            let taskAtIthPosition = tasks.find(task => task.index == i)
            newTaskPosMap.set(i, [newYPos, taskAtIthPosition!.height])

            newYPos = newYPos + taskAtIthPosition!.height
        }
        return newTaskPosMap;
       
    }
     genTaskElementArray(tasks: Task[]): React.JSX.Element[] {
        const newElementArray: React.JSX.Element[] = [];
        for (let i = 0; i < tasks.length; i++) {
            let taskAtIthPosition = tasks.find(task => task.index == i);
            let taskElement: React.JSX.Element =
                <TaskRect
                    key={taskAtIthPosition!.id}
                    task={taskAtIthPosition!}
                    yPos={this.posMap.current.get(i)![0]}
                    positionMap={this.posMap.current} // this may be an issue as taskPosMap is not set at this point. Maybe it will update dynamically?
                    switchTaskIndices={this.switchTaskIndices}
                    color={colorArray[parseInt(taskAtIthPosition!.id)]}
                />

            newElementArray.push(taskElement);
        }

        return newElementArray;
    }

     switchTaskIndices(oldIndex: number, newIndex: number): React.JSX.Element[] | null{
       let newTasks = this.calculateNewTaskIndices(oldIndex, newIndex);

        this.tasksArray.current = newTasks;

        return this.generateTaskArray(newTasks)
    }

    calculateNewTaskIndices(oldIndex: number, newIndex: number): Task[]{
        const newTasks: Task[] = [];
        if (newIndex < 0) newIndex = 0; // im not sure why it does this.
        const movingDown = (oldIndex < newIndex);
        for (let i = 0; i <= this.tasksArray.current.length - 1; i++) {
            let newTask = this.tasksArray.current[i]
            if (newTask.index == oldIndex) { // if this is the selected task, move it to its new position
                newTask.index = newIndex
            }
            else if (movingDown) {
                if (newTask.index <= newIndex && newTask.index >= oldIndex) { // if the task is moving down, everything at or above the new index needs to shift upwards
                    newTask.index = this.tasksArray.current[i].index - 1;                // also, if the task is above where the moving task started, do nothing
                } // otherwise, the position should stay the same

            }
            else if (!movingDown){ // if the task is moving up, everything at or below the new index needs to shift down
                if (newTask.index >= newIndex && newTask.index <= oldIndex) { // also , if the task is below where the selected task started, do nothing
                    newTask.index = this.tasksArray.current[i].index + 1;
                }
                // everything above the new index can stay where is was
            }

            newTasks.push(newTask);
        }
        return newTasks;
    }
}