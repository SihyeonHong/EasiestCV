"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

import { useIsMobile } from "@/hooks/tiptap/use-mobile";

type MobileView = "main" | "highlighter" | "link";

interface ToolbarContextType {
  mobileView: MobileView;
  setMobileView: (view: MobileView) => void;
  isImageUploaderOpen: boolean;
  setIsImageUploaderOpen: (open: boolean) => void;
}

const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

interface ToolbarProviderProps {
  children: React.ReactNode;
}

export function ToolbarProvider({ children }: ToolbarProviderProps) {
  const [mobileView, setMobileView] = useState<MobileView>("main");
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
  const isMobile = useIsMobile();

  // Reset mobile view when switching to desktop
  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  const value: ToolbarContextType = {
    mobileView,
    setMobileView,
    isImageUploaderOpen,
    setIsImageUploaderOpen,
  };

  return (
    <ToolbarContext.Provider value={value}>{children}</ToolbarContext.Provider>
  );
}

export function useToolbar() {
  const context = useContext(ToolbarContext);
  if (context === undefined) {
    throw new Error("useToolbar must be used within a ToolbarProvider");
  }
  return context;
}
