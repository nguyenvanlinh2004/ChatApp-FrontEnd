import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import userApi, { type User } from "../../api/userApi";

interface UserState {
  currentUser: User | null;
  list: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  list: [],
  loading: false,
  error: null,
};

// Lấy user hiện tại
export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
  "user/fetchMe",
  async (_, thunkAPI) => {
    try {
      const user = await userApi.me();
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Lỗi khi lấy user"
      );
    }
  }
);

// Lấy danh sách tất cả user
export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("user/fetchUsers", async (_, thunkAPI) => {
  try {
    const res = (await userApi.all()) as unknown as User[];
    return res;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Lỗi khi lấy danh sách user"
    );
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchMe
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
      })

      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
