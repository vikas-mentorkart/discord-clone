"use client";
import qs from "query-string";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/modalStore";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserCard from "@/components/userCard";
import { Member, MemberRole, Profile } from "@prisma/client";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleMap = (role: "GUEST" | "MODERATOR" | "ADMIN") => {
  const obj = {
    ["GUEST"]: null,
    ["MODERATOR"]: <Shield className="h-4 w-4 ml-2 text-indigo-500" />,
    ["ADMIN"]: <ShieldAlert className="h-4 w-4 text-rose-500" />,
  };
  return obj[role];
};

export const MembersModal = () => {
  const router = useRouter();
  const { type, onClose, isOpen, data, onOpen } = useModal();
  const { data: server } = data;

  const isModalOpen = !!(type === "membersModal" && isOpen);

  const [loadingId, setLoadingId] = useState("");

  const handleRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });
      const { data } = await axios.patch(url, { role });
      router.refresh();
      onOpen("membersModal", { data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const handleKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });

      const { data } = await axios.delete(url);
      router.refresh();
      onOpen("membersModal", { data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map(
            (item: Member & { profile: Profile }, i: number) => {
              return (
                <div key={i} className="flex items-center gap-x-2 mb-2">
                  <UserCard src={item.profile.imageUrl} />
                  <div className="flex flex-col gap-y-1">
                    <div className="text-xs font-semibold flex items-center gap-x-1">
                      {item?.profile.name}
                      {roleMap(item?.role)}
                    </div>
                    <p className="text-zinc-500 text-xs">
                      {item?.profile?.email}
                    </p>
                  </div>
                  {server?.profileId !== item?.profileId &&
                    loadingId !== item?.id && (
                      <div className="ml-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreVertical className="h-4 w-4 text-zinc-500" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="left">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="flex items-center">
                                <ShieldQuestion className="h-4 w-4" />
                                <span>Role</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRoleChange(item?.id, "GUEST")
                                    }
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Guest
                                    {item?.role === "GUEST" && (
                                      <Check className="h-4 w-4 ml-auto" />
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRoleChange(item?.id, "MODERATOR")
                                    }
                                  >
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Moderator
                                    {item?.role === "MODERATOR" && (
                                      <Check className="h-4 w-4 ml-auto" />
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleKick(item?.id)}
                            >
                              <Gavel className="h-4 w-4 mr-2" />
                              Kick
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  {loadingId == item?.id && (
                    <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                  )}
                </div>
              );
            }
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
