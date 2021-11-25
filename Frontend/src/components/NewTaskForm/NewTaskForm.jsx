import React, { useState } from "react"
import formStyles from './NewTaskForm.module.css'

const NewTaskForm = ({setVisible, onCreateTask}) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const resetStates = () => {
        setTitle('')
        setDescription('')
    }

    const onReset = () => {
        setVisible(false)
        resetStates()
    }

    const onSubmit = (event) => {
        onCreateTask(event, title, description)
        resetStates()
    }

    return (
        <form className={formStyles.NewTaskForm} 
              onReset={() => onReset()} 
              onSubmit={(event) => onSubmit(event)}
        >
            <div className={formStyles.InputBlock}>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" onChange={event => setTitle(event.target.value)} value={title} required/>
            </div>
            <div className={formStyles.InputBlock}>
                <label htmlFor="description">Description</label>
                <textarea type="text" id="description" name="description" wrap="hard" rows="10" onChange={event => setDescription(event.target.value)} value={description}></textarea>
            </div>
            <div className={formStyles.Menu}>
                <button className={formStyles.create} type="submit">Создать задачу</button>
                <button className={formStyles.cancel} id="close" type="reset">Отмена</button>
            </div>
        </form>
    )
}

export default NewTaskForm;
