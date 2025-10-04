type Props = {
  sender: string;
  text?: string;
  imageUrl?: string;
  time: string;
  isOwn?: boolean;
};

import { FILE_URL } from "../api/URL";

export default function MessageItem({
  sender,
  text,
  imageUrl,
  time,
  isOwn,
}: Props) {
  return (
    <div
      className={`flex flex-col ${isOwn ? "items-end" : "items-start"} mb-3`}
    >
      {imageUrl && (
        <div
          className={`max-w-xs mb-1 ${isOwn ? "justify-end" : "justify-start"}`}
        >
          <img
            src={FILE_URL + imageUrl}
            alt="message attachment"
            className="rounded-xl max-h-64 object-cover shadow-sm"
          />
        </div>
      )}

      {/* 💬 Tin nhắn văn bản */}
      {text && (
        <div
          className={`max-w-xs p-3 rounded-2xl break-words ${
            isOwn ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-900"
          }`}
        >
          <p>{text}</p>
          <span
            className={`text-xs block mt-1 ${
              isOwn ? "text-gray-200" : "text-gray-500"
            }`}
          >
            {time}
          </span>
        </div>
      )}
    </div>
  );
}
