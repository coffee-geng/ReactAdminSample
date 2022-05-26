import { RECEIVE_USER, RESET_USER, SET_HEADER_TITLE, SHOW_INVALID_LOGIN } from "./action-types"
import storageUtils from '../utils/storageUtils'
import { reqLogin } from "../api"

export const setHeaderTitle = (title) => ({ type: SET_HEADER_TITLE, title })

export const receiveUser = (user)=>({type:RECEIVE_USER, user})

export const resetUser = ()=>({type:RESET_USER})

export const showInvalidLogin = (errorMsg)=>({type:SHOW_INVALID_LOGIN, errorMsg})

export const loginAsync = (username, password) => {
    return async dispatch => {
        const result = await reqLogin(username, password)
        if (result.status === 0) {
            const user = result.data
            
            storageUtils.saveUser(user)
            dispatch(receiveUser(user))
        }
        else {
            const errorMsg = result.msg
            dispatch(showInvalidLogin(errorMsg))
        }
    }
}

export const logout = ()=>{
    return dispatch =>{
        storageUtils.removeUser()
        dispatch(resetUser())
    }
}