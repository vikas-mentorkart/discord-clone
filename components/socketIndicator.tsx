"use client";
import { useSocket } from "@/components/providers/socketProvider";
import { Badge } from "@/components/ui/badge";
import { Dot } from "lucide-react";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  return (
    <Dot
      className={`text-[10px]  ${
        isConnected ? "text-emerald-600" : "text-yellow-600"
      }`}
    />
    // <Badge
    //   variant="outline"
    //   className={`text-white border-none ${
    //     isConnected ? "bg-emerald-600" : "bg-yellow-600"
    //   }`}
    // >
    //   {isConnected? "Live: Real-time updates":"Fallback: Polling every 1s"}
    // </Badge>
  );
};
