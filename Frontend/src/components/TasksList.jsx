import React from "react"
import Loader from "react-loader-spinner"
import { useAsync } from "react-use"
import TasksService from "../api/TasksService"
import TaskItem from "./TaskItem"

const TasksList = ({title, checked, tasks, setTasks, changeCheckbox, deleteTask}) => {
    const state = useAsync(async() => {
        const data = await new TasksService().GetTasks(checked)
        setTasks(data.tasks)
    }, [checked])

    return (
        state.loading?
            <Loader className="Loader" type="TailSpin" color="#00BFFF" height={80} width={80}/>:
            <div className='TaskList'>
                <header className={checked?'checked': 'unchecked'}>
                    <p><b>{title}</b></p>
                </header>
                {tasks.length > 0 && tasks.map((task) => <TaskItem key={task.id} task={task} onCheckboxChange={changeCheckbox} onDeleteTask={deleteTask}/>)}
            </div>
    )
}

export default TasksList
