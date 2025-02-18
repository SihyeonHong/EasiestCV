"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/app/components/common/Button";
import DisplayMode from "@/app/components/common/DisplayMode";

interface HeaderProps {
  params: {
    locale: string;
    userid: string;
  };
}

export default function Header({ params }: HeaderProps) {
  const t = useTranslations("button");
  const newLocale = params.locale === "en" ? "ko" : "en";

  return (
    <div className="flex w-full items-center justify-end gap-2">
      <DisplayMode />
      <Button variant="secondary" asChild>
        <Link href={`/${newLocale}/${params.userid}`}>
          {t("switchLanguage")}
        </Link>
      </Button>
      <Button asChild>
        <Link href="/">{t("loginOrSignup")}</Link>
      </Button>
    </div>
  );
}
