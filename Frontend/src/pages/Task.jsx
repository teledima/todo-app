import React, { useState } from "react";
import Loader from "react-loader-spinner";
import { useAsync } from "react-use";
import TasksService from "../api/TasksService";
import TaskStyles from '../styles/Task.module.css'

const Task = ({id}) => {
    const [Data, setData] = useState({})
    const state = useAsync(async() => {
        const data = await new TasksService().GetFullInfo(id)
        setData(data)
    })

    return (
        state.loading?
            <Loader className="Loader" type="TailSpin" color="#00BFFF" height={80} width={80}/>:
            <main>
                <div className={TaskStyles.Task}>
                    <h2>{ Data.title }</h2>
                    <p> { Data.description? Data.description: "Описание отсутствует" } </p>
                    <a href="/"><p>Back to home</p></a>
                </div>
            </main>
    )
}

export default Task;
