import { Task, ProgBarTask } from "@/app/lib/definitions/types";
import { useEffect, useRef, useState } from "react"
import TaskRect from "./taskRect";
import { colorArray } from "@/app/data/dummy_data";

export default function ProgBar({tasks, id, addTask, switchTaskIndices} : {
  tasks:  Task[] | [], 
  id: string,
  addTask : (id: string, task: Task) => void
  switchTaskIndices: (oldIndex: number, newIndex: number, progBarId: string) => Task[]
}){

    function getProgBarTasks(tasks:Task[]): ProgBarTask[]{
      let newPosMap = getUpdatedPosMap(tasks)
      let yPos = 0;
      let progBarTaskArray : ProgBarTask[]= [];
      for (let i = 0; i < tasks.length; i++){
        let taskAtIthPosition = tasks.find(task => task.index == i);
        progBarTaskArray.push({
          id: taskAtIthPosition!.id,
          name: taskAtIthPosition!.name,
          description: taskAtIthPosition!.description,
          owner: taskAtIthPosition!.owner,
          height: taskAtIthPosition!.height,
          yPos: yPos,
          positionMap: newPosMap,
          index: taskAtIthPosition!.index 
        })
        yPos = yPos + taskAtIthPosition!.height
      }
      return progBarTaskArray;
    }
    const [progBarTasks, setProgBarTasks] = useState<ProgBarTask[]>()

    useEffect(()=>{
      setProgBarTasks(getProgBarTasks(tasks));
    },[])

    
function doTaskSwap(oldIndex: number, newIndex: number): Map<number, [number, number]>{
  const newTaskArray = switchTaskIndices(oldIndex, newIndex, id);
  let newProgBarTaskArray = getProgBarTasks(newTaskArray);
  setProgBarTasks(newProgBarTaskArray);
  return newProgBarTaskArray[0].positionMap
}

 function getUpdatedPosMap(tasks: Task[]):Map<number, [number, number]>  {
    const newTaskPosMap = new Map<number, [number, number]>()
    let newYPos: number = 0; //initialize new position (pixels) for the first task element

    for (let i = 0; i < tasks.length; i++) {

        let taskAtIthPosition = tasks.find(task => task.index == i)
        newTaskPosMap.set(i, [newYPos, taskAtIthPosition!.height])

        newYPos = newYPos + taskAtIthPosition!.height
    }
    return newTaskPosMap;
   
}
const colorsArray = ['red', "blue", "yellow"]

    return (
        <div className="sandbox-body">
        <div className="sandbox-body-content">
          <div className="prog-bar">
            {progBarTasks ?
            progBarTasks!.map(task => <TaskRect
            key={task.id}
             task={task}
             yPos={task.yPos}
             height = {task.height}
             positionMap={task.positionMap}
             swap={doTaskSwap}
             color={colorsArray[parseInt(task.id.split('-').pop()!)]}
              />)
            : <></>}
          </div>
        </div>
      </div>
    )
}