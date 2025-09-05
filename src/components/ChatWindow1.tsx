import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList1";
import MessageInput from "./MessageInput";
import ConversationInfo from "./ConversationInfo1";

export default function ChatWindow() {
  return (
    <div className="flex h-full">
      {/* Cột chat bên trái (chiếm nhiều hơn) */}
      <div className="flex flex-col flex-[3] border-r">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto">
          <MessageList />
        </div>
        <MessageInput />
      </div>

      {/* Cột info bên phải (chiếm ít hơn) */}
      <div className="flex-[1] overflow-y-auto">
        <ConversationInfo />
      </div>
    </div>
  );
}
