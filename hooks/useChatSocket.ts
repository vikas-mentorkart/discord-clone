import { messageWithMemberWithProfile } from "@/components/chat/chatMessages";
import { useSocket } from "@/components/providers/socketProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type chatSocketProps ={
    addKey: string;
    updateKey:string;
    queryKey:string;
}

export const useChatSocket = ({ addKey, updateKey, queryKey }: chatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;
    socket.on(updateKey, (message: messageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (data: any) => {
        if (!data || !data?.pages || data?.pages?.length == 0) return data;
        const newData = data?.pages?.map((page: any) => {
          return {
            ...page,
            items: page?.items?.map((item: messageWithMemberWithProfile) => {
              if (item?.id == message?.id) return message;
              return item;
            }),
          };
        });
        return { ...data, pages: newData };
      });
    });

    socket.on(addKey, (message: messageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (data: any) => {
        console.log(data);
        if (!data || !data?.pages || data?.pages?.length == 0)
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };

        const newData = [
          { ...data?.pages, items: [message, ...data?.pages[0]?.items] },
        ];

        return { ...data, pages: newData };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, updateKey, socket, updateKey]);
};