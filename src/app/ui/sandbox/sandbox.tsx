'use client';

import "../../styles/task-button.css";
import "../../styles/taskRect.css";
import "../../styles/task-form.css";
import "../../styles/topbar.css";
import "../../styles/prog-bar.css";
import "../../styles/sandbox-body.css";
import { EventHandler, useEffect, useReducer, useRef, useState } from "react";
import TaskRect from "./taskRect";
import { colorArray, dummyTasks } from "@/app/data/dummy_data";
import { ProgBarTask, Role, Task, User } from "@/app/lib/definitions/types";
import NewTaskForm from "./newTaskForm";
import ProgBar from "./progBar";


export default function Sandbox() {
    const progMapInit = new Map<string, Task[]>();
    progMapInit.set("a", [dummyTasks[0], dummyTasks[1], dummyTasks[2]]);
    progMapInit.set("b", [dummyTasks[3], dummyTasks[4], dummyTasks[5]]);
    const [progBarsMap, setProgBarsMap] = useState<Map<string, Task[]>>(progMapInit);

    const [openTask, setOpenTask]= useState<ProgBarTask>()

    function viewTask(task: ProgBarTask): void{
        let modal: HTMLDialogElement = document.getElementById("task-modal") as HTMLDialogElement;
        setOpenTask(task);
        modal.showModal();
    }


    function addTask(progBarId: string, task: Task): Task[]{
        const newProgBarMap = new Map(progBarsMap);
        const newTaskArray = [...progBarsMap.get(progBarId)!, task];
        newProgBarMap.set(progBarId, newTaskArray);
        setProgBarsMap(newProgBarMap);
        return newTaskArray
    }

    function switchTaskIndices(oldIndex: number, newIndex: number, progBarId: string): Task[]{
        const newTasks: Task[] = [];
        const progBarTasks: Task[] = progBarsMap.get(progBarId)!
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
        let newProgBarsMap = new Map(progBarsMap);
        newProgBarsMap.set(progBarId, newTasks)
        setProgBarsMap(newProgBarsMap);
        return newTasks;
    }

    const [formVisible, setFormVisible] = useState<boolean>(false)
    const toggleForm = () => {
        setFormVisible(!formVisible)
    }
    const [openTaskFormData, setOpenTaskFormData] = useState({openTaskName: "", openTaskDescription: "" ,openTaskOwner: {username: "", role: Role.other}, openTaskSize: 50});
    
    const updateOpenTaskForm = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const inputKey: string = e.target.name;
        const inputValue: string = e.target.value;
        const newData = {...openTaskFormData }
        switch (inputKey) {
            case 'openTaskName':
                newData.openTaskName = inputValue
                break;
            case 'openTaskDescription':
                newData.openTaskDescription = inputValue
                break;
            case 'openTaskOwner':
                newData.openTaskOwner = {username: inputValue, role: Role.other}
                break;
            case 'openTaskSize':
                newData.openTaskSize = parseInt(inputValue)
                break;
            default:
                break;
        }
        
        setOpenTaskFormData(newData);
    }
    function updateProgBarsMap(formData: {openTaskName: string, openTaskDescription: string, openTaskOwner: User, openTaskSize: number}, openTask: ProgBarTask){
        let newTask : Task = {
            id: openTask.id,
            name: formData.openTaskName,
            description: formData.openTaskDescription,
            owner: formData.openTaskOwner,
            size: formData.openTaskSize,
            index: openTask.index
        }
        let updatedTaskArray =  [...progBarsMap.get(openTask.id.split('-')[0])!];
        let taskIndex = updatedTaskArray.findIndex(element => element.id == openTask.id);
        updatedTaskArray[taskIndex] = newTask;
        let newProgBarsMap = new Map(progBarsMap);
        newProgBarsMap.set((openTask.id.split('-')[0]), updatedTaskArray);
        setProgBarsMap(newProgBarsMap);
        document.getElementById(openTask.id)!.textContent = formData.openTaskName
    }
    useEffect(() => {
        if(openTask){
            setOpenTaskFormData({ openTaskName: openTask.name, openTaskDescription: openTask.description, openTaskOwner: openTask.owner, openTaskSize: openTask.size })
        } 
    }, [openTask])
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
                <ProgBar id={"a"} tasks={progBarsMap.get("a") || [] }  addTask={addTask} switchTaskIndices={switchTaskIndices} viewTask = {viewTask} />
            </div>
           <dialog id="task-modal" >
            <div onClick={()=> {
                let modal = document.getElementById('task-modal') as HTMLDialogElement
                
                updateProgBarsMap(openTaskFormData, openTask!)
                modal.close()
                console.log(progBarsMap)
            }}>CLOSE</div>
                    <div id="modal-body">
                        <form>
                            <div className="open-task-form-body">
                                <div>
                                    <label htmlFor="openTaskName">Name: </label>
                                    <input
                                        type="text" 
                                        id="openTaskName" 
                                        name="openTaskName" 
                                        value={openTaskFormData['openTaskName']}
                                        onChange={updateOpenTaskForm}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="openTaskDescription">Description: </label>
                                    <input 
                                        type="text" 
                                        id="openTaskDescription" 
                                        name="openTaskDescription"  
                                        value={openTaskFormData['openTaskDescription']}
                                        onChange={updateOpenTaskForm}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="openTaskOwner">Owner: </label>
                                    <input 
                                        type="text" 
                                        id="openTaskOwner" 
                                        name="openTaskOwner"  
                                        value={openTaskFormData['openTaskOwner'].username}
                                        onChange={updateOpenTaskForm}
                                    />
                                </div>
                               <div>
                                <label htmlFor="openTaskSize">Size: </label>
                                <input 
                                    type="text" 
                                    id="openTaskSize" 
                                    name="openTaskSize"  
                                    value={openTaskFormData['openTaskSize']}
                                    onChange={updateOpenTaskForm}
                                    />    
                               </div>
                               
                            </div>
                            
                        </form>
                    </div>
           </dialog>
        </div>

    )
}