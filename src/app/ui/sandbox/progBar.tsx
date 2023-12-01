import { Task, ProgBarTask } from "@/app/lib/definitions/types";
import { useEffect, useRef, useState } from "react"
import TaskRect from "./taskRect";
import { colorArray } from "@/app/data/dummy_data";
import NewTaskForm from "./newTaskForm";
import { createTask } from "@/app/lib/actions";
import RotateSVG from "./svg";
export default function ProgBar({ tasks, id, addTask, switchTaskIndices }: {
  tasks: Task[] | [],
  id: string,
  addTask: (id: string, task: Task) => Task[];
  switchTaskIndices: (oldIndex: number, newIndex: number, progBarId: string) => Task[]
}) {
  const [formVisible, setFormVisible] = useState(false);
  const [verticalFlip, setVerticalFlip] = useState(true);
  const [progBarTasks, setProgBarTasks] = useState<ProgBarTask[]>()
  useEffect(() => {
    setProgBarTasks(getProgBarTasks(tasks));
  }, [verticalFlip])


  async function submitTask(formdata: FormData) {
    setFormVisible(false);
    const newTaskId = `${id}-${progBarTasks!.length}`
    let newTask = await createTask(formdata, newTaskId);
    const newTaskArray = addTask(id, newTask);
    setProgBarTasks(getProgBarTasks(newTaskArray));
  }

  function getProgBarTasks(tasks: Task[]): ProgBarTask[] {
    let newPosMap = getUpdatedPosMap(tasks)
    let pos = { xPos: 0, yPos: 0 };
    let progBarTaskArray: ProgBarTask[] = [];
    for (let i = 0; i < tasks.length; i++) {
      let taskAtIthPosition = tasks.find(task => task.index == i);
      progBarTaskArray.push({
        id: taskAtIthPosition!.id,
        name: taskAtIthPosition!.name,
        description: taskAtIthPosition!.description,
        owner: taskAtIthPosition!.owner,
        size: taskAtIthPosition!.size,
        pos: verticalFlip ?
          { xPos: 0, yPos: newPosMap.get(i)![0] }
          : { xPos: newPosMap.get(i)![0], yPos: 0 },
        positionMap: newPosMap,
        index: taskAtIthPosition!.index
      })
      pos.yPos = pos.yPos + taskAtIthPosition!.size
      pos.xPos = pos.xPos + taskAtIthPosition!.size
    }
    return progBarTaskArray;
  }

  function getUpdatedPosMap(tasks: Task[]): Map<number, [number, number]> {
    const newTaskPosMap = new Map<number, [number, number]>()
    let newYPos: number = 0; //initialize new position (pixels) for the first task element
    for (let i = 0; i < tasks.length; i++) {
      let taskAtIthPosition = tasks.find(task => task.index == i)
      newTaskPosMap.set(i, [newYPos, taskAtIthPosition!.size])

      newYPos = newYPos + taskAtIthPosition!.size
    }
    return newTaskPosMap;

  }

  function doTaskSwap(oldIndex: number, newIndex: number): Map<number, [number, number]> {
    const newTaskArray = switchTaskIndices(oldIndex, newIndex, id);
    let newProgBarTaskArray = getProgBarTasks(newTaskArray);
    setProgBarTasks(newProgBarTaskArray);
    return newProgBarTaskArray[0].positionMap
  }


  function flipBar() {
    setVerticalFlip(!verticalFlip);
  }

  const colorsArray = ['red', "blue", "yellow"]

  return (
    <div className="sandbox-body" style={verticalFlip ? { "flexDirection": "column" } : { "flexDirection": "row" }}>
      <div className="progbar-top" style={verticalFlip ? {"flexDirection": "row", "alignItems": "baseline"} : {"flexDirection": "column", "alignItems": "end"}}>
        <div onClick={flipBar} >
          <RotateSVG />
        </div>
        <div className="add-task-button" onClick={() => { setFormVisible(!formVisible) }} style={ verticalFlip? {"justifyContent": "center"} : {"justifyContent": "end"}}>
          {formVisible ? "-" : "+"}
        </div>
      </div>
      <div className="sandbox-body-content">
        <div className="prog-bar" style={verticalFlip ? { "height": "500px", "width": "150px" } : { "height": "150px", "width": "500px" }}>
          {progBarTasks ?
            progBarTasks!.map(task => <TaskRect
              key={task.id}
              task={task}
              pos={task.pos}
              size={task.size}
              positionMap={task.positionMap}
              swap={doTaskSwap}
              color={colorsArray[parseInt(task.id.split('-').pop()!)]}
              isVertical={verticalFlip}
            />)
            : <></>}
        </div>
      </div>

      <NewTaskForm formVisible={formVisible} id={`${id}-${tasks.length}`} submitTask={submitTask} />
    </div>
  )
}