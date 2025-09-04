import { Search, Phone, MoreVertical } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store"; // đổi theo đúng path store của bạn

export default function ChatHeader() {
  const currentConversation = useSelector(
    (state: RootState) => state.conversations.currentConversation
  );
  const authUser = useSelector((state: RootState) => state.auth.users);

  // Nếu là group => lấy tên nhóm
  // Nếu là 1-1 => lấy tên người còn lại trong members
  const displayName = currentConversation
    ? currentConversation.isGroup
      ? currentConversation.name || "Nhóm không tên"
      : currentConversation.members.find((m: any) => m._id !== authUser._id)
          ?.username || "Người dùng"
    : "Chưa chọn hội thoại";
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h2 className="font-bold">{displayName}</h2>
        <p className="text-sm text-blue-500">Đang hoạt động</p>
      </div>
      <div className="flex space-x-3 gap-5">
        <Search className="cursor-pointer" />
        <Phone className="cursor-pointer" />
        <MoreVertical className="cursor-pointer" />
      </div>
    </div>
  );
}
