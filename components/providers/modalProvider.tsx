"use client";

import { useEffect, useState } from "react";

import { CreateServerModal } from "@/components/modals/createServerModal";
import { InviteModal } from "@/components/modals/inviteModal";
import { EditServerModal } from "@/components/modals/editServerModal";
import { MembersModal } from "@/components/modals/membersModal";
import { CreateChannelModal } from "@/components/modals/createChannelModal";
import { LeaveServerModal } from "@/components/modals/leaveServerModal";
import { DeleteServerModal } from "@/components/modals/deleteServerModal";
import { DeleteChannelModal } from "@/components/modals/deleteChannelModal";
import { EditChannelModal } from "@/components/modals/editChannelModal";
import { MessageFileModal } from "@/components/modals/messageFileModal";
import { DeleteMessageModal } from "@/components/modals/deleteMessageModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted ? (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  ) : null;
};
