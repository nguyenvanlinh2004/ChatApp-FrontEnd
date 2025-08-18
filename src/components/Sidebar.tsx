import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import socket from "../soket";
import conversationApi from "../api/conversationApi";
import userApi from "../api/userApi";
import {
    setUserId,
    setToken,
    setUsers
} from "../redux/silces/authSlice";
import { setCurrentConversation, setConversations } from "../redux/silces/conversationSlice";
import ChatListItem from "./ChatListItem";

const Sidebar: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userId = useSelector((state: RootState) => state.auth.userId);
    
    const conversations = useSelector(
        (state: RootState) => state.conversations.conversations
    );
    console.log("asdasdasda",conversations);

    useEffect(() => {
        const tk = localStorage.getItem("token");
        const id = localStorage.getItem("userId");

        if (!tk || !id) {
            navigate("/login", { replace: true });
            return;
        }

        dispatch(setUserId(id));
        dispatch(setToken(tk));

        socket.auth = { token: tk };
        socket.connect();

        socket.on("connect", () => console.log("Connected:", socket.id));
        socket.on("disconnect", () => console.log("Disconnected"));

        (async () => {
            try {
                const convRes = await conversationApi.myConversations();
                dispatch(setConversations(convRes));
                dispatch(setCurrentConversation(convRes[0] || []));
                console.log("convensation",convRes);
                const userRes = await userApi.all();
                console.log("userRes", userRes);
                // const filtered = userRes.data.filter((u: any) => u._id !== id);
                // dispatch(setUsers(filtered));
                
            } catch (err: any) {
                console.error("Lỗi load dữ liệu:", err);
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/login", { replace: true });
                }
            }
        })();

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.disconnect();
        };
    }, [dispatch, navigate]);

    return (
        <div className="flex flex-col gap-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Typography className="flex items-center gap-x-3">
                    <IoChatbubbleEllipsesSharp size={40} />
                   Chat App
                </Typography>
                <div className="flex items-center gap-x-5 pr-4">
                    <CiSettings size={28} />
                </div>
            </div>

            {/* Danh sách hội thoại */}
            <div className="flex flex-col w-full">
                {conversations.map((conv: any) => (
                    <ChatListItem
                        key={conv._id}
                        conversation={conv}
                        currentUserId={userId}
                    />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
