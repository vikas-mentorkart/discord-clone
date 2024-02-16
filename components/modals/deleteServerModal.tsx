"use client";

import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/modalStore";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
export const DeleteServerModal = () => {
  const router = useRouter()
  const { type, onClose, isOpen, data, onOpen } = useModal();
  const isModalOpen = !!(type === "deleteServer" && isOpen);

  const { data: server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const handleClick =async()=>{
    try {
      setIsLoading(true)
      await axios.delete(`/api/servers/${server?.id}`);
      onClose();
      router.refresh();
      router.push("/")
    } catch (error) {
      console.log(error);
    }finally{
     setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delte Server
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-zinc-500">
          Are you sure you want to do this?{" "}<br/>
          <span className="font-semibold text-indigo-500">{server?.name}</span>{" "}
          will be deleted permanently.
        </DialogDescription>
        <DialogFooter className="bg-gray-100 px-6 py-4 ">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleClick}
              variant="primary"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
