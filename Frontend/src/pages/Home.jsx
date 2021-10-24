import React, { useCallback, useState } from 'react'
import TasksService from '../api/TasksService'
import TasksList from '../components/TasksList'
import NewTaskForm from '../components/NewTaskForm/NewTaskForm'
import '../styles/Home.css'
import Dialog from '../components/Dialog/Dialog'
const Home = () => {
  const [checkedTasks, setCheckedTasks] = useState([])
  const [uncheckedTasks, setUncheckedTasks] = useState([])
  const [visibleDialog, setVisibleDialog] = useState(false)

  const handlerShowNewTaskForm = () => {
    setVisibleDialog(true)
  }

  const handlerChangeCheckbox = useCallback(async(item) => {
    const data = await new TasksService().UpdateTask({id: item.id, status: !item.checked})
    if (data['ok'])
      if (item.checked === 0) {
        setCheckedTasks([...checkedTasks, {id: item.id, title: item.title, checked: 1}])
        setUncheckedTasks(uncheckedTasks.filter(task => task.id !== item.id))
      }
      else {
        setUncheckedTasks([...uncheckedTasks, {id: item.id, title: item.title, checked: 0}])
        setCheckedTasks(checkedTasks.filter(task => task.id !== item.id))
      }
  }, [checkedTasks, uncheckedTasks])

  const handlerDeleteTask = useCallback(async(item) => {
    const data = await new TasksService().DeleteTask(item.id)
    if (data['ok'])
        if (item.checked)
          setCheckedTasks(checkedTasks.filter(task => task.id !== item.id))
        else
          setUncheckedTasks(uncheckedTasks.filter(task => task.id !== item.id))
  }, [checkedTasks, uncheckedTasks])

  const handlerCreateTask = useCallback(async(event, title, description) => {
    event.preventDefault()
    const data = await new TasksService().CreateTask(title, description)
    if (data['ok']) {
      setUncheckedTasks([...uncheckedTasks, {id: data['id'], title, description}])
      setVisibleDialog(false)
    }
  }, [uncheckedTasks])

  return (
    <main>
      <div className="Home">
          <TasksList 
            title={"Непроверенные"} 
            checked={false} 
            tasks={uncheckedTasks} 
            setTasks={setUncheckedTasks} 
            changeCheckbox={handlerChangeCheckbox}
            deleteTask={handlerDeleteTask}
          />
          <button onClick={handlerShowNewTaskForm}>Новая задача</button>
          <Dialog visible={visibleDialog}>
            <NewTaskForm setVisible={setVisibleDialog} onCreateTask={handlerCreateTask}/>
          </Dialog>
          <TasksList 
            title={"Проверенные"} 
            checked={true} 
            tasks={checkedTasks}
            setTasks={setCheckedTasks} 
            changeCheckbox={handlerChangeCheckbox}
            deleteTask={handlerDeleteTask}
          />
      </div>
    </main>
  );
}

export default Home;
