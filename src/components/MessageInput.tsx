import { useState } from "react";
import { Send, Image as ImageIcon, X } from "lucide-react";
import { useAppSelector } from "../redux/hooks";
import socket from "../soket";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const currentConversation = useAppSelector(
    (s) => s.conversations.currentConversation
  );
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const handleSend = async () => {
    if ((!text.trim() && !image) || !currentConversation?._id) return;

    let imageUrl: string | null = null;

    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      try {
        const res = await fetch("http://localhost:5000/api/upload/image", {
          method: "POST",
          headers: {
            Authorization: ` ${token || ""}`,
          },
          body: formData,
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Upload failed: ${errText}`);
        }

        const data = await res.json();
        imageUrl = data.url; // server trả về { url: "/uploads/xxx.png" }
      } catch (err) {
        console.error("Lỗi upload ảnh:", err);
        return; // nếu lỗi thì không gửi tin nhắn
      }
    }

    // 🟢 Gửi tin nhắn qua socket
    socket.emit("message:send", {
      conversationId: currentConversation._id,
      sender: userId,
      text,
      imageUrl,
    });

    // 🧹 Dọn input
    setText("");
    setImage(null);
    setPreview(null);
  };

  // 🟢 Bắt phím Enter để gửi
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // 🟢 Chọn ảnh & hiển thị preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col border-t border-gray-100">
      {/* 🖼 Hiển thị ảnh preview */}
      {preview && (
        <div className="p-2 flex items-center space-x-2">
          <img
            src={preview}
            alt="preview"
            className="max-h-20 rounded-md border"
          />
          <X
            className="cursor-pointer text-red-500"
            onClick={() => {
              setImage(null);
              setPreview(null);
            }}
          />
        </div>
      )}

      {/* 💬 Input nhắn tin */}
      <div className="flex items-center p-4 space-x-2">
        <label className="cursor-pointer text-gray-500">
          <ImageIcon />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
        />

        <Send className="cursor-pointer text-indigo-500" onClick={handleSend} />
      </div>
    </div>
  );
}
