'use client';
import { useState, useEffect, useRef } from "react";
import { Role, Task, User, TaskMap } from "./lib/definitions";
import "./styles/task-button.css"
import TaskRect from './ui/taskRect';
import "./styles/taskRect.css";
import "./styles/task-form.css";
import "./styles/topbar.css";
import "./styles/prog-bar.css";
import "./styles/sandbox-body.css";
import NewTaskForm from "./ui/newTaskForm";



export default function Home() {
  const user1: User = {
    role: Role.developer,
    username: "benji",
  };
  const colorArray: string[] = ["red", "blue", "yellow"];
  const testTask: Task = {
    id: "0",
    name: "first",
    description: "This is a test description",
    owner: user1,
    height: 50, index: 0
  }
  const testTask2: Task = {
    id: "1",
    name: "second",
    description: "This is a another test description",
    owner: user1,
    height: 100, index: 1
  }
  const testTask3: Task = {
    id: "2",
    name: "third",
    description: "This is a third test description!!",
    owner: user1,
    height: 200, index: 2
  }

  let taskPosMapInit = new Map<number, [number, number]>([[0, [0, 50]], [1, [50, 100]], [2, [150, 200]]]);

  const displayNewTask = (createdTask: Task) => {
    const newTasks: Task[] = [...tasks.current, createdTask];
    tasks.current = newTasks;
  }

  const toggleForm = () => {
    setFormVisible(!formVisible)
  }

  const generateTaskArray = (tasksWithNewIndices: Task[], newIndex: number = -1): void => {
    /* 
    we take in an array of tasks, which have specified indices.
    The goal is to create an array of task elements which is sorted based on these indices,
    and to supply each task element with the a new y position, which in turn is informed by the height and y position of the previes element
    first, we need to create a new Map<index, [yPosition, height]
    the, we create the element array using the new values stored in the Map

    ----- This can probably be improved by lifting the state of posmap up to a common parent element.----
      could move prog bar down into its own child
    **/
    const newTaskPosMap = new Map<number, [number, number]>()
    const newElementArray: React.JSX.Element[] = []; // initialize an empty array
    let newYPos: number = 0; //initialize new position (pixels) for the first task element

    for (let i = 0; i < tasksWithNewIndices.length; i++) {

      let taskAtIthPosition = tasksWithNewIndices.find(task => task.index == i)
      newTaskPosMap.set(i, [newYPos, taskAtIthPosition!.height])

      newYPos = newYPos + taskAtIthPosition!.height
    }

    for(let i=0; i < tasksWithNewIndices.length; i ++){
      let taskAtIthPosition = tasksWithNewIndices.find(task => task.index == i)
      let taskElement: React.JSX.Element;
      taskElement =
      <TaskRect
        key={taskAtIthPosition!.id}
        task={taskAtIthPosition!}
        yPos={newTaskPosMap.get(i)![0]}
        positionMap={newTaskPosMap} // this may be an issue as taskPosMap is not set at this point. Maybe it will update dynamically?
        switchTaskIndices={switchTaskIndices}
        color={colorArray[parseInt(taskAtIthPosition!.id)]}
        visible = {!(taskAtIthPosition!.index == newIndex)}
      />

    newElementArray.push(taskElement);
    }
    setTaskElementArray(newElementArray);

  };


  const switchTaskIndices = (task: Task, oldIndex: number, newIndex: number, dynamicSwitchMode: boolean) => {
    const newTasks: Task[] = [];
    if (newIndex < 0) newIndex = 0; // im not sure why it does this.
    if (oldIndex == newIndex) return;
    const movingDown = (oldIndex < newIndex);
    for (let i = 0; i <= tasks.current.length - 1; i++) {
      let newTask = tasks.current[i]
      if(newTask.index == oldIndex){ // if this is the selected task, move it to its new position
        newTask.index = newIndex
      } 
      else if (movingDown){
        if (newTask.index <= newIndex && newTask.index >= oldIndex){ // if the task is moving down, everything at or above the new index needs to shift upwards
          newTask.index = tasks.current[i].index - 1;                // also, if the task is above where the moving task started, do nothing
        }
            // otherwise, the position should stay the same
      }
      else{ // if the task is moving up, everything at or below the new index needs to shift down
        if(newTask.index  >= newIndex && newTask.index <= oldIndex){ // also , if the task is below where the selected task started, do nothing
          newTask.index = tasks.current[i].index + 1;
        }
        // everything above the new index can stay where is was
      }

      newTasks.push(newTask);
    }

    tasks.current = newTasks;

    dynamicSwitchMode ? generateTaskArray(newTasks, newIndex) : generateTaskArray(newTasks) 
  }

  
  const tasks = useRef<Task[]>([testTask, testTask2, testTask3])
  const [formVisible, setFormVisible] = useState<boolean>(false)

  let [taskElementArray, setTaskElementArray] = useState<React.JSX.Element[]>(
    [
      <TaskRect key={(testTask.id)} task={testTask} yPos={0} positionMap={taskPosMapInit} color="red" switchTaskIndices={switchTaskIndices} visible={true}/>,
      <TaskRect key={(testTask2.id)} task={testTask2} yPos={50} positionMap={taskPosMapInit} color="blue" switchTaskIndices={switchTaskIndices}  visible={true}/>,
      <TaskRect key={(testTask3.id)} task={testTask3} yPos={150} positionMap={taskPosMapInit} color="yellow" switchTaskIndices={switchTaskIndices}  visible={true} />
    ]
  )


  useEffect(() => {
    generateTaskArray(tasks.current)
  }, []

    // Flow: move task -> switchTaskIndices -> update tasks -> generate task element array -> render new task element array
  );
  return (
    <div>
      <div className="top-bar">
        <div className="task-button"
          onClick={!formVisible ?
            () => setFormVisible(true)
            : () => setFormVisible(false)
          }>
          {formVisible ? "Cancel" : "Create new Task"}
        </div>
      </div>
      <NewTaskForm toggleForm={toggleForm} displayNewTask={displayNewTask} formVisible={formVisible} />
      <div className="sandbox-body">
        <div className="sandbox-body-content">
          <div className="prog-bar">
            {taskElementArray}
          </div>
        </div>
      </div>



    </div>
  )
}
