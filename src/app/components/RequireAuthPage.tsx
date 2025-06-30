"use client";

import { useTranslations } from "next-intl";

import LoadingPage from "@/app/components/LoadingPage";
import useAuth from "@/hooks/useAuth";
import { Link } from "@/i18n/routing";

interface Props {
  url: string;
  children: React.ReactNode;
}

export default function RequireAuth({ url, children }: Props) {
  const t = useTranslations("requireAuth");
  const { me, isLoading } = useAuth();

  if (isLoading) return <LoadingPage />;

  // 비로그인 상태이거나 다른 사용자의 admin 페이지 접근 시도
  if (!me || me.userid !== url) {
    return (
      <div className="flex items-center gap-1">
        {t("cannotAccess")}
        <Link href="/">{t("goToLogIn")}</Link>
      </div>
    );
  }

  return children;
}
