import { Check, Clock, Save, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { SaveStatus } from "@/models/tab.model";
import { cn } from "@/utils/classname";

interface SaveStatusIndicatorProps {
  status: SaveStatus;
}

export default function SaveStatusIndicator({
  status,
}: SaveStatusIndicatorProps) {
  const tSaveStatus = useTranslations("saveStatus");

  const getStatusConfig = () => {
    switch (status) {
      case "saved":
        return {
          icon: <Check className="h-4 w-4" />,
          text: tSaveStatus("saved"),
          className: "text-green-600 dark:text-green-400",
        };
      case "unsaved":
        return {
          icon: <Save className="h-4 w-4" />,
          text: tSaveStatus("unsaved"),
          className: "text-orange-600 dark:text-orange-400",
        };
      case "saving":
        return {
          icon: <Clock className="h-4 w-4 animate-spin" />,
          text: tSaveStatus("saving"),
          className: "text-blue-600 dark:text-blue-400",
        };
      case "error":
        return {
          icon: <X className="h-4 w-4" />,
          text: tSaveStatus("error"),
          className: "text-red-600 dark:text-red-400",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm font-medium",
        config.className,
      )}
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}
