import { Task } from "../../lib/definitions/types"
import { createTask } from "../../lib/actions";

export default function NewTaskForm(
    { 
        toggleForm,
        displayNewTask,
        formVisible 
    }: {
        toggleForm: (arg0: boolean) => void,
        displayNewTask: (arg0: Task) => void, 
        formVisible: boolean 
    }) {
    const createTaskOnPage = async (formData: FormData) => {
        const createdTask: Task = await createTask(formData);
        toggleForm(false);
        displayNewTask(createdTask);
    }

    return (<form
        style={{ "display": formVisible ? "block" : "none" }}
        className="task-form"
        action={createTaskOnPage}
    >
        <div className="task-form-grid">

            <label htmlFor="task_name">
                Name:
            </label>
            <input
                id="task_name"
                name="task_name"
                type="string"
                placeholder="New Task"
                className="task-form-grid-input"
            />

            <label htmlFor="task_desc" className="task-form-grid-label">
                Description:
            </label>
            <textarea
                id="task_desc"
                name="task_desc"
                typeof="string"
                placeholder="Description of task"
                className="task-form-grid-input"
            />
            <button className="task-form-grid-submit" type="submit" >
                Create task
            </button>
        </div>
    </form>
    )
}