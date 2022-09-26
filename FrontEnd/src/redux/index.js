import { configureStore } from '@reduxjs/toolkit'
import loggedInReducer from './reducers/loggedIn'


const store = configureStore({
    reducer: {
        loggedIn: loggedInReducer,
    }
})

export default store