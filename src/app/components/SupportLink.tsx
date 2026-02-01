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
        "center gap-1 whitespace-nowrap p-1 text-sm text-muted",
        className,
      )}
    >
      <HelpCircle size={14} />
      <span className="opacity-80">{t("linkDescription")}</span>
      <Link
        href="/support"
        className="underline underline-offset-2 transition-colors hover:text-link"
      >
        {t("linkText")}
      </Link>
    </div>
  );
}
