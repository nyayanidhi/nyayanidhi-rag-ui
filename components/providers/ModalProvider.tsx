"use client";

import { useState, useEffect } from "react";

import { LoadingModal } from "../modal/LoadingModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <LoadingModal />
    </>
  );
};
