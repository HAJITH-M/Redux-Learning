import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const fetchAllUsers = createAsyncThunk(
    'users/fetchAll',
    async (_, thunkAPI) => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
      if (!response.ok) {
        return thunkAPI.rejectWithValue("Failed to fetch all users");
      }
      return await response.json();
    }
  );
  

export const fetchUserById = createAsyncThunk(
    'users/fetchById',

    async (userId, thunkAPI) => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        const data = await response.json()

        if(!response.ok){
            return thunkAPI.rejectWithValue("failed to fetch data user")
        }

        return data
    }
    
)

const initialState = {
    entities: [],
    loading: "idle",
    error: null
}


const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: builder => {
      // all users
      builder
        .addCase(fetchAllUsers.pending, (state) => {
          state.loading = 'loading';
          state.error = null;
        })
        .addCase(fetchAllUsers.fulfilled, (state, action) => {
          state.loading = 'success';
          state.entities = action.payload; // replace with all users
        })
        .addCase(fetchAllUsers.rejected, (state, action) => {
          state.loading = 'failed';
          state.error = action.payload || action.error.message;
        });
  
      // single user by ID
      builder
        .addCase(fetchUserById.pending, (state) => {
          state.loading = 'loading';
          state.error = null;
        })
        .addCase(fetchUserById.fulfilled, (state, action) => {
          state.loading = 'success';
          state.entities.push(action.payload)
        //   const existing = state.entities.find(u => u.id === action.payload.id);
        //   if (!existing) {
        //     state.entities.push(action.payload); // add if not already in list
        //   } else {
        //     Object.assign(existing, action.payload); // update if exists
        //   }
        })
        .addCase(fetchUserById.rejected, (state, action) => {
          state.loading = 'failed';
          state.error = action.payload || action.error.message;
        });
    }
  });
  


export default userSlice.reducer