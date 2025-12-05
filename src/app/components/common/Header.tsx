"use client";

import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import AdminHeader from "@/app/components/admin/AdminHeader";
import { Button } from "@/app/components/common/Button";
import DisplayMode from "@/app/components/common/DisplayMode";
import LocaleSwitcher from "@/app/components/common/LocaleSwitcher";
import HomeLogo from "@/app/components/HomeLogo";
import SupportLink from "@/app/components/SupportLink";
import useAuth from "@/hooks/useAuth";
import { Link } from "@/i18n/routing";

type HeaderType = "admin" | "public" | "root";

export default function Header() {
  const t = useTranslations("header");
  const pathname = usePathname();
  const params = useParams();
  const { me } = useAuth();

  const userid = params?.userid as string | undefined;

  let headerType: HeaderType = "public";

  if (!userid) {
    headerType = "root";
  } else {
    const isAdminPath = pathname?.includes(`/${userid}/admin`);
    const isAuthenticated = me?.userid === userid;

    // admin 경로이고 인증된 경우에만 admin 헤더 표시
    headerType = isAdminPath && isAuthenticated ? "admin" : "public";
  }

  return (
    <div className="flex w-full flex-col items-end p-2 sm:flex-row sm:flex-wrap">
      {/* 왼쪽 */}
      <div className="flex w-full flex-wrap sm:w-auto sm:gap-3">
        <HomeLogo />
        <SupportLink />
      </div>

      {/* 오른쪽 */}
      <div className="ml-auto flex w-full flex-col items-end sm:w-auto sm:flex-row sm:gap-2">
        <div className="flex">
          <LocaleSwitcher />
          <DisplayMode />
        </div>

        {headerType === "public" && (
          <Button asChild>
            <Link href={`/`}>{t("loginOrSignup")}</Link>
          </Button>
        )}
        {headerType === "admin" && <AdminHeader />}
      </div>
    </div>
  );
}
