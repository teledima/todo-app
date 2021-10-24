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
    document.style = 'height:unset'
    document.body.style = 'height:unset'

    if (state.loading)
        return (
            <Loader className="Loader" type="TailSpin" color="#00BFFF" height={80} width={80}/>
        )
    else {
        if (state.error) {
            const error_code = state.error.response.status
            if (error_code === 404)
                return (
                    <main>
                        <div>
                            <p>Запрашиваемая задача не найдена</p>
                            <a href="/"><p>Back to home</p></a>
                        </div>
                    </main>
                )
            else if (error_code === 403)
                return (
                    <main>
                        <div>
                            <p>У вас нет доступа к запрашиваемому ресурсу</p>
                            <a href="/"><p>Back to home</p></a>
                        </div>
                    </main>
                )
            else
                return (
                    <main>
                        <div>
                            <p>{state.error.response.statusText}</p>
                            <a href="/"><p>Back to home</p></a>
                        </div>
                    </main>
                )
        }
        else 
            return (
                <main>
                    <div className={TaskStyles.Task}>
                        <h2>{ Data.title }</h2>
                        <p> { Data.description? Data.description: "Описание отсутствует" } </p>
                        <a href="/"><p>Back to home</p></a>
                    </div>
                </main>
            )
    }
}

export default Task;
