import api from "./axiosConfig";
import type { Conversation } from "../types/conversation";
const conversationApi = {
  getOrCreateOneToOne: async (partnerId: string) => {
    const res = await api.post("/conversations/one-to-one", { partnerId });
    return res.data;
  },

  createGroup: async (name: string, memberIds: string[]) => {
    const res = await api.post("/conversations/group", { name, memberIds });
    return res.data; 
  },

  renameGroup: async (id: string, name: string) => {
    const res = await api.put(`/conversations/${id}/rename`, { name });
    return res.data;
  },

  updateMembers: async (id: string, action: "add" | "remove", memberIds: string[]) => {
    const res = await api.put(`/conversations/${id}/members`, { action, memberIds });
    return res.data;
  },

  myConversations: (): Promise<Conversation[]> =>
    api.get("/conversations/my"),

  searchConversations: async (q: string) => {
    const res = await api.get(`/conversations/search?q=${q}`);
    const data=res;
    return data;
  },
};

export default conversationApi;
