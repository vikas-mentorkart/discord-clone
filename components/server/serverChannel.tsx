"use client";
import { cn } from "@/lib/utils";
import { Channel, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import TooltipAction from "@/components/tooltipAction";
import { useModal } from "@/hooks/modalStore";

interface serverChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = (type: "TEXT" | "AUDIO" | "VIDEO") => {
  const obj = {
    ["TEXT"]: Hash,
    ["AUDIO"]: Mic,
    ["VIDEO"]: Video,
  };
  return obj[type];
};

const ServerChannel = ({ channel, server, role }: serverChannelProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const params = useParams();
  const Icon = iconMap(channel.type);
  
  const handleclick = ()=>{
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
  }
  return (
    <button
      onClick={handleclick}
      className={cn(
        `group px-2 py-2 rounded-md flex 
        item-center gap-x-2 w-full hover:bg-zinc-700/10
         dark:hover:bg-zinc-700/50 transition mb-1`,
        params?.channelId == channel?.id && "bg-zinc-700/20 dark:bg-zinc-700/50"
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <TooltipAction label="Edit">
            <Edit
              onClick={(e) => {
                e.stopPropagation();
                onOpen("editChannel", { data: server, channel });
              }}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </TooltipAction>
          <TooltipAction label="Delete">
            <Trash
              onClick={(e) => {
                e.stopPropagation();
                onOpen("deleteChannel", { data: server, channel });
              }}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </TooltipAction>
        </div>
      )}{" "}
      {channel.name === "general" && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};

export default ServerChannel;
