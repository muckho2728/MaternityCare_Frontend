import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user:{},
    listUser: [],
    currentUser:{}
}

const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    setUser: (state, action) => {
        state.user = action.payload
    },
    setListUser: (state, action) => {
        state.listUser = action.payload
    },
    setCurrentUser: (state, action) => {
        state.currentUser = action.payload
    },
    updateUserLoginAction: (state, action) => {
        state.currentUser = {
            ...state.userLogin,
            ...action.payload
        };
    },
  }
});

export const {setListUser,setUser,setCurrentUser,updateUserLoginAction} = userReducer.actions

export default userReducer.reducer