import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { cn } from "@/utils/classname";

interface SupportLinkProps {
  className?: string;
}

export default function SupportLink({ className }: SupportLinkProps) {
  const t = useTranslations("support");

  return (
    <div
      className={cn(
        "flex flex-nowrap items-center justify-center gap-1 p-1 text-sm text-muted",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-1 whitespace-nowrap">
        <HelpCircle size={14} />
        <span className="opacity-80">{t("linkDescription")}</span>
      </div>
      <Link
        href="/support"
        className="shrink-0 whitespace-nowrap underline underline-offset-2 transition-colors hover:text-link"
      >
        {t("linkText")}
      </Link>
    </div>
  );
}
