import { redirect } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import { currentProfile } from '@/lib/currentProfile'
import React from 'react'
import { db } from '@/lib/db';
import NavAction from "@/components/navigation/navAction";
import NavItem from "@/components/navigation/navItem";
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModeToggle } from '@/components/toggleMode';
import { UserButton } from '@clerk/nextjs';

interface serverResponse {
    id:string;
    name:string;
    imageUrl:string;
}
const Navbar = async () => {
    const profile = await currentProfile();
    if(!profile)return redirect("/");
    
    const servers = await db.server.findMany({
      where: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary  dark:bg-[#1E1F22] bg-[#E3E5E8] PY-3">
      <NavAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server: serverResponse, i:number) => (
          <div key={i} className="mb-4">
            <NavItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton afterSignOutUrl='/' appearance={{
          elements: {
            avatarBox:"h-[48px] w-[40px]"
          }
        }} />
      </div>
    </div>
  );
}

export default Navbar
