type Props = {
  sender: string;
  text?: string;
  time: string;
  isOwn?: boolean;
};

export default function MessageItem({ sender, text, time, isOwn }: Props) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs p-3 rounded-2xl ${isOwn ? "bg-indigo-500 text-white" : "bg-gray-100"}`}>
        <p>{text}</p>
        <span className="text-xs text-gray-400 block mt-1">{time}</span>
      </div>
    </div>
  );
}
