import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../store/redux/reducers/userReducer'
export const store=configureStore({
        reducer:{
            userReducer
        }
    })