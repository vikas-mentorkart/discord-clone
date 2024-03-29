"use client"
import React from 'react'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import TooltipAction from '@/components/tooltipAction'

interface navItemProps {
  id: string;
  name: string;
  imageUrl: string;
}
const NavItem = ({id, imageUrl, name} : navItemProps) => {
    const params =  useParams();
    const router =  useRouter();
    const handleClick=()=>{
      router.push(`/servers/${id}`)
    }
  return (
    <TooltipAction side="right" align="center" label={name}>
      <button onClick={handleClick} className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image fill src={imageUrl} alt="Channel" />
        </div>
      </button>
    </TooltipAction>
  );
}

export default NavItem
