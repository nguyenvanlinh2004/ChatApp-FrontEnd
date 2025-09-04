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

const ConversationInfo = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="font-semibold mb-1">Thông tin hội thoại</h1>
      {/* Avatar + Tên */}
      <div className="flex flex-col items-center mb-6">
        <Avatar
          sx={{ width: 56, height: 56, alignItems: "center" }}
          alt="Remy Sharp"
          src="/static/images/avatar/1.jpg"
        />
        <Typography variant="h4" component="h1" sx={{ mt: 1 }} fontSize="large">
          Văn Linh
        </Typography>
      </div>

      {/* 3 nút chức năng */}
      <div className="grid grid-cols-3 justify-center gap-2 border-b pb-6 w-full">
        <div className="flex flex-col items-center cursor-pointer ml-30">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 shadow">
            <NotificationsOff fontSize="small" />
          </div>
          <span className="text-sm text-gray-700 mt-2 text-center w-20">
            Tắt thông báo
          </span>
        </div>

        <div className="flex flex-col items-center cursor-pointer">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 shadow">
            <PushPin fontSize="small" />
          </div>
          <span className="text-sm text-gray-700 mt-2 text-center w-20">
            Ghim hội thoại
          </span>
        </div>

        <div className="flex flex-col items-center cursor-pointer mr-30">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 shadow">
            <GroupAdd fontSize="small" />
          </div>
          <span className="text-sm text-gray-700 mt-2 text-center w-20">
            Tạo nhóm trò chuyện
          </span>
        </div>
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
          <div className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            <PhotoLibrary className="text-gray-500" />
          </div>
          <div className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            <PhotoLibrary className="text-gray-500" />
          </div>
          <div className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            <PhotoLibrary className="text-gray-500" />
          </div>
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
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <InsertDriveFile className="text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">
                document.pdf
              </span>
              <span className="text-xs text-gray-500">1.2 MB</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <LinkIcon className="text-gray-500" />
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

      {/* Báo xấu & Xoá lịch sử */}
      <div className="w-full mt-6 px-6 space-y-3">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
          <Report className="text-gray-600" fontSize="small" />
          <span className="text-sm text-gray-700">Báo xấu</span>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:bg-red-50 p-2 rounded-lg">
          <Delete className="text-red-500" fontSize="small" />
          <span className="text-sm text-red-500">Xoá lịch sử trò chuyện</span>
        </div>
      </div>
    </div>
  );
};

export default ConversationInfo;
