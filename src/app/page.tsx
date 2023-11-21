'use client';
import { ReactComponentElement, useState } from "react";
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

  const testTask: Task = {id: "testtest", name: "tester", description: "This is a test description", owner: user1, height: 50}
  const testTask2: Task = {id: "testtest2", name: "another", description: "This is a another test description", owner: user1, height:50}

  const displayNewTask = (createdTask: Task) =>{
    const newTasks: Task[] = [...tasks, createdTask];
    setTasks(newTasks);
  }

  const toggleForm = () =>{
    setFormVisible(!formVisible)
  }
  
  const generateTaskArray= (tasks: Task[]): React.JSX.Element[] => {
    const returnArray : TaskMap[] = [];
    tasks.reduce((prevTask: TaskMap, currTask: Task)  => {
      let task = currTask
      let index = prevTask.index + 1
      let yPos = prevTask.yPos + currTask.height
      returnArray.push({task, index, yPos});


      return {task, index, yPos}
    }, {task : tasks[0], index: 0, yPos:0 });

   const taskRectArray =  returnArray.map(
      taskMap => <TaskRect 
      key={(taskMap.task.id)} 
      task={ taskMap.task} 
      index={taskMap.index} 
      yPos={taskMap.yPos}
      />
       )

    
    return taskRectArray;
  }

  const switchTaskIndices = (task: Task, oldIndex: number, newIndex: number) => {
    const newTasks = [];
    let wasPushed: boolean = false;
    for(let i = 0; i < tasks.length + 1; i++){
      if (!wasPushed){
        if (i == oldIndex){
          continue;
        }
        else if (i == newIndex){
          newTasks.push(task);
          wasPushed = true;
        }
        else{
          newTasks.push(tasks[i]);
        }
      }
     else{
      newTasks.push(i - 1);
     }
      
    }
  }
  const [tasks, setTasks] = useState<Task[]>([testTask, testTask2])
  const [formVisible, setFormVisible] = useState<boolean>(false)

  let allTaskComponents = generateTaskArray(tasks);
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
            {allTaskComponents}
          </div>
      </div>
     </div>
   
     
      
    </div>
  )
}
