import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Box,
  Avatar,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { setUsers } from "../../redux/silces/authSlice";
import userApi from "../../api/userApi";
import { useAppSelector } from "../../redux/hooks";
import { FILE_URL } from "../../api/URL";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UpdateProfilePopup({ open, onClose }: Props) {
  const { currentUser } = useAppSelector((s) => s.user);
  console.log(currentUser)
  const dispatch = useDispatch();

  const [username, setUsername] = useState(currentUser?.username || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (avatarFile) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else if (currentUser?.avatar) {
      setPreviewUrl(currentUser.avatar);
    } else {
      setPreviewUrl("");
    }
  }, [avatarFile, currentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      const updated = new FormData();
      updated.append("username", username);
      if (avatarFile) {
        updated.append("avatar", avatarFile);
      }

      const res = await userApi.update(updated);
      dispatch(setUsers(res));
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Cập nhật thông tin cá nhân
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
          <input
            type="file"
            id="avatar-input"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
          <label htmlFor="avatar-input">
            <Avatar
              src={FILE_URL+previewUrl}
              alt="avatar"
              sx={{
                width: 80,
                height: 80,
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
              }}
            />
          </label>
        </Box>

        <TextField
          fullWidth
          label="Tên"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Nếu muốn giữ nút chọn ảnh thì bỏ comment phần này */}
        {/* 
        <Box sx={{ mt: 3 }}>
          <Button variant="outlined" component="label">
            Chọn ảnh đại diện
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
          {avatarFile && (
            <Box sx={{ mt: 1, fontSize: 14, color: "text.secondary" }}>
              {avatarFile.name}
            </Box>
          )}
        </Box>
        */}

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
        >
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Lưu
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
