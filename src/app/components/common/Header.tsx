"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import AdminHeader from "@/app/components/admin/AdminHeader";
import { Button } from "@/app/components/common/Button";
import DisplayMode from "@/app/components/common/DisplayMode";

interface HeaderProps {
  params: {
    locale: string;
    userid?: string;
  };
  isAdmin?: boolean;
}

export default function Header({ params, isAdmin }: HeaderProps) {
  const t = useTranslations("button");
  const pathname = usePathname();
  const newLocale = params.locale === "en" ? "ko" : "en";
  const newPathname = pathname
    ? pathname.replace(`/${params.locale}`, `/${newLocale}`)
    : params.userid
      ? `/${newLocale}/${params.userid}`
      : `/${newLocale}`;

  return (
    <div className="flex w-full flex-col items-end justify-end p-1 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex">
        <DisplayMode />
        <Button variant="ghost" asChild>
          <Link href={newPathname}>{t("switchLanguage")}</Link>
        </Button>
      </div>

      {params.userid &&
        (isAdmin ? (
          <AdminHeader userid={params.userid} />
        ) : (
          <Button asChild>
            <Link href="/">{t("loginOrSignup")}</Link>
          </Button>
        ))}
    </div>
  );
}
