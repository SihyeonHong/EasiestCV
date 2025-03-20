import { useTranslations } from "next-intl";

import { Button } from "@/app/components/common/Button";
import useAuth from "@/hooks/useAuth";

export default function AdminHeader() {
  const t = useTranslations("button");

  const { logout } = useAuth();

  return (
    <div className="flex gap-2">
      <Button variant="secondary">회원정보수정</Button>
      <Button onClick={() => logout()}>{t("logout")}</Button>
    </div>
  );
}
