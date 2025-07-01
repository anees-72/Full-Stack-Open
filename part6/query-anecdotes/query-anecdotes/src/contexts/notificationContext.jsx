import {useReducer,createContext} from 'react'

const notificationReducer = (state,action) => {
    if (action.type === 'SET_NOTIFICATION') {
        return action.payload
    }
    if (action.type === 'CLEAR_NOTIFICATION') {
        return null
    }
    return state
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({children}) => {
    const [notification,dispatch] = useReducer(notificationReducer,null)

    const setNotification = (message,timeout) => {
        dispatch({type: 'SET_NOTIFICATION', payload:message})
        setTimeout(() => {
            dispatch({type: 'CLEAR_NOTIFICATION'})
        },timeout*1000)
    }
    return (
        <NotificationContext.Provider value={{notification,setNotification}}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext