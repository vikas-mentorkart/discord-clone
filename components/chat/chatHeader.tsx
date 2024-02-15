import { Hash } from "lucide-react";
import React from "react";
import { MobileToggle } from "@/components/mobileToggle";
import UserCard from "@/components/userCard";
import { SocketIndicator } from "@/components/socketIndicator";
import { VideoChatButton } from "./videoChatButton";

interface chatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "converstion";
  imageUrl?: string;
}

const ChatHeader = ({ serverId, name, type, imageUrl }: chatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type == "channel" && (
        <Hash className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type == "converstion" && (
        <UserCard src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
        {type == "converstion" && <VideoChatButton />}
      </div>
    </div>
  );
};

export default ChatHeader;
