import { useTranslations } from "next-intl";

import { cn } from "@/utils/classname";

export default function NeedSaveDescription({
  className,
}: {
  className?: string;
}) {
  const tAdmin = useTranslations("admin");
  return (
    <p className={cn("text-muted text-sm", className)}>
      {tAdmin("saveWarning")}
    </p>
  );
}
