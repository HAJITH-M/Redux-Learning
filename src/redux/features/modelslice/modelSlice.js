import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen : false
}

const modelSlice = createSlice({
    name:'model',
    initialState,
    reducers:{
      
        toggle: (state) =>{
            state.isOpen = !state.isOpen
            console.log(state.isOpen)
        }   
    }
})

export const {open, close, toggle} = modelSlice.actions
export default modelSlice.reducer