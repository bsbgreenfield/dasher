'use server';
import {number, z} from 'zod';
import {User, Role, Task} from "./definitions/types";


const taskSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    owner: z.custom<User>()
})

const CreateTask = taskSchema.omit({owner:true});

export async function createTask(formData: FormData, taskId: string){
    const {id, name, description} = CreateTask.parse({
        id: taskId,
        name: formData.get("task_name"),
        description: formData.get("task_desc"),
    });
    const owner: User =  {username: "Benji", role: Role.developer};
    const newIndex : number  = parseInt(taskId.split('-').pop()!)
    const createdTask: Task = {id, name, description, owner, index: newIndex, size: 50};
    return createdTask;
}