
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import messageApi from "../../api/messageApi";

export interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  text?: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  seenBy: string[];
}

interface MessageState {
  items: Message[];
  loading: boolean;
  error: string | null;
  nextCursor?: string | null; 
}

const initialState: MessageState = {
  items: [],
  loading: false,
  error: null,
  nextCursor: null,
};

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const res = await messageApi.getMessages(conversationId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (
    {
      conversationId,
      text,
      imageUrl,
    }: { conversationId: string; text?: string; imageUrl?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await messageApi.sendMessage({
        conversationId,
        text,
        imageUrl,
      });
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  "messages/markAsRead",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await messageApi.markAsRead(id);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.items = [];
      state.nextCursor = null;
    },
    addMessageRealtime: (state, action: PayloadAction<Message>) => {
      state.items.push(action.payload);
    },
    updateMessageRealtime: (state, action: PayloadAction<Message>) => {
      const idx = state.items.findIndex((m) => m._id === action.payload._id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // fetchMessages
    builder.addCase(fetchMessages.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchMessages.fulfilled,
      (
        state,
        action: PayloadAction<{ items: Message[]; nextCursor?: string }>
      ) => {
        state.loading = false;
        state.items = action.payload.items;
        state.nextCursor = action.payload.nextCursor || null;
      }
    );
    builder.addCase(fetchMessages.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    // sendMessage
    builder.addCase(
      sendMessage.fulfilled,
      (state, action: PayloadAction<Message>) => {
        state.items.push(action.payload);
      }
    );

    // markAsRead
    builder.addCase(
      markAsRead.fulfilled,
      (state, action: PayloadAction<Message>) => {
        const idx = state.items.findIndex((m) => m._id === action.payload._id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      }
    );
  },
});

export const { clearMessages, addMessageRealtime, updateMessageRealtime } =
  messageSlice.actions;

export default messageSlice.reducer;
