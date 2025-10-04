import ChatListItem from "./ChatListItem1";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchMyConversations,
  setCurrentConversation,
} from "../redux/silces/conversationSlice";
import { useEffect, useState } from "react";
import UserListPopup from "./popup/UserList";
import { useMediaQuery } from "@mui/material";

export default function ChatList({ onSelect }: { onSelect?: () => void }) {
  const currentUserId = localStorage.getItem("userId");
  const dispatch = useAppDispatch();
  const { conversations, loading, error, currentConversation } = useAppSelector(
    (s) => s.conversations
  );
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [openUserList, setOpenUserList] = useState(false);

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    dispatch(fetchMyConversations());
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(inputValue);
    }, 500);
    return () => clearTimeout(timeout);
  }, [inputValue]);

  if (loading)
    return <div className="p-3">Đang tải danh sách hội thoại...</div>;
  if (error) return <div className="p-3 text-red-500">{error}</div>;

  const filteredConversations = conversations.filter((c) => {
    const name = c.isGroup
      ? (c.name as string) || "Nhóm không tên"
      : (
          c.members.find((m: any) => m._id !== currentUserId) as {
            username?: string;
          }
        )?.username || "Người dùng";

    const id = (c._id as string) || "";
    return (
      id.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div
      className={`flex flex-col border-gray-200 ${
        isMobile ? "h-full" : "w-full sm:w-80"
      }`}
    >
      {/* Search box */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden space-y-2 px-2 pb-16 sm:pb-2">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((c) => (
            <div
              key={c._id}
              onClick={() => {
                dispatch(setCurrentConversation(c));
                if (onSelect) onSelect();
              }}
            >
              <ChatListItem
                avatar={
                  (
                    c.members.find((m: any) => m._id !== currentUserId) as {
                      avatar?: string;
                    }
                  )?.avatar || ""
                }
                name={
                  c.isGroup
                    ? String(c.name || "Nhóm không tên")
                    : String(
                        (
                          c.members.find(
                            (m: any) => m._id !== currentUserId
                          ) as { username?: string }
                        )?.username || "Người dùng"
                      )
                }
                lastMessage={c.lastMessage?.text || "Chưa có tin nhắn"}
                time={c.lastMessage?.createdAt || ""}
                active={currentConversation?._id === c._id}
              />
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm p-3">
            <p>Chưa có cuộc trò chuyện nào.</p>
            <button
              onClick={() => setOpenUserList(true)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
              Thêm bạn bè
            </button>
          </div>
        )}
      </div>
      <UserListPopup
        open={openUserList}
        onClose={() => setOpenUserList(false)}
      />
    </div>
  );
}
