import { Avatar, Switch, Typography } from "@mui/material";
import {
  NotificationsOff,
  PushPin,
  GroupAdd,
  PhotoLibrary,
  InsertDriveFile,
  Report,
  VisibilityOff,
  AccessTime,
  ExpandMore,
} from "@mui/icons-material";
import { Delete, Link as LinkIcon } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useAppSelector } from "../redux/hooks";
import { FILE_URL } from "../api/URL";

const ConversationInfo = () => {
  const currentConversation = useSelector(
    (state: RootState) => state.conversations.currentConversation
  );
  const { currentUser } = useAppSelector((s) => s.user);
  const currentUserId = currentUser?._id;

  const avatar = currentConversation
    ? currentConversation.isGroup
      ? currentConversation.name || "Nhóm không tên"
      : (
          currentConversation.members.find(
            (m: any) => m._id !== currentUserId
          ) as { avatar?: string }
        )?.avatar || ""
    : "";

  const displayName = currentConversation
    ? currentConversation.isGroup
      ? currentConversation.name || "Nhóm không tên"
      : (
          currentConversation.members.find(
            (m: any) => m._id !== currentUserId
          ) as { username?: string }
        )?.username || "Người dùng"
    : "";

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header */}
      <h1 className="font-semibold mb-2 text-lg text-gray-800">
        Thông tin hội thoại
      </h1>
      <div className="flex flex-col items-center mb-6">
        <Avatar
          sx={{ width: 64, height: 64 }}
          alt={displayName}
          src={FILE_URL + avatar}
        />
        <Typography variant="h6" component="h2" sx={{ mt: 1, fontWeight: 600 }}>
          {displayName}
        </Typography>
      </div>

      {/* 3 nút chức năng */}
      <div className="grid grid-cols-3 gap-4 border-b pb-6 w-full">
        {[
          {
            icon: <NotificationsOff fontSize="small" />,
            label: "Tắt thông báo",
          },
          { icon: <PushPin fontSize="small" />, label: "Ghim hội thoại" },
          { icon: <GroupAdd fontSize="small" />, label: "Tạo nhóm" },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition transform hover:scale-105 shadow-sm">
              {item.icon}
            </div>
            <span className="text-sm text-gray-700 mt-2 text-center">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Ảnh/Video */}
      <div className="w-full mt-6 px-6 border-b pb-6">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-800">Ảnh/Video</span>
          <span className="text-blue-500 text-sm cursor-pointer hover:underline">
            Xem tất cả
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition"
            >
              <PhotoLibrary className="text-gray-500" />
            </div>
          ))}
        </div>
      </div>

      {/* File & Link */}
      <div className="w-full mt-6 px-6 border-b pb-6">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-800">File & Link</span>
          <span className="text-blue-500 text-sm cursor-pointer hover:underline">
            Xem tất cả
          </span>
        </div>

        <div className="mt-3 space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
            <InsertDriveFile className="text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">
                document.pdf
              </span>
              <span className="text-xs text-gray-500">1.2 MB</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
            <LinkIcon className="text-gray-500" size={18} />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800 truncate w-40">
                https://example.com/bai-viet
              </span>
              <span className="text-xs text-gray-500">Link</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thiết lập bảo mật */}
      <div className="w-full mt-6 px-6 border-b pb-6">
        <div className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-gray-800">Thiết lập bảo mật</span>
          <ExpandMore className="text-gray-600" />
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AccessTime className="text-gray-500" fontSize="small" />
              <span className="text-sm text-gray-700">Tin nhắn tự xoá</span>
            </div>
            <span className="text-xs text-gray-500">Không bao giờ</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <VisibilityOff className="text-gray-500" fontSize="small" />
              <span className="text-sm text-gray-700">Ẩn trò chuyện</span>
            </div>
            <Switch size="small" />
          </div>
        </div>
      </div>
      <div className="w-full mt-6 px-6 space-y-3">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition">
          <Report className="text-gray-600" fontSize="small" />
          <span className="text-sm text-gray-700">Báo xấu</span>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:bg-red-50 p-2 rounded-lg transition">
          <Delete className="text-red-500" size={16} />
          <span className="text-sm text-red-500">Xoá lịch sử trò chuyện</span>
        </div>
      </div>
    </div>
  );
};

export default ConversationInfo;
