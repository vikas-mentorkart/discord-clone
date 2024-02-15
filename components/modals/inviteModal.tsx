"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/modalStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/useOrigin";
import { useState } from "react";
import axios from "axios";
export const InviteModal = () => {
  const { type, onClose, isOpen, data, onOpen } = useModal();
  const isModalOpen = !!(type === "inviteModal" && isOpen);

  const { data: server } = data;
  const origin = useOrigin();
  const inviteLink = `${origin}/invite/${server?.inviteCode}`;

  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const generateNewLink = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.patch(
        `/api/servers/${server.id}/regenerate-invite-code`
      );
      onOpen("inviteModal", { data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bol text-zinc-500 dark:text-secondary/70">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 border-0 
            focus-visible:ring-0 text-black
             focus-visible:ring-offset-0"
              value={inviteLink}
              disabled={isLoading}
            />
            <Button size="icon" onClick={handleCopy} disabled={isLoading}>
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
            onClick={generateNewLink}
            disabled={isLoading}
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
