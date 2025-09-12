import { Search, Phone, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useState } from "react";
import { setSearchKeyword } from "../redux/silces/searchSlice";

export default function ChatHeader() {
  const dispatch = useDispatch();
  const currentConversation = useSelector(
    (state: RootState) => state.conversations.currentConversation
  );
  const authUser = useSelector((state: RootState) => state.auth.users);
  const keyword = useSelector((state: RootState) => state.search.keyword);
  const [searchMode, setSearchMode] = useState(false);

  const displayName = currentConversation
    ? currentConversation.isGroup
      ? currentConversation.name || "Nhóm không tên"
      : currentConversation.members.find((m: any) => m._id !== authUser._id)
          ?.username || "Người dùng"
    : "Chưa chọn hội thoại";
  return (
    <div className="flex items-center justify-between p-4 border-b">
      {searchMode ? (
        <input
          autoFocus
          value={keyword}
          onChange={(e) => dispatch(setSearchKeyword(e.target.value))}
          placeholder="Tìm tin nhắn..."
          className="flex-1 px-3 py-1 border rounded-lg focus:outline-none focus:ring"
        />
      ) : (
        <div>
          <h2 className="font-bold">{displayName}</h2>
          <p className="text-sm text-blue-500">Đang hoạt động</p>
        </div>
      )}
      <div className="flex space-x-3 gap-5">
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
        <Phone className="cursor-pointer" />
      </div>
    </div>
  );
}
