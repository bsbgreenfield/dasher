
import {Task} from "../../lib/definitions/types";
import {Draggable  } from "../../lib/definitions/task-rect";
export default function TaskRect({
    task, 
    yPos, 
    positionMap, 
    switchTaskIndices,
    color,
            }: {
    task: Task,
    yPos: number,
    positionMap: Map<number, [number, number]>,
    switchTaskIndices: (oldIndex: number, newIndex: number) => React.JSX.Element[] | null,
    color: string,
}){

    let dragged: boolean = false;
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
                    if(newPos.newY < value[0] - (value[1]/2)){
                        newIndex = key -1  ;
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
            draggableDiv.startMoving(thisDiv, thisDiv.parentElement as HTMLDivElement, {x: 0, y: yPos});
            const stopMove = () => {
                thisDiv.removeEventListener("mousemove", activePostion);
                thisDiv.style.zIndex = "0";
                let newPos = draggableDiv.stopMoving(progBar, thisDiv)
                thisDiv.removeEventListener("mouseup", stopMove)
                let newIndex = task.index;
                if (newPos){
                     newIndex =  calculateNewIndex(newPos);
                } 
              
                const newElementArray = switchTaskIndices(task.index, newIndex);
                positionMap = newElementArray![newIndex].props.positionMap;
                yPos = newElementArray![newIndex].props.yPos.toString();
                draggableDiv.move(thisDiv, progBar.clientWidth/2 - thisDiv.clientWidth/2, yPos)
                dragged = false;
            };
            const activePostion = () =>{
                if(!dragged){
                    let newPos = draggableDiv.stopMoving(progBar, thisDiv);
                    let currIndex = calculateNewIndex(newPos!) 
                    if( currIndex !== task.index){
                       switchTaskIndices(task.index, currIndex)
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
        style={{"top" : yPos, "backgroundColor": color, "height": task.height}}
        >
            {task.name}
        </div>
    )
}