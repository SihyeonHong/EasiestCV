"use client";

import { useTranslations } from "next-intl";

import AdminHeader from "@/app/components/admin/AdminHeader";
import { Button } from "@/app/components/common/Button";
import DisplayMode from "@/app/components/common/DisplayMode";
import LocaleSwitcher from "@/app/components/common/LocaleSwitcher";
import HomeLogo from "@/app/components/HomeLogo";
import SupportLink from "@/app/components/SupportLink";
import { Link } from "@/i18n/routing";

type HeaderType = "admin" | "public" | "root";

interface HeaderProps {
  type: HeaderType;
}

export default function Header({ type }: HeaderProps) {
  const t = useTranslations("header");

  return (
    <div className="flex w-full flex-col items-end p-2 sm:flex-row sm:flex-wrap">
      {/* 왼쪽 */}
      <div className="flex w-full flex-wrap sm:w-auto sm:gap-3">
        <HomeLogo />
        <SupportLink />
      </div>

      {/* 오른쪽 */}
      <div className="ml-auto flex w-full flex-col items-end sm:w-auto sm:flex-row">
        <div className="flex">
          <LocaleSwitcher />
          <DisplayMode />
        </div>

        {type === "public" && (
          <Button asChild>
            <Link href={`/`}>{t("loginOrSignup")}</Link>
          </Button>
        )}
        {type === "admin" && <AdminHeader />}
      </div>
    </div>
  );
}
