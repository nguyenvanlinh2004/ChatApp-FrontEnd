import { useEffect, useState } from "react";
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
import { fetchMe } from "../redux/silces/userSlice";

export default function ChatLayout() {
  const currentConversation = useSelector(
    (state: RootState) => state.conversations.currentConversation
  );
  const dispatch = useDispatch();

  // Mobile: true = đang mở chat window, false = đang ở chat list
  const [showChat, setShowChat] = useState(false);

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

    dispatch(fetchMe() as any);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:read", handleReadMessage);
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar desktop */}
      <div className="hidden sm:flex w-12 text-white fixed left-0 top-0 h-full bg-gray-900 ">
        <Sidebar />
      </div>

      {/* Sidebar mobile - bottom bar */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full h-12 bg-gray-900 text-white z-20">
        <Sidebar onOpenChat={() => setShowChat(false)} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 sm:ml-12 bg-white rounded-[32px] shadow-xl overflow-hidden m-2.5 relative md:ml-14">
        {/* Chat List */}
        <div
          className={`
            border-r overflow-y-auto transition-all duration-300
            ${showChat ? "hidden sm:block sm:w-80" : "block w-full sm:w-80"}
          `}
        >
          <ChatList onSelect={() => setShowChat(true)} />
        </div>

        {/* Chat Window */}
        <div
          className={`
            flex-1 flex flex-col overflow-y-auto transition-all duration-300
            ${!showChat ? "hidden sm:flex" : "flex"}
          `}
        >
          {currentConversation ? <ChatWindow /> : <Welcome />}
        </div>
      </div>
    </div>
  );
}
