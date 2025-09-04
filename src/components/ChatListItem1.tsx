type Props = {
  name: string;
  lastMessage: string;
  time: string;
  active?: boolean;
};

export default function ChatListItem({ name, lastMessage, time, active }: Props) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${active ? "bg-gray-100" : "hover:bg-gray-50"}`}>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">{lastMessage}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}
