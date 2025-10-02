import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface LogoutDialog {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutDialog({
  open,
  onClose,
  onConfirm,
}: LogoutDialog) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Đăng xuất</DialogTitle>
      <DialogContent>
        <p>Bạn có chắc chắn muốn đăng xuất?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          
          variant="contained"
        >
          Đăng xuất
        </Button>
      </DialogActions>
    </Dialog>
  );
}
