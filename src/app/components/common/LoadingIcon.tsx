"use client";

import { FaSpinner } from "react-icons/fa";

import { cn } from "@/utils/classname";

interface Props {
  className?: string;
}

export default function LoadingIcon({ className }: Props) {
  return (
    <FaSpinner
      className={cn("h-6 w-6 animate-spin text-gray-400", className)}
    />
  );
}
