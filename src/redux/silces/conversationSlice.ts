import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit"
import conversationApi from "../../api/conversationApi";

export interface Conversation {
  _id: string;
  name?: string;
  isGroup: boolean;
  members: string[];
  lastMessage?: string;
  
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
      return rejectWithValue(err.response?.data?.message || "Lỗi tải hội thoại");
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
  "conversations/getOrCreateOneToOne",
  async (partnerId: string, { rejectWithValue }) => {
    try {
      return await conversationApi.getOrCreateOneToOne(partnerId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Lỗi tạo hội thoại 1-1");
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
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMyConversations
      .addCase(fetchMyConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
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
        const exists = state.conversations.find((c) => c._id === action.payload._id);
        if (!exists) {
          state.conversations.push(action.payload);
        }
        state.currentConversation = action.payload;
      });
  },
});

export const { setCurrentConversation, setConversations } = conversationSlice.actions;
export default conversationSlice.reducer;
