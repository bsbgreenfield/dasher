
import {Task} from "../../lib/definitions/types";
import {Draggable  } from "../../lib/definitions/task-rect";
export default function TaskRect({
    task, 
    pos, 
    height,
    positionMap,
    swap,
    color,
            }: {
    task: Task,
    pos: {xPos: number, yPos: number},
    height: number,
    positionMap: Map<number, [number, number]>
    swap: (oldIndex: number, newIndex: number) => Map<number, [number, number]>,
    color: string,
}){
    const draggableDiv = new Draggable();
    // in posMap: value[0] = yPos, value[1] = height

    const calculateNewIndex = (newPos: {newX: number, newY: number}, movingDown: boolean): number =>{
        let newIndex = task.index;
        positionMap.forEach((value, key) => {
            if(movingDown){
                if ( task.index < key && newPos.newY + height > value[0] + value[1]){
                    newIndex = key;
                }
            }
            else{
                if(task.index > key && newPos.newY < value[0] + 5){
                    newIndex = key;
                }
            }
        })
        return newIndex
    }
    const grabTask = async () => {
        let x= pos.xPos; let y = pos.yPos;
        const thisDiv = document.getElementById(task.id) as HTMLDivElement;
        const progBar = thisDiv.parentElement as HTMLDivElement;
        if(thisDiv){
            thisDiv.style.zIndex = "40";
            draggableDiv.startMoving(thisDiv, thisDiv.parentElement as HTMLDivElement, pos);
            const stopMove = () => {
                thisDiv.removeEventListener("mousemove", activePostion);
                thisDiv.style.zIndex = "0";
                let newPos = draggableDiv.stopMoving(progBar, thisDiv);
                thisDiv.removeEventListener("mouseup", stopMove)
    
                let newIndex =  calculateNewIndex(newPos!, true);
                const newPosArray = swap(task.index, newIndex);
                draggableDiv.move(thisDiv, progBar.clientWidth/2 - thisDiv.clientWidth/2, newPosArray.get(task.index)![0]);
            };
            const activePostion = (e: MouseEvent) =>{
                    thisDiv.style.zIndex = "5";
                    let newPos = draggableDiv.stopMoving(progBar, thisDiv);
                    let newIndex = task.index
                    if(newPos!.newY > y){
                        newIndex = calculateNewIndex(newPos!, true );
                    }else if(newPos!.newY < y){
                        newIndex = calculateNewIndex(newPos!, false)
                    }
                    y = newPos!.newY;
                    if( newIndex !== task.index){
                        positionMap = swap(task.index, newIndex);
                        task.index = newIndex;
                        
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
            {"top" : pos.yPos, 
            "backgroundColor": color, 
            "height": height}
        }
        >
            {task.name}
        </div>
    )
}