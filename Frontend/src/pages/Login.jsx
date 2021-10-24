import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import axios from 'axios'
import UserService from '../api/UserService'
import {UserContext} from '../components/context'
import '../styles/Login.css'
import FormInformation from '../components/FormInformation'


const Login = () => {
    const history = useHistory()
    const [AuthData, SetAuthData] = useState({login:'', password:''})
    const [Info, SetInfo] = useState({type: '', value: ''})
    const userContext = useContext(UserContext)

    const LoginClick = async (event) => {
        event.preventDefault();
        
        try {
            const data = await new UserService(AuthData).Login()
            if (!data['ok'])
                SetInfo({type: 'error', value: data['error']})
            else {
                history.replace('/')
                const user_info = await new UserService().GetUserInfo()
                userContext.setUserData(user_info)
            }
        }
        catch(error) {
            if (axios.isAxiosError(error)) {
                SetInfo({type: 'error', value: error.response.statusText})
            }
        }
    }

    const RegisterClick = async (event) => {
        event.preventDefault()

        try {
            const data = await new UserService(AuthData).Register()
            if (!data['ok'])
                SetInfo({type: 'error', value: data['error']})
            else
                SetInfo({type: 'success', value: 'account_created'})
        }
        catch(error) {
            if (axios.isAxiosError(error)) {
                SetInfo({type: 'error', value: error.response.statusText})
            }
        }
    }

    return (
        <div className='Login'>
            <form>
                <div>
                    <label htmlFor='login'>Login</label>
                    <input type='text' name='login'  onChange={(event) => SetAuthData({login: event.target.value, password: AuthData.password})}  required/>
                </div>
                <div>
                    <label htmlFor='password-input'>Password</label>
                    <input type='password' name='password-input' autoComplete='true'  onChange={(event) => SetAuthData({login: AuthData.login, password: event.target.value})}  required/>
                </div>
                <div className='buttons'> 
                    <button onClick={RegisterClick} type="submit">Create an account</button>
                    <button onClick={LoginClick} type="submit">Log in</button>
                </div>
                <FormInformation type={Info.type} value={Info.value}/>
            </form>
        </div> 
    )
}

export default Login;
