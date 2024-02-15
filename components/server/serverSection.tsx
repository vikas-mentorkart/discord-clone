"use client"
import React from 'react'

import { ChannelType, MemberRole } from '@prisma/client';

import { serverWithMembersAndProfiles } from '@/types';
import { Plus, Settings } from 'lucide-react';
import { useModal } from '@/hooks/modalStore';
import TooltipAction from '../tooltipAction';

interface serverSectionProps {
    label:string;
    role?:MemberRole;
    sectionType :"channel" | "member";
    channelType? : ChannelType;
    server?: serverWithMembersAndProfiles;
}
const ServerSection = ({
    label,
    role,
    sectionType,
    channelType,
    server
}:serverSectionProps) => {
 const {onOpen} = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p
        className="text-xs uppercase font-semibold
       text-zinc-500 dark:text-zinc-400"
      >
        {" "}
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType == "channel" && (
        <TooltipAction label="Create Channel" side="right">
          <button
            className="text-zinc-500 hover:text-zinc-600
         dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("createChannel", {channelType})}
          >
            <Plus className="h-4 w-4" />
          </button>
        </TooltipAction>
      )}
      {role == MemberRole.ADMIN && sectionType == "member" && (
        <TooltipAction label="Manage Members" side="right">
          <button
            className="text-zinc-500 hover:text-zinc-600
         dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("membersModal", { data: server })}
          >
            <Settings className="h-4 w-4" />
          </button>
        </TooltipAction>
      )}
    </div>
  );
}

export default ServerSection
