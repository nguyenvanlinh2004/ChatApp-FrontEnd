import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: { keyword: "" },
  reducers: {
    setSearchKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    clearSearch: (state) => {
      state.keyword = "";
    },
  },
});

export const { setSearchKeyword, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
