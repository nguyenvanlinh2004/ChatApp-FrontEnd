import MessageItem from "./MessageItem1";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useRef } from "react";
import { clearMessages, fetchMessages } from "../redux/silces/messageSlice";
import socket from "../soket";
import { useDispatch } from "react-redux";

export default function MessageList() {
  const dispatch=useAppDispatch();

  const { items: messages, loading, error } = useAppSelector((s) => s.messages);
  const currentConversation = useAppSelector(
    (s) => s.conversations.currentConversation
  );

  const endRef = useRef<HTMLDivElement | null>(null);

  // Cuộn xuống mỗi khi messages thay đổi
// Khi chuyển conversation: clear + fetch mới + join room
  useEffect(() => {
  if (!currentConversation?._id) return;

  dispatch(clearMessages());

  // dùng dispatch bình thường, TS sẽ hiểu đây là thunk
  dispatch(fetchMessages(currentConversation._id));

  socket.emit("joinConversation", currentConversation._id);

  return () => {
    socket.emit("leaveConversation", currentConversation._id);
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
          sender={m.sender ?? "Unknown"}
          text={m.text || ""}
          time={new Date(m.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          isOwn={m.sender === localStorage.getItem("userId")}
        />
      ))}
      {/* div dummy để scroll xuống cuối */}
      <div ref={endRef} />
    </div>
  );
}
