"use client";
import { Member, Message, Profile } from "@prisma/client";
import React, { Fragment, useRef, ElementRef } from "react";
import { ChatWelcome } from "@/components/chat/chatWelcome";
import { useChatQuery } from "@/hooks/useChat";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./chatItem";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useScroll } from "@/hooks/useScroll";

interface chatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, any>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

export type messageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

const ChatMessages = (props: chatMessagesProps) => {
  const queryKey = `chat:${props.chatId}`;
  const addKey = `chat:${props.chatId}:messages`;
  const updateKey = `chat:${props.chatId}:messages:update`;

  const chatRef =  useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl: props.apiUrl,
      paramKey: props.paramKey,
      paramValue: props.paramValue,
    });
  useChatSocket({ addKey, queryKey, updateKey });
  useScroll({
    chatRef,
    bottomRef,
    load: fetchNextPage,
    shouldLoad: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages[0]?.items?.length ?? 0,
  });

  if (status == "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-700 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          loading messages
        </p>
      </div>
    );
  }

  if (status == "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-700 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={props.type} name={props.name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 ani my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items?.map(
              (message: messageWithMemberWithProfile, ind: number) => (
                <ChatItem
                  key={ind}
                  message={message}
                  currentMember={props.member}
                  socketQuery={props.socketQuery}
                  socketUrl={props.socketUrl}
                />
              )
            )}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
