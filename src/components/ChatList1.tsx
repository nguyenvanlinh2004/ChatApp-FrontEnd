import ChatListItem from "./ChatListItem1";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchMyConversations,
  setCurrentConversation,
} from "../redux/silces/conversationSlice";
import { useEffect } from "react";

export default function ChatList() {
  const currentUserId = localStorage.getItem("userId");
  const dispatch = useAppDispatch();
  const { conversations, loading, error, currentConversation } = useAppSelector(
    (s) => s.conversations
  );
  console.log("oaiuichsnisaugysvcbasc", conversations);
  useEffect(() => {
    dispatch(fetchMyConversations());
  }, [dispatch]);

  if (loading)
    return <div className="p-3">Đang tải danh sách hội thoại...</div>;
  if (error) return <div className="p-3 text-red-500">{error}</div>;

  function formatTime(isoString?: string) {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return (
    <div className="p-3 w-64 border-r border-gray-200 flex flex-col">
      {/* Search box */}
      <input
        type="text"
        placeholder="Search..."
        className="w-full px-3 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
      />

      {/* List */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-2">
        {conversations.map((c) => (
          <div key={c._id} onClick={() => dispatch(setCurrentConversation(c))}>
            <ChatListItem
              name={
                c.isGroup
                  ? c.name
                  : c.members.find((m) => m._id !== currentUserId)?.username
              }
              lastMessage={c.lastMessage?.text || "Chưa có tin nhắn"}
              time={formatTime(c.lastMessage?.createdAt)|| ""}
              active={currentConversation?._id === c._id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
