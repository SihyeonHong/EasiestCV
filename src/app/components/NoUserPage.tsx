"use client";

import { useTranslations } from "next-intl";

export default function NoUserPage() {
  const t = useTranslations("message");
  return <h2 className="text-center">{t("noUser")}</h2>;
}
