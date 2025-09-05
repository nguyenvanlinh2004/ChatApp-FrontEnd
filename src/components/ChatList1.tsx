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

  useEffect(() => {
    dispatch(fetchMyConversations());
  }, [dispatch]);

  if (loading)
    return <div className="p-3">Đang tải danh sách hội thoại...</div>;
  if (error) return <div className="p-3 text-red-500">{error}</div>;

  return (
    <div className="p-3 w-full border-gray-200 flex flex-col">
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
                  : c.members.find((m) => m._id !== currentUserId)?.username ||
                    "Người dùng"
              }
              lastMessage={c.lastMessage?.text || "Chưa có tin nhắn"}
              time={c.lastMessage?.createdAt || ""}
              active={currentConversation?._id === c._id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
