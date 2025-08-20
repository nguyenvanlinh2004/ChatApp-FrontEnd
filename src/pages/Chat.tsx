import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import axios from "axios";

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
  const [sidebarTab, setSidebarTab] = useState<"conversations" | "users">("conversations");

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
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { 
          Authorization: tk },
      });
      setUsers(res.data.filter((u: User) => u._id !== userId));
    } catch (err: any) {
      console.error("Lỗi fetchUsers:", err.response?.data || err.message);
    }
  };

  // Fetch danh sách conversation
  const fetchConversations = async (tk: string) => {
    try {
      const res = await axios.get("http://localhost:5000/api/conversations/my", {
        headers: { Authorization: tk },
      });
      setConversations(res.data || []);
    } catch (err: any) {
      console.error("Lỗi fetchConversations:", err.response?.data || err.message);
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
      const res = await axios.get(`http://localhost:5000/api/messages/${convId}`, {
        headers: { Authorization: tk },
      });
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
        { headers: 
          { Authorization: tk } }
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
      console.error("Lỗi startConversation:", err.response?.data || err.message);
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
      // const tk = token || localStorage.getItem("token");

      // // Gửi tin nhắn lên backend để lưu DB
      // await axios.post(
      //   "http://localhost:5000/api/messages",
      //   { conversationId: activeConv._id, text: newMsg },
      //   { headers: { Authorization: tk } }
      // );

      // Emit qua socket đúng format server cần
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
    
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r flex flex-col">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 p-2 ${sidebarTab === "conversations" ? "bg-gray-200" : ""}`}
            onClick={() => setSidebarTab("conversations")}
          >
            Conversations
          </button>
          <button
            className={`flex-1 p-2 ${sidebarTab === "users" ? "bg-gray-200" : ""}`}
            onClick={() => setSidebarTab("users")}
          >
            Users
          </button>
        </div>

        {/* Content */}
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
                className={`p-4 cursor-pointer hover:bg-gray-100 ${activeConv?._id === conv._id ? "bg-gray-200" : ""
                  }`}
              >
                <div className="font-bold">
                  {conv.isGroup
                    ? conv.name
                    : conv.members.find((m) => m._id !== userId)?.username}
                </div>
                <div className="text-sm text-gray-500">
                  {conv.lastMessage?.text || "Chưa có tin nhắn"}
                </div>
              </div>
            ))}

          {sidebarTab === "users" &&
            users.map((u) => (
              <div
                key={u._id}
                onClick={() => startConversation(u._id)}
                className="p-4 cursor-pointer hover:bg-gray-100"
              >
                {u.username}
              </div>
            ))}
        </div>
      </div>

      {/* Chat box */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">


          {messages.map((msg) => {
            const senderId =
              typeof msg.sender === "object" ? msg.sender._id : msg.sender;

            const isMe = String(senderId) === String(userId);

            console.log("Sender ID:", senderId);
            console.log("Current User ID:", userId);

            return (
              <div
                key={msg._id}
                className={`mb-2 flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg max-w-xs break-words ${isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                    }`}
                >
                  {/* {!isMe && (
                    <strong>
                      {typeof msg.sender === "object"
                        ? msg.sender.username
                        : "Unknown"}:{" "}
                    </strong>
                  )} */}
                  {msg.text}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>



        {/* Input */}
        {activeConv && (
          <form onSubmit={handleSendMessage} className="flex p-4 border-t">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="border border-gray-300 p-2 flex-1 rounded-l"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            >
              Gửi
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
