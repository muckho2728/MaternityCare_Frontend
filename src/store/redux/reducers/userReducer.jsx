import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {},
    listUser: [],
    currentUser: {},
    totalElements:0
};

const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    setUser: (state, action) => {
        console.log("action", action.payload); 
        state.user = action.payload;
        const userId = action.payload.id;
        localStorage.setItem('userId', userId); 
    },
    setListUser: (state, action) => {
        state.listUser = action.payload;
    },
    setCurrentUser: (state, action) => {
        console.log("Setting current user:", action.payload); 
        state.currentUser = action.payload;
    },
    updateUserLoginAction: (state) => {
        state.currentUser = {
            ...state.currentUser, 
        };
    },
    setTotalElements : (state , action)=>{
        console.log("action", action.payload); 
        state.totalElements = action.payload;
    }
  }
});

// Export actions
export const { setListUser, setUser, setCurrentUser, updateUserLoginAction , setTotalElements } = userReducer.actions;

// Export reducer
export default userReducer.reducer;