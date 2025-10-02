import api from "./axiosConfig";
import type { Conversation } from "../types/conversation";
const conversationApi = {
  getOrCreateOneToOne: async (partnerId: string): Promise<Conversation> => {
    const res = await api.post<Conversation>("/conversations/one-to-one", {
      partnerId,
    });
    return res as unknown as Conversation;
  },

  createGroup: async (name: string, memberIds: string[]) => {
    const res = await api.post("/conversations/group", { name, memberIds });
    return res.data;
  },

  renameGroup: async (id: string, name: string) => {
    const res = await api.put(`/conversations/${id}/rename`, { name });
    return res.data;
  },

  updateMembers: async (
    id: string,
    action: "add" | "remove",
    memberIds: string[]
  ) => {
    const res = await api.put(`/conversations/${id}/members`, {
      action,
      memberIds,
    });
    return res.data;
  },

  myConversations: async (): Promise<Conversation[]> => {
    const res: Conversation[] = await api.get("/conversations/my");
    return res;
  },

  searchConversations: async (q: string) => {
    const res = await api.get(`/conversations/search?q=${q}`);
    const data = res;
    return data;
  },
};

export default conversationApi;
