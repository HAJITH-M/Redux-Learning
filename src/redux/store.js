import { configureStore } from "@reduxjs/toolkit";
import modelReducer from "./features/modelslice/modelSlice";
import  userReducer  from "./features/userSlice/userSlice";

const store = configureStore({
    reducer:{
        model: modelReducer,
        users: userReducer
    }
})

export default store