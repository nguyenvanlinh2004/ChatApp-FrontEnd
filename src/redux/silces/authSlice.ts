import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userId: string | null;
  token: string | null;
  users: any|null; 
}

const initialState: AuthState = {
  userId: null,
  token: null,
  users: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUsers: (state, action: PayloadAction<any>) => {
      state.users = action.payload;
    },
    logout: (state) => {
      state.userId = null;
      state.token = null;
      state.users = [];
    },
  },
});

export const { setUserId, setToken, setUsers, logout } = authSlice.actions;
export default authSlice.reducer;
