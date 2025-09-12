import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { setUsers } from "../../redux/silces/authSlice";
import userApi from "../../api/userApi";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UpdateProfilePopup({ open, onClose }: Props) {
  const user = useSelector((s: RootState) => s.auth.users);
  const dispatch = useDispatch();

  const [username, setUsername] = useState(user?.username || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleSave = async () => {
    try {
      const updated = new FormData();
      updated.append("username", username);
      if (avatarFile) {
        updated.append("avatar", avatarFile);
      }

      const res = await userApi.update(updated);
      dispatch(setUsers(res.data));
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="flex justify-between items-center">
        Cập nhật thông tin cá nhân
        <IconButton onClick={onClose}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent className="space-y-4">
        {/* Tên hiển thị */}
        <TextField
          fullWidth
          label="Tên hiển thị"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Ảnh đại diện */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setAvatarFile(e.target.files ? e.target.files[0] : null)
          }
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Lưu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
