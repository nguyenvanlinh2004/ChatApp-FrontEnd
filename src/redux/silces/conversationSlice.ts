import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import conversationApi from "../../api/conversationApi";

export interface User {
  _id: string;
  username: string;
  avatar?: string;
  fullName?: string;
}
export interface LastMessage {
  _id?: string;
  text?: string;
  sender?: string;
  createdAt?: string;
}
export interface Conversation {
  _id?: string;
  name?: string;
  isGroup: boolean;
  members: string[];
  lastMessage?: LastMessage;
}

interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConversationState = {
  conversations: [],
  currentConversation: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchMyConversations = createAsyncThunk(
  "conversations/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      return await conversationApi.myConversations();
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi tải hội thoại"
      );
    }
  }
);

export const createGroupConversation = createAsyncThunk(
  "conversations/createGroup",
  async (
    { name, memberIds }: { name: string; memberIds: string[] },
    { rejectWithValue }
  ) => {
    try {
      return await conversationApi.createGroup(name, memberIds);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Lỗi tạo nhóm");
    }
  }
);

export const getOrCreateOneToOne = createAsyncThunk(
  "conversations/one-to-one",
  async (partnerId: string, { rejectWithValue }) => {
    try {
      const conv = await conversationApi.getOrCreateOneToOne(partnerId);
      console.log("Conversation fetched:", conv);
      return conv;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi tạo hội thoại 1-1"
      );
    }
  }
);
// Slice
const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    setCurrentConversation: (
      state,
      action: PayloadAction<Conversation | null>
    ) => {
      state.currentConversation = action.payload;
    },
    updateConversationLastMessage: (state, action) => {
      const { conversationId, lastMessage } = action.payload;
      const conv = state.conversations.find((c) => c._id === conversationId);
      if (conv) {
        conv.lastMessage = lastMessage;
        state.conversations = [
          conv,
          ...state.conversations.filter((c) => c._id !== conversationId),
        ];
      }
    },
    addConversation: (state, action: PayloadAction<any>) => {
      if (!action.payload?._id) return;
      console.log("Adding conversation:", action.payload._id);
      const exists = state.conversations.find(
        (c) => c._id === action.payload._id
      );
      if (!exists) state.conversations.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyConversations.fulfilled, (state, action) => {
        console.log("payload conversations:", action.payload);
        state.loading = false;
        state.conversations = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchMyConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // createGroupConversation
      .addCase(createGroupConversation.fulfilled, (state, action) => {
        state.conversations.push(action.payload);
      })

      // getOrCreateOneToOne
      .addCase(getOrCreateOneToOne.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const exists = state.conversations.find(
          (c) => c._id === action.payload._id
        );
        if (!exists) {
          state.conversations.push(action.payload);
        }
        state.currentConversation = action.payload;
      });
  },
});

export const {
  setCurrentConversation,
  setConversations,
  addConversation,
  updateConversationLastMessage,
} = conversationSlice.actions;
export default conversationSlice.reducer;
