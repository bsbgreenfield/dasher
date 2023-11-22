
import { Task, Draggable  } from "../lib/definitions";
export default function TaskRect({task, index, yPos, positionMap, switchTaskIndices, color}: {
    task: Task,
    index: number,
    yPos: number,
    positionMap: Map<number, number>,
    switchTaskIndices: (task: Task, oldIndex: number, newIndex: number) => void,
    color: string,
}){
    
   
    const draggableDiv = new Draggable();
    
    const calculateNewIndex = (newPos: {newX: number, newY: number}): number =>{
        let newIndex = index;
        const BreakException = {};
        const finalPos = positionMap.get(positionMap.size - 1)
        if ( finalPos && newPos.newY > finalPos ) return (positionMap.size - 1) // check if moving all the wy to the end
        try{
            positionMap.forEach(function(value, key){
             
                if(newPos.newY < value){
                    newIndex = key - 1;
                    throw BreakException; // short foreach loop to get the first key
                } 
            })
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
                let newIndex = index;
                if (newPos){
                     newIndex =  calculateNewIndex(newPos);
                } 
              
                 switchTaskIndices(task, index,newIndex);
                 
            };
            
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
        style={{"top" : yPos, "backgroundColor": color}}
        >
            {task.name}
        </div>
    )
}