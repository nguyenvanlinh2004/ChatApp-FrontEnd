import { Tooltip } from "@mui/material";
import { useMediaQuery } from "@mui/material";

type Props = {
  icon: React.ReactNode;
  badgeCount?: number;
  active?: boolean;
  onClick?: () => void;
  label?: string;
};

export default function SidebarItem({
  icon,
  badgeCount,
  active,
  onClick,
  label,
}: Props) {
  const isMobile = useMediaQuery("(max-width: 840px)");

  const content = (
    <div
      onClick={onClick}
      className={`relative cursor-pointer flex items-center justify-center 
        ${isMobile ? "flex-1 h-full rounded-none" : "p-2 rounded-xl mt-10"} 
        ${active ? "bg-gray-700" : ""} hover:bg-gray-700`}
    >
      {icon}
      {badgeCount && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
          {badgeCount}
        </span>
      )}
    </div>
  );

  return isMobile ? (
    content
  ) : (
    <Tooltip title={label || ""} placement="right">
      {content}
    </Tooltip>
  );
}
