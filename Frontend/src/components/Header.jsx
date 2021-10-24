import React, { useContext } from "react"
import { useHistory } from "react-router"
import UserService from "../api/UserService"
import '../styles/Header.css'
import { UserContext } from "./context"



const Header = ({title, login}) => {
    const history = useHistory()
    const userContext = useContext(UserContext)
    const handlerLogout = async(event) => {
        new UserService().Logout().then(data => {
            if (data['ok'] === true) {
                history.replace('/login')
                userContext.setUserData({id: null, login: null})
            }
        })
    }
    return (
        <header className='AppHeader'>
            <p><b>{ title }</b></p>
            {login?
                <div className="header__right">
                    <p>{ login }</p>
                    <button className="btn-text" onClick={handlerLogout}>Log out</button>
                </div>:null
            }
        </header>
    )
}

export default Header
