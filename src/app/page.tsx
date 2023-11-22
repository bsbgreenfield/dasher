'use client';
import { useState, useEffect } from "react";
import { Role, Task, User, TaskMap} from "./lib/definitions";
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
  const colorArray : string[] = ["red", "blue", "yellow"];
  const testTask: Task = {id: "0", name: "first", description: "This is a test description", owner: user1, height: 50}
  const testTask2: Task = {id: "1", name: "second", description: "This is a another test description", owner: user1, height:50}
  const testTask3: Task = {id: "2", name: "third", description: "This is a third test description!!", owner: user1, height:50}
  const displayNewTask = (createdTask: Task) =>{
    const newTasks: Task[] = [...tasks, createdTask];
    setTasks(newTasks);
  }

  const toggleForm = () =>{
    setFormVisible(!formVisible)
  }
  const posMap = new Map<number, number>();

  const generateTaskArray= (tasks: Task[]): React.JSX.Element[] => {
    const returnArray : TaskMap[] = [];
    tasks.reduce((prevTask: TaskMap, currTask: Task)  => {
      let task: Task = currTask
      let index: number = prevTask.index + 1
      let yPos: number = prevTask.yPos + currTask.height
      returnArray.push({task, index: index -1, yPos});
      posMap.set(index - 1, yPos);

      return {task, index, yPos}
    }, {task : tasks[0], index: 0, yPos:0 });
  
   const taskRectArray =  returnArray.map(
      taskMap => <TaskRect 
      key={(taskMap.task.id)} 
      task={ taskMap.task} 
      index={taskMap.index} 
      yPos={taskMap.yPos}
      positionMap={taskPosMap}
      switchTaskIndices={switchTaskIndices}
      color={colorArray[parseInt(taskMap.task.id)]}
      />
       )

    
    return taskRectArray;
  }
  useEffect(() => {
    setTaskPosMap(posMap)
  }, [])

  const switchTaskIndices = (task: Task, oldIndex: number, newIndex: number) => {
    [0, 1, 2]
    const newTasks: Task[] = [];
    let wasPushed: boolean = false;
    if (oldIndex == newIndex) return;
    for(let i = 0; i <= tasks.length ; i++){
      if (!wasPushed){
        if (i == oldIndex){
          console.log(`index is ${i} which = ${oldIndex}, doing nothing. newTasks = ${newTasks}`)
          continue;
        }
        else if (i == newIndex + 1){
          newTasks.push(task);
          wasPushed = true;
          
          console.log(`index is ${i} which = ${newIndex}, pushing ${task.name} newTasks = ${newTasks}`)
        }
        else{
          newTasks.push(tasks[i]);
          
           console.log(`index is ${i}, pushing ${tasks[i].name} newTasks = ${newTasks}`) 
        }
      }
     else{
        if (tasks[i-1] !== task){
          newTasks.push(tasks[i - 1]);
        }
      
       console.log(`index is ${i}, pushing ${tasks[i-1].name} newTasks = ${newTasks}`) 
     }
      
    }
    console.log(newTasks, oldIndex, newIndex);
    setTasks(newTasks);
  }
  const [tasks, setTasks] = useState<Task[]>([testTask, testTask2, testTask3])
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [taskPosMap, setTaskPosMap] = useState(new Map<number, number>);


  return (
    <div>
      <div className="top-bar">
        <div className="task-button"
         onClick={ !formVisible ?
          ()=> setFormVisible(true)
          : () => setFormVisible(false)
          }>
          {formVisible ? "Cancel" : "Create new Task"}
        </div>
      </div>
      <NewTaskForm toggleForm= {toggleForm} displayNewTask = {displayNewTask} formVisible = {formVisible}/>
     <div className="sandbox-body">
      <div className="sandbox-body-content">
        <div className="prog-bar">
            {generateTaskArray(tasks)}
          </div>
      </div>
     </div>
   
     
      
    </div>
  )
}
