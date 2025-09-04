type Props = {
  icon: React.ReactNode;
  badgeCount?: number;
  active?: boolean;
};

export default function SidebarItem({ icon, badgeCount, active }: Props) {
  return (
    <div className={`relative p-2 rounded-xl cursor-pointer hover:bg-gray-700 ${active ? "bg-gray-700" : ""}`}>
      {icon}
      {badgeCount && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
          {badgeCount}
        </span>
      )}
    </div>
  );
}
