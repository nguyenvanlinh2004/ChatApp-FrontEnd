import { Home, Briefcase, Users, Newspaper, Archive, User, Edit3, LogOut } from "lucide-react";
import SidebarItem from "././SidebarItem";

export default function Sidebar() {
  return (
    <div className="flex flex-col items-center py-4 space-y-6">
      <SidebarItem icon={<Home />} />
      <SidebarItem icon={<Briefcase />}/>
      <SidebarItem icon={<Users />} />
      <SidebarItem icon={<Newspaper />} />
      <SidebarItem icon={<Archive />} />
      <SidebarItem icon={<User />} />
      <SidebarItem icon={<Edit3 />} />
      <SidebarItem icon={<LogOut />} />
    </div>
  );
}
