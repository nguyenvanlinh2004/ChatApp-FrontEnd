import { Avatar, Chip, Typography, useTheme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useDispatch } from "react-redux";
import { setCurrentConversation } from "../redux/silces/conversationSlice";
import socket from "../soket";
import conversationApi from "../api/conversationApi";

interface Props {
  conversation: any;
  currentUserId: string | null;
}

const ChatListItem: React.FC<Props> = ({ conversation, currentUserId }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const startConversation = async (partnerId: string) => {
    try {
      const conv = await conversationApi.getOrCreateOneToOne(partnerId);
      dispatch(setCurrentConversation(conv));

      if (socket) socket.emit("conversation:join", conv._id);
    } catch (err: any) {
      console.error("Lỗi startConversation:", err.response?.data || err.message);
    }
  };
  
  // Lấy tên hiển thị
  const isGroup = conversation.isGroup;
  console.log("asudhaisd",isGroup);
  const displayName = isGroup
    ? conversation.name
    : conversation.members.find((m: any) => m._id !== currentUserId)?.username;
  console.log("conv members", conversation.members);
  return (
    <div
      className="flex items-center px-8 py-3 w-auto gap-x-3 cursor-pointer hover:bg-gray-100"
      onClick={() => {
        if (!isGroup) {
          const partner = conversation.members.find(
            (m: any) => m._id !== currentUserId
          );
          if (partner) startConversation(partner._id);
        } else {
          dispatch(setCurrentConversation(conversation));
          if (socket) socket.emit("conversation:join", conversation._id);
        }
      }}
    >
      <Avatar alt={displayName} src="" />
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between">
          <Typography
            className="flex items-center gap-x-3"
            fontWeight={600}
            fontSize={16}
          >
            {displayName}
            {isGroup && <Chip label="group" size="small" />}
          </Typography>
          <Typography
            component={"span"}
            fontSize={12}
            sx={{ color: theme.palette.grey[400] }}
          >
            {conversation.updatedAt
              ? new Date(conversation.updatedAt).toLocaleTimeString()
              : ""}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <Typography component={"span"} fontSize={12}>
            {conversation.lastMessage?.content || "Chưa có tin nhắn"}
          </Typography>
          <StarIcon fontSize="small" />
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
