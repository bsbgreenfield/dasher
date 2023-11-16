import React from "react";
import { Task } from "../lib/definitions";
export default function TaskRect({task}: {task: Task}){
    const viewDetails = (event: React.MouseEvent) => {
            console.log("HELLO")
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
        <div className="task-rect" draggable="true" onClick={viewDetails} data-open='false'>
            {task.name}
        </div>
    )
}