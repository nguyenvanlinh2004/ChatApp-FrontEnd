import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const fetchMe = createAsyncThunk("user/fetchMe", async (_, thunkAPI) => {
  try {
    const res = await userApi.me();
    console.log("ususudas",res)
    return res as User;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || "Lỗi khi lấy user");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
