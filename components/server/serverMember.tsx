"use client"

import { Member, Server, Profile } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { roleIconMap } from './serverSideBar';
import { cn } from '@/lib/utils';
import UserCard from '../userCard';

interface serverMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}
const ServerMember = ({member, server}:serverMemberProps) => {
  const params =  useParams();
  const router = useRouter();
  const icon = roleIconMap(member.role);
  
  const handleClick =()=>{
    router.push(`/servers/${params?.serverId}/conversation/${member.id}`)
  }

  return (
    <button
     onClick={handleClick}
      className={cn(
        `group px-2 py-2 rounded-md flex
    items-center gap-x-2 w-full
     hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 
     tarnsition mb-1`,
        params?.memberId == member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserCard
        src={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={cn(
          `font-semibold text-sm text-zinc-500
    group-hover:text-zinc-600 dark:text-zinc-400
     dark:group-hover:text-zinc-300 transition`,
          params?.memberId == member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
}

export default ServerMember
