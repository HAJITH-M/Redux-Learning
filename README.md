`README.md`** that explains `createAsyncThunk`, `builder` in `extraReducers`, and common methods like `rejectWithValue`, `push`, `replace`, `update`, etc.,

Here’s what it could look like:

---

````markdown
# Redux Toolkit Async Thunks & Builder API Cheatsheet

This guide explains how to use `createAsyncThunk`, the `builder` API in `extraReducers`, and common patterns when working with Redux Toolkit async logic.

---

## 1️⃣ `createAsyncThunk`

### Syntax
```js
import { createAsyncThunk } from '@reduxjs/toolkit';

export const myThunk = createAsyncThunk(
  'sliceName/actionName',
  async (arg, thunkAPI) => {
    try {
      const res = await fetch(`/api/data/${arg}`);
      if (!res.ok) {
        return thunkAPI.rejectWithValue('Request failed');
      }
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
````

### Arguments

* **Type Prefix** (string) → Namespaces the generated action types.
* **Payload Creator** (function) → Async function that returns:

  * **Success:** resolved value (goes to `.fulfilled`)
  * **Error:** `thunkAPI.rejectWithValue(error)` (goes to `.rejected`)

### What it generates

`createAsyncThunk` automatically creates 3 action types:

1. **pending** → when the async operation starts
2. **fulfilled** → when the operation succeeds
3. **rejected** → when the operation fails

Example:

```txt
users/fetchById/pending
users/fetchById/fulfilled
users/fetchById/rejected
```

---

## 2️⃣ `thunkAPI` helpers

Inside the payload creator function, you can use:

* `thunkAPI.dispatch(action)` → Dispatch another action inside the thunk.
* `thunkAPI.getState()` → Access the current Redux state.
* `thunkAPI.rejectWithValue(value)` → Return a custom error payload to `.rejected`.

---

## 3️⃣ Handling thunk actions in `extraReducers`

`extraReducers` handles actions that aren’t defined in your `reducers` object (like async thunk actions).

### **Builder Callback Syntax**

```js
extraReducers: builder => {
  builder
    .addCase(myThunk.pending, (state) => {
      state.loading = 'loading';
      state.error = null;
    })
    .addCase(myThunk.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      state.entities = action.payload;
    })
    .addCase(myThunk.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.payload || action.error.message;
    });
}
```

**Common `builder` methods:**

* `.addCase(actionCreator, reducer)` → Handle a specific action.
* `.addMatcher(matcherFn, reducer)` → Handle multiple actions matching a condition.
* `.addDefaultCase(reducer)` → Fallback for unmatched actions.

---

## 4️⃣ Common State Update Patterns

Inside your reducers/extraReducers, you can use **mutating syntax** (thanks to Immer).

### Replace entire array

```js
state.entities = action.payload;
```

### Push a single new item

```js
state.entities.push(action.payload);
```

### Update an existing item

```js
const existing = state.entities.find(u => u.id === action.payload.id);
if (existing) {
  Object.assign(existing, action.payload);
}
```

### Remove an item

```js
state.entities = state.entities.filter(u => u.id !== action.payload);
```

---

## 5️⃣ Example: Fetch All + Fetch By ID

```js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Fetch all users
export const fetchAllUsers = createAsyncThunk('users/fetchAll', async (_, thunkAPI) => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!res.ok) return thunkAPI.rejectWithValue('Failed to fetch all users');
  return res.json();
});

// Fetch single user by ID
export const fetchUserById = createAsyncThunk('users/fetchById', async (id, thunkAPI) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) return thunkAPI.rejectWithValue('Failed to fetch user');
  return res.json();
});

const userSlice = createSlice({
  name: 'users',
  initialState: { entities: [], loading: 'idle', error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.entities = action.payload;
      })
      // Fetch single user
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const existing = state.entities.find(u => u.id === action.payload.id);
        if (!existing) {
          state.entities.push(action.payload);
        } else {
          Object.assign(existing, action.payload);
        }
      });
  }
});

export default userSlice.reducer;
```

---

## 6️⃣ Tips

* Use `rejectWithValue` to send **custom error messages** instead of generic ones.
* Always check if an item already exists before `push` to avoid duplicates.
* Keep `loading` and `error` states for a better user experience.
* Use `.unwrap()` in components if you want to handle async results with `try/catch` directly.

```js
try {
  const user = await dispatch(fetchUserById(1)).unwrap();
  console.log(user);
} catch (err) {
  console.error(err);
}
```


