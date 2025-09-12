import {
  Home,
  Briefcase,
  Users,
  Newspaper,
  Archive,
  User,
  Edit3,
  LogOut,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import OpenProfilePopup from "./popup/OpenProfilePopup";
import UpdateProfilePopup from "./popup/UpdateProfilePopup";

export default function Sidebar() {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center py-4 space-y-6">
      <SidebarItem icon={<Home />} />
      <SidebarItem icon={<Briefcase />} />
      <SidebarItem icon={<Users />} />
      <SidebarItem icon={<Newspaper />} />
      <SidebarItem icon={<Archive />} />
      <SidebarItem icon={<User />} onClick={() => setOpenProfile(true)} />
      <SidebarItem icon={<Edit3 />} />
      <SidebarItem icon={<LogOut />} onClick={handleLogout} />
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
    </div>
  );
}
