import React, { useState } from "react";
import { Task } from "../lib/definitions";
import { boolean } from "zod";
export default function TaskRect({task, controlTaskDrag}: {
    task: Task,
    controlTaskDrag: (event: React.MouseEvent, pageGrab : () => void) => void
}){

    const [isBeingDragged, setIsBeingDragged] = useState(false);

    if (isBeingDragged) console.log("Im being dragged");

    const grabTask= (event: React.MouseEvent) => {
        const options : AddEventListenerOptions = {
            capture: true
        }
        setIsBeingDragged(true);
        document.addEventListener("mousemove", function grab(){
            controlTaskDrag(event, grab);
        })
        
    }
    const dropTask = (event: React.MouseEvent) => {
        setIsBeingDragged(false);
        
        console.log("you dropped me!")
    }
    const viewDetails = (event: React.MouseEvent) => {
        
            if(event.currentTarget){
                const selectedTask = event.currentTarget as HTMLDivElement;
                if (selectedTask.getAttribute("data-open") == 'false'){
                    const descriptionRow: HTMLDivElement = document.createElement("div");
                    descriptionRow.textContent = task.description.toString();
                    selectedTask.appendChild(descriptionRow);
                    selectedTask.setAttribute("data-open", 'true');
                }else{
                    const descriptionRow = selectedTask.firstElementChild;
                    if (descriptionRow) selectedTask.removeChild(descriptionRow);
                    selectedTask.setAttribute("data-open", 'false');
                }
                
            }
            event.preventDefault();
    }
    return (
        <div 
        className="task-rect" 
        draggable="true" 
        onClick={viewDetails} 
        data-open='false'
        onMouseDown={grabTask}
        >
            {task.name}
        </div>
    )
}