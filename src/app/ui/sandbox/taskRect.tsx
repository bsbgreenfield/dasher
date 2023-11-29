
import {Task} from "../../lib/definitions/types";
import {Draggable  } from "../../lib/definitions/task-rect";
export default function TaskRect({
    task, 
    yPos, 
    height,
    positionMap,
    swap,
    color,
            }: {
    task: Task,
    yPos: number,
    height: number,
    positionMap: Map<number, [number, number]>
    swap: (oldIndex: number, newIndex: number) => Map<number, [number, number]>,
    color: string,
}){
    let dragged: boolean = false;
    const draggableDiv = new Draggable();
    // in posMap: value[0] = yPos, value[1] = height

    function TID(fullId: string): number { // "Task ID"
        return parseInt(fullId.split('-').pop()!);
    }
    const calculateNewIndex = (newPos: {newX: number, newY: number}): number =>{
        let newIndex = task.index;
        const BreakException = {};
        try{
            if(newPos.newY > yPos ){ // moving down
                positionMap.forEach(function(value, key){
                    if(value[0] > yPos){ // only valid if other div started below selected div
                        if((newPos.newY + task.height > (value[0] + value[1]))){// if the bottom of the selected task is below  the bottom of the mapped task bottom
                            console.log(`${newPos.newY + task.height} is greater than ${value[0] + value[1]}`)
                            newIndex = key; // keep setting until we find something its not below
                            
                        } 
                    }
                })  
            }
            else{ // moving up
                positionMap.forEach(function(value, key){
                    if(value[0]< yPos){ // only valid if the other div started above selected div
                        console.log(`${key} started above ${yPos}`)
                        if((newPos.newY < (value[0] + 5))){
                            newIndex = key;
                            console.log(`new index of ${task.id} is ${key}`)
                            throw BreakException; // short foreach loop to get the first key
                    }
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
    const grabTask = async () => {
        const thisDiv = document.getElementById(task.id) as HTMLDivElement;
        const progBar = thisDiv.parentElement as HTMLDivElement;
        if(thisDiv){
            thisDiv.style.zIndex = "40";
            draggableDiv.startMoving(thisDiv, thisDiv.parentElement as HTMLDivElement, {xPos: 0, yPos: yPos});
            const stopMove = () => {
                thisDiv.removeEventListener("mousemove", activePostion);
                thisDiv.style.zIndex = "0";
                let newPos = draggableDiv.stopMoving(progBar, thisDiv);
                thisDiv.removeEventListener("mouseup", stopMove)
                
                
                let newIndex =  calculateNewIndex(newPos!);
                
                const newPosArray = swap(task.index, newIndex);
                draggableDiv.move(thisDiv, progBar.clientWidth/2 - thisDiv.clientWidth/2, newPosArray.get(task.index)![0]);
                dragged = false;
            };
            const activePostion = (e: MouseEvent) =>{
                if(!dragged){ 
                    thisDiv.style.zIndex = "5";
                    let newPos = draggableDiv.stopMoving(progBar, thisDiv);
                    let newIndex = calculateNewIndex(newPos!);
                    if( newIndex !== task.index){
                        swap(task.index, newIndex);
                        task.index = newIndex;
                        dragged = false;
                    }
                }
            }
            thisDiv.addEventListener("mouseup", stopMove);
            thisDiv.addEventListener("mousemove", activePostion)
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
        style={
            {"top" : yPos, 
            "backgroundColor": color, 
            "height": height}
        }
        >
            {task.name}
        </div>
    )
}