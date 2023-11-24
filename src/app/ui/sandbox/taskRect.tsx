
import {Task} from "../../lib/definitions/types";
import {Draggable  } from "../../lib/definitions/task-rect";
import { Dispatch } from "react";
export default function TaskRect({
    task, 
    yPos, 
    positionMap, 
    switchTaskIndices,
    dispatchNewTaskElements, 
    color,
            }: {
    task: Task,
    yPos: number,
    positionMap: Map<number, [number, number]>,
    switchTaskIndices: (task: Task, oldIndex: number, newIndex: number) => void,
    dispatchNewTaskElements: Dispatch<{
        type: String;
        newState: any;
    }>
    color: string,
}){
    
    const draggableDiv = new Draggable();
    // in posMap: value[0] = yPos, value[1] = height
    const calculateNewIndex = (newPos: {newX: number, newY: number}): number =>{
        let newIndex = task.index;
        const BreakException = {};
        const finalPosMapVal = positionMap.get(positionMap.size - 1)
        if ( finalPosMapVal  && newPos.newY > finalPosMapVal[0]  ) return (positionMap.size - 1) // check if moving all the wy to the end
        try{
            if(newPos.newY > yPos){ // moving down
                positionMap.forEach(function(value, key){
                    if(newPos.newY + task.height > (value[0] + value[1])){// if the bottom of the selected task is below  the bottom of the mapped task bottom
                        newIndex = key ; // keep setting until we find something its not below
                    } 
                })  
            }
            else{ // moving up
                positionMap.forEach(function(value, key){
                    if(newPos.newY <= value[0]){
                        newIndex = key  ;
                        throw BreakException; // short foreach loop to get the first key
                    } 
                })  
            }
           
        } catch(e){
            if (e!== BreakException){
                throw e;
            }
        }
       
       
        return newIndex
    }
    const grabTask = async (evt: React.MouseEvent) => {
        const thisDiv = document.getElementById(task.id) as HTMLDivElement;
        const progBar = thisDiv.parentElement as HTMLDivElement;
        if(thisDiv){
            thisDiv.style.zIndex = "5";
            draggableDiv.startMoving(thisDiv, thisDiv.parentElement as HTMLDivElement, evt, {x: 0, y: yPos});
            const stopMove = () => {
                thisDiv.style.zIndex = "0";
                let newPos = draggableDiv.stopMoving(progBar, thisDiv)
                thisDiv.removeEventListener("mouseup", stopMove)
                let newIndex = task.index;
                if (newPos){
                     newIndex =  calculateNewIndex(newPos);
                } 
              
                const newElementArray =  switchTaskIndices(task, task.index, newIndex);
                dispatchNewTaskElements({
                    type:"tasks_updated",
                    newState: newElementArray
            });
            
            thisDiv.addEventListener("mouseup", stopMove);
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
                } else{
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
        data-open='false'
        onMouseDown={grabTask}
        style={{"top" : yPos, "backgroundColor": color, "height": task.height}}
        >
            {task.name}
        </div>
    )
}