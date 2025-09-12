import { configureStore } from "@reduxjs/toolkit";
import conversationReducer from "./silces/conversationSlice";
import authReducer from "./silces/authSlice";
import messagesReducer from "./silces/messageSlice";
import searchReducer from "./silces/searchSlice";
import userReducer from "./silces/userSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationReducer,
    messages: messagesReducer,
    search: searchReducer,
    user:userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
