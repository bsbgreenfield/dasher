import { Task, ProgBarTask } from "@/app/lib/definitions/types";
import { useEffect, useState } from "react"
import TaskRect from "./taskRect";
import { colorArray } from "@/app/data/dummy_data";
import NewTaskForm from "./newTaskForm";
import { createTask } from "@/app/lib/actions";
import RotateSVG from "./svg";
export default function ProgBar({tasks, id, addTask, switchTaskIndices} : {
  tasks:  Task[] | [], 
  id: string,
  addTask : (id: string, task: Task) => Task[]
  switchTaskIndices: (oldIndex: number, newIndex: number, progBarId: string) => Task[]
}){

    async function submitTask(formdata: FormData){
     let newTask =  await createTask(formdata)
     const newTaskArray = addTask(id, newTask)
     setProgBarTasks(getProgBarTasks(newTaskArray));
     setFormVisible(false);
    }
    const [formVisible, setFormVisible] = useState(false)


    function getProgBarTasks(tasks:Task[]): ProgBarTask[]{
      let newPosMap = getUpdatedPosMap(tasks)
      let pos= {xPos: 0, yPos: 0};
      let progBarTaskArray : ProgBarTask[]= [];
      for (let i = 0; i < tasks.length; i++){
        let taskAtIthPosition = tasks.find(task => task.index == i);
        console.log(taskAtIthPosition)
        progBarTaskArray.push({
          id: taskAtIthPosition!.id,
          name: taskAtIthPosition!.name,
          description: taskAtIthPosition!.description,
          owner: taskAtIthPosition!.owner,
          height: taskAtIthPosition!.height,
          pos: {xPos: 0, yPos: newPosMap.get(i)![0]},
          positionMap: newPosMap,
          index: taskAtIthPosition!.index 
        })
        pos.yPos = pos.yPos + taskAtIthPosition!.height
        pos.xPos = pos.xPos + taskAtIthPosition!.height
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
          <div className="progbar-top">
            <RotateSVG/>
              <div className="add-task-button" onClick={()=>{setFormVisible(!formVisible)}}>
                {formVisible ? "-": "+"}
              </div>
            </div>
        <div className="sandbox-body-content">
          <div className="prog-bar">
            {progBarTasks ?
            progBarTasks!.map(task => <TaskRect
            key={task.id}
             task={task}
             pos={task.pos}
             height = {task.height}
             positionMap={task.positionMap}
             swap={doTaskSwap}
             color={colorsArray[parseInt(task.id.split('-').pop()!)]}
              />)
            : <></>}
          </div>
        </div>
       
        <NewTaskForm formVisible={formVisible} id={`${id}-${tasks.length}`} submitTask={submitTask}/>
      </div>
    ) 
}