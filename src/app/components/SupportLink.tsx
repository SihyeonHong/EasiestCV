import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function SupportLink() {
  const t = useTranslations("support");

  return (
    <div className="flex items-center gap-1 whitespace-nowrap p-1 text-sm text-gray-700 dark:text-gray-400">
      <HelpCircle size={14} />
      <span>{t("linkDescription")}</span>
      <Link href="/support" className="underline dark:text-gray-300">
        {t("linkText")}
      </Link>
    </div>
  );
}
