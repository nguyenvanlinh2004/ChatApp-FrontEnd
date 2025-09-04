import axiosClient from "./axiosConfig";

const messageApi = {
  getMessages: async (conversationId: string) => {
    const res = await axiosClient.get(`/messages/${conversationId}`);
    console.log("API /messages trả về:", res);
    return res.data ?? res;
  },

  sendMessage: async (data: {
    conversationId: string;
    text?: string;
    imageUrl?: string;
  }) => {
    const res = await axiosClient.post("/messages", data);
    return res.data;
  },

  markAsRead: async (messageId: string) => {
    const res = await axiosClient.post(`/messages/${messageId}/read`);
    return res.data;
  },
};

export default messageApi;
