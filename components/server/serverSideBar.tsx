import React from "react";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/currentProfile";
import {
  Channel,
  ChannelType,
  Member,
  MemberRole,
  Profile,
} from "@prisma/client";
import { redirect } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import ServerSearch from "./serverSearch";
import ServerHeader from "./serverHeader";
import ServerSection from "./serverSection";

import { Hash, Mic, Shield, ShieldAlert, Video } from "lucide-react";
import ServerChannel from "./serverChannel";
import ServerMember from "./serverMember";

export const iconMap = {
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

export const roleIconMap = (role: "GUEST" | "MODERATOR" | "ADMIN") => {
  const obj = {
    ["GUEST"]: null,
    ["MODERATOR"]: <Shield className="h-4 w-4 mr-1 text-indigo-500" />,
    ["ADMIN"]: <ShieldAlert className="h-4 w-4 mr-1 text-rose-500" />,
  };
  return obj[role];
};

interface dataMap {
  id: string;
  name: string;
  type: ChannelType;
}

const ServerSideBar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  if (!server) return redirect("/");

  const textChannels = server?.channels.filter(
    (channel: Channel) => channel.type == ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel: Channel) => channel.type == ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel: Channel) => channel.type == ChannelType.VIDEO
  );
  const members = server?.members.filter(
    (member: { profileId: string }) => member.profileId !== profile.id
  );

  const role = server.members.find(
    (member: { profileId: string }) => member?.profileId == profile.id
  )?.role;
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />{" "}
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel: dataMap) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel: dataMap) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel: dataMap) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member: Member & { profile: Profile }) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap(member.role),
                })),
              },
            ]}
          />
        </div>
        {!!textChannels?.length && (
          <div className="mb-2">
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
            <ServerSection
              sectionType="channel"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            {textChannels?.map((channel: Channel,i:number) => (
              <div className="space-y-[2px]">
                {" "}
                <ServerChannel
                  key={i}
                  channel={channel}
                  role={role}
                  server={server}
                />
              </div>
            ))}
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
            <ServerSection
              sectionType="channel"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            {audioChannels?.map((channel: Channel,i:number) => (
              <div className="space-y-[2px]">
                {" "}
                <ServerChannel
                  key={i}
                  channel={channel}
                  role={role}
                  server={server}
                />
              </div>
            ))}
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
            <ServerSection
              sectionType="channel"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            {videoChannels?.map((channel: Channel,i:number) => (
              <div className="space-y-[2px]">
                {" "}
                <ServerChannel
                  key={i}
                  channel={channel}
                  role={role}
                  server={server}
                />
              </div>
            ))}
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
            <ServerSection sectionType="member" role={role} label="Members" />
            <div className="space-y-[2px]">
              {members.map((member: Member & { profile: Profile },i:number) => (
                <ServerMember key={i} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSideBar;
