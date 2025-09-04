// redux/messageSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import messageApi from "../../api/messageApi";

// Kiểu dữ liệu message
export interface Message {
  _id: string;
  conversationId: string;
  sender: string; // userId
  text?: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  seenBy: string[];
}

// Kiểu dữ liệu state
interface MessageState {
  items: Message[];
  loading: boolean;
  error: string | null;
  nextCursor?: string | null; // phân trang
}

const initialState: MessageState = {
  items: [],
  loading: false,
  error: null,
  nextCursor: null,
};

//
// ------------------- ASYNC ACTIONS -------------------
//

// Lấy messages theo conversationId
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const res = await messageApi.getMessages(conversationId);
      // API trả về { items, nextCursor }
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Gửi message
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
      return res; // 1 object message
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Đánh dấu message đã đọc
export const markAsRead = createAsyncThunk(
  "messages/markAsRead",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await messageApi.markAsRead(id);
      return res; // message sau khi update seenBy
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//
// ------------------- SLICE -------------------
//

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.items = [];
      state.nextCursor = null;
    },
    // Thêm message mới từ socket realtime
    addMessageRealtime: (state, action: PayloadAction<Message>) => {
      state.items.push(action.payload);
    },
    // Update message từ socket realtime (vd: seenBy)
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
