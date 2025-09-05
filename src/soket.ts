import { io } from "socket.io-client";

const URL = "http://localhost:5000";
const socket = io(URL, {
  autoConnect: true,
  transports: ["websocket"], // ép dùng websocket
  auth: {
    token: localStorage.getItem("token"), // JWT để backend verify
  },
});

export default socket;
