import { Task } from "../../lib/definitions/types"


export default function NewTaskForm({
    formVisible, id, submitTask}: 
    {formVisible: boolean, id:string, submitTask: (formdata: FormData) => void}) {

    return (<form
        style={{"display": formVisible ? "block": "none"}}
        className="task-form"
        action={submitTask}
    >
        <div className="task-form-grid">
            <input
             type="hidden" 
             value={id}
             id="task_id"
             name="task_id"
             />
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