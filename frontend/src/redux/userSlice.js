// import { createSlice } from "@reduxjs/toolkit"

// const userSlice = createSlice({
//   name: 'user',
//   initialState: {
//    user:null
//   },
//   reducers: {
//     setuser: (state, action) => {
//       state.user = action.payload
//     }
//   }
// })
// export const { setuser } = userSlice.actions
// export default userSlice.reducer

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,         // This will hold your user object
  isAuthenticated: false,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action called when the login is successful
    setuser: (state, action) => {
      state.user = action.payload; // action.payload will be res.data.user
      state.isAuthenticated = true;
    },
    // Action called when logging out
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    // Optional: Useful if you need to track global auth loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

// Export the actions to use in your Login component
export const { setuser, logout, setLoading } = userSlice.actions;

// Export the reducer to wire it up in the store
export default userSlice.reducer;
