import { MessageCircle, Users, User, LogOut } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import OpenProfilePopup from "./popup/OpenProfilePopup";
import UpdateProfilePopup from "./popup/UpdateProfilePopup";
import UserListPopup from "./popup/UserList";
import LogoutDialog from "../dialog/LogOutDialog";
import { Avatar, useMediaQuery } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { FILE_URL } from "../api/URL";

type SidebarProps = {
  onOpenChat?: () => void; // 👈 thêm props này
};

export default function Sidebar({ onOpenChat }: SidebarProps) {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openUserList, setOpenUserList] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { currentUser } = useAppSelector((s) => s.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <div
      className={`${
        isMobile
          ? "fixed bottom-0 left-0 right-0 flex justify-around items-center bg-[#0f172a] h-14"
          : "w-15 flex flex-col bg-[#0f172a] p-2 justify-between"
      }`}
    >
      {isMobile ? (
        // 📱 Mobile
        <>
          <SidebarItem
            icon={<MessageCircle />}
            label="Chat"
            onClick={onOpenChat} // 👈 gọi hàm từ props
          />
          <SidebarItem
            icon={<Users />}
            label="Bạn bè"
            onClick={() => setOpenUserList(true)}
          />
          <SidebarItem
            icon={<User />}
            label="Hồ sơ"
            onClick={() => setOpenProfile(true)}
          />
          <SidebarItem
            icon={<LogOut />}
            label="Đăng xuất"
            onClick={() => setLogoutOpen(true)}
          />
        </>
      ) : (
        // 🖥️ Desktop
        <>
          <div>
            <Avatar
              src={FILE_URL + currentUser?.avatar}
              alt="haha"
              className="mb-4"
            />
            <SidebarItem icon={<MessageCircle />} label="Chat" />
            <SidebarItem
              icon={<Users />}
              label="Bạn bè"
              onClick={() => setOpenUserList(true)}
            />
          </div>
          <div className="mb-10">
            <SidebarItem
              icon={<User />}
              label="Hồ sơ"
              onClick={() => setOpenProfile(true)}
            />
            <SidebarItem
              icon={<LogOut />}
              label="Đăng xuất"
              onClick={() => setLogoutOpen(true)}
            />
          </div>
        </>
      )}

      {/* Popup/Dialog */}
      {openProfile && (
        <OpenProfilePopup
          open={openProfile}
          onClose={() => setOpenProfile(false)}
          onEdit={() => setOpenEdit(true)}
        />
      )}
      {openEdit && (
        <UpdateProfilePopup
          open={openEdit}
          onClose={() => setOpenEdit(false)}
        />
      )}
      {openUserList && (
        <UserListPopup
          open={openUserList}
          onClose={() => setOpenUserList(false)}
        />
      )}
      <LogoutDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
