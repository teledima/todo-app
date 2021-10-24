import React, { useState } from "react"
import Loader from "react-loader-spinner"
import { useHistory } from "react-router"
import TasksService from "../api/TasksService"

const TaskItem = ({task, onCheckboxChange, onDeleteTask}) => {
    const [Title, setTitle] = useState(task.title)
    const [isChange, setIsChange] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    let history = useHistory()

    const handlerShowAll = () => {
        history.push(`/task/${task.id}`)
    }

    const handlerChangeTitle = (event) => {
        if (event.target.value === Title)
            setIsChange(false)
        else
            setIsChange(true)
        setTitle(event.target.value)
    }

    const handlerApplyChanges = async() => {
        setIsLoading(true)
        const data = await new TasksService().UpdateTask({id: task.id, title: Title})
        if (data['ok'])
            setIsChange(false)
        setIsLoading(false)
    }

    return (
        <div className="TaskItem" data-reactid={task.id}>
            <input type="checkbox" value="task" onChange={() => onCheckboxChange(task)} checked={task.checked} disabled={isLoading}/>
            <input type="text" id="task-description-unchecked" name="task-description" value={Title} onDoubleClick={handlerShowAll} onChange={handlerChangeTitle} disabled={isLoading} required/>
            <img src="https://api.iconify.design/bx/bx-trash.svg?color=red&height=28" onClick={!isLoading?() => {onDeleteTask(task)}:null} alt="trash-icon"></img>
            {isChange && !isLoading && <img src='https://api.iconify.design/akar-icons/circle-check-fill.svg?color=%230fa958&height=28' alt="apply-changes" onClick={!isLoading?handlerApplyChanges:null}/>}
            {isLoading && <Loader className="Loader" type="TailSpin" color="#00BFFF" height={28} width={28}/>}
        </div>
    )
}

export default React.memo(TaskItem)
