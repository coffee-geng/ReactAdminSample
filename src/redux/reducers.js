import { SET_HEADER_TITLE, RECEIVE_USER, RESET_USER, SHOW_INVALID_LOGIN } from "./action-types"
import { combineReducers } from "redux"
import storageUtils from "../utils/storageUtils"

const INIT_HEADER_TITLE = '首页'
const INIT_USER = storageUtils.getUser()

function headerTitle(previousState = INIT_HEADER_TITLE, action) {
    if (action && action.type === SET_HEADER_TITLE) {
        return action.title
    }
    return previousState
}

function currentUser(previousState = INIT_USER, action) {
    let state
    switch (action.type) {
        case RECEIVE_USER:
            state = action.user
            break
        case RESET_USER:
            state = {}
            break
        case SHOW_INVALID_LOGIN:
            state = { ...previousState, errorMsg: action.errorMsg }
            break
        default:
            state = previousState
            break
    }
    return state
}

export default combineReducers({
    headerTitle, currentUser
})