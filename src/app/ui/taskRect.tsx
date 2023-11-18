
import { Task, iDraggable, Draggable  } from "../lib/definitions";
export default function TaskRect({task, index, yPos}: {
    task: Task,
    index: number,
    yPos: number,
}){
    
   
    const draggableDiv = new Draggable();
    
    const grabTask = (evt: React.MouseEvent) => {
        const thisDiv = document.getElementById(task.id) as HTMLDivElement;
        thisDiv.parentElement?.addEventListener("mouseup",() => draggableDiv.stopMoving);
        if(thisDiv){
            draggableDiv.startMoving(thisDiv, thisDiv.parentElement as HTMLDivElement, evt)
        }
       
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
        id={task.id}
        className="task-rect" 
        onClick={viewDetails} 
        data-open='false'
        onMouseDown={grabTask}
        style={{"top" : yPos}}
        >
            {task.name}
        </div>
    )
}