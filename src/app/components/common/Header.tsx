"use client";

import { useTranslations } from "next-intl";

import AdminHeader from "@/app/components/admin/AdminHeader";
import { Button } from "@/app/components/common/Button";
import DisplayMode from "@/app/components/common/DisplayMode";
import LocaleSwitcher from "@/app/components/common/LocaleSwitcher";
import { Link } from "@/i18n/routing";

interface HeaderProps {
  params: {
    locale: string;
    userid?: string;
  };
  isAdmin?: boolean;
}

export default function Header({ params, isAdmin }: HeaderProps) {
  const t = useTranslations("header");

  return (
    <div className="flex w-full flex-col items-end justify-end p-1 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex">
        <DisplayMode />
        <LocaleSwitcher />
      </div>

      {params.userid &&
        (isAdmin ? (
          <AdminHeader userid={params.userid} />
        ) : (
          <Button asChild>
            <Link href={`/`}>{t("loginOrSignup")}</Link>
          </Button>
        ))}
    </div>
  );
}
