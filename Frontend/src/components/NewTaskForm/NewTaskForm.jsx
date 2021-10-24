import React, { useState } from "react"
import formStyles from './NewTaskForm.module.css'

const NewTaskForm = ({setVisible, onCreateTask}) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    return (
        <form className={formStyles.NewTaskForm} 
              onReset={() => setVisible(false)} 
              onSubmit={(event) => onCreateTask(event, title, description)}
        >
            <div className={formStyles.InputBlock}>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" onChange={event => setTitle(event.target.value)} required/>
            </div>
            <div className={formStyles.InputBlock}>
                <label htmlFor="description">Description</label>
                <textarea type="text" id="description" name="description" wrap="hard" rows="10" onChange={event => setDescription(event.target.value)}></textarea>
            </div>
            <div className={formStyles.Menu}>
                <button className={formStyles.create} type="submit">Создать задачу</button>
                <button className={formStyles.cancel} id="close" type="reset">Отмена</button>
            </div>
        </form>
    )
}

export default NewTaskForm;
