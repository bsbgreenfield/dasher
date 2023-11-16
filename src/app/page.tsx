'use client';
import { useState } from "react";
import { Role, Task, User } from "./lib/definitions";
import "./styles/task-button.css"
import TaskRect from './ui/taskRect';
import "./styles/taskRect.css";
import "./styles/task-form.css";
import "./styles/topbar.css";
import NewTaskForm from "./ui/newTaskForm";

export default function Home() {
  const user1: User = {
    role: Role.developer,
    username: "benji",
  };

  const displayNewTask = (createdTask: Task) =>{
    const newTasks: Task[] = [...tasks, createdTask];
    setTasks(newTasks);
  }

  const toggleForm = () =>{
    setFormVisible(!formVisible)
  }

  const [tasks, setTasks] = useState<Task[]>([])
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
     
      <div>
        {tasks.map(task => <TaskRect task={task} />)}
      </div>
      <NewTaskForm toggleForm= {toggleForm} displayNewTask = {displayNewTask} formVisible = {formVisible}/>
    </div>
  )
}
