import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList1";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </div>
  );
}
