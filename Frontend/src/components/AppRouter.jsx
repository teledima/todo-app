import React, { useContext } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import { UserContext } from './context'
import Header from './Header'
import Task from '../pages/Task'

export const AppRouter = () => {
    const context = useContext(UserContext)
    return (
        <Router>
            <Header title={"TODO Service"} login={context.UserData.login}/>
            <Switch>
                <Route exact path='/'>
                    {context.UserData.id === null? <Redirect to='/login' component={Login} />: <Home/>}
                </Route>
                <Route path='/login'>
                    {context.UserData.id === null? <Login/>: <Redirect to='/' component={Home}/>}
                </Route>
                <Route exact path='/task/:id' render={(props) => (
                    <Task id={props.match.params.id}/>
                )}/>
            </Switch>
        </Router> 
    )
}
