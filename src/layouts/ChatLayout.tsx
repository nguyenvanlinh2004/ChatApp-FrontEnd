import { useEffect } from "react";
import ChatList from "../components/ChatList1";
import ChatWindow from "../components/ChatWindow1";
import Sidebar from "../components/Sidebar1";
import socket from "../soket";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessageRealtime,
  updateMessageRealtime,
} from "../redux/silces/messageSlice";
import type { RootState } from "../redux/store";
import Welcome from "../components/Welcome";
import { updateConversationLastMessage } from "../redux/silces/conversationSlice";

export default function ChatLayout() {
  const currentConversation = useSelector(
    (state: RootState) => state.conversations.currentConversation
  );
  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect();

    const handleNewMessage = (msg: any) => {
      dispatch(addMessageRealtime(msg));

      dispatch(
        updateConversationLastMessage({
          conversationId: msg.conversationId,
          lastMessage: {
            _id: msg._id,
            text: msg.text,
            sender: msg.sender,
            createdAt: msg.createdAt,
          },
        })
      );
    };

    const handleReadMessage = (msg: any) => {
      dispatch(updateMessageRealtime(msg));
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:read", handleReadMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:read", handleReadMessage);
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex w-10 text-white fixed left-2 top-3 h-full bg-gray-900">
        <Sidebar />
      </div>

      <div className="flex flex-1 ml-15 bg-white rounded-[32px] shadow-xl overflow-hidden m-2.5">
        <div className="w-80 border-r overflow-y-auto">
          <ChatList />
        </div>

        <div className="flex-1/2 flex flex-col overflow-y-auto border-r">
          {currentConversation ? <ChatWindow /> : <Welcome />}
        </div>
      </div>
    </div>
  );
}
