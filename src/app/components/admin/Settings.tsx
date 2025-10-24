import { useTranslations } from "next-intl";

import AdminPDF from "@/app/components/admin/AdminPDF";
import PasswordChanger from "@/app/components/admin/PasswordChanger";
import TabManager from "@/app/components/admin/TabManager";
import UserInfoEditor from "@/app/components/admin/UserInfoEditor";
import { Card, CardContent } from "@/app/components/common/Card";

interface Props {
  userid: string;
}

export default function Settings({ userid }: Props) {
  const t = useTranslations("settings");

  return (
    <div>
      <Card>
        <CardContent className="flex flex-col gap-12">
          <div>
            <h1 className="mb-2 text-2xl font-bold">{t("shortcut")}</h1>
            <ul className="flex gap-2">
              <li>탭</li>
              <li>PDF</li>
              <li>메타데이터</li>
              <li>회원정보</li>
            </ul>
          </div>
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />

          <AdminPDF userid={userid} />
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
          <TabManager userid={userid} />
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex flex-col gap-12 sm:flex-row">
            <UserInfoEditor userid={userid} />
            <div className="w-px self-stretch bg-zinc-200 dark:bg-zinc-800" />
            <PasswordChanger userid={userid} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
