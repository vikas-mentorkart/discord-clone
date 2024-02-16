"use client";
import { useSocket } from "@/components/providers/socketProvider";
import { Badge } from "@/components/ui/badge";
import { Dot } from "lucide-react";
import TooltipAction from "./tooltipAction";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  return (
    <TooltipAction
      label={
        isConnected ? "Live: Real-time updates" : "Fallback: Polling every 1s"
      }
    >
      <div
        className={`w-2 h-2 mr-2 rounded-md ${
          isConnected ? "bg-emerald-600" : "bg-yellow-600"
        }`}
      />
     
    </TooltipAction>
  );
};
