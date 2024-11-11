"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";

import { useProgressStore } from "@/hooks/useModelStore";

export const LoadingModal = () => {
  const { loading } = useProgressStore();

  return (
    <Dialog open={loading}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden flex flex-col items-center justify-center space-y-2">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Loading
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0 flex gap-4 mt-0">
          Please wait while we upload and process your files
          <LoaderCircle className="text-black animate-spin" size={24} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
