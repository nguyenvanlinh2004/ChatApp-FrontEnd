import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { Send, UserCircle2 } from "lucide-react";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Message {
  _id: string;
  sender: { _id: string; username: string };
  text: string;
  conversationId: string;
}

interface Conversation {
  _id: string;
  name?: string;
  isGroup: boolean;
  members: { _id: string; username: string }[];
  lastMessage?: { text: string };
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sidebarTab, setSidebarTab] = useState<"conversations" | "users">(
    "conversations"
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll xuống cuối message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Kết nối socket & load dữ liệu ban đầu
  useEffect(() => {
    const tk = localStorage.getItem("token");
    const id = localStorage.getItem("userId");

    if (!tk || !id) {
      navigate("/login", { replace: true });
      return;
    }
    setUserId(id);
    setToken(tk);

    const newSocket = io("http://localhost:5000", {
      auth: { token: tk },
      transports: ["websocket"],
    });
    setSocket(newSocket);

    (async () => {
      try {
        await fetchConversations(tk);
        await fetchUsers(tk);
      } catch (err) {
        console.error("Lỗi khi load dữ liệu ban đầu:", err);
      }
    })();

    return () => {
      newSocket.disconnect();
    };
  }, [navigate]);

  // Fetch danh sách users
  const fetchUsers = async (tk: string) => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/all", {
        headers: { Authorization: tk },
      });
      setUsers(res.data.filter((u: User) => String(u._id) !== String(userId)));
    } catch (err: any) {
      console.error("Lỗi fetchUsers:", err.response?.data || err.message);
    }
  };

  // Fetch danh sách conversation
  const fetchConversations = async (tk: string) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/conversations/my",
        {
          headers: { Authorization: tk },
        }
      );
      setConversations(res.data || []);
    } catch (err: any) {
      console.error(
        "Lỗi fetchConversations:",
        err.response?.data || err.message
      );
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    }
  };

  // Fetch messages
  const fetchMessages = async (convId: string) => {
    try {
      const tk = token || localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/messages/${convId}`,
        {
          headers: { Authorization: tk },
        }
      );
      setMessages(res.data.items || res.data || []);
    } catch (err: any) {
      console.error("Lỗi fetchMessages:", err.response?.data || err.message);
    }
  };

  // Bắt đầu hoặc chọn conversation 1-1
  const startConversation = async (partnerId: string) => {
    try {
      const tk = token || localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/conversations/one-to-one",
        { partnerId },
        { headers: { Authorization: tk } }
      );
      const conv = res.data;

      setConversations((prev) =>
        prev.find((c) => c._id === conv._id) ? prev : [conv, ...prev]
      );

      setActiveConv(conv);
      await fetchMessages(conv._id);

      if (socket) socket.emit("conversation:join", conv._id);
      setSidebarTab("conversations");
    } catch (err: any) {
      console.error(
        "Lỗi startConversation:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    if (socket && activeConv?._id) {
      socket.emit("conversation:join", activeConv._id);
    }
  }, [socket, activeConv]);

  // Lắng nghe tin nhắn từ socket
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg: any) => {
      if (msg.conversationId === activeConv?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("message:new", handleNewMessage);
    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, activeConv]);

  // Gửi tin nhắn
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMsg.trim() || !activeConv) return;
    try {
      socket?.emit("message:send", {
        conversationId: activeConv._id,
        text: newMsg,
      });
      setNewMsg("");
    } catch (err: any) {
      console.error("Lỗi gửi tin nhắn:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r flex flex-col">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 p-3 text-sm font-semibold ${
              sidebarTab === "conversations"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setSidebarTab("conversations")}
          >
            Conversations
          </button>
          <button
            className={`flex-1 p-3 text-sm font-semibold ${
              sidebarTab === "users"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setSidebarTab("users")}
          >
            Users
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {sidebarTab === "conversations" &&
            conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => {
                  setActiveConv(conv);
                  fetchMessages(conv._id);
                  socket?.emit("conversation:join", conv._id);
                }}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b hover:bg-gray-50 ${
                  activeConv?._id === conv._id ? "bg-gray-100" : ""
                }`}
              >
                <UserCircle2 className="w-8 h-8 text-gray-400" />
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-sm">
                    {conv.isGroup
                      ? conv.name
                      : conv.members.find((m) => m._id !== userId)?.username}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {conv.lastMessage?.text || "Chưa có tin nhắn"}
                  </span>
                </div>
              </div>
            ))}

          {sidebarTab === "users" &&
            users.map((u) => (
              <div
                key={u._id}
                onClick={() => startConversation(u._id)}
                className="flex items-center gap-3 p-4 cursor-pointer border-b hover:bg-gray-50"
              >
                <UserCircle2 className="w-8 h-8 text-gray-400" />
                <span className="font-medium">{u.username}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {activeConv ? (
          <div className="p-4 border-b bg-white">
            <h2 className="font-bold text-lg">
              {activeConv.isGroup
                ? activeConv.name
                : activeConv.members.find((m) => m._id !== userId)?.username}
            </h2>
            <p className="text-sm text-gray-500">
              {activeConv.isGroup ? "Group chat" : "Private chat"}
            </p>
          </div>
        ) : (
          <div className="p-4 border-b bg-white text-gray-500 text-center">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map((msg) => {
            const senderId =
              typeof msg.sender === "object" ? msg.sender._id : msg.sender;
            const isMe = String(senderId) === String(userId);
            return (
              <div
                key={msg._id}
                className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow ${
                    isMe
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white border rounded-bl-none"
                  }`}
                >
                  {!isMe && (
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      {typeof msg.sender === "object"
                        ? msg.sender.username
                        : "Unknown"}
                    </p>
                  )}
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {activeConv && (
          <form
            onSubmit={handleSendMessage}
            className="flex items-center p-4 border-t bg-white gap-2"
          >
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
