'use server';
import {z} from 'zod';
import {User, Role, Task} from "./definitions/types";
import {v4 as uuid} from 'uuid';

const taskSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    owner: z.custom<User>()
})

const CreateTask = taskSchema.omit({id: true, owner:true});

export async function createTask(formData: FormData){
    const {name, description} = CreateTask.parse({
        name: formData.get("task_name"),
        description: formData.get("task_desc"),
    });
    const id = uuid();
    const owner: User =  {username: "Benji", role: Role.developer};
    const createdTask: Task = {id, name, description, owner, index: 3, height: 50};
    return createdTask;
}