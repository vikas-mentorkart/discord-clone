import ChatHeader from "@/components/chat/chatHeader";
import { ChatInput } from "@/components/chat/chatInput";
import ChatMessages from "@/components/chat/chatMessages";
import { MediaRoom } from "@/components/mediaRoom";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface memberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}
const MemberIdPage = async ({ params, searchParams }: memberIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(
    currentMember?.id,
    params?.memberId
  );

  if (!conversation) return redirect(`/servers/${params.serverId}`);
  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne?.profileId == profile.id ? memberTwo : memberOne;
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember?.profile?.imageUrl}
        name={otherMember?.profile?.name}
        serverId={params.serverId}
        type="converstion"
      />
      {!!searchParams?.video ? (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      ) : (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember?.profile?.name}
            chatId={conversation?.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation?.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{ conversationId: conversation?.id }}
          />
          <ChatInput
            name={otherMember?.profile?.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{ conversationId: conversation?.id }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
