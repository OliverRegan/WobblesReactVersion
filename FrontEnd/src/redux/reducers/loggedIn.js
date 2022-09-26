import { createSlice } from "@reduxjs/toolkit"

export const loggedIn = createSlice({
    name: 'loggedIn',
    initialState: {
        value: false,
        token: ''
    },
    reducers: {
        login: (state, action) => {
            state.value = true
            state.token = action.payload[0]
            state.user = action.payload[1]
        },
        logout: (state) => {
            state.value = false
            state.token = ''
            state.user = ''
        }
    }
})
export const { login, logout } = loggedIn.actions
export default loggedIn.reducer