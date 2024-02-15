"use client";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";

interface serverSearchProps {
  data:
     {
        label: string;
        type: "member" | "channel";
        data: {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[];
      }[]
    | undefined;
}
const ServerSearch = ({ data }: serverSearchProps) => {
    const router =  useRouter();
    const params = useParams();
    const [isOpen, setIsOpen] = useState(false)
    useEffect(()=>{
     const handleKeyDown= (event :KeyboardEvent)=>{
        if(event.key ==="k" && (event.metaKey ||event.ctrlKey)){
            event.preventDefault();
            setIsOpen((st)=>!st)
        }
     }
     document.addEventListener("keydown", handleKeyDown);
     return () => document.removeEventListener("keydown", handleKeyDown);
    },[])

const handleClick =({id, type}:{id:string, type:"channel"|"member"})=>{
     setIsOpen(false);
     if(type=="channel")return router.push(`/servers/${params?.serverId}/channels/${id}`);
     if(type=="member")return router.push(`/servers/${params.serverId}/conversations/${id}`)
}
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group px-2 py-2 rounded-md flex
   items-center gap-x-2 w-full hover:bg-zinc-700/10
    dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <p
          className="font-semibold text-sm
         text-zinc-500 dark:text-zinc-400
          group-hover:text-zinc-700
           dark:group-hover:text-zinc-300 transition"
        >
          Search
        </p>
        <kbd
          className="pointer-events-none inline-flex h-5 
        select-none items-center gap-1 rounded border 
        bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foregound ml-auto"
        >
          <span className="text-xs">Ctrl</span>k
        </kbd>
      </button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="search all channels and members" />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data?.map(({ label, type, data },i) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={i} heading={label}>
                {data?.map(({ id, icon, name },i) => {
                  return (
                    <CommandItem
                      key={i}
                      onSelect={() => handleClick({ id, type })}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
