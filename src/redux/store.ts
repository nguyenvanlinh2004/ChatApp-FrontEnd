import { configureStore } from "@reduxjs/toolkit";
import conversationReducer from "./silces/conversationSlice";
import authReducer from "./silces/authSlice"

export const store = configureStore({
  reducer: {
    auth:authReducer,
    conversations: conversationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
