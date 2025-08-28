"use client";

import { useTranslations } from "next-intl";

import AdminHeader from "@/app/components/admin/AdminHeader";
import { Button } from "@/app/components/common/Button";
import DisplayMode from "@/app/components/common/DisplayMode";
import LocaleSwitcher from "@/app/components/common/LocaleSwitcher";
import { Link } from "@/i18n/routing";

import SupportLink from "../SupportLink";

type HeaderType = "admin" | "public" | "root";

interface HeaderProps {
  type: HeaderType;
}

export default function Header({ type }: HeaderProps) {
  const t = useTranslations("header");

  return (
    <div className="flex w-full flex-col items-center justify-between p-1 sm:flex-row sm:items-start sm:gap-4">
      {/* 왼쪽 */}
      <SupportLink />

      {/* 오른쪽 */}
      <div className="flex flex-col items-center sm:flex-row sm:gap-4">
        <div className="flex">
          <DisplayMode />
          <LocaleSwitcher />
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
