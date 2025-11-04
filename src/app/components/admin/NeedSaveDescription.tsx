import { useTranslations } from "next-intl";

import { cn } from "@/utils/classname";

export default function NeedSaveDescription({
  className,
}: {
  className?: string;
}) {
  const tAdmin = useTranslations("admin");
  return (
    <p className={cn("text-sm text-muted", className)}>
      {tAdmin("saveWarning")}
    </p>
  );
}
