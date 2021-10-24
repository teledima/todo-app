import React from "react"
import { useHistory } from "react-router"

const TaskItem = ({task, onCheckboxChange, onDeleteTask}) => {
    let history = useHistory()
    const handlerShowAll = (event) => {
        history.push(`/task/${task.id}`)
    }

    return (
        <div className="TaskItem" data-reactid={task.id}>
            <input type="checkbox" value="task" onChange={() => onCheckboxChange(task)} checked={task.checked}/>
            <input type="text" id="task-description-unchecked" name="task-description" value={task.title} onDoubleClick={handlerShowAll} required/>
            <img src="https://api.iconify.design/bx/bx-trash.svg?color=red&height=28" onClick={() => onDeleteTask(task)} alt="trash-icon"></img>
        </div>
    )
}

export default React.memo(TaskItem)
