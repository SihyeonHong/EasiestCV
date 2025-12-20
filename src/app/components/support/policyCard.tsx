import Link from "next/link";
import { useTranslations } from "next-intl";

export default function PolicyCard() {
  const t = useTranslations("support");

  return (
    <div>
      <Link
        href="/policy"
        className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        {t("policy")}
      </Link>
    </div>
  );
}
