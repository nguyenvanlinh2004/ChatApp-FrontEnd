import {
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchMe } from "../../redux/silces/userSlice";
import { useEffect } from "react";
interface Props {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function OpenProfilePopup({ open, onClose, onEdit }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const { currentUser, loading } = useSelector((s: RootState) => s.user);
  console.log("úe",currentUser)

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  if (loading) return <p>Đang tải...</p>;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="flex justify-between items-center">
        Thông tin tài khoản
        <IconButton onClick={onClose}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <div className="flex flex-col items-center gap-3">
          <Avatar
            src={currentUser?.avatar || ""}
            alt={currentUser?.username || "User"}
            sx={{ width: 80, height: 80 }}
          />

          <h2 className="text-lg font-semibold">{currentUser?.username}</h2>

          <div className="w-full mt-4 space-y-2 text-sm text-gray-700">
            <p>
              <strong>Tên:</strong> {currentUser?.username || "Chưa có"}
            </p>
            <p>
              <strong>Email:</strong> {currentUser?.email}
            </p>
          </div>
          <div className="mt-6">
            <Button
              variant="outlined"
              onClick={() => {
                onClose();
                onEdit();
              }}
            >
              Cập nhật
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
