import { useEffect } from "react";
import ChatList from "../components/ChatList1";
import ChatWindow from "../components/ChatWindow1";
import ConversationInfo from "../components/ConversationInfo1";
import Sidebar from "../components/Sidebar1";
import socket from "../soket";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessageRealtime,
  updateMessageRealtime,
} from "../redux/silces/messageSlice";

export default function ChatLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect();

    const handleNewMessage = (msg: any) => {
      dispatch(addMessageRealtime(msg));
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

        <div className="flex-1/20 flex flex-col overflow-y-auto border-r">
          <ChatWindow />
        </div>

        <div className="">
          <ConversationInfo />
        </div>
      </div>
    </div>
  );
}
