import { MessageCircle } from "lucide-react";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-600">
      <MessageCircle className="w-16 h-16 text-gray-400 mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Chào mừng bạn 👋</h1>
      <p className="text-center max-w-md">
        Hãy chọn một cuộc trò chuyện trong danh sách bên trái để bắt đầu nhắn
        tin.
      </p>
    </div>
  );
};

export default Welcome;
