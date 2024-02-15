"use client";
import { Plus } from "lucide-react";
import React from "react";

import TooltipAction from "../tooltipAction";
import { useModal } from "@/hooks/modalStore";

const NavAction = () => {
  const {onOpen} = useModal();
  return (
    <div className="mt-[5px]">
      <TooltipAction side="right" align="center" label="Add a server">
        <button
          className="group flex items-center"
          onClick={() => onOpen("createServer")}
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </TooltipAction>
    </div>
  );
};

export default NavAction;
