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
        console.log("action", action.payload); // Debug action payload
        state.user = action.payload;
        const userId = action.payload.id;
        localStorage.setItem('userId', userId); // Giả sử bạn lưu userId trong localStorage
    },
    setListUser: (state, action) => {
        state.listUser = action.payload;
    },
    setCurrentUser: (state, action) => {
        console.log("Setting current user:", action.payload); // Debug action payload
        state.currentUser = action.payload;
    },
    updateUserLoginAction: (state, action) => {
        state.currentUser = {
            ...state.currentUser, // Sửa từ state.userLogin thành state.currentUser
            ...action.payload
        };
    }
  }
});

// Export actions
export const { setListUser, setUser, setCurrentUser, updateUserLoginAction } = userReducer.actions;

// Export reducer
export default userReducer.reducer;