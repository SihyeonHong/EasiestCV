import { useTranslations } from "next-intl";

import { SaveStatus } from "@/hooks/useAutoSave";
import { cn } from "@/utils/classname";

interface SaveStatusIndicatorProps {
  status: SaveStatus;
}

export default function SaveStatusIndicator({
  status,
}: SaveStatusIndicatorProps) {
  const tEditor = useTranslations("editor");

  const getStatusDisplay = () => {
    switch (status) {
      case "saving":
        return {
          text: tEditor("saving"),
          className: "text-blue-600",
          icon: "⏳",
        };
      case "saved":
        return {
          text: tEditor("saved"),
          className: "text-green-600",
          icon: "✓",
        };
      case "unsaved":
        return {
          text: tEditor("unsaved"),
          className: "text-orange-600",
          icon: "○",
        };
      case "error":
        return {
          text: tEditor("error"),
          className: "text-red-600",
          icon: "✗",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div
      className={cn("flex items-center gap-2 text-sm", statusDisplay.className)}
    >
      <span>{statusDisplay.icon}</span>
      <span>{statusDisplay.text}</span>
    </div>
  );
}
