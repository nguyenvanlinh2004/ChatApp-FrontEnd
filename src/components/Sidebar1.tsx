import { Home, Briefcase, Users, Newspaper, Archive, User, Edit3, LogOut } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xoá dữ liệu auth
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Chuyển về login
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center py-4 space-y-6">
      <SidebarItem icon={<Home />} />
      <SidebarItem icon={<Briefcase />} />
      <SidebarItem icon={<Users />} />
      <SidebarItem icon={<Newspaper />} />
      <SidebarItem icon={<Archive />} />
      <SidebarItem icon={<User />} />
      <SidebarItem icon={<Edit3 />} />
      <SidebarItem icon={<LogOut />} onClick={handleLogout} /> {/* 👈 gắn logout */}
    </div>
  );
}
