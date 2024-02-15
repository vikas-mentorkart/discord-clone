import * as z from "zod";
import axios from "axios";
import queryString from "query-string";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageWithMemberWithProfile } from "./chatMessages";
import { Member, MemberRole } from "@prisma/client";
import UserCard from "../userCard";
import TooltipAction from "../tooltipAction";
import { roleIconMap } from "../server/serverSideBar";
import moment from "moment";
import Image from "next/image";
import { Edit, FileIcon, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/modalStore";
import { useRouter, useParams } from "next/navigation";

interface chatItemProps {
  message: messageWithMemberWithProfile;
  socketQuery: Record<string, string>;
  socketUrl: string;
  currentMember: Member;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem = ({
  message,
  socketQuery,
  socketUrl,
  currentMember,
}: chatItemProps) => {   
  const {onOpen} =  useModal();
  const [isEditing, setIsEditing] = useState(false);
  const params =  useParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues: {
      content: message?.content || "",
    },
  });
 useEffect(() => {
   const handleClick = (event: KeyboardEvent) => {
     if (event.key == "Escape" || event.keyCode == 27) setIsEditing(false);
   };

   document.addEventListener("keydown", handleClick);

   return () => {
     document.removeEventListener("keydown", handleClick);
   };
 }, []);

  useEffect(() => {
    form.reset({
      content: message?.content,
    });
  }, [message?.content, form]);

  const fileType = message?.fileUrl?.split(".").pop();
  const isUpdated = message?.createdAt != message?.updatedAt;

  const isAdmin = currentMember?.role == MemberRole.ADMIN;
  const isModerator = currentMember?.role == MemberRole.MODERATOR;
  const isSender = currentMember?.id == message?.member?.id;

  const canDelete = !message?.deleted && (isAdmin || isModerator || isSender);
  const canEdit = !message?.deleted && isSender && !message?.fileUrl;

  const isPDF = fileType == "pdf";
  const isImage = !isPDF && !!message?.fileUrl;

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: `${socketUrl}/${message?.id}`,
        query: socketQuery,
      });
      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);  
    } catch (error) {
      console.log(error);
    }
  };

  const onMemberClick = ()=>{
    if(message?.member?.id == currentMember?.id)return;
    router.push(
      `/servers/${params?.serverId}/conversation/${message?.member?.id}`
    );
  }

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserCard src={message?.member?.profile?.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
                className="font-semibold hover:underline cursor-pointer"
              >
                {message?.member?.profile?.name}&nbsp;
              </p>
              <TooltipAction label={message?.member?.role}>
                {roleIconMap(message?.member?.role)}
              </TooltipAction>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {moment(message?.createdAt).format("d MMM yyyy, HH:MM")}
            </span>
          </div>
          {isImage && (
            <a
              href={message?.fileUrl}
              target="_blank"
              rel="noopener noreferer"
              className="relative aspect-square rounded-md mt-2 border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={message?.fileUrl}
                alt={message?.content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={message?.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!message?.fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-ainc-600 dark:text-zinc-300",
                !!message?.deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {message?.content}
              {isUpdated && !message?.deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!message?.fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bc-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited Message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button variant="primary" size="sm" disabled={isLoading}>
                  save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400 ">
                Press escape to cancel or enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDelete && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 rounded-sm">
          {canEdit && (
            <TooltipAction label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </TooltipAction>
          )}
          <TooltipAction label="Delete">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${message?.id}`,
                  query: socketQuery,
                })
              }
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </TooltipAction>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
