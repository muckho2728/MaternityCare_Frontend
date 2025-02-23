import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {},
    listUser: [],
    currentUser: {}
};

const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    setUser: (state, action) => {
        console.log("action", action.payload); 
        state.user = action.payload;
    },
    setListUser: (state, action) => {
        state.listUser = action.payload;
    },
    setCurrentUser: (state, action) => {
        console.log("Setting current user:", action.payload); 
        state.currentUser = action.payload;
    },
    updateUserLoginAction: (state, action) => {
        state.currentUser = {
            ...state.currentUser, 
        };
    }
  }
});

// Export actions
export const { setListUser, setUser, setCurrentUser, updateUserLoginAction } = userReducer.actions;

// Export reducer
export default userReducer.reducer;