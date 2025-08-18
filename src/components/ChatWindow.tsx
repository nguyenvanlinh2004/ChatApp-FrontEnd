import { Avatar, Typography, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CallIcon from '@mui/icons-material/Call';
import MissedVideoCallIcon from '@mui/icons-material/MissedVideoCall';
import InfoIcon from '@mui/icons-material/Info';
import { useState, useRef, useEffect } from "react";

const ChatWindow = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Is this some kind of a joke?", sender: "other" },
        { id: 2, text: "Good day to all! I wanted to know how things are with Half Life 3? Date of release?", sender: "me" },
        { id: 3, text: "WTF???", sender: "other" },
        { id: 4, text: "WTF???", sender: "other" },
        { id: 5, text: "WTF???", sender: "other" },
        { id: 6, text: "WTF???", sender: "other" },
        { id: 7, text: "WTF???", sender: "other" },
        { id: 8, text: "WTF???", sender: "other" }

    ]);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        setMessages([...messages, { id: Date.now(), text: newMessage, sender: "me" }]);
        setNewMessage("");
    };

    return (
        <div className=" rounded-lg flex flex-col shadow">
            {/* Header */}
            <div className="p-4 border-b">
                {/* <Typography variant="h6">Group Chat</Typography> */}
                <div className="flex items-center justify-between mt-2">
                    <Typography variant="subtitle1">Half-Life 3</Typography>
                    <div className="flex gap-x-3">
                        <CallIcon />
                        <MissedVideoCallIcon/>
                        <InfoIcon />
                    </div>
                </div>
            </div>
            <div className="flex-3 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                        {msg.sender === "other" && <Avatar className="mr-2" />}
                        <div
                            className={`px-4 py-2 rounded-lg max-w-[70%] ${msg.sender === "me" ? "bg-green-500 text-white" : "bg-gray-200"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>

            <div className="p-3 border-t flex items-center gap-2">
                <input
                    type="text"
                    className="flex-1 border rounded-full px-4 py-2 outline-none"
                    placeholder="Type something to send..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <IconButton onClick={handleSend} color="primary">
                    <SendIcon />
                </IconButton>
            </div>
        </div>
    );
};

export default ChatWindow;
