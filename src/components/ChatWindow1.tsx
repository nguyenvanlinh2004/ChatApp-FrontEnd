import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList1";
import MessageInput from "./MessageInput";
import ConversationInfo from "./ConversationInfo1";

export default function ChatWindow() {
  return (
    <div className="flex h-full pb-12 sm:pb-0">
      <div className="flex flex-col flex-[3] border-r border-gray-100">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto scrollbar-hidden">
          <MessageList />
        </div>
        <MessageInput />
      </div>

      <div className="hidden sm:flex flex-[1] overflow-y-auto scrollbar-hidden">
        <ConversationInfo />
      </div>
    </div>
  );
}
