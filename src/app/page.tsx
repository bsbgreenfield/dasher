'use client';
import { useState } from "react";
import { Role, Task, User } from "./lib/definitions";
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

  const testTask: Task = {id: "testtest", name: "tester", description: "This is a test description", owner: user1}
  const testTask2: Task = {id: "testtest2", name: "another", description: "This is a another test description", owner: user1}

  const displayNewTask = (createdTask: Task) =>{
    const newTasks: Task[] = [...tasks, createdTask];
    setTasks(newTasks);
  }

  const toggleForm = () =>{
    setFormVisible(!formVisible)
  }
  const controlTaskDrag = (event: React.MouseEvent, grabListener: ()=> void) => {
    document.addEventListener("mouseup", () => {
      console.log("dropped")
      document.removeEventListener("mousemove", grabListener)
    })
    console.log(event.clientX, event.clientY)
  }

  const [tasks, setTasks] = useState<Task[]>([testTask, testTask2])
  const [formVisible, setFormVisible] = useState<boolean>(false)
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
            {tasks.map(task => <TaskRect key={task.id.toString()} controlTaskDrag={controlTaskDrag} task={task} />)}
          </div>
      </div>
     </div>
   
     
      
    </div>
  )
}
