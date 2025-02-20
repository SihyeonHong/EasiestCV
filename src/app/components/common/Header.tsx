"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/app/components/common/Button";
import DisplayMode from "@/app/components/common/DisplayMode";
import AdminHeader from "@/app/components/admin/AdminHeader";

interface HeaderProps {
  params: {
    locale: string;
    userid?: string;
  };
  isAdmin?: boolean;
}

export default function Header({ params, isAdmin }: HeaderProps) {
  const t = useTranslations("button");
  const newLocale = params.locale === "en" ? "ko" : "en";

  return (
    <div className="flex w-full flex-col items-end justify-end p-1 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex">
        <DisplayMode />
        <Button variant="ghost" asChild>
          <Link
            href={
              params.userid ? `/${newLocale}/${params.userid}` : `/${newLocale}`
            }
          >
            {t("switchLanguage")}
          </Link>
        </Button>
      </div>

      {params.userid &&
        (isAdmin ? (
          <AdminHeader />
        ) : (
          <Button asChild>
            <Link href="/">{t("loginOrSignup")}</Link>
          </Button>
        ))}
    </div>
  );
}
