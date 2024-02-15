import { serverWithMembersAndProfiles } from "@/types";
import { Channel, ChannelType } from "@prisma/client";
import { create } from "zustand";

export type modalType =
  | "createServer"
  | "inviteModal"
  | "editServer"
  | "membersModal"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage";

interface modalData {
  data?: serverWithMembersAndProfiles;
  channelType?: ChannelType;
  channel?: Channel;
  apiUrl?: string;
  query?: Record<string, any>;
}
interface modalStore {
  type: modalType | null;
  data: modalData;
  isOpen: Boolean;
  onOpen: (type: modalType, data?: modalData) => void;
  onClose: () => void;
}

export const useModal = create<modalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
