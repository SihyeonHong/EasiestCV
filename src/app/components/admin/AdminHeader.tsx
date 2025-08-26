import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import UserInfoDropDown from "@/app/components/admin/UserInfoDropDown";
import { Button } from "@/app/components/common/Button";
import { useRouter } from "@/i18n/routing";

export default function AdminHeader() {
  const userid = useParams().userid as string;
  const t = useTranslations("header");
  const tMessage = useTranslations("message");
  const router = useRouter();

  const handleLogout = () => {
    const confirmed = window.confirm(tMessage("confirmLogout"));

    if (confirmed) {
      router.push(`/${userid}?logout=true`);
    }
  };

  return (
    <div className="flex gap-2">
      <UserInfoDropDown />
      <Button onClick={handleLogout}>{t("logout")}</Button>
    </div>
  );
}
