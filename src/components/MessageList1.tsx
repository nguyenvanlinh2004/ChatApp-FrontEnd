import MessageItem from "./MessageItem1";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useRef } from "react";
import { clearMessages, fetchMessages } from "../redux/silces/messageSlice";
import socket from "../soket";


export default function MessageList() {
  const dispatch = useAppDispatch();

  const { items: messages, loading, error } = useAppSelector((s) => s.messages);
  const currentConversation = useAppSelector(
    (s) => s.conversations.currentConversation
  );

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!currentConversation?._id) return;

    dispatch(clearMessages());

    dispatch(fetchMessages(currentConversation._id));

    console.log("➡️ Join room:", currentConversation._id);
    socket.emit("conversation:join", currentConversation._id);

    return () => {
      console.log("⬅️ Leave room:", currentConversation._id);
      socket.emit("conversation:leave", currentConversation._id);
    };
  }, [dispatch, currentConversation?._id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentConversation)
    return (
      <div className="p-4 text-gray-500">
        Hãy chọn một hội thoại để bắt đầu chat
      </div>
    );

  if (loading) return <div className="p-3">Đang tải tin nhắn...</div>;
  if (error) return <div className="p-3 text-red-500">{error}</div>;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.filter(Boolean).map((m, i) => (
        <MessageItem
          key={m._id || i}
          sender={
            typeof m.sender === "object"
              ? m.sender.username
              : m.sender ?? "Unknown"
          }
          text={m.text || ""}
          time={new Date(m.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          isOwn={
            (typeof m.sender === "object" ? m.sender._id : m.sender) ===
            localStorage.getItem("userId")
          }
        />
      ))}
      {/* div dummy để scroll xuống cuối */}
      <div ref={endRef} />
    </div>
  );
}
