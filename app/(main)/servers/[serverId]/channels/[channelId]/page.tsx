import ChatHeader from "@/components/chat/chatHeader";
import { ChatInput } from "@/components/chat/chatInput";
import ChatMessages from "@/components/chat/chatMessages";
import { MediaRoom } from "@/components/mediaRoom";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
interface channelIdPageProps {
  params: {
    channelId: string;
    serverId: string;
  };
}
const ChannelIdPage = async ({ params }: channelIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  const channel = await db.channel.findUnique({
    where: {
      id: params?.channelId,
    },
  });
  const member = await db.member.findFirst({
    where: {
      serverId: params?.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) return redirect("/");
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type == ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
            paramKey="channelId"
            paramValue={channel.id}
            chatId={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
      {channel.type == ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} audio={true} video={false} />
      )}
      {channel.type == ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} audio={true} video={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;
