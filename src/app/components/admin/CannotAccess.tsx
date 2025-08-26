"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";

export default function CannotAccess() {
  const t = useTranslations("requireAuth");

  return (
    <div className="flex items-center gap-1">
      {t("cannotAccess")}
      <Link href="/">{t("goToLogIn")}</Link>
    </div>
  );
}
