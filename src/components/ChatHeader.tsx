import { Search, Phone, X, Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useState } from "react";
import { setSearchKeyword } from "../redux/silces/searchSlice";
import { useAppSelector } from "../redux/hooks";
import { useMediaQuery } from "@mui/material";
import ConversationInfo from "./ConversationInfo1";

export default function ChatHeader() {
  const dispatch = useDispatch();
  const currentConversation = useSelector(
    (state: RootState) => state.conversations.currentConversation
  );
  const keyword = useSelector((state: RootState) => state.search.keyword);
  const [searchMode, setSearchMode] = useState(false);

  const { currentUser } = useAppSelector((s) => s.user);
  const currentUserId = currentUser?._id;
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [showInfo, setShowInfo] = useState(false);

  // Hiển thị tên hội thoại
  const displayName = currentConversation
    ? currentConversation.isGroup
      ? currentConversation.name || "Nhóm không tên"
      : (
          currentConversation.members.find(
            (m) => (m as unknown as { _id: string })._id !== currentUserId
          ) as { _id: string; username: string } | undefined
        )?.username || "Người dùng"
    : "Chưa chọn hội thoại";

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
      {/* Trái: tên hoặc ô tìm kiếm */}
      {searchMode ? (
        <input
          autoFocus
          value={keyword}
          onChange={(e) => dispatch(setSearchKeyword(e.target.value))}
          placeholder="Tìm tin nhắn..."
          className="flex-1 px-3 py-1 border rounded-lg focus:outline-none focus:ring"
        />
      ) : (
        <div className="flex flex-col">
          <h2 className="font-bold">{displayName}</h2>
          <p className="text-sm text-blue-500">Đang hoạt động</p>
        </div>
      )}

      {/* Phải: icon hành động */}
      <div className="flex items-center gap-4 ml-4">
        {searchMode ? (
          <X
            className="cursor-pointer hover:text-red-500"
            onClick={() => {
              setSearchMode(false);
              dispatch(setSearchKeyword(""));
            }}
          />
        ) : (
          <Search
            className="cursor-pointer hover:text-blue-500"
            onClick={() => setSearchMode(true)}
          />
        )}

        <Phone className="cursor-pointer hover:text-green-500" />

        {/* Chỉ hiện icon info trên mobile */}
        {isMobile && (
          <Info
            className="cursor-pointer hover:text-blue-500"
            onClick={() => setShowInfo(true)}
          />
        )}
        {isMobile && showInfo && (
          <div className="fixed inset-0 z-50 flex w-full">
            {/* overlay */}
            <div
              className="flex-1 bg-black bg-opacity-40"
              onClick={() => setShowInfo(false)}
            />

            {/* content */}
            <div className="relative w-full h-full bg-white animate-slide-up overflow-y-auto scrollbar-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-bold">Thông tin hội thoại</h2>
                <X
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => setShowInfo(false)}
                />
              </div>
              <ConversationInfo />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
