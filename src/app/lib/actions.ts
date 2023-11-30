'use server';
import {z} from 'zod';
import {User, Role, Task} from "./definitions/types";


const taskSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    owner: z.custom<User>()
})

const CreateTask = taskSchema.omit({owner:true});

export async function createTask(formData: FormData){
    const {id, name, description} = CreateTask.parse({
        id: "a-3",
        name: formData.get("task_name"),
        description: formData.get("task_desc"),
    });
    const owner: User =  {username: "Benji", role: Role.developer};
    const createdTask: Task = {id, name, description, owner, index: 3, height: 50};
    return createdTask;
}