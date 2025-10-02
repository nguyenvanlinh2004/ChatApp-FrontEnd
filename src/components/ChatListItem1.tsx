import { Avatar } from "@mui/material";
import { formatTime } from "../utils/timeFormat";
import { FILE_URL } from "../api/URL";
type Props = {
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  active?: boolean;
};

export default function ChatListItem({
  name,
  avatar,
  lastMessage,
  time,
  active,
}: Props) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer sm:w-full ${
        active ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center">
        <div className="mr-4">
          <Avatar
            src={FILE_URL + avatar}
            alt="avatar"
            sx={{ width: 50, height: 50 }}
          />
        </div>
        <div>
          {" "}
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{lastMessage}</p>
        </div>
      </div>
      <span className="text-xs text-gray-400">{formatTime(time)}</span>
    </div>
  );
}
