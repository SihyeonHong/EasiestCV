import { useTranslations } from "next-intl";

import UserInfoDropDown from "@/app/components/admin/UserInfoDropDown";
import { Button } from "@/app/components/common/Button";
import useAuth from "@/hooks/useAuth";

export default function AdminHeader() {
  const t = useTranslations("header");

  const { logout } = useAuth();

  return (
    <div className="flex gap-2">
      <UserInfoDropDown />
      <Button onClick={() => logout()}>{t("logout")}</Button>
    </div>
  );
}
