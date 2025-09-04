import { useState } from "react";
import { Mic, Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { sendMessage, addMessageRealtime } from "../redux/silces/messageSlice";
import socket from "../soket";

export default function MessageInput() {
  const [text, setText] = useState("");
  const dispatch = useAppDispatch();
  const currentConversation = useAppSelector(
    (s) => s.conversations.currentConversation
  );
  const userId = localStorage.getItem("userId");

  const handleSend = () => {
    if (!text.trim() || !currentConversation?._id) return;

    // 1️⃣ Thêm ngay vào Redux để hiển thị sender
    const tempMsg = {
      _id: Math.random().toString(36), // tạm id
      conversationId: currentConversation._id,
      sender: userId!,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seenBy: [userId!],
    };
    dispatch(addMessageRealtime(tempMsg));

    // 2️⃣ Gửi lên API + Redux
    dispatch(
      sendMessage({
        conversationId: currentConversation._id,
        text,
      })
    );

    // 3️⃣ Phát realtime cho backend
    socket.emit("message:send", {
      conversationId: currentConversation._id,
      sender: userId,
      text,
    });

    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center p-4 border-t space-x-2">
      <input
        type="text"
        placeholder="Your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
      />
      <Mic className="cursor-pointer text-gray-500" />
      <Send className="cursor-pointer text-indigo-500" onClick={handleSend} />
    </div>
  );
}
