import { useEffect } from "react";
import { FILE_URL } from "../../api/URL";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchUsers } from "../../redux/silces/userSlice";
import {
  getOrCreateOneToOne,
  setCurrentConversation,
  addConversation,
  fetchMyConversations,
} from "../../redux/silces/conversationSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
} from "@mui/material";
import { X } from "lucide-react";

interface UserListPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function UserListPopup({ open, onClose }: UserListPopupProps) {
  const dispatch = useAppDispatch();
  const { list: users, currentUser } = useAppSelector((s) => s.user);
  const currentUserId = currentUser?._id;

  useEffect(() => {
    if (open) dispatch(fetchUsers());
  }, [dispatch, open]);

  const handleClickUser = async (userId: string) => {
    try {
      let conv = await dispatch(getOrCreateOneToOne(userId)).unwrap();
      dispatch(fetchMyConversations());
      const selectedUser = users.find((u) => u._id === userId);

      if (conv && !conv.isGroup && conv.members.length === 1 && selectedUser) {
        conv = {
          ...conv,
          members: [...conv.members, selectedUser._id],
        };
      }

      dispatch(addConversation(conv));
      dispatch(setCurrentConversation(conv));
      onClose();
    } catch (err) {
      console.error("Lỗi tạo conversation:", err);
    }
  };

  if (!open) return null;

  const filteredUsers = (users || []).filter((u) => u._id !== currentUserId);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="flex justify-between items-center">
        <span className="text-lg font-semibold">Chọn 1 người bạn muốn trò chuyện</span>
        <IconButton onClick={onClose}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <div className="flex flex-col space-y-2">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <div
                key={u._id}
                className="flex text-center items-center p-2 rounded-2xl cursor-pointer text-gray-700 hover:bg-gray-100"
                onClick={() => handleClickUser(u._id)}
              >
                <Avatar
                  src={FILE_URL + u.avatar}
                  alt="avatar"
                  sx={{ marginRight: 2 }}
                />
                {u.username}
              </div>
            ))
          ) : (
            <div className="text-gray-500">Không có ai để nhắn tin cả</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
