import React, { useState } from 'react'
import { UserContext } from './components/context'
import { AppRouter } from './components/AppRouter'


function App({data}) {
    const [UserData, setUserData] = useState(data)
    return (
        <UserContext.Provider value={{UserData, setUserData}}>
            <AppRouter />
        </UserContext.Provider>
    )
}

export default App;
